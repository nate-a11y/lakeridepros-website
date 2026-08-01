import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  mockCreate,
  mockFetchAllGoogleReviews,
  mockPatch,
  mockPatchCommit,
  mockPatchSet,
  mockSanityFetch,
  mockTransformGoogleReview,
} = vi.hoisted(() => {
  const patchCommit = vi.fn().mockResolvedValue(undefined)
  const patchSet = vi.fn(() => ({ commit: patchCommit }))
  return {
    mockCreate: vi.fn().mockResolvedValue(undefined),
    mockFetchAllGoogleReviews: vi.fn(),
    mockPatch: vi.fn(() => ({ set: patchSet })),
    mockPatchCommit: patchCommit,
    mockPatchSet: patchSet,
    mockSanityFetch: vi.fn(),
    mockTransformGoogleReview: vi.fn(),
  }
})

vi.mock('@/sanity/lib/client', () => ({
  writeClient: {
    create: mockCreate,
    fetch: mockSanityFetch,
    patch: mockPatch,
  },
}))

vi.mock('@/lib/google-reviews', () => ({
  fetchAllGoogleReviews: mockFetchAllGoogleReviews,
  transformGoogleReviewToTestimonial: mockTransformGoogleReview,
}))

import { GET } from '../route'

function request(authorization?: string) {
  return new NextRequest('https://www.lakeridepros.com/api/sync-google-reviews', {
    headers: authorization ? { authorization } : undefined,
  })
}

describe('Google review sync route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    delete process.env.CRON_SECRET
    process.env.GOOGLE_CLIENT_ID = 'client-id'
    process.env.GOOGLE_CLIENT_SECRET = 'client-secret'
    process.env.GOOGLE_REFRESH_TOKEN = 'refresh-token'
    process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
    mockFetchAllGoogleReviews.mockResolvedValue({
      reviews: [],
      totalReviewCount: 0,
      averageRating: null,
    })
    mockSanityFetch.mockResolvedValue({
      lastSynced: { syncedAt: '2026-02-02T00:48:22.844Z' },
      total: 242,
    })
  })

  it('returns public status when no authorization is supplied', async () => {
    const response = await GET(request())

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      configured: true,
      provider: 'Google Business Profile API',
      totalGoogleReviews: 242,
    })
  })

  it('fails closed when the cron secret is missing', async () => {
    const response = await GET(request('Bearer undefined'))

    expect(response.status).toBe(401)
    expect(mockSanityFetch).not.toHaveBeenCalled()
  })

  it('rejects an invalid cron secret', async () => {
    process.env.CRON_SECRET = 'expected-secret'

    const response = await GET(request('Bearer wrong-secret'))

    expect(response.status).toBe(401)
    expect(mockSanityFetch).not.toHaveBeenCalled()
  })

  it('runs the official Google Business Profile sync for a valid cron request', async () => {
    process.env.CRON_SECRET = 'expected-secret'

    const response = await GET(request('Bearer expected-secret'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      stats: { fetched: 0, created: 0, updated: 0, unchanged: 0, skipped: 0 },
      metadata: { totalReviews: 0, rating: null },
    })
    expect(mockFetchAllGoogleReviews).toHaveBeenCalledOnce()
  })

  it('rebinds exact legacy matches and creates only genuinely new reviews', async () => {
    process.env.CRON_SECRET = 'expected-secret'
    const firstReview = {
      reviewId: 'official-1',
      reviewer: { displayName: 'Rider One' },
      starRating: 'FIVE',
      comment: 'Great ride',
    }
    const secondReview = {
      reviewId: 'official-2',
      reviewer: { displayName: 'Rider Two' },
      starRating: 'FIVE',
      comment: 'Also great',
    }
    mockFetchAllGoogleReviews.mockResolvedValueOnce({
      reviews: [firstReview, secondReview],
      totalReviewCount: 2,
      averageRating: 5,
    })
    mockSanityFetch.mockResolvedValueOnce([{
      _id: 'legacy-doc',
      externalId: 'outscraper-1',
      name: 'Rider One',
      content: 'Great ride',
      rating: 5,
    }])
    mockTransformGoogleReview.mockImplementation((review) => ({
      name: review.reviewer.displayName,
      content: review.comment,
      rating: 5,
      source: 'google',
      externalId: review.reviewId,
      externalUrl: `https://www.google.com/maps/reviews/${review.reviewId}`,
      syncedAt: 'test-time',
      featured: false,
      order: 999,
    }))

    const response = await GET(request('Bearer expected-secret'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      stats: {
        fetched: 2,
        created: 1,
        updated: 1,
        rebound: 1,
        notFound: 0,
      },
    })
    expect(mockPatch).toHaveBeenCalledWith('legacy-doc')
    expect(mockPatchSet).toHaveBeenCalledWith(expect.objectContaining({
      externalId: 'official-1',
      googleReviewStatus: 'current',
    }))
    expect(mockPatchCommit).toHaveBeenCalledOnce()
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      externalId: 'official-2',
      googleReviewStatus: 'current',
    }))
  })
})

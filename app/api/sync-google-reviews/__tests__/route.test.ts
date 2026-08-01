import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { mockSanityFetch } = vi.hoisted(() => ({
  mockSanityFetch: vi.fn(),
}))

vi.mock('@/sanity/lib/client', () => ({
  writeClient: {
    fetch: mockSanityFetch,
  },
}))

vi.mock('@/lib/google-reviews', () => ({
  transformGoogleReviewToTestimonial: vi.fn(),
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
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    process.env.GOOGLE_PLACE_ID = 'google-place-id'
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

  it('runs the sync for a valid cron request using server credentials', async () => {
    process.env.CRON_SECRET = 'expected-secret'
    mockSanityFetch.mockResolvedValueOnce({
      syncedAt: '2026-02-02T00:48:22.844Z',
    })
    const edgeFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          reviews: [],
          metadata: { totalReviews: 308, rating: 5 },
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal('fetch', edgeFetch)

    const response = await GET(request('Bearer expected-secret'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      stats: { fetched: 0, created: 0, updated: 0, skipped: 0 },
    })
    expect(edgeFetch).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/sync-google-reviews',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer service-role-key',
        }),
      }),
    )
  })
})

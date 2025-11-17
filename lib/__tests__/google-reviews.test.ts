import { describe, it, expect, beforeEach, vi } from 'vitest'
import { convertStarRating, fetchGoogleReviews, getAuthorizationUrl, getTokensFromCode, transformGoogleReviewToTestimonial, type GoogleReview } from '../google-reviews'

// Mock googleapis
const mockGetAccessToken = vi.fn()
const mockSetCredentials = vi.fn()
const mockGenerateAuthUrl = vi.fn()
const mockGetToken = vi.fn()

vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: class MockOAuth2 {
        getAccessToken = mockGetAccessToken
        setCredentials = mockSetCredentials
        generateAuthUrl = mockGenerateAuthUrl
        getToken = mockGetToken
      }
    }
  }
}))

// Mock global fetch
global.fetch = vi.fn()

describe('Google Reviews Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_SECRET
    delete process.env.GOOGLE_REFRESH_TOKEN
    delete process.env.GOOGLE_BUSINESS_LOCATION_ID
    delete process.env.GOOGLE_REDIRECT_URI
  })

  describe('convertStarRating', () => {
    it('converts ONE to 1', () => {
      expect(convertStarRating('ONE')).toBe(1)
    })

    it('converts TWO to 2', () => {
      expect(convertStarRating('TWO')).toBe(2)
    })

    it('converts THREE to 3', () => {
      expect(convertStarRating('THREE')).toBe(3)
    })

    it('converts FOUR to 4', () => {
      expect(convertStarRating('FOUR')).toBe(4)
    })

    it('converts FIVE to 5', () => {
      expect(convertStarRating('FIVE')).toBe(5)
    })

    it('defaults to 5 for invalid ratings', () => {
      expect(convertStarRating('INVALID')).toBe(5)
      expect(convertStarRating('')).toBe(5)
      expect(convertStarRating('SIX')).toBe(5)
    })

    it('handles lowercase input gracefully', () => {
      // Function is case-sensitive, so lowercase should default to 5
      expect(convertStarRating('one')).toBe(5)
      expect(convertStarRating('five')).toBe(5)
    })
  })

  describe('fetchGoogleReviews', () => {
    it('throws error when location ID is not provided', async () => {
      await expect(fetchGoogleReviews()).rejects.toThrow('Google Business Location ID not configured')
    })

    it('throws error when Google OAuth credentials are not configured', async () => {
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'

      await expect(fetchGoogleReviews()).rejects.toThrow('Google OAuth credentials not configured')
    })

    it('throws error when access token fails', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: null })

      await expect(fetchGoogleReviews()).rejects.toThrow('Failed to get access token from Google')
    })

    it('fetches reviews successfully', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: 'test-access-token' })

      const mockReviews = [
        {
          reviewId: 'review-1',
          reviewer: { displayName: 'John Doe' },
          starRating: 'FIVE',
          comment: 'Great service!',
          createTime: '2024-01-01T00:00:00Z',
          updateTime: '2024-01-01T00:00:00Z',
        }
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ reviews: mockReviews }),
      } as Response)

      const result = await fetchGoogleReviews()

      expect(result).toEqual(mockReviews)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://mybusiness.googleapis.com/v4/accounts/123/locations/456/reviews?pageSize=50',
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test-access-token',
            'Content-Type': 'application/json',
          },
        })
      )
    })

    it('accepts custom location ID parameter', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: 'test-access-token' });

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ reviews: [] }),
      } as Response)

      await fetchGoogleReviews('accounts/999/locations/888', 10)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://mybusiness.googleapis.com/v4/accounts/999/locations/888/reviews?pageSize=10',
        expect.any(Object)
      )
    })

    it('handles API errors correctly', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: 'test-access-token' });

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Location not found',
      } as Response)

      await expect(fetchGoogleReviews()).rejects.toThrow('Google API error: 404 Not Found - Location not found')
    })

    it('returns empty array when no reviews exist', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: 'test-access-token' });

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      const result = await fetchGoogleReviews()
      expect(result).toEqual([])
    })

    it('handles fetch errors correctly', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_BUSINESS_LOCATION_ID = 'accounts/123/locations/456'
      process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'

      mockGetAccessToken.mockResolvedValue({ token: 'test-access-token' });

      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      await expect(fetchGoogleReviews()).rejects.toThrow('Network error')
    })
  })

  describe('getAuthorizationUrl', () => {
    it('generates authorization URL with correct parameters', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

      mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/auth?...')

      const url = getAuthorizationUrl()

      expect(url).toBe('https://accounts.google.com/o/oauth2/auth?...')
      expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/business.manage'],
        prompt: 'consent',
      })
    })

    it('uses custom redirect URI when provided', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
      process.env.GOOGLE_REDIRECT_URI = 'https://example.com/callback'

      mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/auth?...')

      getAuthorizationUrl()

      expect(mockGenerateAuthUrl).toHaveBeenCalled()
    })
  })

  describe('getTokensFromCode', () => {
    it('exchanges authorization code for tokens', async () => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

      const mockTokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expiry_date: 1234567890,
      }

      mockGetToken.mockResolvedValue({ tokens: mockTokens })

      const result = await getTokensFromCode('test-auth-code')

      expect(result).toEqual(mockTokens)
      expect(mockGetToken).toHaveBeenCalledWith('test-auth-code')
    })
  })

  describe('transformGoogleReviewToTestimonial', () => {
    it('transforms review with all fields', () => {
      const review: GoogleReview = {
        reviewId: 'review-123',
        reviewer: {
          displayName: 'John Doe',
          profilePhotoUrl: 'https://example.com/photo.jpg',
        },
        starRating: 'FIVE',
        comment: 'Excellent service!',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-02T00:00:00Z',
        reviewReply: {
          comment: 'Thank you!',
          updateTime: '2024-01-03T00:00:00Z',
        },
      }

      const result = transformGoogleReviewToTestimonial(review)

      expect(result).toMatchObject({
        name: 'John Doe',
        content: 'Excellent service!',
        rating: 5,
        source: 'google',
        externalId: 'review-123',
        externalUrl: 'https://www.google.com/maps/reviews/review-123',
        featured: false,
        order: 999,
      })
      expect(result.syncedAt).toBeDefined()
    })

    it('handles review without comment', () => {
      const review: GoogleReview = {
        reviewId: 'review-456',
        reviewer: {
          displayName: 'Jane Smith',
        },
        starRating: 'FOUR',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
      }

      const result = transformGoogleReviewToTestimonial(review)

      expect(result.content).toBe('No comment provided')
      expect(result.rating).toBe(4)
    })

    it('handles review with low rating', () => {
      const review: GoogleReview = {
        reviewId: 'review-789',
        reviewer: {
          displayName: 'Bob Johnson',
        },
        starRating: 'TWO',
        comment: 'Could be better',
        createTime: '2024-01-01T00:00:00Z',
        updateTime: '2024-01-01T00:00:00Z',
      }

      const result = transformGoogleReviewToTestimonial(review)

      expect(result.rating).toBe(2)
      expect(result.content).toBe('Could be better')
    })
  })
})

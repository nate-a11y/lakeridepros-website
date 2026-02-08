import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock Sanity client
const mockFetch = vi.fn()
const mockCreate = vi.fn()
const mockCommit = vi.fn()
const mockSet = vi.fn().mockReturnValue({ commit: mockCommit })
const mockPatch = vi.fn().mockReturnValue({ set: mockSet })

vi.mock('@/sanity/lib/client', () => ({
  writeClient: {
    fetch: mockFetch,
    create: mockCreate,
    patch: mockPatch,
  },
}))

vi.mock('next-sanity', () => ({
  groq: (strings: TemplateStringsArray, ...values: any[]) => String.raw(strings, ...values),
}))

// Mock crypto.randomUUID used in the route for _key generation
vi.stubGlobal('crypto', {
  randomUUID: vi.fn().mockReturnValue('abcdef01-2345-6789-abcd-ef0123456789'),
})

describe('Analytics Track API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSet.mockReturnValue({ commit: mockCommit })
  })

  const createMockRequest = (body: object) =>
    ({
      json: vi.fn().mockResolvedValue(body),
    }) as unknown as NextRequest

  describe('Input Validation', () => {
    it('returns 400 when serviceSlug is missing', async () => {
      const request = createMockRequest({ eventType: 'view' })
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('required')
    })

    it('returns 400 when eventType is missing', async () => {
      const request = createMockRequest({ serviceSlug: 'boat-detailing' })
      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('returns 400 for invalid eventType', async () => {
      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'invalid',
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('must be')
    })

    it('accepts valid view event', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // No existing analytics
      mockFetch.mockResolvedValueOnce(null)
      // Create returns new analytics
      mockCreate.mockResolvedValue({ _id: 'analytics-1', popularityScore: 1 })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('accepts valid booking event', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // No existing analytics
      mockFetch.mockResolvedValueOnce(null)
      // Create returns new analytics
      mockCreate.mockResolvedValue({ _id: 'analytics-1', popularityScore: 10 })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'booking',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Service Lookup', () => {
    it('returns 404 when service not found', async () => {
      // Service not found
      mockFetch.mockResolvedValueOnce(null)

      const request = createMockRequest({
        serviceSlug: 'nonexistent-service',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json.error).toContain('not found')
    })
  })

  describe('Analytics Tracking', () => {
    it('creates new analytics record for first view', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // No existing analytics
      mockFetch.mockResolvedValueOnce(null)
      // Create returns new analytics
      mockCreate.mockResolvedValue({
        _id: 'analytics-1',
        views: 1,
        bookings: 0,
        popularityScore: 1,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: 'serviceAnalytics',
          service: { _type: 'reference', _ref: 'service-1' },
          views: 1,
          bookings: 0,
          popularityScore: 1,
        })
      )
    })

    it('updates existing analytics for subsequent views', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics record
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 10,
        bookings: 2,
        dailyStats: [],
      })
      // Patch returns updated analytics
      mockCommit.mockResolvedValue({
        _id: 'analytics-1',
        views: 11,
        bookings: 2,
        popularityScore: 21,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockPatch).toHaveBeenCalledWith('analytics-1')
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          views: 11,
          bookings: 2,
        })
      )
      expect(mockCommit).toHaveBeenCalled()
    })

    it('tracks booking events with higher popularity score', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // No existing analytics
      mockFetch.mockResolvedValueOnce(null)
      // Create returns new analytics
      mockCreate.mockResolvedValue({
        _id: 'analytics-1',
        views: 0,
        bookings: 1,
        popularityScore: 10,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'booking',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: 'serviceAnalytics',
          views: 0,
          bookings: 1,
          popularityScore: 10,
        })
      )
    })
  })

  describe('Daily Stats Management', () => {
    it('updates existing daily stats for today when tracking view', async () => {
      const today = new Date()
      const todayString = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics with today's stats
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 10,
        bookings: 2,
        dailyStats: [
          {
            _key: 'abc12345',
            date: todayString,
            views: 5,
            bookings: 1,
          },
        ],
      })
      // Patch returns updated analytics
      mockCommit.mockResolvedValue({
        _id: 'analytics-1',
        views: 11,
        bookings: 2,
        popularityScore: 21,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockPatch).toHaveBeenCalledWith('analytics-1')
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          views: 11,
          dailyStats: expect.arrayContaining([
            expect.objectContaining({
              date: todayString,
              views: 6,
              bookings: 1,
            }),
          ]),
        })
      )
      expect(mockCommit).toHaveBeenCalled()
    })

    it('updates existing daily stats for today when tracking booking', async () => {
      const today = new Date()
      const todayString = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()

      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics with today's stats
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 10,
        bookings: 2,
        dailyStats: [
          {
            _key: 'abc12345',
            date: todayString,
            views: 5,
            bookings: 1,
          },
        ],
      })
      // Patch returns updated analytics
      mockCommit.mockResolvedValue({
        _id: 'analytics-1',
        views: 10,
        bookings: 3,
        popularityScore: 40,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'booking',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockPatch).toHaveBeenCalledWith('analytics-1')
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          bookings: 3,
          dailyStats: expect.arrayContaining([
            expect.objectContaining({
              date: todayString,
              views: 5,
              bookings: 2,
            }),
          ]),
        })
      )
      expect(mockCommit).toHaveBeenCalled()
    })

    it('sorts daily stats by date descending', async () => {
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)

      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics with multiple days of stats
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 30,
        bookings: 6,
        dailyStats: [
          {
            _key: 'key1',
            date: twoDaysAgo.toISOString(),
            views: 10,
            bookings: 2,
          },
          {
            _key: 'key2',
            date: yesterday.toISOString(),
            views: 15,
            bookings: 3,
          },
        ],
      })
      // Patch returns updated analytics
      mockCommit.mockResolvedValue({
        _id: 'analytics-1',
        views: 31,
        bookings: 6,
        popularityScore: 61,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)

      // Verify dailyStats are sorted by date descending (most recent first)
      const setCallArgs = mockSet.mock.calls[0][0]
      const stats = setCallArgs.dailyStats
      for (let i = 0; i < stats.length - 1; i++) {
        expect(new Date(stats[i].date).getTime()).toBeGreaterThanOrEqual(
          new Date(stats[i + 1].date).getTime()
        )
      }
    })

    it('limits daily stats to 30 entries', async () => {
      const today = new Date()
      // Create 32 days of stats (all within 30-day window so none get filtered by date)
      const manyStats = Array.from({ length: 32 }, (_, i) => ({
        _key: `key-${i}`,
        date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString(),
        views: 5,
        bookings: 1,
      }))

      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics with many stats
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 160,
        bookings: 32,
        dailyStats: manyStats,
      })
      // Patch returns updated analytics
      mockCommit.mockResolvedValue({
        _id: 'analytics-1',
        views: 161,
        bookings: 32,
        popularityScore: 321,
      })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      // Verify that set was called with limited stats (max 30)
      expect(mockSet).toHaveBeenCalled()
      const setCallArgs = mockSet.mock.calls[0][0]
      expect(setCallArgs.dailyStats.length).toBeLessThanOrEqual(30)
    })
  })

  describe('Error Handling', () => {
    it('returns 500 on database errors', async () => {
      mockFetch.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(500)
    })

    it('returns 500 when create fails', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // No existing analytics
      mockFetch.mockResolvedValueOnce(null)
      // Create fails
      mockCreate.mockRejectedValue(new Error('Create failed'))

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(500)
    })

    it('returns 500 when patch commit fails', async () => {
      // Service found
      mockFetch.mockResolvedValueOnce({ _id: 'service-1' })
      // Existing analytics
      mockFetch.mockResolvedValueOnce({
        _id: 'analytics-1',
        views: 10,
        bookings: 2,
        dailyStats: [],
      })
      // Commit fails
      mockCommit.mockRejectedValue(new Error('Commit failed'))

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })
})

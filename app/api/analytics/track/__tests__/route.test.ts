import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock Payload
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  }),
}))

describe('Analytics Track API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (body: object) => ({
    json: vi.fn().mockResolvedValue(body),
  } as unknown as NextRequest)

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
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>
      const createMock = mockPayload.create as ReturnType<typeof vi.fn>

      findMock
        .mockResolvedValueOnce({ docs: [{ id: 'service-1', slug: 'boat-detailing' }] })
        .mockResolvedValueOnce({ docs: [] })

      createMock.mockResolvedValue({ id: 'analytics-1', popularityScore: 1 })

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('accepts valid booking event', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>
      const createMock = mockPayload.create as ReturnType<typeof vi.fn>

      findMock
        .mockResolvedValueOnce({ docs: [{ id: 'service-1' }] })
        .mockResolvedValueOnce({ docs: [] })

      createMock.mockResolvedValue({ id: 'analytics-1', popularityScore: 10 })

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
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValueOnce({ docs: [] })

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
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>
      const createMock = mockPayload.create as ReturnType<typeof vi.fn>

      findMock
        .mockResolvedValueOnce({ docs: [{ id: 'service-1' }] })
        .mockResolvedValueOnce({ docs: [] })

      createMock.mockResolvedValue({
        id: 'analytics-1',
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
      expect(createMock).toHaveBeenCalledWith({
        collection: 'service-analytics',
        data: expect.objectContaining({
          views: 1,
          bookings: 0,
          service: 'service-1',
        }),
      })
    })

    it('updates existing analytics for subsequent views', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>
      const updateMock = mockPayload.update as ReturnType<typeof vi.fn>

      findMock
        .mockResolvedValueOnce({ docs: [{ id: 'service-1' }] })
        .mockResolvedValueOnce({
          docs: [{
            id: 'analytics-1',
            views: 10,
            bookings: 2,
            dailyStats: [],
          }],
        })

      updateMock.mockResolvedValue({
        id: 'analytics-1',
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
      expect(updateMock).toHaveBeenCalled()
    })

    it('tracks booking events with higher popularity score', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>
      const createMock = mockPayload.create as ReturnType<typeof vi.fn>

      findMock
        .mockResolvedValueOnce({ docs: [{ id: 'service-1' }] })
        .mockResolvedValueOnce({ docs: [] })

      createMock.mockResolvedValue({
        id: 'analytics-1',
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
      expect(createMock).toHaveBeenCalledWith({
        collection: 'service-analytics',
        data: expect.objectContaining({
          views: 0,
          bookings: 1,
          popularityScore: 10,
        }),
      })
    })
  })

  describe('Error Handling', () => {
    it('returns 500 on database errors', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest({
        serviceSlug: 'boat-detailing',
        eventType: 'view',
      })
      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })
})

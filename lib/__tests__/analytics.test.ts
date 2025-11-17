import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackServiceEvent, getPopularServices } from '../analytics'

// Mock fetch
global.fetch = vi.fn()

describe('Analytics Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window state
    ;(global as { window?: unknown }).window = undefined
    delete process.env.VERCEL_URL
  })

  describe('trackServiceEvent', () => {
    it('tracks view event successfully', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, popularityScore: 10 }),
      } as Response)

      await trackServiceEvent('boat-detailing', 'view')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/analytics/track',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceSlug: 'boat-detailing',
            eventType: 'view',
          }),
        })
      )
    })

    it('tracks booking event successfully', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, popularityScore: 100 }),
      } as Response)

      await trackServiceEvent('boat-detailing', 'booking')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/analytics/track',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            serviceSlug: 'boat-detailing',
            eventType: 'booking',
          }),
        })
      )
    })

    it('handles tracking failures gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)

      // Should not throw even on error
      await expect(trackServiceEvent('invalid-service', 'view')).resolves.toBeUndefined()

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Analytics tracking error'),
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('handles network errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      )

      // Should not throw
      await expect(trackServiceEvent('service', 'view')).resolves.toBeUndefined()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('uses relative URL in browser environment', async () => {
      // Simulate browser environment
      ;(global as { window?: object }).window = {}

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      await trackServiceEvent('service', 'view')

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/track',
        expect.any(Object)
      )
    })

    it('uses Vercel URL in deployment', async () => {
      process.env.VERCEL_URL = 'my-app.vercel.app'

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      await trackServiceEvent('service', 'view')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://my-app.vercel.app/api/analytics/track',
        expect.any(Object)
      )

      delete process.env.VERCEL_URL
    })
  })

  describe('getPopularServices', () => {
    it('fetches popular services successfully', async () => {
      const mockServices = [
        {
          name: 'Boat Detailing',
          slug: 'boat-detailing',
          popularityScore: 100,
          views: 50,
          bookings: 10,
        },
        {
          name: 'Boat Maintenance',
          slug: 'boat-maintenance',
          popularityScore: 75,
          views: 30,
          bookings: 5,
        },
      ]

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ services: mockServices }),
      } as Response)

      const result = await getPopularServices()

      expect(result).toEqual(mockServices)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/analytics/popular-services?limit=5',
        expect.objectContaining({
          next: { revalidate: 300 },
        })
      )
    })

    it('fetches popular services with custom limit', async () => {
      const mockServices = [
        {
          name: 'Boat Detailing',
          slug: 'boat-detailing',
          popularityScore: 100,
          views: 50,
          bookings: 10,
        },
      ]

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ services: mockServices }),
      } as Response)

      const result = await getPopularServices(3)

      expect(result).toEqual(mockServices)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/analytics/popular-services?limit=3',
        expect.any(Object)
      )
    })

    it('returns empty array on fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response)

      const result = await getPopularServices()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching popular services:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('returns empty array on network error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      )

      const result = await getPopularServices()

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('handles missing services field in response', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      const result = await getPopularServices()

      expect(result).toEqual([])
    })

    it('uses relative URL in browser environment', async () => {
      // Simulate browser environment
      ;(global as { window?: object }).window = {}

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ services: [] }),
      } as Response)

      await getPopularServices()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics/popular-services?limit=5',
        expect.any(Object)
      )
    })

    it('uses Vercel URL in deployment', async () => {
      process.env.VERCEL_URL = 'my-app.vercel.app'

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ services: [] }),
      } as Response)

      await getPopularServices()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://my-app.vercel.app/api/analytics/popular-services?limit=5',
        expect.any(Object)
      )
    })
  })
})

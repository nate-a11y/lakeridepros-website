import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackServiceEvent } from '../analytics'

// Mock fetch
global.fetch = vi.fn()

describe('Analytics Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window state
    ;(global as { window?: unknown }).window = undefined
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
})

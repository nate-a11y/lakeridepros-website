import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

// Mock Payload
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn(),
  }),
  buildConfig: vi.fn((config) => config),
}))

// Mock payload config
vi.mock('@payload-config', () => ({
  default: {},
}))

describe('Gift Card Balance Check API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockRequest = (body: Record<string, unknown>) => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as NextRequest
  }

  describe('Input Validation', () => {
    it('returns 400 when code is missing', async () => {
      const request = createMockRequest({})
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBe('Gift card code is required')
    })

    it('returns 400 when code is empty string', async () => {
      const request = createMockRequest({ code: '' })
      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('normalizes code to uppercase', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-TEST123',
          currentBalance: 100,
          initialAmount: 100,
          status: 'active',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: 'gc-test123' })
      await POST(request)

      expect(findMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            code: {
              equals: 'GC-TEST123',
            },
          },
        })
      )
    })

    it('trims whitespace from code', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-TEST123',
          currentBalance: 100,
          initialAmount: 100,
          status: 'active',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: '  GC-TEST123  ' })
      await POST(request)

      expect(findMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            code: {
              equals: 'GC-TEST123',
            },
          },
        })
      )
    })
  })

  describe('Gift Card Lookup', () => {
    it('returns 404 when gift card not found', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({ docs: [] })

      const request = createMockRequest({ code: 'GC-NOTFOUND' })
      const response = await POST(request)

      expect(response.status).toBe(404)
      const json = await response.json()
      expect(json.error).toContain('Gift card not found')
    })

    it('returns 400 when gift card is inactive', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-INACTIVE',
          currentBalance: 0,
          initialAmount: 100,
          status: 'used',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: 'GC-INACTIVE' })
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toContain('no longer active')
    })

    it('returns balance for valid active gift card', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-VALID123',
          currentBalance: 75.50,
          initialAmount: 100,
          status: 'active',
          createdAt: '2024-01-15T12:00:00Z',
        }],
      })

      const request = createMockRequest({ code: 'GC-VALID123' })
      const response = await POST(request)

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json).toEqual({
        code: 'GC-VALID123',
        balance: 75.50,
        originalAmount: 100,
        purchasedDate: '2024-01-15T12:00:00Z',
        expirationDate: 'Never',
        status: 'active',
      })
    })

    it('handles gift card with zero balance', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-EMPTY',
          currentBalance: 0,
          initialAmount: 50,
          status: 'active',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: 'GC-EMPTY' })
      const response = await POST(request)

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.balance).toBe(0)
    })

    it('handles gift card without initialAmount', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-TEST',
          currentBalance: 100,
          status: 'active',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: 'GC-TEST' })
      const response = await POST(request)

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.originalAmount).toBe(100) // Falls back to currentBalance
    })
  })

  describe('Error Handling', () => {
    it('returns 500 on database errors', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest({ code: 'GC-TEST' })
      const response = await POST(request)

      expect(response.status).toBe(500)
      const json = await response.json()
      expect(json.error).toContain('error occurred')
    })

    it('handles malformed request body', async () => {
      const request = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as NextRequest

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })

  describe('Security', () => {
    it('uses overrideAccess for public balance checks', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          code: 'GC-TEST',
          currentBalance: 100,
          initialAmount: 100,
          status: 'active',
          createdAt: '2024-01-01',
        }],
      })

      const request = createMockRequest({ code: 'GC-TEST' })
      await POST(request)

      expect(findMock).toHaveBeenCalledWith(
        expect.objectContaining({
          overrideAccess: true,
        })
      )
    })

    it('only returns public gift card information', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const findMock = mockPayload.find as ReturnType<typeof vi.fn>

      findMock.mockResolvedValue({
        docs: [{
          id: 'secret-id',
          code: 'GC-TEST',
          currentBalance: 100,
          initialAmount: 100,
          status: 'active',
          createdAt: '2024-01-01',
          purchaserEmail: 'secret@example.com',
          stripePaymentIntentId: 'pi_secret',
        }],
      })

      const request = createMockRequest({ code: 'GC-TEST' })
      const response = await POST(request)
      const json = await response.json()

      // Should NOT include sensitive fields
      expect(json).not.toHaveProperty('id')
      expect(json).not.toHaveProperty('purchaserEmail')
      expect(json).not.toHaveProperty('stripePaymentIntentId')

      // Should ONLY include public fields
      expect(Object.keys(json)).toEqual([
        'code',
        'balance',
        'originalAmount',
        'purchasedDate',
        'expirationDate',
        'status',
      ])
    })
  })
})

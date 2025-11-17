import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'
import type Stripe from 'stripe'

// Create shared mocks
const mockConstructEvent = vi.fn()
const mockRetrieve = vi.fn()

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      webhooks = {
        constructEvent: mockConstructEvent,
      }
      checkout = {
        sessions: {
          retrieve: mockRetrieve,
        },
      }
    }
  }
})

// Mock dependencies
vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue(true),
  sendOwnerOrderNotification: vi.fn().mockResolvedValue(true),
  sendOwnerGiftCardNotification: vi.fn().mockResolvedValue(true),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({
      id: 'test-id',
      orderNumber: 'ORD-123456',
      total: 100.00,
      code: 'GC-ABC123',
    }),
    update: vi.fn().mockResolvedValue({}),
  }),
  buildConfig: vi.fn((config) => config),
}))

// Mock payload config
vi.mock('@payload-config', () => ({
  default: {},
}))

// Mock fetch for internal API calls
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ id: 'printify-123' }),
}) as typeof fetch

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
  })

  const createMockRequest = (body: string, signature: string = 'test-signature') => {
    return {
      text: vi.fn().mockResolvedValue(body),
      headers: {
        get: vi.fn((name: string) => {
          if (name === 'stripe-signature') return signature
          return null
        }),
      },
    } as unknown as NextRequest
  }

  describe('Signature Verification', () => {
    it('returns 400 for invalid signature', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const request = createMockRequest('{}', 'invalid-signature')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBe('Invalid signature')
    })

    it('validates signature correctly', async () => {
      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test',
            metadata: {},
          },
        },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest('{}')
      const response = await POST(request)

      expect(mockConstructEvent).toHaveBeenCalledWith(
        '{}',
        'test-signature',
        'whsec_test_123'
      )
      expect(response.status).toBe(200)
    })
  })

  describe('Checkout Session Completed - Regular Order', () => {
    it('processes regular product order successfully', async () => {
      const cartItems = [
        {
          productId: 'prod_123',
          productName: 'Test Product',
          variantId: 'var_123',
          variantName: 'Medium / Blue',
          quantity: 2,
          price: 29.99,
        },
      ]

      const mockSession = {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_intent: 'pi_test_123',
        customer_details: {
          email: 'customer@example.com',
          name: 'John Doe',
          phone: null,
          tax_exempt: 'none',
          tax_ids: null,
        },
        amount_total: 10997,
        amount_subtotal: 5998,
        metadata: {
          cartItems: JSON.stringify(cartItems),
        },
      }

      const fullSession = {
        ...mockSession,
        line_items: { data: [] },
        shipping_details: {
          address: {
            line1: '123 Main St',
            line2: null,
            city: 'Springfield',
            state: 'MO',
            postal_code: '65801',
            country: 'US',
          },
        },
        total_details: {
          amount_shipping: 999,
          amount_tax: 4000,
        },
      }

      mockRetrieve.mockResolvedValue(fullSession)

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(mockRetrieve).toHaveBeenCalledWith(
        'cs_test_123',
        expect.objectContaining({
          expand: expect.arrayContaining(['line_items', 'customer_details', 'shipping_details']),
        })
      )
    })

    it('handles missing customer information gracefully', async () => {
      const mockSession = {
        id: 'cs_test_123',
        metadata: {},
        customer_details: null,
      }

      mockRetrieve.mockResolvedValue(mockSession)

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      // Should still return 200 even if order creation fails
      expect(response.status).toBe(200)
    })
  })

  describe('Checkout Session Completed - Gift Card', () => {
    it('processes digital gift card purchase', async () => {
      const mockSession = {
        id: 'cs_test_gift',
        payment_intent: 'pi_test_gift',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '100.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          message: 'Happy Birthday!',
          deliveryMethod: 'immediate',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json.received).toBe(true)
    })

    it('processes scheduled digital gift card', async () => {
      const mockSession = {
        id: 'cs_test_scheduled',
        payment_intent: 'pi_test_scheduled',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '50.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          deliveryMethod: 'scheduled',
          scheduledDeliveryDate: '2024-12-25',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('processes physical gift card purchase', async () => {
      const mockSession = {
        id: 'cs_test_physical',
        payment_intent: 'pi_test_physical',
        metadata: {
          type: 'gift-card',
          cardType: 'physical',
          amount: '75.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          shippingName: 'Jane Doe',
          shippingStreet1: '456 Oak Ave',
          shippingCity: 'Springfield',
          shippingState: 'MO',
          shippingZipCode: '65801',
          shippingCountry: 'United States',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Other Event Types', () => {
    it('handles payment_intent.succeeded event', async () => {
      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test' } },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('handles payment_intent.payment_failed event', async () => {
      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'payment_intent.payment_failed',
        data: { object: { id: 'pi_test_failed' } },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('handles unknown event types gracefully', async () => {
      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'unknown.event.type',
        data: { object: {} },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Printify Integration', () => {
    it('handles failed Printify order creation gracefully', async () => {
      const cartItems = [
        {
          productId: 'prod_123',
          productName: 'Test Product',
          variantId: 'var_123',
          variantName: 'Medium / Blue',
          quantity: 2,
          price: 29.99,
        },
      ]

      const mockSession = {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_intent: 'pi_test_123',
        customer_details: {
          email: 'customer@example.com',
          name: 'John Doe',
          phone: null,
          tax_exempt: 'none',
          tax_ids: null,
        },
        amount_total: 10997,
        amount_subtotal: 5998,
        metadata: {
          cartItems: JSON.stringify(cartItems),
        },
      }

      const fullSession = {
        ...mockSession,
        line_items: { data: [] },
        shipping_details: {
          address: {
            line1: '123 Main St',
            line2: null,
            city: 'Springfield',
            state: 'MO',
            postal_code: '65801',
            country: 'US',
          },
        },
        total_details: {
          amount_shipping: 999,
          amount_tax: 4000,
        },
      }

      mockRetrieve.mockResolvedValue(fullSession)

      // Mock fetch to fail for Printify API call
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Printify error' }),
      })

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      // Should still return 200 even if Printify fails
      expect(response.status).toBe(200)
    })

    it('updates order with Printify ID on success', async () => {
      const { getPayload } = await import('payload')
      const mockPayload = await getPayload({ config: {} as never })
      const updateMock = mockPayload.update as ReturnType<typeof vi.fn>

      const cartItems = [
        {
          productId: 'prod_123',
          productName: 'Test Product',
          variantId: 'var_123',
          variantName: 'Medium / Blue',
          quantity: 2,
          price: 29.99,
        },
      ]

      const mockSession = {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_intent: 'pi_test_123',
        customer_details: {
          email: 'customer@example.com',
          name: 'John Doe',
          phone: null,
          tax_exempt: 'none',
          tax_ids: null,
        },
        amount_total: 10997,
        amount_subtotal: 5998,
        metadata: {
          cartItems: JSON.stringify(cartItems),
        },
      }

      const fullSession = {
        ...mockSession,
        line_items: { data: [] },
        shipping_details: {
          address: {
            line1: '123 Main St',
            line2: null,
            city: 'Springfield',
            state: 'MO',
            postal_code: '65801',
            country: 'US',
          },
        },
        total_details: {
          amount_shipping: 999,
          amount_tax: 4000,
        },
      }

      mockRetrieve.mockResolvedValue(fullSession)

      // Mock successful Printify response
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'printify-order-123' }),
      })

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(updateMock).toHaveBeenCalled()
    })
  })

  describe('Email Notifications', () => {
    it('sends emails for regular orders', async () => {
      const { sendOrderConfirmation, sendOwnerOrderNotification } = await import('@/lib/email')

      const cartItems = [
        {
          productId: 'prod_123',
          productName: 'Test Product',
          variantId: 'var_123',
          variantName: 'Medium / Blue',
          quantity: 2,
          price: 29.99,
        },
      ]

      const mockSession = {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_intent: 'pi_test_123',
        customer_details: {
          email: 'customer@example.com',
          name: 'John Doe',
          phone: null,
          tax_exempt: 'none',
          tax_ids: null,
        },
        amount_total: 10997,
        amount_subtotal: 5998,
        metadata: {
          cartItems: JSON.stringify(cartItems),
        },
      }

      const fullSession = {
        ...mockSession,
        line_items: { data: [] },
        shipping_details: {
          address: {
            line1: '123 Main St',
            line2: null,
            city: 'Springfield',
            state: 'MO',
            postal_code: '65801',
            country: 'US',
          },
        },
        total_details: {
          amount_shipping: 999,
          amount_tax: 4000,
        },
      }

      mockRetrieve.mockResolvedValue(fullSession)

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(sendOrderConfirmation).toHaveBeenCalled()
      expect(sendOwnerOrderNotification).toHaveBeenCalled()
    })

    it('handles immediate gift card email delivery', async () => {
      const mockSession = {
        id: 'cs_test_gift',
        payment_intent: 'pi_test_gift',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '100.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          message: 'Happy Birthday!',
          deliveryMethod: 'immediate',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      // Mock fetch for gift card email API
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/email/send-gift-card'),
        expect.any(Object)
      )
    })

    it('handles gift card email failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const mockSession = {
        id: 'cs_test_gift',
        payment_intent: 'pi_test_gift',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '100.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          deliveryMethod: 'immediate',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      // Mock fetch to throw error
      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Email API error'))

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      // Should still return 200 even if email fails
      expect(response.status).toBe(200)
      consoleSpy.mockRestore()
    })

    it('handles scheduled gift card confirmation', async () => {
      const mockSession = {
        id: 'cs_test_scheduled',
        payment_intent: 'pi_test_scheduled',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '50.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          deliveryMethod: 'scheduled',
          scheduledDeliveryDate: '2024-12-25',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/email/send-scheduled-gift-card-confirmation'),
        expect.any(Object)
      )
    })

    it('handles physical gift card confirmation', async () => {
      const mockSession = {
        id: 'cs_test_physical',
        payment_intent: 'pi_test_physical',
        metadata: {
          type: 'gift-card',
          cardType: 'physical',
          amount: '75.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          shippingName: 'Jane Doe',
          shippingStreet1: '456 Oak Ave',
          shippingCity: 'Springfield',
          shippingState: 'MO',
          shippingZipCode: '65801',
          shippingCountry: 'United States',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/email/send-physical-gift-card-confirmation'),
        expect.any(Object)
      )
    })

    it('handles physical gift card email failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const mockSession = {
        id: 'cs_test_physical',
        payment_intent: 'pi_test_physical',
        metadata: {
          type: 'gift-card',
          cardType: 'physical',
          amount: '75.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          shippingName: 'Jane Doe',
          shippingStreet1: '456 Oak Ave',
          shippingCity: 'Springfield',
          shippingState: 'MO',
          shippingZipCode: '65801',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      // Mock failed email API
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
      })

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      consoleSpy.mockRestore()
    })

    it('handles scheduled gift card email failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const mockSession = {
        id: 'cs_test_scheduled',
        payment_intent: 'pi_test_scheduled',
        metadata: {
          type: 'gift-card',
          cardType: 'digital',
          amount: '50.00',
          purchaserName: 'John Doe',
          purchaserEmail: 'john@example.com',
          recipientName: 'Jane Doe',
          recipientEmail: 'jane@example.com',
          deliveryMethod: 'scheduled',
          scheduledDeliveryDate: '2024-12-25',
        },
      }

      const mockEvent = {
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: mockSession },
        api_version: '2025-10-29.clover',
        created: Date.now(),
        livemode: false,
        pending_webhooks: 0,
        request: null,
      }

      mockConstructEvent.mockReturnValue(mockEvent)

      // Mock failed email API
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
      })

      const request = createMockRequest(JSON.stringify(mockEvent))
      const response = await POST(request)

      expect(response.status).toBe(200)
      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('returns 400 on signature verification errors', async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error('Signature verification failed')
      })

      const request = createMockRequest('{}')
      const response = await POST(request)

      expect(response.status).toBe(400)
      const json = await response.json()
      expect(json.error).toBe('Invalid signature')
    })

    it('handles missing Stripe secret key', async () => {
      delete process.env.STRIPE_SECRET_KEY

      const request = createMockRequest('{}')

      await expect(POST(request)).rejects.toThrow('STRIPE_SECRET_KEY is not set')
    })
  })
})

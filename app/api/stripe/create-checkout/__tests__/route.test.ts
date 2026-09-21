import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'

const { mockCreateSession } = vi.hoisted(() => ({
  mockCreateSession: vi.fn(),
}))

vi.mock('stripe', () => ({
  default: class MockStripe {
    checkout = {
      sessions: {
        create: mockCreateSession,
      },
    }
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true })),
  getClientIp: vi.fn(() => '127.0.0.1'),
}))

describe('Stripe merch checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.lakeridepros.com'
    process.env.MERCH_CHECKOUT_ENABLED = 'true'
    mockCreateSession.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    })
  })

  it('blocks merch checkout while the replacement shop is being launched', async () => {
    process.env.MERCH_CHECKOUT_ENABLED = 'false'
    const request = new NextRequest('http://localhost/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ productId: 'old-printify-product' }] }),
    })

    const response = await POST(request)

    expect(response.status).toBe(503)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  it('stores cart details on line items without exceeding session metadata limits', async () => {
    const items = Array.from({ length: 12 }, (_, index) => ({
      productId: `product-${index}`,
      variantId: `variant-${index}`,
      productName: `Booth Product ${index} ${'x'.repeat(100)}`,
      variantName: 'Black / M',
      image: 'https://cdn.example.com/product.png',
      price: 25,
      quantity: 1,
      size: 'M',
      color: 'Black',
      personalization: '',
    }))

    const request = new NextRequest('http://localhost/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    const response = await POST(request)
    const checkoutInput = mockCreateSession.mock.calls[0][0]

    expect(response.status).toBe(200)
    expect(checkoutInput.metadata).toEqual({ type: 'merch' })
    expect(checkoutInput.metadata).not.toHaveProperty('cartItems')
    expect(checkoutInput.line_items).toHaveLength(12)
    expect(checkoutInput.line_items[0].price_data.product_data.metadata).toEqual({
      productId: 'product-0',
      variantId: 'variant-0',
      size: 'M',
      color: 'Black',
      personalization: '',
    })
  })
})

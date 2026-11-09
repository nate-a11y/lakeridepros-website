import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as merchCheckout } from '../create-checkout/route'
import { POST as giftCardCheckout } from '../create-gift-card-checkout/route'
import { GET as getSession } from '../session/route'
import { POST as webhook } from '../webhook/route'

const { mockOptions, mockCreateSession } = vi.hoisted(() => ({
  mockOptions: vi.fn(),
  mockCreateSession: vi.fn(),
}))

vi.mock('stripe', () => ({
  default: class MockStripe {
    constructor(_key: string, options: unknown) {
      mockOptions(options)
    }
    checkout = { sessions: { create: mockCreateSession } }
    webhooks = {
      constructEvent: () => ({ type: 'unhandled.test.event' }),
    }
  },
}))

beforeEach(() => {
  vi.stubEnv('MERCH_CHECKOUT_ENABLED', 'true')
  mockOptions.mockClear()
  mockCreateSession.mockResolvedValue({ id: 'cs_test', url: 'https://checkout.stripe.com/test' })
})

afterEach(() => vi.unstubAllEnvs())

it.each([
  ['merch checkout', merchCheckout],
  ['gift card checkout', giftCardCheckout],
  ['session retrieval', getSession],
  ['webhook', webhook],
])('%s keeps the existing Stripe API contract after the SDK upgrade', async (_name, handler) => {
  await handler(new NextRequest('http://localhost/api/stripe/test', { method: 'POST', body: '{}' }))
  expect(mockOptions).toHaveBeenCalledWith({ apiVersion: '2026-09-30.endive' })
})

it.each([
  ['merch', merchCheckout, {
    items: [{ productId: 'product', variantId: 'variant', productName: 'Shirt', variantName: 'M',
      image: 'https://example.com/shirt.png', price: 25, quantity: 1 }],
  }],
  ['gift card', giftCardCheckout, {
    amount: 25, purchaserName: 'Test Buyer', purchaserEmail: 'buyer@example.com',
  }],
])('%s checkout remains card-only', async (_name, handler, body) => {
  const response = await handler(new NextRequest('http://localhost/api/stripe/test', {
    method: 'POST', body: JSON.stringify(body),
  }))
  expect(response.status).toBe(200)
  expect(mockCreateSession).toHaveBeenCalledWith(expect.objectContaining({ allowed_payment_method_types: ['card'] }))
})

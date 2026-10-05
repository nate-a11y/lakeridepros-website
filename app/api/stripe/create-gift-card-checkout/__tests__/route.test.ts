import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'

const { createSession, stripeOptions } = vi.hoisted(() => ({
  createSession: vi.fn(), stripeOptions: vi.fn(),
}))
vi.mock('stripe', () => ({
  default: class StripeMock {
    constructor(_key: string, options: unknown) { stripeOptions(options) }
    checkout = { sessions: { create: createSession } }
  },
}))

describe('Endive gift card checkout compatibility', () => {
  beforeEach(() => {
    createSession.mockResolvedValue({ id: 'cs_test_only', url: 'https://example.com/test-checkout' })
  })
  it('keeps digital gift cards card-only and preserves the purchase amount', async () => {
    const response = await POST(new NextRequest('http://localhost/api/stripe/create-gift-card-checkout', {
      method: 'POST', body: JSON.stringify({
        type: 'digital', amount: 50, purchaserName: 'Test Buyer', purchaserEmail: 'buyer@example.com',
      }),
    }))
    expect(response.status).toBe(200)
    expect(stripeOptions).toHaveBeenCalledWith({ apiVersion: '2026-09-30.endive' })
    const input = createSession.mock.calls[0][0]
    expect(input.allowed_payment_method_types).toEqual(['card'])
    expect(input).not.toHaveProperty('payment_method_types')
    expect(input.line_items[0].price_data.unit_amount).toBe(5000)
    expect(input.metadata).toMatchObject({ type: 'gift-card', amount: '50', cardType: 'digital' })
  })
})

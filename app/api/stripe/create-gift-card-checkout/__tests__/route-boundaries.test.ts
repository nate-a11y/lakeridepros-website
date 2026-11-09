import { NextRequest } from 'next/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { POST } from '../route'

const { create } = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('stripe', () => ({ default: class { checkout = { sessions: { create } } } }))
const input = { amount: 100, purchaserName: 'Test Buyer', purchaserEmail: 'buyer@example.com' }
const request = (body: unknown) => new NextRequest('http://localhost/api/stripe/create-gift-card-checkout', { method: 'POST', body: JSON.stringify(body) })
beforeEach(() => {
  vi.stubEnv('STRIPE_SECRET_KEY', 'test-only'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com')
  create.mockReset().mockResolvedValue({ id: 'test-session', url: 'https://checkout.example.com' })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs() })

it.each([undefined, 0, 9, 1001])('rejects amount %s before calling Stripe', async amount => {
  expect((await POST(request({ ...input, amount }))).status).toBe(400)
  expect(create).not.toHaveBeenCalled()
})
it.each(['purchaserName', 'purchaserEmail'])('requires %s', async field => {
  expect((await POST(request({ ...input, [field]: '' }))).status).toBe(400)
  expect(create).not.toHaveBeenCalled()
})
it.each(['address', 'name', 'street1', 'city', 'state', 'zipCode'])('requires complete physical shipping: %s', async field => {
  const shippingAddress = { name: 'Buyer', street1: '123 Example St', city: 'Example', state: 'MO', zipCode: '65000', [field]: '' }
  expect((await POST(request({ ...input, type: 'physical', shippingAddress: field === 'address' ? undefined : shippingAddress }))).status).toBe(400)
  expect(create).not.toHaveBeenCalled()
})
it('preserves physical card value and bills USPS shipping separately', async () => {
  const response = await POST(request({ ...input, type: 'physical', shippingAddress: { name: 'Buyer', street1: '123 Example St', city: 'Example', state: 'MO', zipCode: '65000' } }))
  expect(response.status).toBe(200)
  const params = create.mock.calls[0][0]
  expect(params.line_items.map((item: { price_data: { unit_amount: number } }) => item.price_data.unit_amount)).toEqual([10000, 500])
  expect(params.metadata).toMatchObject({ amount: '100', cardType: 'physical', shippingCountry: 'United States', shippingStreet2: '', recipientName: '', recipientEmail: '', message: '', deliveryMethod: 'immediate', giftCardValue: '100', isPromotion: 'false' })
})
it('stores recipient, scheduled delivery, and promotional value without charging for the bonus', async () => {
  vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('2025-11-28')
  expect((await POST(request({ ...input, type: 'digital', recipientName: 'Recipient', recipientEmail: 'recipient@example.com', message: 'Example', deliveryMethod: 'scheduled', scheduledDeliveryDate: '2099-01-01T12:00:00Z' }))).status).toBe(200)
  const params = create.mock.calls[0][0]
  expect(params.metadata).toMatchObject({ isPromotion: 'true', bonusAmount: '25', giftCardValue: '125', recipientName: 'Recipient', recipientEmail: 'recipient@example.com', message: 'Example', deliveryMethod: 'scheduled', scheduledDeliveryDate: '2099-01-01T12:00:00Z' })
  expect(params.line_items[0].price_data.unit_amount).toBe(10000)
  expect(params.line_items[0].price_data.product_data.description).toContain('BONUS')
})
it('uses the configured server base URL or localhost fallback when no public site URL exists', async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', ''); vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://server.example.com')
  await POST(request(input)); expect(create.mock.calls[0][0].cancel_url).toBe('https://server.example.com/gift-cards')
  vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
  await POST(request(input)); expect(create.mock.calls[1][0].cancel_url).toBe('http://localhost:3000/gift-cards')
})
it('reports SDK failures without creating a successful checkout response', async () => {
  create.mockRejectedValueOnce(new Error('provider unavailable'))
  expect(await (await POST(request(input))).json()).toEqual({ error: 'provider unavailable' })
  create.mockRejectedValueOnce('offline')
  expect(await (await POST(request(input))).json()).toEqual({ error: 'Failed to create checkout session' })
  vi.stubEnv('STRIPE_SECRET_KEY', '')
  await expect(POST(request(input))).rejects.toThrow('STRIPE_SECRET_KEY')
})

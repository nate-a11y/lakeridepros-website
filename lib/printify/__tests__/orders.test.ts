import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createPrintifyOrder } from '../orders'

const { fetchProduct } = vi.hoisted(() => ({ fetchProduct: vi.fn() }))
vi.mock('@/sanity/lib/client', () => ({ client: { fetch: fetchProduct } }))
const fetcher = vi.fn()
const input = {
  orderNumber: 'ORD-TEST', cartItems: [{ productId: 'product-1', variantId: 'SKU-1', quantity: 2 }],
  shippingAddress: { line1: '123 Example St', city: 'Example', state: 'MO', postalCode: '65000', country: 'US' },
  customerEmail: 'buyer@example.com', customerName: 'Test Example Buyer',
}
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test'); vi.stubEnv('PRINTIFY_API_TOKEN', 'test-token'); vi.stubEnv('PRINTIFY_SHOP_ID', 'test-shop')
  vi.stubGlobal('fetch', fetcher)
  fetcher.mockReset().mockImplementation(async () => Response.json({ id: 'order-1' }))
  fetchProduct.mockReset().mockResolvedValue({ _id: 'product-1', printifyProductId: 'external-product', variants: [{ sku: 'SKU-1', printifyVariantId: '123' }] })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers() })

it('maps verified CMS product/variant identifiers, shipping, quantities, and order idempotency keys', async () => {
  expect(await createPrintifyOrder(input)).toEqual({ id: 'order-1', productionStatus: 'not_attempted' })
  expect(fetchProduct).toHaveBeenCalledWith(expect.any(String), { id: 'product-1' })
  expect(fetcher).toHaveBeenCalledTimes(1)
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
    external_id: 'ORD-TEST', label: 'ORD-TEST',
    line_items: [{ product_id: 'external-product', variant_id: 123, quantity: 2, external_id: 'ORD-TEST-1' }],
    shipping_method: 1, send_shipping_notification: true,
    address_to: { first_name: 'Test', last_name: 'Example Buyer', email: 'buyer@example.com', phone: '', country: 'US', region: 'MO', address1: '123 Example St', address2: '', city: 'Example', zip: '65000' },
  })
})

it.each(['PRINTIFY_API_TOKEN', 'PRINTIFY_SHOP_ID'])('rejects missing %s without contacting a provider', async key => {
  vi.stubEnv(key, '')
  await expect(createPrintifyOrder(input)).rejects.toThrow('Printify is not configured')
  expect(fetchProduct).not.toHaveBeenCalled(); expect(fetcher).not.toHaveBeenCalled()
})

it.each([
  [null, 'Failed to fetch product'], [{ _id: 'product-1' }, 'Printify product ID not found'],
  [{ printifyProductId: 'external' }, 'Printify variant ID not found'],
  [{ printifyProductId: 'external', variants: [{ sku: 'other' }] }, 'Printify variant ID not found'],
  [{ printifyProductId: 'external', variants: [{ sku: 'SKU-1' }] }, 'Printify variant ID not found'],
])('does not create an order when CMS product mapping is incomplete: %j', async (product, message) => {
  fetchProduct.mockResolvedValue(product)
  await expect(createPrintifyOrder(input)).rejects.toThrow(message)
  expect(fetcher).not.toHaveBeenCalled()
})

it.each(['Single', '   '])('handles single or absent customer name: %j', async name => {
  await createPrintifyOrder({ ...input, customerName: name, customerPhone: '+15555550123', shippingAddress: { ...input.shippingAddress, line2: 'Suite 1' } })
  expect(JSON.parse(fetcher.mock.calls[0][1].body).address_to).toMatchObject({ first_name: name.trim() || 'Customer', last_name: '', address2: 'Suite 1', phone: '+15555550123' })
})

it('rejects provider failures and incomplete success responses', async () => {
  fetcher.mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
  await expect(createPrintifyOrder(input)).rejects.toThrow('Printify API error: 503')
  fetcher.mockResolvedValueOnce(Response.json({}))
  await expect(createPrintifyOrder(input)).rejects.toThrow('did not include an order id')
})

it('submits production orders only in production and preserves a created order on fulfillment failure', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  const result = await createPrintifyOrder(input)
  expect(result.productionStatus).toBe('sent_to_production')
  expect(fetcher.mock.calls[1][0]).toContain('/orders/order-1/send_to_production.json')
  fetcher.mockReset().mockResolvedValueOnce(Response.json({ id: 'order-2' })).mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
  expect(await createPrintifyOrder(input)).toMatchObject({ id: 'order-2', productionStatus: 'failed', productionError: 'Printify send-to-production error: 503' })
  expect(fetcher).toHaveBeenCalledTimes(2)
})

it.each([1, 3])('bounds pending-status retries (%i pending responses)', async pendingCount => {
  vi.stubEnv('NODE_ENV', 'production'); vi.useFakeTimers()
  fetcher.mockReset().mockResolvedValueOnce(Response.json({ id: 'order-1' }))
  for (let n = 0; n < pendingCount; n++) fetcher.mockResolvedValueOnce(new Response('status pending', { status: 400 }))
  fetcher.mockImplementation(async () => new Response(null, { status: 200 }))
  const order = createPrintifyOrder(input)
  await vi.runAllTimersAsync()
  expect((await order).productionStatus).toBe(pendingCount === 3 ? 'failed' : 'sent_to_production')
  expect(fetcher).toHaveBeenCalledTimes(pendingCount === 3 ? 4 : 3)
})

it('normalizes non-Error transport failures without losing the created order id', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  fetcher.mockResolvedValueOnce(Response.json({ id: 'order-1' })).mockRejectedValueOnce('offline')
  expect(await createPrintifyOrder(input)).toMatchObject({ id: 'order-1', productionStatus: 'failed', productionError: 'Unknown Printify send-to-production error' })
})

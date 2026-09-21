import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createFourthwallCart,
  FourthwallConfigurationError,
  getFourthwallCheckoutUrl,
  validateFourthwallCheckoutItems,
} from '@/lib/fourthwall/checkout'

const VARIANT_ID = '5ffbc1e0-40f8-4afa-9bed-03f854f080b7'

describe('Fourthwall checkout client', () => {
  beforeEach(() => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED', 'true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('creates a cart with only trusted Storefront API fields', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'cart-123', items: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(createFourthwallCart([
      { variantId: VARIANT_ID, quantity: 2 },
    ])).resolves.toBe('cart-123')

    const [requestUrl, options] = fetchMock.mock.calls[0]
    const url = new URL(String(requestUrl))
    expect(`${url.origin}${url.pathname}`).toBe('https://storefront-api.fourthwall.com/v1/carts')
    expect(url.searchParams.get('storefront_token')).toBe('storefront-token')
    expect(url.searchParams.get('currency')).toBe('USD')
    expect(options).toMatchObject({
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify({ items: [{ variantId: VARIANT_ID, quantity: 2 }] }),
    })
  })

  it('fails closed when the Storefront token is missing', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', '')

    await expect(createFourthwallCart([
      { variantId: VARIANT_ID, quantity: 1 },
    ])).rejects.toBeInstanceOf(FourthwallConfigurationError)
  })

  it('rejects a malformed cart id returned by Fourthwall', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'cart?id=unsafe' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(createFourthwallCart([
      { variantId: VARIANT_ID, quantity: 1 },
    ])).rejects.toMatchObject({
      status: 502,
      message: 'Fourthwall checkout is temporarily unavailable',
    })
  })

  it('sanitizes rejected item details from Fourthwall', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        code: 'CART_OFFER_NOT_AVAILABLE',
        privateDetail: 'must not leak',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const promise = createFourthwallCart([{ variantId: VARIANT_ID, quantity: 1 }])
    await expect(promise).rejects.toMatchObject({
      status: 400,
      code: 'CART_OFFER_NOT_AVAILABLE',
      message: 'One or more cart items are no longer available. Please refresh your cart and try again.',
    })
  })

  it('rejects checkout variants that are not in the public purchasable catalog', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 }),
    )

    await expect(validateFourthwallCheckoutItems([
      { variantId: VARIANT_ID, quantity: 1 },
    ])).rejects.toMatchObject({
      status: 400,
      code: 'CART_ITEM_NOT_PUBLIC',
    })
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store' })
  })

  it('builds the documented checkout URL from a secure configured shop URL', () => {
    vi.stubEnv('FOURTHWALL_SHOP_URL', 'https://shop.example.com/store')

    expect(getFourthwallCheckoutUrl('cart-123')).toBe(
      'https://shop.example.com/checkout/?cartCurrency=USD&cartId=cart-123',
    )
  })

  it.each([
    'http://shop.example.com',
    'https://user:password@shop.example.com',
    'not-a-url',
  ])('rejects an unsafe checkout shop URL: %s', (shopUrl) => {
    vi.stubEnv('FOURTHWALL_SHOP_URL', shopUrl)

    expect(() => getFourthwallCheckoutUrl('cart-123')).toThrow(
      FourthwallConfigurationError,
    )
  })
})

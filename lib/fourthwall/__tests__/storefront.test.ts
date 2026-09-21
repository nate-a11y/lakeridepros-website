import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getFourthwallProduct,
  getFourthwallProducts,
} from '@/lib/fourthwall/storefront'

const PRODUCT = {
  type: 'PRODUCT',
  id: 'product-1',
  name: 'LRP Shirt',
  slug: 'lrp-shirt',
  description: '<p>A shirt</p>',
  state: { type: 'AVAILABLE' },
  access: { type: 'PUBLIC' },
  images: [{ id: 'image-1', url: 'https://cdn.example.com/shirt.jpg', width: 800, height: 800 }],
  variants: [{
    id: '5ffbc1e0-40f8-4afa-9bed-03f854f080b7',
    name: 'Large',
    sku: 'SHIRT-L',
    unitPrice: { value: 25, currency: 'USD' },
    attributes: { description: 'Large' },
    stock: { type: 'UNLIMITED' },
    images: [],
  }],
  createdAt: '2026-09-20T00:00:00Z',
  updatedAt: '2026-09-20T00:00:00Z',
}

describe('Fourthwall Storefront API client', () => {
  beforeEach(() => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED', 'true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('returns validated products from the configured collection', async () => {
    vi.setSystemTime(new Date('2026-09-21T06:30:00Z'))
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.stubEnv('FOURTHWALL_COLLECTION_SLUG', 'featured')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: [PRODUCT] }), { status: 200 }),
    )

    await expect(getFourthwallProducts()).resolves.toEqual([PRODUCT])

    const url = new URL(String(fetchMock.mock.calls[0][0]))
    expect(url.pathname).toBe('/v1/collections/featured/products')
    expect(url.searchParams.get('storefront_token')).toBe('storefront-token')
    expect(url.searchParams.get('currency')).toBe('USD')
    expect(url.searchParams.get('_lrp_catalog_epoch')).toBe(
      String(Math.floor(Date.now() / 60_000)),
    )
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ next: { revalidate: 60 } })
  })

  it('bypasses both application and upstream collection caches during checkout validation', async () => {
    vi.setSystemTime(new Date('2026-09-21T06:31:23.456Z'))
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: [PRODUCT] }), { status: 200 }),
    )

    await expect(getFourthwallProducts({ throwOnError: true })).resolves.toEqual([PRODUCT])

    const url = new URL(String(fetchMock.mock.calls[0][0]))
    expect(url.searchParams.get('_lrp_catalog_epoch')).toBe(String(Date.now()))
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store' })
  })

  it('drops malformed upstream products instead of crashing the shop', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        results: [{ ...PRODUCT, variants: [{ id: 'missing-required-fields' }] }],
      }), { status: 200 }),
    )

    await expect(getFourthwallProducts()).resolves.toEqual([])
  })

  it.each([
    { access: { type: 'HIDDEN' } },
    { access: { type: 'PRIVATE' } },
    { state: { type: 'SOLD_OUT' } },
  ])('does not list unreleased or unpurchasable products: %j', async (override) => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: [{ ...PRODUCT, ...override }] }), { status: 200 }),
    )

    await expect(getFourthwallProducts()).resolves.toEqual([])
  })

  it('does not call Fourthwall when the Storefront token is missing', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(getFourthwallProducts()).resolves.toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([undefined, '', 'false', 'TRUE'])(
    'fails closed when the storefront release gate is %s',
    async (value) => {
      if (value === undefined) {
        vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED', '')
      } else {
        vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED', value)
      }
      vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
      const fetchMock = vi.spyOn(globalThis, 'fetch')

      await expect(getFourthwallProducts()).resolves.toEqual([])
      await expect(getFourthwallProduct('lrp-shirt')).resolves.toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('exposes a disabled storefront as a configuration error to checkout validation', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_ENABLED', 'false')
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')

    await expect(getFourthwallProducts({ throwOnError: true })).rejects.toMatchObject({
      reason: 'configuration',
    })
  })

  it('exposes configuration failure to checkout validation without leaking a token', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', '')

    await expect(getFourthwallProducts({ throwOnError: true })).rejects.toMatchObject({
      reason: 'configuration',
    })
  })

  it('returns null for a malformed product response', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ type: 'BUNDLE' }), { status: 200 }),
    )

    await expect(getFourthwallProduct('bundle')).resolves.toBeNull()
  })

  it('returns null when a hidden product is fetched directly by a known slug', async () => {
    vi.stubEnv('FOURTHWALL_STOREFRONT_TOKEN', 'storefront-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        ...PRODUCT,
        access: { type: 'HIDDEN' },
      }), { status: 200 }),
    )

    await expect(getFourthwallProduct('known-hidden-slug')).resolves.toBeNull()
  })
})

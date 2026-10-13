import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/api/sanity', () => ({
  getServicesLocal: vi.fn().mockResolvedValue({ docs: [] }),
  getBlogPostsLocal: vi.fn().mockResolvedValue({ docs: [] }),
  getVehiclesLocal: vi.fn().mockResolvedValue([]),
  getProductsLocal: vi.fn().mockResolvedValue([{ slug: 'obsolete-sanity-shirt' }]),
  getPagesLocal: vi.fn().mockResolvedValue([]),
  getPartnersLocal: vi.fn().mockResolvedValue([]),
  getDriverProfiles: vi.fn().mockResolvedValue([]),
  getUpcomingEvents: vi.fn().mockResolvedValue([]),
  getVenues: vi.fn().mockResolvedValue({ docs: [] }),
}))
vi.mock('@/lib/fourthwall/storefront', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/fourthwall/storefront')>(),
  getFourthwallProducts: vi.fn(),
}))

import sitemap, { dynamic } from '@/app/sitemap'
import { getFourthwallProducts, FourthwallStorefrontError, type FourthwallProduct } from '@/lib/fourthwall/storefront'
import { getProductsLocal, getServicesLocal } from '@/lib/api/sanity'

const product = (slug: string): FourthwallProduct => ({
  type: 'PRODUCT', id: slug, slug, name: slug, description: '',
  state: { type: 'AVAILABLE' }, access: { type: 'PUBLIC' }, images: [], variants: [],
  createdAt: '2026-10-01T12:00:00Z', updatedAt: '2026-10-12T12:00:00Z',
})

describe('sitemap stays aligned with the live shop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getFourthwallProducts).mockResolvedValue([])
    vi.mocked(getServicesLocal).mockResolvedValue({ docs: [] })
  })

  it('is generated at request time and never uses the retired Sanity catalog', async () => {
    vi.mocked(getFourthwallProducts).mockResolvedValue([product('current-tee')])
    const entries = await sitemap()
    expect(dynamic).toBe('force-dynamic')
    expect(entries.filter(entry => entry.url.includes('/shop/products/')).map(entry => entry.url)).toEqual(['https://www.lakeridepros.com/shop/products/current-tee'])
    expect(getProductsLocal).not.toHaveBeenCalled()
    expect(getFourthwallProducts).toHaveBeenCalledWith({ throwOnError: true })
  })

  it('adds and removes products on subsequent requests without a deployment', async () => {
    vi.mocked(getFourthwallProducts).mockResolvedValueOnce([product('first-tee')]).mockResolvedValueOnce([product('next-hat')])
    expect((await sitemap()).some(entry => entry.url.endsWith('/first-tee'))).toBe(true)
    const next = await sitemap()
    expect(next.some(entry => entry.url.endsWith('/first-tee'))).toBe(false)
    expect(next.some(entry => entry.url.endsWith('/next-hat'))).toBe(true)
  })

  it('omits products when the shop is disabled but propagates outages instead of publishing a partial catalog', async () => {
    vi.mocked(getFourthwallProducts).mockRejectedValueOnce(new FourthwallStorefrontError('Disabled', 'configuration'))
    expect((await sitemap()).some(entry => entry.url.includes('/shop/products/'))).toBe(false)
    vi.mocked(getFourthwallProducts).mockRejectedValueOnce(new FourthwallStorefrontError('Unavailable', 'upstream'))
    await expect(sitemap()).rejects.toThrow('Unavailable')
  })

  it('uses real modification dates and deduplicates static/CMS URLs', async () => {
    vi.mocked(getFourthwallProducts).mockResolvedValue([product('tee'), product('tee')])
    vi.mocked(getServicesLocal).mockResolvedValue({ docs: [{ slug: 'restaurant-shuttle', _updatedAt: '2026-09-01T12:00:00Z' }] as never[] })
    const entries = await sitemap()
    expect(new Set(entries.map(entry => entry.url)).size).toBe(entries.length)
    expect(entries.find(entry => entry.url.endsWith('/tee'))?.lastModified).toEqual(new Date('2026-10-12T12:00:00Z'))
    expect(entries.find(entry => entry.url.endsWith('/restaurant-shuttle'))?.lastModified).toEqual(new Date('2026-09-01T12:00:00Z'))
    expect(entries.find(entry => entry.url.endsWith('/pricing'))?.lastModified).toBeUndefined()
  })
})

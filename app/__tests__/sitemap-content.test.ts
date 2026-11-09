import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import sitemap from '../sitemap'

const { cms } = vi.hoisted(() => ({ cms: { getServicesLocal: vi.fn(), getBlogPostsLocal: vi.fn(), getVehiclesLocal: vi.fn(), getProductsLocal: vi.fn(), getPagesLocal: vi.fn(), getPartnersLocal: vi.fn(), getDriverProfiles: vi.fn(), getUpcomingEvents: vi.fn(), getVenues: vi.fn(), getTestimonialsLocal: vi.fn(), getFourthwallProducts: vi.fn() } }))
vi.mock('@/lib/api/sanity', () => cms)
vi.mock('@/lib/fourthwall/storefront', async importOriginal => ({ ...await importOriginal<typeof import('@/lib/fourthwall/storefront')>(), getFourthwallProducts: cms.getFourthwallProducts }))
beforeEach(() => {
  for (const fn of Object.values(cms)) fn.mockReset().mockResolvedValue([])
  cms.getServicesLocal.mockResolvedValue({ docs: [] }); cms.getBlogPostsLocal.mockResolvedValue({ docs: [] }); cms.getVenues.mockResolvedValue({ docs: [] })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

it('includes all canonical public content with source modification-date fallbacks', async () => {
  cms.getServicesLocal.mockResolvedValue({ docs: [{ slug: 'airport', updatedAt: '2026-11-01' }, { slug: 'wedding' }] })
  cms.getBlogPostsLocal.mockResolvedValue({ docs: [{ slug: 'guide', updatedAt: '2026-11-02' }, { slug: 'news', publishedDate: '2026-11-03' }, { slug: 'undated' }] })
  cms.getVehiclesLocal.mockResolvedValue([{ slug: 'suv', updatedAt: '2026-11-01' }, { slug: 'van' }])
  cms.getFourthwallProducts.mockResolvedValue([{ slug: 'valid-shirt', updatedAt: '2026-11-01' }, { slug: 'valid-hat' }])
  cms.getPagesLocal.mockResolvedValue([{ slug: 'custom-page', updatedAt: '2026-11-01' }, { slug: 'other-page' }])
  cms.getPartnersLocal.mockResolvedValue([{ slug: null }, { slug: { current: '' } }, { slug: 'lrp-promotions' }, { slug: 'premier', isPremierPartner: true }, { slug: { current: 'legacy premier' }, category: 'local-premier', updatedAt: '2026-11-01' }, { slug: 'wedding', isWeddingPartner: true }, { slug: 'legacy-wedding', category: 'wedding' }, { slug: 'referral', isReferralPartner: true }, { slug: 'promotion', isPromotion: true }])
  cms.getDriverProfiles.mockResolvedValue([{ slug: 'open', name: ' Open ' }, { name: 'Missing slug' }, { slug: { current: 'example driver' }, name: 'Driver', _updatedAt: '2026-11-01' }, { slug: 'second-driver', updatedAt: '2026-11-02' }, { slug: 'third-driver' }])
  cms.getUpcomingEvents.mockResolvedValue([{ slug: { current: 'event' }, date: '2099-01-01', _updatedAt: '2026-11-01' }, { slug: 'event-2', date: '2099-01-01', updatedAt: '2026-11-02' }])
  const result = await sitemap()
  const paths = result.map(entry => new URL(entry.url).pathname)
  for (const path of ['/services/airport', '/blog/guide', '/blog/news', '/fleet/suv', '/shop/products/valid-shirt', '/custom-page', '/local-premier-partners/premier', '/local-premier-partners/legacy%20premier', '/wedding-partners/wedding', '/wedding-partners/legacy-wedding', '/partners/referral', '/partners/promotion', '/our-drivers/example%20driver', '/our-drivers/third-driver', '/events/event']) expect(paths).toContain(path)
  expect(paths.some(path => path.includes('Unsafe') || path.endsWith('/open') || path.includes('/partners/lrp-promotions'))).toBe(false)
  expect(result.find(entry => entry.url.endsWith('/blog/news'))?.lastModified).toEqual(new Date('2026-11-03'))
})

it('retains static routes if one dynamic CMS collection fails', async () => {
  cms.getPagesLocal.mockRejectedValue(new Error('CMS unavailable'))
  const entries = await sitemap()
  expect(entries.some(entry => entry.url.endsWith('/gift-cards'))).toBe(true)
  expect(entries.some(entry => entry.url.endsWith('/contact'))).toBe(true)
  expect(entries.some(entry => entry.url.includes('/shop/products/'))).toBe(false)
})

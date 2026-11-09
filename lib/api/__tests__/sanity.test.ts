import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../sanity'

const { fetchRead, fetchWrite, imageUrl } = vi.hoisted(() => ({
  fetchRead: vi.fn(), fetchWrite: vi.fn(), imageUrl: vi.fn(),
}))
vi.mock('@/sanity/lib/client', () => ({ client: { fetch: fetchRead }, writeClient: { fetch: fetchWrite } }))
vi.mock('@/sanity/lib/image', () => ({ urlFor: () => ({ url: imageUrl }) }))

const document = {
  _id: 'document-1', slug: { current: 'sample' }, content: 'A comfortable shuttle ride',
  active: true, featured: true, category: 'trusted-referral', date: '2099-12-31',
  venue: { _id: 'venue-1', slug: { current: 'venue' }, active: true },
  author: { _id: 'author-1' }, service: { _id: 'service-1', slug: 'service' },
}
const normalized = { ...document, id: 'document-1', slug: 'sample',
  venue: { ...document.venue, id: 'venue-1', slug: 'venue' },
  author: { ...document.author, id: 'author-1' }, service: { ...document.service, id: 'service-1' } }

beforeEach(() => {
  fetchRead.mockReset().mockResolvedValue([document])
  fetchWrite.mockReset().mockResolvedValue(document)
  imageUrl.mockReset().mockReturnValue('https://cdn.sanity.io/image.jpg')
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.useRealTimers() })

describe.each([
  ['services', api.getServices], ['vehicles', api.getVehicles], ['products', api.getProducts],
  ['venues', api.getVenues], ['events', api.getEvents],
] as const)('%s collection', (_name, read) => {
  it('normalizes references without mutating the CMS response and caches reads', async () => {
    expect(await read()).toEqual({ docs: [normalized] })
    expect(document.slug).toEqual({ current: 'sample' })
    expect(fetchRead).toHaveBeenCalledWith(expect.any(String), {}, { next: { revalidate: 60 } })
  })
  it('supports page/limit slicing and an omitted limit', async () => {
    fetchRead.mockResolvedValue([document, { ...document, _id: 'second' }])
    expect((await read({ limit: 1, page: 2 })).docs).toEqual([{ ...normalized, _id: 'second', id: 'second' }])
    expect((await read({ page: 1 })).docs).toHaveLength(2)
    expect((await read({ limit: 1 })).docs).toHaveLength(1)
  })
  it('returns an empty collection on unavailable or missing CMS data', async () => {
    fetchRead.mockResolvedValue(null)
    expect(await read()).toEqual({ docs: [] })
    fetchRead.mockRejectedValue(new Error('CMS unavailable'))
    expect(await read()).toEqual({ docs: [] })
  })
})

describe.each([
  ['featured vehicles', () => api.getFeaturedVehicles()], ['random vehicles', () => api.getRandomVehicles()],
  ['local vehicles', api.getVehiclesLocal], ['latest posts', () => api.getLatestBlogPosts()],
  ['featured products', () => api.getFeaturedProducts()], ['local products', api.getProductsLocal],
  ['testimonials', () => api.getTestimonials()], ['random testimonials', () => api.getRandomTestimonials()],
  ['vehicle testimonials', () => api.getVehicleRelatedTestimonials()], ['partners', () => api.getPartners()],
  ['referral partners', () => api.getPartnersByType('referral')], ['pages', api.getPagesLocal],
  ['upcoming events', api.getUpcomingEvents], ['venue events', () => api.getEventsByVenue('venue-1')],
  ['driver profiles', api.getDriverProfiles], ['member logos', api.getMemberLogos],
] as const)('%s list', (_name, read) => {
  it('returns normalized documents', async () => { expect(await read()).toEqual([normalized]) })
  it('fails closed to an empty list', async () => {
    fetchRead.mockRejectedValue({ request: { headers: { Authorization: 'synthetic-test-only' } } })
    expect(await read()).toEqual([])
    const messages = [...vi.mocked(console.error).mock.calls, ...vi.mocked(console.warn).mock.calls]
    expect(JSON.stringify(messages)).not.toContain('synthetic-test-only')
  })
})

describe.each([
  ['service', api.getServiceBySlug], ['vehicle', api.getVehicleBySlug], ['post', api.getBlogPostBySlug],
  ['product', api.getProductBySlug], ['partner', api.getPartnerBySlugLocal], ['page', api.getPageBySlug],
  ['venue', api.getVenueBySlug], ['event', api.getEventBySlug], ['driver', api.getDriverProfileBySlug],
] as const)('%s slug lookup', (_name, read) => {
  it('passes the slug as a query parameter and normalizes the result', async () => {
    fetchRead.mockResolvedValue(document)
    expect(await read('sample')).toEqual(normalized)
    const fetcher = read === api.getVehicleBySlug ? fetchWrite : fetchRead
    expect(fetcher).toHaveBeenCalledWith(expect.any(String), { slug: 'sample' }, expect.any(Object))
    if (read === api.getVehicleBySlug) expect(fetchWrite.mock.calls[0][2]).toEqual({ cache: 'no-store' })
  })
  it('returns null for a missing document or a provider failure', async () => {
    fetchRead.mockResolvedValue(null); fetchWrite.mockResolvedValue(null)
    expect(await read('missing')).toBeNull()
    fetchRead.mockRejectedValue(new Error('CMS unavailable')); fetchWrite.mockRejectedValue('unavailable')
    expect(await read('sample')).toBeNull()
  })
})

it('handles pagination totals, empty results, and failed compound blog queries', async () => {
  fetchRead.mockResolvedValue({ docs: [document], total: 25 })
  expect(await api.getBlogPosts({ page: 2, limit: 10 })).toEqual({ docs: [normalized], hasNextPage: true, page: 2, totalDocs: 25, totalPages: 3 })
  expect(fetchRead.mock.calls[0][1]).toEqual({ start: 10, end: 20 })
  fetchRead.mockResolvedValue({})
  expect(await api.getBlogPosts()).toEqual({ docs: [], hasNextPage: false, page: 1, totalDocs: 0, totalPages: 1 })
  fetchRead.mockRejectedValue(new Error('unavailable'))
  expect(await api.getBlogPosts()).toEqual({ docs: [], hasNextPage: false, page: 1, totalDocs: 0, totalPages: 0 })
})

it('locates adjacent posts at either edge and for unknown slugs', async () => {
  fetchRead.mockResolvedValue([{ _id: 'first', slug: 'first' }, { _id: 'last', slug: 'last' }])
  expect(await api.getAdjacentBlogPosts('first')).toEqual({ previous: null, next: { _id: 'last', id: 'last', slug: 'last' } })
  expect(await api.getAdjacentBlogPosts('last')).toEqual({ previous: { _id: 'first', id: 'first', slug: 'first' }, next: null })
  expect(await api.getAdjacentBlogPosts('missing')).toEqual({ previous: null, next: null })
  fetchRead.mockRejectedValue(new Error('unavailable'))
  expect(await api.getAdjacentBlogPosts('first')).toEqual({ previous: null, next: null })
})

it('excludes placeholder reviews, shuffles copies, and falls back when vehicle reviews are scarce', async () => {
  fetchRead.mockResolvedValue([{ content: ' ' }, {}, { content: 'No comment provided' }, { content: 'No content provided' }, document])
  expect(await api.getTestimonials(true, 4)).toEqual([normalized])
  expect(fetchRead.mock.calls[0][1]).toEqual({ featured: true, minRating: 4 })
  const reviews = [document, { _id: 'second', content: 'Great service' }, { _id: 'third', content: 'Great team', name: 'Reviewer', title: 'Customer' }]
  fetchRead.mockResolvedValue(reviews)
  vi.spyOn(Math, 'random').mockReturnValue(0)
  expect(await api.getRandomTestimonials(1)).toHaveLength(1)
  expect(await api.getVehicleRelatedTestimonials(2)).toHaveLength(2)
  expect(await api.getVehicleRelatedTestimonials(1)).toEqual([normalized])
  expect(reviews[0]).toBe(document)
  expect(await api.getRandomVehicles(1)).toHaveLength(1)
})

it.each([
  ['local-premier', 'premier', 'isPremierPartner'], ['trusted-referral', 'referral', 'isReferralPartner'],
  ['wedding', 'wedding', 'isWeddingPartner'], ['promotions', 'promotion', 'isPromotion'],
] as const)('honors %s legacy categories and checkbox precedence', async (category, type, checkbox) => {
  fetchRead.mockResolvedValue([
    { _id: 'legacy', active: true, category }, { _id: 'modern', active: true, [checkbox]: true, featured: true },
    { _id: 'inactive', active: false, [checkbox]: true },
    { _id: 'other', active: true, category: 'different', isPromotion: true },
  ])
  const expected = type === 'promotion' ? ['legacy', 'modern', 'other'] : ['legacy', 'modern']
  expect((await api.getPartners(category)).map(p => p._id)).toEqual(expected)
  expect((await api.getPartnersByType(type)).map(p => p._id)).toEqual(expected)
  expect((await api.getPartners(category, true)).map(p => p._id)).toEqual(['modern'])
  expect((await api.getPartnersByType(type, true)).map(p => p._id)).toEqual(['modern'])
})

it('includes premier partners in referrals, supports legacy custom categories, and rejects unknown types', async () => {
  fetchRead.mockResolvedValue([{ _id: 'premier', active: true, isPremierPartner: true }, { _id: 'legacy', active: true, category: 'local-premier' }, { _id: 'custom', active: true, category: 'custom' }])
  expect((await api.getPartners('trusted-referral')).map(p => p._id)).toEqual(['premier', 'legacy'])
  expect((await api.getPartners('custom')).map(p => p._id)).toEqual(['custom'])
  expect(await api.getPartnersByType('invalid' as api.PartnerType)).toEqual([])
})

it('includes today but excludes past events and inactive venues', async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-09T18:00:00Z'))
  fetchRead.mockResolvedValue([{ ...document, date: '2026-11-09T00:00:00Z' }, { ...document, date: '2026-11-08' }, { ...document, active: false }, { ...document, venue: { active: false } }, { ...document, venue: 'venue-1' }, { ...document, date: undefined }])
  expect(await api.getUpcomingEvents()).toHaveLength(2)
  for (const value of [{ ...document, date: '2026-11-08' }, { ...document, venue: { active: false } }, { ...document, date: undefined }]) {
    fetchRead.mockResolvedValue(value)
    expect(await api.getEventBySlug('sample')).toBeNull()
  }
})

it('resolves media URLs with safe fallbacks when an image reference is invalid', () => {
  expect(api.getMediaUrl(null)).toBe('')
  expect(api.getMediaUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
  expect(api.getMediaUrl('/image.jpg')).toBe('http://localhost:3000/image.jpg')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', ''); vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://example.com')
  expect(api.getMediaUrl('/image.jpg')).toBe('https://example.com/image.jpg')
  vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
  expect(api.getMediaUrl('/image.jpg')).toBe('https://www.lakeridepros.com/image.jpg')
  expect(api.getMediaUrl({ asset: { url: 'https://example.com/resolved.jpg' } })).toBe('https://example.com/resolved.jpg')
  expect(api.getMediaUrl({ asset: { _ref: 'image-ref' } })).toBe('https://cdn.sanity.io/image.jpg')
  imageUrl.mockImplementation(() => { throw new Error('invalid image') })
  expect(api.getMediaUrl({ url: '/legacy.jpg' })).toBe('https://www.lakeridepros.com/legacy.jpg')
  expect(api.getMediaUrl({})).toBe('')
  expect(api.getMediaUrl(12)).toBe('')
})

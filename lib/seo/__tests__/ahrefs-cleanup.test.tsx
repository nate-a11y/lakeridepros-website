import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const data = vi.hoisted(() => ({
  partner: vi.fn(), venue: vi.fn(), venues: vi.fn(), product: vi.fn(), products: vi.fn(),
  redirect: vi.fn((path: string) => { throw new Error(`redirect:${path}`) }),
}))

vi.mock('next/navigation', () => ({ permanentRedirect: data.redirect }))
vi.mock('@/lib/api/sanity', () => ({
  getPartnerBySlugLocal: data.partner,
  getVenueBySlug: data.venue,
  getVenues: data.venues,
  getUpcomingEvents: vi.fn().mockResolvedValue([]),
  getServices: vi.fn().mockResolvedValue({ docs: [{ title: 'Wedding Transportation', slug: 'wedding-transportation', shortDescription: 'Wedding rides.' }] }),
  getMediaUrl: () => '/og-image.jpg',
}))
vi.mock('@/lib/event-waitlist', () => ({ getActiveEventWaitlistCounts: vi.fn().mockResolvedValue({}) }))
vi.mock('@/lib/fourthwall/storefront', () => ({
  getFourthwallProduct: data.product,
  getFourthwallProducts: data.products,
  plainFourthwallDescription: (value: string) => value,
  getFourthwallProductImage: () => '/og-image.jpg',
}))
vi.mock('@/components/BookingWidget', () => ({ default: () => null }))
vi.mock('@/components/events-editorial/EventCalendarClient', () => ({ default: () => null }))
vi.mock('@/components/EventWaitlistStatusLookup', () => ({ default: () => null }))
vi.mock('@/lib/iconMapper', () => ({ DynamicIcon: () => null }))

import PartnerPage from '@/app/(site)/partners/[slug]/page'
import WeddingPartnerPage, { generateMetadata as weddingMetadata } from '@/app/(site)/wedding-partners/[slug]/page'
import PremierPartnerPage, { generateMetadata as premierMetadata } from '@/app/(site)/local-premier-partners/[slug]/page'
import { generateMetadata as venueMetadata } from '@/app/(site)/events/venues/[slug]/page'
import EventsPage, { generateMetadata as eventMetadata } from '@/app/(site)/events/page'
import { generateMetadata as reviewMetadata } from '@/app/(site)/testimonials/page'
import { generateMetadata as shopMetadata } from '@/app/(site)/shop/page'
import { generateMetadata as productMetadata } from '@/app/(site)/shop/products/[slug]/page'
import ServicesPage from '@/app/(site)/services/page'
import { metadata as musicMetadata } from '@/app/(site)/music/page'
import { metadata as returnMetadata } from '@/app/(site)/return-policy/page'
import { metadata as termsMetadata } from '@/app/(site)/insider-terms-and-conditions/page'
import { metadata as waitlistMetadata } from '@/app/(site)/events/waitlist/page'
import { getCaseSensitiveLegacyRedirect } from '../case-sensitive-redirects'
import nextConfig from '../../../next.config.mjs'

beforeEach(() => {
  vi.clearAllMocks()
  data.partner.mockResolvedValue({ name: 'Lake Partner', slug: 'lake-partner', isWeddingPartner: true, isPremierPartner: true })
  data.venue.mockResolvedValue({ name: 'A Long Missouri Amphitheater Venue Name', slug: 'venue', description: 'Venue information. '.repeat(100) })
  data.venues.mockResolvedValue({ docs: [{ _id: 'venue', slug: 'venue-without-events', name: 'Venue Without Upcoming Events' }] })
  data.products.mockResolvedValue([{ id: 'shirt' }])
  data.product.mockResolvedValue({ id: 'shirt', name: 'Lake Ride Pros Shirt', slug: 'shirt', description: 'Product details. '.repeat(100) })
})

describe('Ahrefs regression fixes', () => {
  it('sends a missing legacy partner to an existing directory', async () => {
    data.partner.mockResolvedValue(null)
    await expect(PartnerPage({ params: Promise.resolve({ slug: 'missing' }) })).rejects.toThrow('redirect:/trusted-referral-partners')
  })

  it('redirects duplicate partner routes to the same canonical URL', async () => {
    const props = { params: Promise.resolve({ slug: 'lake-partner' }) }
    await expect(WeddingPartnerPage(props)).rejects.toThrow('redirect:/local-premier-partners/lake-partner')
    const wedding = await weddingMetadata(props)
    const premier = await premierMetadata(props)
    expect(wedding.alternates?.canonical).toBe(premier.alternates?.canonical)
    expect(wedding.openGraph).toMatchObject({ url: premier.alternates?.canonical })
  })

  it('does not redirect a canonical partner page or introduce a loop', async () => {
    const node = await PremierPartnerPage({ params: Promise.resolve({ slug: 'lake-partner' }) })
    expect(node).toBeTruthy()
    expect(data.redirect).not.toHaveBeenCalled()
  })

  it('bounds venue metadata while retaining useful local content', async () => {
    const metadata = await venueMetadata({ params: Promise.resolve({ slug: 'venue' }) })
    expect(String(metadata.title).length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(155)
    expect(metadata.description).toContain('Venue information.')
    expect(metadata.openGraph).toMatchObject({ title: metadata.title, description: metadata.description })
  })

  it('links venues even when there are no upcoming events', async () => {
    render(await EventsPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByRole('link', { name: 'Venue Without Upcoming Events' })).toHaveAttribute('href', '/events/venues/venue-without-events')
  })

  it.each(['2', '10', '11'])('keeps review pagination %s consistent across search and social metadata', async page => {
    const metadata = await reviewMetadata({ searchParams: Promise.resolve({ page }) })
    expect(metadata.alternates?.canonical).toBe(`https://www.lakeridepros.com/testimonials?page=${page}`)
    expect(metadata.openGraph).toMatchObject({ url: metadata.alternates?.canonical, title: metadata.title, description: metadata.description })
    expect(metadata.description!.length).toBeGreaterThanOrEqual(120)
    expect(metadata.description!.length).toBeLessThanOrEqual(155)
  })

  it('supplements short event metadata without altering the filter canonical', async () => {
    const metadata = await eventMetadata({ searchParams: Promise.resolve({ type: 'tour' }) })
    expect(metadata.description.length).toBeGreaterThanOrEqual(120)
    expect(metadata.openGraph.url).toBe('https://www.lakeridepros.com/events?type=tour')
  })

  it('references one complete business entity instead of repeating incomplete providers', async () => {
    const { container } = render(await ServicesPage())
    const docs = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(script => JSON.parse(script.textContent!))
    const list = docs.find(doc => doc['@type'] === 'ItemList')
    const business = docs.find(doc => doc['@type'] === 'LocalBusiness')
    expect(list.itemListElement[0].item.provider).toEqual({ '@id': business['@id'] })
    expect(business.address.addressRegion).toBe('MO')
    expect(business.address).not.toHaveProperty('streetAddress')
  })

  it('publishes complete social metadata for the store and its real products', async () => {
    for (const metadata of [await shopMetadata(), await productMetadata({ params: Promise.resolve({ slug: 'shirt' }) })]) {
      expect(metadata.openGraph).toMatchObject({ type: 'website', url: metadata.alternates?.canonical, title: metadata.title, description: metadata.description })
      expect(metadata.openGraph).toHaveProperty('images')
      expect(metadata.description!.length).toBeLessThanOrEqual(155)
    }
  })

  it('preserves the empty shop noindex policy', async () => {
    data.products.mockResolvedValue([])
    expect(await shopMetadata()).toMatchObject({ robots: { index: false, follow: true }, openGraph: { url: 'https://www.lakeridepros.com/shop' } })
  })

  it.each([musicMetadata, returnMetadata, termsMetadata, waitlistMetadata])('provides full social metadata on supporting pages', metadata => {
    expect(metadata.openGraph).toMatchObject({ type: 'website', url: metadata.alternates?.canonical })
    expect(metadata.openGraph).toHaveProperty('images')
  })

  it('shortens retired event redirects without changing reusable venue aliases', () => {
    expect(getCaseSensitiveLegacyRedirect('/events/MC4D')).toBe('/events')
    expect(getCaseSensitiveLegacyRedirect('/events/venues/T-Mobile-Center')).toBe('/events/venues/t-mobile-center')
  })

  it('keeps the old partner hub reachable and removes static obsolete-product chains', async () => {
    const rules = await nextConfig.redirects()
    expect(rules).toContainEqual({ source: '/partners', destination: '/trusted-referral-partners', permanent: true })
    expect(rules).toContainEqual({ source: '/shop/products/-lrp-white-tough-phone-cases', destination: '/shop', permanent: true })
  })
})

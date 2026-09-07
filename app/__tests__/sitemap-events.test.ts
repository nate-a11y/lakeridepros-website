import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Event } from '@/lib/api/sanity'

vi.mock('@/lib/api/sanity', () => ({
  getServicesLocal: vi.fn().mockResolvedValue({ docs: [] }),
  getBlogPostsLocal: vi.fn().mockResolvedValue({ docs: [] }),
  getVehiclesLocal: vi.fn().mockResolvedValue([]),
  getProductsLocal: vi.fn().mockResolvedValue([]),
  getPagesLocal: vi.fn().mockResolvedValue([]),
  getPartnersLocal: vi.fn().mockResolvedValue([]),
  getDriverProfiles: vi.fn().mockResolvedValue([]),
  getEvents: vi.fn(),
  getUpcomingEvents: vi.fn().mockRejectedValue(new Error('Uncached calendar fetch must not run during sitemap prerender')),
}))

import sitemap from '@/app/sitemap'
import { getEvents, getUpcomingEvents } from '@/lib/api/sanity'

function event(slug: string, date: string, extras: Partial<Event> = {}): Event {
  return { _id: slug, name: slug, slug, date, venue: 'venue', featured: false, active: true, order: 0, ...extras }
}

describe('sitemap event prerendering', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 6, 16))
    vi.clearAllMocks()
  })
  afterEach(() => vi.useRealTimers())

  it('uses the cached public event fetch and preserves upcoming/active filtering', async () => {
    vi.mocked(getEvents).mockResolvedValue({ docs: [
      event('today', '2026-09-06T00:00:00Z'),
      event('future event', '2026-09-07T00:00:00Z'),
      event('past', '2026-09-05T23:59:59Z'),
      event('inactive', '2026-09-07', { active: false }),
      event('inactive-venue', '2026-09-07', { venue: { _id: 'venue', name: 'Venue', slug: 'venue', active: false, order: 0 } }),
      event('no-date', ''),
      event('', '2026-09-07'),
    ] })

    const entries = await sitemap()
    const eventUrls = entries.map(entry => entry.url).filter(url => url.includes('/events/'))
    expect(eventUrls).toEqual([
      'https://www.lakeridepros.com/events/today',
      'https://www.lakeridepros.com/events/future%20event',
    ])
    expect(getEvents).toHaveBeenCalledOnce()
    expect(getEvents).toHaveBeenCalledWith()
    expect(getUpcomingEvents).not.toHaveBeenCalled()
  })

  it('retains the static calendar URL when the public event list is empty', async () => {
    vi.mocked(getEvents).mockResolvedValue({ docs: [] })
    expect(await sitemap()).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: 'https://www.lakeridepros.com/events' }),
    ]))
  })
})

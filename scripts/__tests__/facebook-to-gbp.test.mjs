import { describe, expect, it } from 'vitest'

import {
  buildTrackedUrl,
  chooseLandingPath,
  classifyFacebookPost,
  inferContentPillar,
  sanitizeFacebookMessage,
  selectFacebookCandidate,
  truncateSummary,
} from '../facebook-to-gbp.mjs'

const now = new Date('2026-09-03T15:00:00Z')

function post(overrides = {}) {
  return {
    id: 'page_123',
    message: 'Professional transportation for airport arrivals and group trips throughout the Lake of the Ozarks. Our team coordinates every pickup with care.',
    created_time: '2026-09-02T15:00:00Z',
    full_picture: 'https://example.com/photo.jpg',
    ...overrides,
  }
}

describe('Facebook-to-GBP automation', () => {
  it('removes contact details, links, and hashtags from Facebook copy', () => {
    expect(
      sanitizeFacebookMessage('Call us at (573) 206-9499! Visit https://example.com now.\n#LakeRidePros #LOTO'),
    ).toBe('Call us at! Visit now.')
  })

  it('removes phone numbers without separators', () => {
    expect(sanitizeFacebookMessage('Reserve at 5732069499 for your next private ride.')).toBe(
      'Reserve at for your next private ride.',
    )
  })

  it('removes emoji-heavy all-caps hook lines from Google copy', () => {
    expect(
      sanitizeFacebookMessage('🔥🔥 FOOTBALL TIME AT THE LAKE! 🔥🔥\nLake Ride Pros is proud to support our local schools and the families who make this community special.'),
    ).toBe('Lake Ride Pros is proud to support our local schools and the families who make this community special.')
  })

  it.each([
    ['giveaway', 'Enter our giveaway to win concert tickets.'],
    ['time-sensitive', 'Book a ride tonight for September 6.'],
    ['hiring', 'We are now hiring professional drivers.'],
    ['sensitive story', 'A tribute to a customer who passed away.'],
  ])('rejects %s content from automatic publication', (_label, message) => {
    expect(classifyFacebookPost(post({ message }), { now }).eligible).toBe(false)
  })

  it('accepts fresh evergreen content with a public photo', () => {
    const result = classifyFacebookPost(post(), { now })
    expect(result).toMatchObject({ eligible: true })
    expect(result.summary).toContain('airport arrivals')
  })

  it('rejects short posts without transportation or brand relevance', () => {
    expect(
      classifyFacebookPost(post({ message: "PaPPo's Pizzeria and Pub - Thank you for giving everyone something to look forward to." }), { now }),
    ).toMatchObject({ eligible: false, reason: 'not relevant to transportation' })
  })

  it('chooses the newest eligible unprocessed post', () => {
    const result = selectFacebookCandidate(
      [
        post({ id: 'new-risky', created_time: '2026-09-03T12:00:00Z', message: 'Enter this giveaway to win tickets tonight!' }),
        post({ id: 'new-safe', created_time: '2026-09-03T11:00:00Z' }),
        post({ id: 'old-safe', created_time: '2026-09-01T11:00:00Z' }),
      ],
      { now, processedIds: ['old-safe'] },
    )
    expect(result.post.id).toBe('new-safe')
    expect(result.skipped).toEqual([{ id: 'new-risky', reason: 'promotion or contest' }])
  })

  it('rotates away from a recently used content pillar', () => {
    const communityPost = post({
      id: 'community',
      created_time: '2026-09-03T12:00:00Z',
      message: 'Lake Ride Pros is proud to sponsor our local school and support the families who make the Lake community such a special place to live and work.',
    })
    const airportPost = post({ id: 'airport', created_time: '2026-09-03T11:00:00Z' })
    expect(selectFacebookCandidate([communityPost, airportPost], { now, excludedPillars: ['community'] }).post.id).toBe('airport')
  })

  it('uses topic-specific landing pages and a stable Facebook marker', () => {
    expect(chooseLandingPath('We track your airport flight.')).toBe('/lake-ozarks-airport-transportation')
    const url = new URL(buildTrackedUrl('We track your airport flight.', 'page/123'))
    expect(url.pathname).toBe('/lake-ozarks-airport-transportation')
    expect(url.searchParams.get('utm_content')).toBe('facebook_page_123')
    expect(inferContentPillar('Wedding guest shuttle planning')).toBe('wedding')
  })

  it('truncates long content without breaking the configured limit', () => {
    expect(truncateSummary('word '.repeat(200), 100).length).toBeLessThanOrEqual(100)
  })
})

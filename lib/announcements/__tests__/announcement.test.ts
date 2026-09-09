import { describe, expect, it } from 'vitest'
import { parseAnnouncement, validateAnnouncementExpiry, isAnnouncementPathAllowed } from '../announcement'

const now = Date.parse('2026-09-09T12:00:00Z')
const announcement = {
  _id: 'siteAnnouncement', _rev: 'revision-1', enabled: true, mode: 'popup',
  title: 'Lake weekend update', message: 'Book your ride early.', expiresAt: '2026-09-10T12:00:00Z',
}

describe('announcement publication boundary', () => {
  it('accepts one published singleton with an optional image and CTA', () => {
    expect(parseAnnouncement({ ...announcement, linkLabel: 'Book a ride', linkUrl: '/book', image: {
      url: 'https://cdn.sanity.io/images/test/production/image.jpg', alt: 'Lake Ride Pros shuttle', width: 1200, height: 800,
    } }, now)).toMatchObject({ mode: 'popup', image: { alt: 'Lake Ride Pros shuttle' } })
  })
  it.each([
    { _id: 'anotherAnnouncement' }, { _id: 'drafts.siteAnnouncement' }, { enabled: false },
    { expiresAt: undefined }, { expiresAt: 'not-a-date' }, { expiresAt: '2026-09-09T12:00:00Z' },
    { expiresAt: '2026-09-09T11:00:00Z' }, { mode: 'unexpected' }, { title: '' },
    { linkLabel: 'Click', linkUrl: 'javascript:alert(1)' }, { linkLabel: 'Click', linkUrl: '//evil.test' },
    { linkLabel: 'Click', linkUrl: '/\\evil.test' }, { linkLabel: 'Click' },
    { image: { url: 'https://evil.test/photo.jpg', alt: 'Photo', width: 100, height: 100 } },
    { image: { url: 'https://cdn.sanity.io/images/test/production/image.jpg', alt: '', width: 100, height: 100 } },
  ])('hides malformed, unpublished, or expired announcements: %j', (patch) => {
    expect(parseAnnouncement({ ...announcement, ...patch }, now)).toBeNull()
  })
  it('permits no image and a safe external CTA', () => {
    expect(parseAnnouncement({ ...announcement, image: null, linkLabel: 'Learn more', linkUrl: 'https://example.com/info' }, now)).not.toBeNull()
  })
  it('requires an expiration even when disabled, and a future expiration when enabled', () => {
    expect(validateAnnouncementExpiry(undefined, false, now)).not.toBe(true)
    expect(validateAnnouncementExpiry('2026-09-09T11:00:00Z', true, now)).not.toBe(true)
    expect(validateAnnouncementExpiry('2026-09-09T11:00:00Z', false, now)).toBe(true)
    expect(validateAnnouncementExpiry('2026-09-10T11:00:00Z', true, now)).toBe(true)
  })
  it.each(['/checkout', '/checkout/success', '/cart', '/careers/driver-application', '/careers/general-application', '/careers/application-status', '/insiders/account', '/giveaways-admin', '/camden-county', '/studio'])('does not interrupt task or private routes: %s', (path) => {
    expect(isAnnouncementPathAllowed(path)).toBe(false)
  })
  it.each(['/', '/services', '/careers', '/blog/lake-weekend'])('allows marketing routes: %s', (path) => {
    expect(isAnnouncementPathAllowed(path)).toBe(true)
  })
})

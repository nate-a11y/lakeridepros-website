import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ATTRIBUTION_MAX_AGE_MS, BOOKING_ATTRIBUTION_KEY, MOOVS_PORTAL_URL, buildMoovsPortalUrl, captureBookingAttribution, extractBookingAttribution } from '../booking-attribution'

beforeEach(() => { vi.restoreAllMocks(); window.sessionStorage.clear(); captureBookingAttribution('', 100) })

describe('booking attribution', () => {
  it('allows campaign fields and common ad click IDs, never arbitrary personal or auth data', () => {
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'utm_custom', 'gclid', 'dclid', 'gbraid', 'wbraid', 'gclsrc', 'gad_source', 'gad_campaignid', 'fbclid', 'msclkid', 'ttclid', 'twclid', 'li_fat_id', 'sccid', 'epik', 'moovs_source']
    const params = new URLSearchParams(keys.map(k => [k, `example & ${k}`]))
    for (const key of ['email', 'token', 'phone', 'gtm_auth', 'gtm_preview', '_gl', 'redirect']) params.set(key, 'never-copy')
    expect(extractBookingAttribution(params.toString())).toEqual(Object.fromEntries(keys.map(k => [k, `example & ${k}`])))
  })
  it('rejects empty, control-character, and oversized values and bounds key count', () => {
    expect(extractBookingAttribution(`utm_source=&utm_medium=%00&utm_campaign=${'a'.repeat(2049)}`)).toEqual({})
    expect(Object.keys(extractBookingAttribution(new URLSearchParams(Array.from({ length: 50 }, (_, i) => [`utm_${i}`, 'x'])).toString()))).toHaveLength(32)
  })
  it('retains attribution through untagged internal navigation and refresh', () => {
    captureBookingAttribution('?utm_source=google&gclid=example', 100)
    expect(captureBookingAttribution('', 200)).toEqual({ utm_source: 'google', gclid: 'example' })
    expect(JSON.parse(sessionStorage.getItem(BOOKING_ATTRIBUTION_KEY)!)).toEqual({ params: { utm_source: 'google', gclid: 'example' }, lastSeen: 200 })
  })
  it('replaces a previous campaign instead of mixing click IDs', () => {
    captureBookingAttribution('?utm_source=google&gclid=old', 100)
    expect(captureBookingAttribution('?utm_source=newsletter', 200)).toEqual({ utm_source: 'newsletter' })
  })
  it('expires idle attribution and ignores future timestamps', () => {
    captureBookingAttribution('?utm_source=google', 100)
    expect(captureBookingAttribution('', 101 + ATTRIBUTION_MAX_AGE_MS)).toEqual({})
    captureBookingAttribution('?utm_source=google', 10000)
    expect(captureBookingAttribution('', 200)).toEqual({})
  })
  it('does not reuse deleted session storage', () => {
    captureBookingAttribution('?utm_source=google', 100)
    sessionStorage.clear()
    expect(captureBookingAttribution('', 200)).toEqual({})
  })
  it('tolerates broken stored JSON and malformed saved params', () => {
    sessionStorage.setItem(BOOKING_ATTRIBUTION_KEY, 'broken')
    expect(captureBookingAttribution('', 200)).toEqual({})
    sessionStorage.setItem(BOOKING_ATTRIBUTION_KEY, JSON.stringify({ params: [['bad']], lastSeen: 200 }))
    expect(captureBookingAttribution('', 201)).toEqual({})
  })
  it('falls back to tab memory when storage is blocked', () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => { throw new Error('blocked') })
    captureBookingAttribution('?utm_source=google', 100)
    expect(captureBookingAttribution('', 200)).toEqual({ utm_source: 'google' })
  })
  it('encodes values and only ever links to the fixed portal', () => {
    const url = new URL(buildMoovsPortalUrl({ utm_campaign: 'summer & lake=fun', email: 'private' }))
    expect(url.origin + url.pathname).toBe(MOOVS_PORTAL_URL)
    expect(url.searchParams.get('utm_campaign')).toBe('summer & lake=fun')
    expect(url.searchParams.has('email')).toBe(false)
  })
  it('preserves a fresh Google linker only on a trusted decorated anchor and never stores it', () => {
    expect(new URL(buildMoovsPortalUrl({}, `${MOOVS_PORTAL_URL}?_gl=fresh&token=private`)).search).toBe('?_gl=fresh')
    for (const href of ['https://evil.example/?_gl=bad', 'broken', 'https://customer.moovs.app/other/?_gl=bad']) expect(buildMoovsPortalUrl({}, href)).toBe(MOOVS_PORTAL_URL)
    captureBookingAttribution('?utm_source=google&_gl=old', 100)
    expect(sessionStorage.getItem(BOOKING_ATTRIBUTION_KEY)).not.toContain('_gl')
  })
})

/** Marketing attribution only: never copy arbitrary query strings or cookies. */
export const MOOVS_PORTAL_URL = 'https://customer.moovs.app/lake-ride-pros/'
export const BOOKING_ATTRIBUTION_EVENT = 'lrp:booking-attribution'
export const BOOKING_ATTRIBUTION_KEY = 'lrp:booking-attribution:v1'
export const ATTRIBUTION_MAX_AGE_MS = 30 * 60 * 1000
const CLICK_KEYS = new Set([
  'gclid', 'dclid', 'gbraid', 'wbraid', 'gclsrc', 'gad_source', 'gad_campaignid',
  'fbclid', 'msclkid', 'ttclid', 'twclid', 'li_fat_id', 'sccid', 'epik', 'moovs_source',
])
const MAX_VALUE_LENGTH = 2048

function validValue(value: string) {
  return value.length > 0 && value.length <= MAX_VALUE_LENGTH && !/[\u0000-\u001f\u007f]/.test(value)
}

export function extractBookingAttribution(search: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of new URLSearchParams(search)) {
    // GTM preview credentials, email, auth tokens, request IDs, etc. are not attribution.
    if (!(/^utm_[a-z0-9_]{1,64}$/i.test(key) || CLICK_KEYS.has(key))) continue
    if (!validValue(value) || Object.keys(result).length >= 32) continue
    result[key] = value
  }
  return result
}

interface StoredAttribution { params: Record<string, string>; lastSeen: number }
let memory: StoredAttribution | null = null

/** Session/tab-scoped fallback survives blocked sessionStorage without blocking booking. */
export function captureBookingAttribution(search: string, now = Date.now()): Record<string, string> {
  let stored = memory
  try {
    const raw = window.sessionStorage.getItem(BOOKING_ATTRIBUTION_KEY)
    stored = raw ? JSON.parse(raw) as StoredAttribution : null
  } catch { /* Storage is optional in private/restricted browsers. */ }
  if (!stored || !Number.isFinite(stored.lastSeen) || now - stored.lastSeen > ATTRIBUTION_MAX_AGE_MS || stored.lastSeen > now) stored = null
  const incoming = extractBookingAttribution(search)
  // A new tagged campaign replaces the old one rather than mixing stale click IDs/UTMs.
  let previous: Record<string, string> = {}
  try { previous = extractBookingAttribution(new URLSearchParams(stored?.params).toString()) } catch { /* Ignore malformed saved state. */ }
  const params = Object.keys(incoming).length ? incoming : previous
  memory = { params, lastSeen: now }
  try { window.sessionStorage.setItem(BOOKING_ATTRIBUTION_KEY, JSON.stringify(memory)) } catch { /* Use in-memory fallback. */ }
  return params
}

export function buildMoovsPortalUrl(params: Record<string, string>, decoratedHref?: string): string {
  const url = new URL(MOOVS_PORTAL_URL)
  const safe = extractBookingAttribution(new URLSearchParams(params).toString())
  for (const [key, value] of Object.entries(safe)) url.searchParams.set(key, value)
  // Google decorates real anchors at click time. Do not erase a fresh linker value,
  // and never persist/replay it in sessionStorage (Google expires it after 2 minutes).
  if (decoratedHref) {
    try {
      const decorated = new URL(decoratedHref)
      const linker = decorated.searchParams.get('_gl')
      if (decorated.origin === url.origin && decorated.pathname === url.pathname && linker && validValue(linker)) url.searchParams.set('_gl', linker)
    } catch { /* Always fall back to the fixed, trusted portal destination. */ }
  }
  return url.toString()
}

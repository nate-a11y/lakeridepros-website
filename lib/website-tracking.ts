/** Business milestones, not form contents, customer identities, or arbitrary URLs. */
export type WebsiteEvent = 'booking_portal_click' | 'booking_intent' | 'phone_click' | 'sms_click' | 'email_click' | 'view_service' | 'view_vehicle' | 'contact_form_start' | 'contact_form_submit' | 'contact_form_error' | 'newsletter_signup' | 'event_waitlist_join'
type EventContext = { booking_location?: string; booking_destination?: string; service_slug?: string; vehicle_slug?: string; form_id?: string; error_type?: string; contact_location?: string }

// Never add custom marketing events on private account/admin/tokenized routes.
export function isPublicMarketingPath(path: string) {
  return !/(?:^|\/)(?:camden|insiders|admin|api|studio|sanity|checkout|gift-card-balance|application-status|driver-application|general-application|application-received)(?:\/|$)|-admin(?:\/|$)/i.test(path)
}

export function trackWebsiteEvent(event: WebsiteEvent, context: EventContext = {}) {
  if (typeof window === 'undefined' || !isPublicMarketingPath(window.location.pathname)) return
  try {
    window.dataLayer = window.dataLayer || []
    const safe: Record<string, string> = {}
    for (const key of ['booking_location', 'booking_destination', 'service_slug', 'vehicle_slug', 'form_id', 'error_type', 'contact_location'] as const) {
      const value = context[key]
      if (typeof value === 'string' && value.length <= 100 && !/[\u0000-\u001f\u007f]/.test(value)) safe[key] = value
    }
    window.dataLayer.push({ event, ...safe })
  } catch { /* Analytics/ad blockers must never break booking or successful forms. */ }
}

export function contactClickEvent(href: string): WebsiteEvent | null {
  const [scheme, destination = ''] = href.split(':')
  const recipient = destination.split('?')[0]
  if (scheme === 'mailto' && recipient.toLowerCase() === 'contactus@lakeridepros.com') return 'email_click'
  const digits = recipient.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')
  if (digits !== '5732069499') return null
  return scheme === 'tel' ? 'phone_click' : scheme === 'sms' ? 'sms_click' : null
}

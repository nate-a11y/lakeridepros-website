'use client'

import { useEffect, useState, type ComponentPropsWithoutRef, type MouseEvent } from 'react'
import { BOOKING_ATTRIBUTION_EVENT, MOOVS_PORTAL_URL, buildMoovsPortalUrl, captureBookingAttribution } from '@/lib/booking-attribution'
import { trackWebsiteEvent } from '@/lib/website-tracking'
import { trackServiceEvent } from '@/lib/analytics'

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { serviceSlug?: string; location?: string }

/** A real anchor supports keyboard, new tabs, and Google's click-time linker. */
export function MoovsBookingLink({ children, className = '', onClick, onAuxClick, serviceSlug, location = 'booking', ...props }: Props) {
  const [href, setHref] = useState(MOOVS_PORTAL_URL)
  useEffect(() => {
    const refresh = () => setHref(buildMoovsPortalUrl(captureBookingAttribution(window.location.search)))
    refresh()
    window.addEventListener(BOOKING_ATTRIBUTION_EVENT, refresh)
    window.addEventListener('pageshow', refresh)
    return () => {
      window.removeEventListener(BOOKING_ATTRIBUTION_EVENT, refresh)
      window.removeEventListener('pageshow', refresh)
    }
  }, [])

  function prepare(event: MouseEvent<HTMLAnchorElement>) {
    // Set the DOM href synchronously, preserving any linker already added by Google.
    // Never prevent native navigation or wait for analytics/network responses.
    event.currentTarget.href = buildMoovsPortalUrl(captureBookingAttribution(window.location.search), event.currentTarget.href)
  }
  function track() {
    if (serviceSlug) void trackServiceEvent(serviceSlug, 'booking')
    trackWebsiteEvent('booking_portal_click', { booking_location: location, ...(serviceSlug ? { service_slug: serviceSlug } : {}), booking_destination: MOOVS_PORTAL_URL })
  }

  return <a {...props} href={href} data-moovs-booking="true" className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`} onClick={(event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    prepare(event)
    track()
  }} onAuxClick={(event) => {
    onAuxClick?.(event)
    if (event.defaultPrevented || event.button !== 1) return
    prepare(event)
    track()
  }}>{children}</a>
}

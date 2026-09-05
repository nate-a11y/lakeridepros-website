'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { contactClickEvent, isPublicMarketingPath, trackWebsiteEvent } from '@/lib/website-tracking'

export function WebsiteAnalytics() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (!isPublicMarketingPath(pathname)) return
    const match = /^\/(services|fleet)\/([a-z0-9-]+)\/?$/.exec(pathname)
    if (match?.[1] === 'services') trackWebsiteEvent('view_service', { service_slug: match[2] })
    if (match?.[1] === 'fleet') trackWebsiteEvent('view_vehicle', { vehicle_slug: match[2] })
  }, [pathname])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1) || !isPublicMarketingPath(window.location.pathname)) return
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor) return
      const contactEvent = contactClickEvent(anchor.getAttribute('href') || '')
      // Do not send link text/phone/email/URL: links can include private data.
      const location = anchor.closest('header') ? 'header' : anchor.closest('footer') ? 'footer' : 'content'
      if (contactEvent) trackWebsiteEvent(contactEvent, { contact_location: location })

    }
    // Next Link prevents the native click while performing client navigation.
    // Capture booking intent before that interception (intent is not a conversion).
    function handleBookingIntent(event: MouseEvent) {
      if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (anchor?.origin === window.location.origin && /^\/book\/?$/.test(anchor.pathname)) {
        trackWebsiteEvent('booking_intent', { booking_location: anchor.closest('header') ? 'header' : anchor.closest('footer') ? 'footer' : 'content' })
      }
    }
    document.addEventListener('click', handleBookingIntent, true)
    document.addEventListener('auxclick', handleBookingIntent, true)
    document.addEventListener('click', handleClick)
    document.addEventListener('auxclick', handleClick)
    return () => {
      document.removeEventListener('click', handleBookingIntent, true)
      document.removeEventListener('auxclick', handleBookingIntent, true)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('auxclick', handleClick)
    }
  }, [])
  return null
}

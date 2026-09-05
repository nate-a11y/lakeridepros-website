'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { BOOKING_ATTRIBUTION_EVENT, captureBookingAttribution } from '@/lib/booking-attribution'

export function BookingAttributionCapture() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  useEffect(() => {
    captureBookingAttribution(search)
    window.dispatchEvent(new Event(BOOKING_ATTRIBUTION_EVENT))
  }, [pathname, search])
  return null
}

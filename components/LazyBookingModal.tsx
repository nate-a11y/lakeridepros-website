'use client'

import dynamic from 'next/dynamic'

export const LazyBookingModal = dynamic(
  () => import('./BookingModal').then((mod) => mod.BookingModal),
  {
    ssr: false,
    loading: () => null,
  }
)

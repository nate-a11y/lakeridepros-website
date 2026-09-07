import type { ReactNode } from 'react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'
import Link from 'next/link'
import { PhoneLink } from '@/components/PhoneLink'

export default function LocationCTA({
  title,
  description,
  bookingLabel,
  bookingLocation,
  bookingHref,
  phoneLabel = 'Call (573) 206-9499',
}: {
  title: string
  description: ReactNode
  bookingLabel: string
  bookingLocation: string
  bookingHref?: string
  phoneLabel?: string
}) {
  const bookingClass =
    'inline-flex min-h-14 items-center justify-center bg-primary px-6 py-4 text-center font-bold text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black'
  return (
    <section aria-labelledby="location-booking-heading" className="bg-lrp-black py-14 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-8">
        <div className="lg:col-span-7">
          <h2
            id="location-booking-heading"
            className="max-w-3xl text-balance font-celebri text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl"
          >
            {title}
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed">{description}</div>
        </div>
        <div className="flex flex-col items-start gap-4 lg:col-span-5">
          {bookingHref ? (
            <Link href={bookingHref} className={bookingClass}>
              {bookingLabel}
            </Link>
          ) : (
            <MoovsBookingLink location={bookingLocation} className={bookingClass}>
              {bookingLabel}
            </MoovsBookingLink>
          )}
          <PhoneLink className="inline-flex min-h-12 items-center py-3 font-bold text-white underline underline-offset-4 hover:text-primary-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            {phoneLabel}
          </PhoneLink>
        </div>
      </div>
    </section>
  )
}

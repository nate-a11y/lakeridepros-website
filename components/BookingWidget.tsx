import { ArrowUpRight } from 'lucide-react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

interface BookingWidgetProps { className?: string; serviceSlug?: string }

export default function BookingWidget({ className = '', serviceSlug }: BookingWidgetProps) {
  return (
    <div className={`grid gap-7 border-y border-white/25 bg-lrp-black px-6 py-8 text-white sm:px-8 lg:grid-cols-12 lg:items-center ${className}`}>
      <div className="lg:col-span-5">
        <p className="mb-2 text-sm font-semibold text-primary-light">Ready when you are</p>
        <h2 className="font-celebri text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
          Your next ride starts here.
        </h2>
      </div>
      <p className="max-w-xl text-base leading-relaxed text-white/75 lg:col-span-4">
        Get a quote, book your ride, or manage an existing reservation in the Lake Ride Pros
        customer portal.
      </p>
      <div className="lg:col-span-3 lg:text-right">
        <MoovsBookingLink
          serviceSlug={serviceSlug}
          location="booking_section"
          className="inline-flex min-h-14 items-center justify-center gap-2 bg-primary px-7 py-4 text-base font-bold text-lrp-black transition-colors hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black"
        >
          Open customer portal <ArrowUpRight className="size-5" aria-hidden="true" />
        </MoovsBookingLink>
      </div>
    </div>
  )
}

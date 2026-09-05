import { ArrowUpRight } from 'lucide-react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

interface BookingWidgetProps { className?: string; serviceSlug?: string }

export default function BookingWidget({ className = '', serviceSlug }: BookingWidgetProps) {
  return <div className={`rounded-2xl border border-primary/20 bg-neutral-50 p-8 text-center dark:bg-dark-bg-secondary sm:p-12 ${className}`}>
    <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">Your next ride starts here</h2>
    <p className="mx-auto mb-7 max-w-xl text-neutral-600 dark:text-neutral-300">Get a quote, book your ride, or manage your reservations in the Lake Ride Pros customer portal.</p>
    <MoovsBookingLink serviceSlug={serviceSlug} location="booking_section" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-lrp-black transition-colors hover:bg-primary-dark">
      Open Customer Portal <ArrowUpRight className="size-5" aria-hidden="true" />
    </MoovsBookingLink>
  </div>
}

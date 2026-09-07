import Link from 'next/link'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

const tripStandards = [
  {
    title: 'Arrival, not just departure',
    description:
      'We monitor your flight and coordinate airport pickup around the actual arrival, with clear pickup updates when plans change.',
  },
  {
    title: 'The vehicle fits the trip',
    description:
      'People, luggage, and property access all count. We match the vehicle to your group and the roads, driveways, and venues on your itinerary.',
  },
  {
    title: 'Several vehicles. One plan.',
    description:
      'For weddings and larger groups, pickup windows, venues, and vehicles stay together in one confirmed itinerary with one local team coordinating.',
  },
  {
    title: 'You know what happens next',
    description:
      'Online booking, clear confirmations, and pickup updates keep the details close. Manage reservations through the customer portal, or call our team.',
  },
] as const

/** Static operating proof; only the shared booking link needs client-side attribution. */
export default function OperationsProof() {
  return (
    <section
      aria-labelledby="operations-proof-heading"
      className="bg-lrp-black py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-boardson text-2xl leading-tight sm:text-3xl">
              We come prepared.
            </p>
            <h2
              id="operations-proof-heading"
              className="mt-5 max-w-lg text-balance font-celebri text-4xl leading-[1.06] tracking-[-0.035em] sm:text-5xl"
            >
              A good ride starts long before pickup.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed">
              Behind the reservation is a local team thinking through the details. Technology keeps
              the plan connected. People take responsibility for the ride.
            </p>

            <div className="mt-8 max-w-md border-l-4 border-primary pl-5 sm:mt-10">
              <h3 className="font-celebri text-xl leading-snug">Booked means booked.</h3>
              <p className="mt-2 leading-relaxed">
                We don&apos;t cancel a confirmed ride because something easier came along.
              </p>
            </div>
          </div>

          <dl className="border-t-2 border-white lg:col-span-7">
            {tripStandards.map((standard) => (
              <div
                key={standard.title}
                className="grid gap-3 border-b border-white/25 py-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8"
              >
                <dt className="max-w-56 font-celebri text-xl leading-snug">
                  {standard.title}
                </dt>
                <dd className="max-w-xl text-base leading-relaxed">{standard.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 grid gap-5 border-b border-white/25 pb-10 sm:mt-16 lg:grid-cols-12 lg:gap-16">
          <h3 className="font-celebri text-2xl leading-tight lg:col-span-5">
            Professional isn&apos;t just how we look.
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 lg:col-span-7">
            <p className="text-sm leading-relaxed sm:text-base">
              Commercial licensing and liability insurance. DOT-compliant, background-checked
              drivers.
            </p>
            <p className="text-sm leading-relaxed sm:text-base">
              Drivers trained in First Aid, CPR, AED use, and Stop the Bleed.
            </p>
          </div>
        </div>

        <div className="grid gap-7 pt-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="font-celebri text-xl">Start with your plans.</h3>
            <p className="mt-3 max-w-md leading-relaxed">
              Book online or call with your date, stops, and group size. We confirm the reservation,
              prepare the right vehicle, and assign a driver. You get clear pickup details; we handle
              the roads and timing.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-x-7 gap-y-3 lg:col-span-7 lg:pt-1">
            <MoovsBookingLink
              location="operations_proof"
              className="inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 font-bold text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black"
            >
              Get a quote or book
            </MoovsBookingLink>
            <a
              href="tel:+15732069499"
              className="inline-flex min-h-12 items-center py-3 font-bold text-white underline decoration-1 underline-offset-4 hover:text-primary-light hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Call (573) 206-9499
            </a>
            <Link
              href="/about-us"
              className="inline-flex min-h-11 basis-full items-center py-2 text-sm text-white/70 underline decoration-1 underline-offset-4 hover:text-white hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Meet the people behind your ride
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

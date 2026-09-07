import type { Metadata } from 'next'
import Link from 'next/link'
import EventWaitlistStatusLookup from '@/components/EventWaitlistStatusLookup'

export const metadata: Metadata = {
  title: 'Check Event Waitlist Status | Lake Ride Pros',
  description: 'Verify your email or phone number to check active Lake Ride Pros event transportation waitlist entries.',
  alternates: { canonical: 'https://www.lakeridepros.com/events/waitlist' },
}

export default function EventWaitlistStatusPage() {
  return (
    <div className="min-h-screen bg-white text-lrp-black">
      <section className="bg-lrp-black px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-boardson text-3xl text-primary-light">Event waitlist</p>
          <h1 className="max-w-3xl text-balance font-celebri text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">Check your waitlist status.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Enter the email or phone number used for your waitlist request. We&apos;ll email a one-time code before showing any waitlist details.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5">
            <Link href="/events" className="inline-flex min-h-11 items-center font-bold underline decoration-primary decoration-2 underline-offset-4 hover:decoration-lrp-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-lrp-black">
              ← Back to events
            </Link>
          </div>
          <EventWaitlistStatusLookup />
        </div>
      </section>
    </div>
  )
}

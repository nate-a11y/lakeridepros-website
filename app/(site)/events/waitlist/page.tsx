import type { Metadata } from 'next'
import Link from 'next/link'
import EventWaitlistStatusLookup from '@/components/EventWaitlistStatusLookup'

export const metadata: Metadata = {
  title: 'Check Event Waitlist Status | Lake Ride Pros',
  description: 'Verify your email or phone number to check active Lake Ride Pros event transportation waitlist entries.',
}

export default function EventWaitlistStatusPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
      <section className="bg-gradient-to-r from-primary to-primary-dark px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-white/80">Event Waitlist</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Check your waitlist status</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Enter the email or phone number used for your waitlist request. We&apos;ll email a one-time code before showing any waitlist details.
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5">
            <Link href="/events" className="font-semibold text-primary hover:underline">
              ← Back to events
            </Link>
          </div>
          <EventWaitlistStatusLookup />
        </div>
      </section>
    </main>
  )
}

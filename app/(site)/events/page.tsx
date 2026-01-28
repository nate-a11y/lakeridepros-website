import { getUpcomingEvents, getVenues } from '@/lib/api/payload'
import Link from 'next/link'
import EventCalendarClient from '@/components/EventCalendarClient'

export const metadata = {
  title: 'Concert & Event Ride Availability | Lake Ride Pros',
  description: 'Check ride availability for upcoming concerts and events at Lake of the Ozarks. Book your transportation to OAMP, Shady Gators, Encore, and more.',
  openGraph: {
    title: 'Concert & Event Ride Availability | Lake Ride Pros',
    description: 'Check ride availability for upcoming concerts and events at Lake of the Ozarks. Book your transportation to OAMP, Shady Gators, Encore, and more.',
    url: 'https://www.lakeridepros.com/events',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Event Calendar' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concert & Event Ride Availability | Lake Ride Pros',
    description: 'Check ride availability for upcoming concerts and events at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

// Force dynamic rendering so Payload CMS is available at request time
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const [events, venuesResponse] = await Promise.all([
    getUpcomingEvents(),
    getVenues(),
  ])

  const venues = venuesResponse.docs || []

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
            2026 Concert Series
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center mb-6">
            Check ride availability for upcoming concerts and events at Lake of the Ozarks venues.
          </p>
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <p className="text-sm text-white/80">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                Available
                <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mx-2 ml-4"></span>
                Limited
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-2 ml-4"></span>
                Reserved
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 bg-lrp-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black font-bold mr-2 text-xs">1</span>
              Pick your concert
            </span>
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black font-bold mr-2 text-xs">2</span>
              Get your group together
            </span>
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black font-bold mr-2 text-xs">3</span>
              Purchase your tickets
            </span>
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black font-bold mr-2 text-xs">4</span>
              Call Lake Ride Pros
            </span>
            <span className="flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-black font-bold mr-2 text-xs">5</span>
              Have a great time!
            </span>
          </div>
        </div>
      </section>

      {/* Client Component with Filters and Event Display */}
      <EventCalendarClient events={events} venues={venues} />

      {/* CTA Section */}
      <section className="bg-lrp-green py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Call us to reserve your transportation for any upcoming concert or event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:573-206-9499"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              (573) 206-9499
            </a>
            <Link
              href="/book"
              className="inline-block bg-lrp-black text-white hover:bg-gray-800 px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

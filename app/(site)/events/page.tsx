import { getUpcomingEvents, getVenues } from '@/lib/api/sanity'
import Link from 'next/link'
import EventCalendarClient from '@/components/EventCalendarClient'

export const metadata = {
  title: 'Upcoming Event Ride Availability in Missouri | Lake Ride Pros',
  description: 'Check ride availability for upcoming concerts and events across Missouri — Lake of the Ozarks, Kansas City, Sedalia, and more. Book transportation to OAMP, Lazy Gators, Encore, T-Mobile Center, Missouri State Fair, and other top venues.',
  openGraph: {
    title: 'Upcoming Event Ride Availability in Missouri | Lake Ride Pros',
    description: 'Check ride availability for upcoming concerts and events across Missouri — Lake of the Ozarks, Kansas City, Sedalia, and more. Book transportation to OAMP, Lazy Gators, Encore, T-Mobile Center, and other top venues.',
    url: 'https://www.lakeridepros.com/events',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Event Ride Availability' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upcoming Event Ride Availability in Missouri | Lake Ride Pros',
    description: 'Check ride availability for upcoming concerts and events across Missouri — Lake of the Ozarks, Kansas City, Sedalia, and more.',
    images: ['/og-image.jpg'],
  },
}

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
            Upcoming Event Availability
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center mb-6">
            Check ride availability for upcoming events at venues across Missouri.
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
              Pick your event
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
              Book with Lake Ride Pros
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
            Reserve your ride to any upcoming event across Missouri.
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Book Your Ride Online
          </Link>
          <p className="text-white/80 text-sm mt-4">
            Or call <a href="tel:573-206-9499" className="font-semibold text-white hover:underline">(573) 206-9499</a>
          </p>
        </div>
      </section>
    </div>
  )
}

import { getUpcomingEvents, getVenues, type Event, type EventType } from '@/lib/api/sanity'
import Link from 'next/link'
import EventCalendarClient from '@/components/EventCalendarClient'

const EVENT_TYPE_COPY: Record<
  EventType | 'all',
  { heading: string; subheading: string; metaTitle: string; metaDescription: string }
> = {
  all: {
    heading: 'Upcoming Event Availability',
    subheading: 'Check ride availability for upcoming events at venues across Missouri.',
    metaTitle: 'Upcoming Event Ride Availability in Missouri | Lake Ride Pros',
    metaDescription:
      'Check ride availability for upcoming concerts, tours, and special events across Missouri — Lake of the Ozarks, Kansas City, Sedalia, and more.',
  },
  concert: {
    heading: 'Upcoming Concerts',
    subheading: 'Ride availability for upcoming concerts at venues across Missouri.',
    metaTitle: 'Concert Ride Availability in Missouri | Lake Ride Pros',
    metaDescription:
      'Check ride availability for upcoming concerts across Missouri — OAMP, Lazy Gators, Encore, T-Mobile Center, and more.',
  },
  tour: {
    heading: 'Upcoming Tours',
    subheading: 'Ride availability for upcoming tours across Missouri.',
    metaTitle: 'Tour Ride Availability in Missouri | Lake Ride Pros',
    metaDescription:
      'Check ride availability for upcoming tours across Missouri with Lake Ride Pros transportation.',
  },
  special: {
    heading: 'Upcoming Special Events',
    subheading: 'Ride availability for upcoming special events across Missouri.',
    metaTitle: 'Special Event Ride Availability in Missouri | Lake Ride Pros',
    metaDescription:
      'Check ride availability for upcoming special events across Missouri with Lake Ride Pros transportation.',
  },
}

function normalizeType(value: string | string[] | undefined): EventType | 'all' {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === 'concert' || raw === 'tour' || raw === 'special') return raw
  return 'all'
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const type = normalizeType(params?.type)
  const copy = EVENT_TYPE_COPY[type]
  const url =
    type === 'all'
      ? 'https://www.lakeridepros.com/events'
      : `https://www.lakeridepros.com/events?type=${type}`

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url,
      siteName: 'Lake Ride Pros',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Event Ride Availability' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: ['/og-image.jpg'],
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const type = normalizeType(params?.type)
  const copy = EVENT_TYPE_COPY[type]

  const [events, venuesResponse] = await Promise.all([
    getUpcomingEvents(),
    getVenues(),
  ])

  const venues = venuesResponse.docs || []
  const filteredEvents: Event[] =
    type === 'all' ? events : events.filter((event) => event.eventType === type)

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
            {copy.heading}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center mb-6">
            {copy.subheading}
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

      {/* Category Tabs */}
      <section className="bg-white dark:bg-dark-bg-primary border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Event categories" className="flex flex-wrap gap-2 py-4">
            {(
              [
                { value: 'all', label: 'All Events', href: '/events' },
                { value: 'concert', label: 'Concerts', href: '/events?type=concert' },
                { value: 'tour', label: 'Tours', href: '/events?type=tour' },
                { value: 'special', label: 'Special Events', href: '/events?type=special' },
              ] as const
            ).map((tab) => {
              const active = tab.value === type
              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-black'
                      : 'bg-gray-100 dark:bg-dark-bg-secondary text-lrp-black dark:text-white hover:bg-primary/20'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
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
      <EventCalendarClient events={filteredEvents} venues={venues} />

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

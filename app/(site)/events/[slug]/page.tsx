import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getEventBySlug, getUpcomingEvents } from '@/lib/api/payload'
import { getMediaUrl } from '@/lib/utils'
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'
import RideAvailabilityBadge from '@/components/RideAvailabilityBadge'

interface Props {
  params: Promise<{ slug: string }>
}

// Ride type configuration
const RIDE_TYPES = [
  { value: 'flex', label: 'Flex', capacity: 'Seats 1-4', description: 'Perfect for couples or small groups' },
  { value: 'elite', label: 'Elite', capacity: 'Seats 1-7', description: 'Luxury SUV experience' },
  { value: 'lrp-black', label: 'LRP Black', capacity: 'Seats 1-6', description: 'Premium black car service' },
  { value: 'limo-bus', label: 'Limo Bus', capacity: 'Up to 14', description: 'Party bus with amenities' },
  { value: 'rescue-squad', label: 'Rescue Squad', capacity: 'Up to 14', description: 'Group transportation' },
  { value: 'luxury-sprinter', label: 'Luxury Sprinter', capacity: 'Up to 13', description: 'Executive sprinter van' },
  { value: 'luxury-shuttle', label: 'Luxury Shuttle', capacity: 'Up to 37', description: 'Large group shuttle' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Event Not Found | Lake Ride Pros',
    }
  }

  const venue = typeof event.venue === 'object' ? event.venue : null
  const venueName = venue?.name || 'Lake of the Ozarks'

  return {
    title: `${event.name} at ${venueName} | Lake Ride Pros`,
    description: event.description || `Book your ride to ${event.name} at ${venueName}. Check availability and reserve your transportation with Lake Ride Pros.`,
    openGraph: {
      title: `${event.name} | Lake Ride Pros`,
      description: event.description || `Book your ride to ${event.name} at ${venueName}.`,
      url: `https://www.lakeridepros.com/events/${event.slug}`,
      siteName: 'Lake Ride Pros',
      images: event.image && typeof event.image === 'object'
        ? [{ url: getMediaUrl(event.image.url), width: 1200, height: 630, alt: event.name }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: event.name }],
      locale: 'en_US',
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const events = await getUpcomingEvents(100)
  return events.map((event) => ({
    slug: event.slug,
  }))
}

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const venue = typeof event.venue === 'object' ? event.venue : null
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Back Link */}
      <div className="bg-gray-50 dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event Calendar
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-lrp-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              {/* Date Badge */}
              <div className="inline-flex items-center bg-primary text-black px-4 py-2 rounded-full font-bold mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                {formattedDate}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{event.name}</h1>

              {venue && (
                <div className="flex items-center text-gray-300 mb-4">
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-xl">{venue.name}</span>
                </div>
              )}

              {event.time && (
                <div className="flex items-center text-gray-300 mb-6">
                  <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{event.time}</span>
                </div>
              )}

              {event.description && (
                <p className="text-gray-300 text-lg mb-6">{event.description}</p>
              )}

              <Link
                href="/book"
                className="inline-flex items-center bg-primary hover:bg-primary-dark text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Book Your Ride Online
              </Link>
              <p className="text-gray-400 text-sm mt-3">
                Or call <a href="tel:573-206-9499" className="text-primary hover:text-primary-dark">(573) 206-9499</a>
              </p>
            </div>

            {/* Event Image */}
            {event.image && typeof event.image === 'object' && (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={getMediaUrl(event.image.url)}
                  alt={event.image.alt || event.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Venue Info */}
      {venue && (
        <section className="bg-gray-50 dark:bg-dark-bg-secondary py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-6">
              {venue.image && typeof venue.image === 'object' && (
                <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow">
                  <Image
                    src={getMediaUrl(venue.image.url)}
                    alt={venue.image.alt || venue.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-lrp-black dark:text-white">{venue.name}</h2>
                {venue.address && (
                  <p className="text-gray-600 dark:text-gray-400">{venue.address}</p>
                )}
              </div>
              <div className="flex gap-4 ml-auto">
                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark font-semibold"
                  >
                    Visit Website
                  </a>
                )}
                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="text-primary hover:text-primary-dark font-semibold"
                  >
                    {venue.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ride Availability */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 text-center">
            Ride Availability
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {RIDE_TYPES.map((type) => {
              const availability = event.rideAvailability?.find(
                (r) => r.rideType === type.value
              )
              const status = availability?.status || 'available'

              return (
                <div
                  key={type.value}
                  className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-lrp-black dark:text-white">
                      {type.label}
                    </h3>
                    <RideAvailabilityBadge status={status} notes={availability?.notes} />
                  </div>
                  <p className="text-primary font-semibold mb-2">{type.capacity}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {type.description}
                  </p>
                  {availability?.notes && (
                    <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 italic">
                      {availability.notes}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-600 dark:text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-gray-600 dark:text-gray-400">Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-gray-600 dark:text-gray-400">Reserved</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-black/80 text-lg mb-8">
            Reserve your transportation to {event.name} in just a few clicks.
          </p>
          <Link
            href="/book"
            className="inline-block bg-black text-white hover:bg-gray-800 px-12 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Book Online Now
          </Link>
          <p className="text-black/70 text-sm mt-4">
            Prefer to talk? Call <a href="tel:573-206-9499" className="font-semibold hover:underline">(573) 206-9499</a>
          </p>
        </div>
      </section>
    </div>
  )
}

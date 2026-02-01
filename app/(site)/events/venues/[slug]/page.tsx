import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getVenueBySlug, getUpcomingEvents } from '@/lib/api/payload'
import { getMediaUrl } from '@/lib/utils'
import { MapPin, Globe, Phone, ArrowLeft, Calendar, Clock } from 'lucide-react'
import RideAvailabilityBadge from '@/components/RideAvailabilityBadge'

interface Props {
  params: Promise<{ slug: string }>
}

const RIDE_TYPES = [
  { value: 'flex', label: 'Flex', capacity: 'Seats 1-4' },
  { value: 'elite', label: 'Elite', capacity: 'Seats 1-7' },
  { value: 'lrp-black', label: 'LRP Black', capacity: 'Seats 1-6' },
  { value: 'limo-bus', label: 'Limo Bus', capacity: 'Up to 14' },
  { value: 'rescue-squad', label: 'Rescue Squad', capacity: 'Up to 14' },
  { value: 'luxury-sprinter', label: 'Luxury Sprinter', capacity: 'Up to 13' },
  { value: 'luxury-shuttle', label: 'Luxury Shuttle', capacity: 'Up to 37' },
] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const venue = await getVenueBySlug(slug)

  if (!venue) {
    return { title: 'Venue Not Found | Lake Ride Pros' }
  }

  return {
    title: `${venue.name} — Upcoming Events & Ride Availability | Lake Ride Pros`,
    description: venue.description || `Check upcoming events and book your ride to ${venue.name} in Missouri. See ride availability and reserve transportation with Lake Ride Pros.`,
    openGraph: {
      title: `${venue.name} Events | Lake Ride Pros`,
      description: venue.description || `Upcoming events and ride availability at ${venue.name}.`,
      url: `https://www.lakeridepros.com/events/venues/${venue.slug}`,
      siteName: 'Lake Ride Pros',
      images: venue.image && typeof venue.image === 'object'
        ? [{ url: getMediaUrl(venue.image.url), width: 1200, height: 630, alt: venue.name }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: venue.name }],
      locale: 'en_US',
      type: 'website',
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function VenueDetailPage({ params }: Props) {
  const { slug } = await params
  const venue = await getVenueBySlug(slug)

  if (!venue) {
    permanentRedirect('/events')
  }

  // Get upcoming events and filter to this venue
  const allEvents = await getUpcomingEvents(1000)
  const venueEvents = allEvents.filter(event => {
    const eventVenueId = typeof event.venue === 'object' ? String(event.venue?.id) : String(event.venue)
    return eventVenueId === String(venue.id)
  })

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
      day,
      full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    }
  }

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
            Back to All Events
          </Link>
        </div>
      </div>

      {/* Venue Hero */}
      <section className="bg-gradient-to-r from-lrp-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {venue.image && typeof venue.image === 'object' && (
              <div className="relative w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={getMediaUrl(venue.image.url)}
                  alt={venue.image.alt || venue.name}
                  fill
                  className="object-contain p-3"
                  priority
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3">{venue.name}</h1>
              {venue.address && (
                <p className="flex items-center justify-center md:justify-start text-gray-300 text-lg mb-2">
                  <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                  {venue.address}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                {venue.website && (
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark font-semibold"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                )}
                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="inline-flex items-center text-primary hover:text-primary-dark font-semibold"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {venue.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
          {venue.description && (
            <p className="text-gray-300 text-lg mt-8 max-w-3xl">{venue.description}</p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8">
            Upcoming Events at {venue.shortName || venue.name}
          </h2>

          {venueEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No upcoming events scheduled at this venue. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {venueEvents.map((event) => {
                const dateInfo = formatDate(event.date)
                return (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 sm:w-24 bg-gray-50 dark:bg-dark-bg-primary flex sm:flex-col items-center justify-center p-4 gap-2 sm:gap-0">
                        <div className="text-primary font-bold text-sm">{dateInfo.month}</div>
                        <div className="text-3xl font-bold text-lrp-black dark:text-white">{dateInfo.day}</div>
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <Link
                              href={`/events/${event.slug}`}
                              className="text-xl font-bold text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                            >
                              {event.name}
                            </Link>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                              {dateInfo.full}
                              {event.time && (
                                <span className="inline-flex items-center ml-3">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {event.time}
                                </span>
                              )}
                            </p>
                          </div>
                          <Link
                            href="/book"
                            className="inline-flex items-center bg-primary hover:bg-primary-dark text-black font-bold px-6 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
                          >
                            Book Ride
                          </Link>
                        </div>

                        {/* Ride Availability Row */}
                        {event.rideAvailability && event.rideAvailability.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {RIDE_TYPES.map((type) => {
                              const availability = event.rideAvailability?.find(
                                (r) => r.rideType === type.value
                              )
                              if (!availability) return null
                              return (
                                <div key={type.value} className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">{type.label}:</span>
                                  <RideAvailabilityBadge status={availability.status} notes={availability.notes} />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Need a Ride to {venue.shortName || venue.name}?
          </h2>
          <p className="text-black/80 text-lg mb-8">
            Book your transportation in just a few clicks.
          </p>
          <Link
            href="/book"
            className="inline-block bg-black text-white hover:bg-gray-800 px-12 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Book Online Now
          </Link>
          <p className="text-black/70 text-sm mt-4">
            Or call <a href="tel:573-206-9499" className="font-semibold hover:underline">(573) 206-9499</a>
          </p>
        </div>
      </section>
    </div>
  )
}

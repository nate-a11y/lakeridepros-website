import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getEventBySlug, getUpcomingEvents } from '@/lib/api/sanity'
import { getMediaUrl } from '@/lib/utils'
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'
import RideStatus from '@/components/events-editorial/RideStatus'
import styles from '@/components/events-editorial/EventsEditorial.module.css'

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
  { value: 'pink-patrol', label: 'Pink Patrol', capacity: 'Up to 23', description: '23-passenger party bus' },
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
  const venueName = venue?.name || 'Missouri'

  return {
    title: `${event.name} at ${venueName} — Ride Availability | Lake Ride Pros`,
    description: event.description || `Book your ride to ${event.name} at ${venueName}, Missouri. Check availability and reserve your transportation with Lake Ride Pros.`,
    alternates: { canonical: `https://www.lakeridepros.com/events/${event.slug}` },
    openGraph: {
      title: `${event.name} at ${venueName} | Lake Ride Pros`,
      description: event.description || `Book your ride to ${event.name} at ${venueName}, Missouri.`,
      url: `https://www.lakeridepros.com/events/${event.slug}`,
      siteName: 'Lake Ride Pros',
      images: event.image && typeof event.image === 'object'
        ? [{ url: getMediaUrl(event.image), width: 1200, height: 630, alt: event.name }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: event.name }],
      locale: 'en_US',
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  try {
    const events = await getUpcomingEvents()
    return events.map((event) => ({
      slug: event.slug,
    }))
  } catch {
    return []
  }
}

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    permanentRedirect('/events')
  }

  const venue = typeof event.venue === 'object' ? event.venue : null
  // Extract YYYY-MM-DD from the ISO string to avoid any timezone shifting.
  // This is safe regardless of whether the stored date is midnight UTC, noon UTC, etc.
  const [year, month, day] = event.date.split('T')[0].split('-').map(Number)
  const eventDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <div className={styles.container}>
          <Link href="/events" className={styles.textLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Event Calendar
          </Link>
        </div>
      </div>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <p className={styles.eventDate}>
              <Calendar size={20} aria-hidden="true" />
              <time dateTime={event.date.split('T')[0]}>{formattedDate}</time>
            </p>
            <h1>{event.name}</h1>
            {venue && (
              <p className={styles.heroFact}>
                <MapPin size={20} aria-hidden="true" />
                {venue.name}
              </p>
            )}
            {event.time && (
              <p className={styles.heroFact}>
                <Clock size={20} aria-hidden="true" />
                {event.time}
              </p>
            )}
            <div className={styles.actions}>
              <Link href="/book" className={styles.button}>
                Book Your Ride Online
              </Link>
            </div>
            <p className={styles.phone}>
              Or call <a href="tel:573-206-9499">(573) 206-9499</a>
            </p>
          </div>
          {event.image && typeof event.image === 'object' && (
            <div className={styles.heroImage}>
              <Image
                src={getMediaUrl(event.image)}
                alt={event.image.alt || event.name}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 100vw"
                preload
              />
            </div>
          )}
        </div>
      </section>
      {event.description && (
        <section
          className={styles.section}
          aria-labelledby="event-description-heading"
        >
          <div className={`${styles.container} ${styles.descriptionGrid}`}>
            <h2 id="event-description-heading">About the event</h2>
            <p className={styles.description}>{event.description}</p>
          </div>
        </section>
      )}
      {venue && (
        <section className={styles.venueInfo} aria-label="Venue information">
          <div className={`${styles.container} ${styles.venueInfoInner}`}>
            {venue.image && typeof venue.image === 'object' && (
              <div className={styles.venueLogo}>
                <Image
                  src={getMediaUrl(venue.image)}
                  alt={venue.image.alt || venue.name}
                  fill
                  sizes="88px"
                />
              </div>
            )}
            <div>
              <h2>{venue.name}</h2>
              {venue.address && <p>{venue.address}</p>}
            </div>
            <div className={styles.actions}>
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.textLink}
                >
                  Visit Website
                </a>
              )}
              {venue.phone && (
                <a href={`tel:${venue.phone}`} className={styles.textLink}>
                  {venue.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
      <section
        className={styles.section}
        aria-labelledby="ride-availability-heading"
      >
        <div className={styles.container}>
          <h2 id="ride-availability-heading">Ride Availability</h2>
          <div className={styles.rideRows}>
            {RIDE_TYPES.map((type) => {
              const availability = event.rideAvailability?.find(
                (r) => r.rideType === type.value,
              )
              const status = availability?.status || 'available'
              return (
                <div key={type.value} className={styles.rideRow}>
                  <div>
                    <h3>{type.label}</h3>
                    <p className={styles.rideCapacity}>{type.capacity}</p>
                  </div>
                  <RideStatus status={status} />
                  <div className={styles.rideDescription}>
                    <p>{type.description}</p>
                    {availability?.notes && (
                      <p className={styles.statusNote}>{availability.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.statusLegend} aria-label="Availability key">
            <span className={styles.status} data-status="available">
              Available
            </span>
            <span className={styles.status} data-status="limited">
              Limited
            </span>
            <span className={styles.status} data-status="reserved">
              Reserved
            </span>
          </div>
        </div>
      </section>
      <section className={styles.close}>
        <div className={`${styles.container} ${styles.closeGrid}`}>
          <div>
            <h2>Ready to Book Your Ride?</h2>
            <p className={styles.intro}>
              Reserve your transportation to {event.name} in just a few clicks.
            </p>
          </div>
          <div>
            <Link href="/book" className={styles.button}>
              Book Online Now
            </Link>
            <p className={styles.phone}>
              Prefer to talk? Call <a href="tel:573-206-9499">(573) 206-9499</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

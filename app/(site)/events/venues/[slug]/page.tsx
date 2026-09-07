import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getVenueBySlug, getUpcomingEvents } from '@/lib/api/sanity'
import { getMediaUrl } from '@/lib/utils'
import { renderPortableTextToHtml } from '@/lib/sanity/render-rich-text'
import { MapPin, Globe, Phone, ArrowLeft } from 'lucide-react'
import RideStatus from '@/components/events-editorial/RideStatus'
import styles from '@/components/events-editorial/EventsEditorial.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

const RIDE_TYPES = [
  { value: 'flex', label: 'Flex', capacity: 'Seats 1-4' },
  { value: 'elite', label: 'Elite', capacity: 'Seats 1-7' },
  { value: 'lrp-black', label: 'LRP Black', capacity: 'Seats 1-6' },
  { value: 'limo-bus', label: 'Limo Bus', capacity: 'Up to 14' },
  { value: 'rescue-squad', label: 'Rescue Squad', capacity: 'Up to 14' },
  { value: 'pink-patrol', label: 'Pink Patrol', capacity: 'Up to 23' },
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
    alternates: { canonical: `https://www.lakeridepros.com/events/venues/${venue.slug}` },
    openGraph: {
      title: `${venue.name} Events | Lake Ride Pros`,
      description: venue.description || `Upcoming events and ride availability at ${venue.name}.`,
      url: `https://www.lakeridepros.com/events/venues/${venue.slug}`,
      siteName: 'Lake Ride Pros',
      images: venue.image && typeof venue.image === 'object'
        ? [{ url: getMediaUrl(venue.image), width: 1200, height: 630, alt: venue.name }]
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
  const allEvents = await getUpcomingEvents()
  const venueEvents = allEvents.filter((event) => {
    const eventVenueId =
      typeof event.venue === 'object'
        ? String(event.venue?._id)
        : String(event.venue)
    return eventVenueId === String(venue._id)
  })
  const venueDetailsHtml = renderPortableTextToHtml(venue.additionalInfo)
    .replace(/<h1(?=[ >])/g, '<h2')
    .replace(/<\/h1>/g, '</h2>')

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    return {
      month: date
        .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
        .toUpperCase(),
      day,
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }),
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.back}>
        <div className={styles.container}>
          <Link href="/events" className={styles.textLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to All Events
          </Link>
        </div>
      </div>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <h1>{venue.name}</h1>
            {venue.address && (
              <p className={styles.heroFact}>
                <MapPin size={20} aria-hidden="true" />
                {venue.address}
              </p>
            )}
            {venue.description && (
              <p className={styles.intro}>{venue.description}</p>
            )}
            <div className={styles.actions}>
              {venue.website && (
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.textLink}
                >
                  <Globe size={16} aria-hidden="true" />
                  Visit Website
                </a>
              )}
              {venue.phone && (
                <a href={`tel:${venue.phone}`} className={styles.textLink}>
                  <Phone size={16} aria-hidden="true" />
                  {venue.phone}
                </a>
              )}
            </div>
          </div>
          {venue.image && typeof venue.image === 'object' && (
            <div className={styles.heroImage}>
              <Image
                src={getMediaUrl(venue.image)}
                alt={venue.image.alt || venue.name}
                fill
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 100vw"
                preload
              />
            </div>
          )}
        </div>
      </section>
      {venue.gallery && venue.gallery.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2>Venue Photos</h2>
            <div className={styles.gallery}>
              {venue.gallery.map((item, index) => {
                const img = typeof item.image === 'object' ? item.image : null
                if (!img) return null
                return (
                  <figure key={item.id || index}>
                    <div className={styles.galleryImage}>
                      <Image
                        src={getMediaUrl(img)}
                        alt={
                          item.caption ||
                          img.alt ||
                          `${venue.name} photo ${index + 1}`
                        }
                        fill
                        sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                )
              })}
            </div>
          </div>
        </section>
      )}
      {venueDetailsHtml && (
          <section className={styles.section}>
            <div className={styles.container}>
              <h2>Venue Details</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: venueDetailsHtml,
                }}
                className={styles.richText}
              />
            </div>
          </section>
        )}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Upcoming Events at {venue.shortName || venue.name}</h2>
          {venueEvents.length === 0 ? (
            <p className={styles.empty}>
              No upcoming events scheduled at this venue. Check back soon!
            </p>
          ) : (
            <div className={styles.rideRows}>
              {venueEvents.map((event) => {
                const dateInfo = formatDate(event.date)
                return (
                  <article key={event._id} className={styles.venueEvent}>
                    <div className={styles.venueEventTop}>
                      <div className={styles.eventIdentity}>
                        <time
                          dateTime={event.date.split('T')[0]}
                          aria-label={dateInfo.full}
                          className={styles.date}
                        >
                          <span className={styles.dateMonth}>
                            {dateInfo.month}
                          </span>
                          <span className={styles.dateDay}>{dateInfo.day}</span>
                        </time>
                        <div>
                          <h3 className={styles.eventName}>
                            <Link href={`/events/${event.slug}`}>
                              {event.name}
                            </Link>
                          </h3>
                          <p className={styles.eventTime}>
                            {dateInfo.full}
                            {event.time && (
                              <>
                                <br />
                                {event.time}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Link href="/book" className={styles.button}>
                        Book Ride
                      </Link>
                    </div>
                    {event.rideAvailability &&
                      event.rideAvailability.length > 0 && (
                        <dl
                          className={styles.availability}
                          aria-label={`Ride availability for ${event.name}`}
                        >
                          {RIDE_TYPES.map((type) => {
                            const availability = event.rideAvailability?.find(
                              (r) => r.rideType === type.value,
                            )
                            if (!availability) return null
                            return (
                              <div key={type.value}>
                                <dt className={styles.rideName}>
                                  {type.label}
                                </dt>
                                <dd>
                                  <RideStatus
                                    status={availability.status}
                                    notes={availability.notes}
                                  />
                                </dd>
                              </div>
                            )
                          })}
                        </dl>
                      )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <section className={styles.close}>
        <div className={`${styles.container} ${styles.closeGrid}`}>
          <div>
            <h2>Need a Ride to {venue.shortName || venue.name}?</h2>
            <p className={styles.intro}>
              Book your transportation in just a few clicks.
            </p>
          </div>
          <div>
            <Link href="/book" className={styles.button}>
              Book Online Now
            </Link>
            <p className={styles.phone}>
              Or call <a href="tel:573-206-9499">(573) 206-9499</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

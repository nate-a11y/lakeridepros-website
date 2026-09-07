import { getUpcomingEvents, getVenues, type Event, type EventType } from '@/lib/api/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/utils'
import styles from '@/components/events-editorial/EventsEditorial.module.css'
import EventCalendarClient from '@/components/events-editorial/EventCalendarClient'
import { getActiveEventWaitlistCounts } from '@/lib/event-waitlist'

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
    alternates: { canonical: url },
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
  const waitlistCounts = await getActiveEventWaitlistCounts(
    filteredEvents.map((event) => event._id),
  )

  const featuredEvent = filteredEvents.find(
    (event) => event.image && typeof event.image === 'object',
  )
  const featuredImage =
    featuredEvent && typeof featuredEvent.image === 'object'
      ? featuredEvent.image
      : null

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <h1>{copy.heading}</h1>
            <p className={styles.intro}>{copy.subheading}</p>
            <div className={styles.actions}>
              <Link href="/events/waitlist" className={styles.secondaryButton}>
                Check your waitlist status
              </Link>
            </div>
          </div>
          {featuredEvent && featuredImage && (
            <figure>
              <Link
                href={`/events/${featuredEvent.slug}`}
                aria-label={`View ${featuredEvent.name}`}
                className={styles.heroImage}
                style={{ display: 'block' }}
              >
                <Image
                  src={getMediaUrl(featuredImage)}
                  alt={featuredImage.alt || featuredEvent.name}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 80vw, 100vw"
                  preload
                />
              </Link>
              <figcaption className={styles.imageCaption}>
                {featuredEvent.name}
              </figcaption>
            </figure>
          )}
        </div>
      </section>
      <div className={styles.container}>
        <nav aria-label="Event categories" className={styles.tabs}>
          {(
            [
              { value: 'all', label: 'All Events', href: '/events' },
              {
                value: 'concert',
                label: 'Concerts',
                href: '/events?type=concert',
              },
              { value: 'tour', label: 'Tours', href: '/events?type=tour' },
              {
                value: 'special',
                label: 'Special Events',
                href: '/events?type=special',
              },
            ] as const
          ).map((tab) => (
            <Link
              key={tab.value}
              href={tab.href}
              aria-current={tab.value === type ? 'page' : undefined}
              className={styles.tab}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <ol className={styles.steps} aria-label="Plan your event ride">
          <li>Pick your event</li>
          <li>Get your group together</li>
          <li>Purchase your tickets</li>
          <li>Book with Lake Ride Pros</li>
          <li>Have a great time!</li>
        </ol>
      </div>
      <EventCalendarClient
        events={filteredEvents}
        venues={venues}
        waitlistCounts={waitlistCounts}
      />
      <section className={styles.close}>
        <div className={`${styles.container} ${styles.closeGrid}`}>
          <div>
            <h2>Ready to Book Your Ride?</h2>
            <p className={styles.intro}>
              Reserve your ride to any upcoming event across Missouri.
            </p>
          </div>
          <div>
            <Link href="/book" className={styles.button}>
              Book Your Ride Online
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

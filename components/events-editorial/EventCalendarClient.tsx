'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Event, Venue } from '@/lib/api/sanity'
import RideStatus from './RideStatus'
import styles from './EventsEditorial.module.css'
import type { EventWaitlistContext } from '@/components/EventWaitlistModal'
import EventWaitlistDialog from './EventWaitlistDialog'

interface EventCalendarClientProps {
  events: Event[]
  venues: Venue[]
  waitlistCounts?: Record<string, number>
}

// Ride type configuration
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

export default function EventCalendarClient({
  events,
  venues,
  waitlistCounts = {},
}: EventCalendarClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [venueFilter, setVenueFilter] = useState<string>('')
  const [waitlist, setWaitlist] = useState<EventWaitlistContext | null>(null)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const venueId =
        typeof event.venue === 'object'
          ? String(event.venue?._id)
          : String(event.venue)
      const matchesVenue = !venueFilter || venueId === venueFilter

      return matchesSearch && matchesVenue
    })
  }, [events, searchTerm, venueFilter])

  // Group events by venue for display, sorted by Sanity venue order
  const eventsByVenue = useMemo(() => {
    const grouped: Record<string, { venue: Venue; events: Event[] }> = {}

    filteredEvents.forEach((event) => {
      const venue = typeof event.venue === 'object' ? event.venue : null
      if (!venue) return

      if (!grouped[venue._id]) {
        grouped[venue._id] = { venue, events: [] }
      }
      grouped[venue._id].events.push(event)
    })

    // Build a venue order map from the venues prop (already sorted by Sanity order)
    const venueOrder = new Map(venues.map((v, i) => [v._id, i]))

    return Object.values(grouped).sort((a, b) => {
      const orderA = venueOrder.get(a.venue._id) ?? Infinity
      const orderB = venueOrder.get(b.venue._id) ?? Infinity
      return orderA - orderB
    })
  }, [filteredEvents, venues])

  const formatDate = (dateString: string) => {
    // Extract YYYY-MM-DD from the ISO string to avoid any timezone shifting.
    // This is safe regardless of whether the stored date is midnight UTC, noon UTC, etc.
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    return {
      iso: dateString.split('T')[0],
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

  const closeWaitlist = useCallback(() => setWaitlist(null), [])

  return (
    <>
      <section className={styles.filters} aria-label="Filter events">
        <div className={styles.container}>
          <div className={styles.filterGrid}>
            <div className={styles.field}>
              <label htmlFor="event-search">Find an event</label>
              <input
                id="event-search"
                type="search"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="event-venue">Venue</label>
              <select
                id="event-venue"
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
              >
                <option value="">All Venues</option>
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.shortName || venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className={styles.results} role="status">
            {filteredEvents.length} upcoming{' '}
            {filteredEvents.length === 1 ? 'event' : 'events'}. Availability is
            shown for each ride type.
          </p>
          <div className={styles.statusLegend} aria-label="Availability key">
            <span className={styles.status} data-status="available">
              Available
            </span>
            <span className={styles.status} data-status="limited">
              Limited
            </span>
            <span className={styles.status} data-status="reserved">
              Sold Out / Waitlist
            </span>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        aria-label="Upcoming events and ride availability"
      >
        <div className={styles.container}>
          {eventsByVenue.length === 0 ? (
            <div className={styles.empty}>
              <p>
                {events.length === 0
                  ? 'No upcoming events at this time. Check back soon!'
                  : 'No events found matching your search.'}
              </p>
              {(searchTerm || venueFilter) && (
                <button
                  type="button"
                  className={styles.textLink}
                  onClick={() => {
                    setSearchTerm('')
                    setVenueFilter('')
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            eventsByVenue.map(({ venue, events: venueEvents }) => (
              <section
                key={venue._id}
                className={styles.venueGroup}
                aria-labelledby={`venue-${venue._id}`}
              >
                <div className={styles.venueHeader}>
                  <div>
                    <h2 id={`venue-${venue._id}`} className={styles.venueTitle}>
                      <Link href={`/events/venues/${venue.slug}`}>
                        {venue.name}
                      </Link>
                    </h2>
                    {venue.address && (
                      <p className={styles.venueAddress}>
                        <MapPin size={16} aria-hidden="true" />
                        {venue.address}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/events/venues/${venue.slug}`}
                    className={styles.textLink}
                  >
                    Venue details
                  </Link>
                </div>
                {venueEvents.map((event) => {
                  const dateInfo = formatDate(event.date)
                  return (
                    <article key={event._id} className={styles.eventRow}>
                      <div className={styles.eventIdentity}>
                        <time
                          dateTime={dateInfo.iso}
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
                          {event.time && (
                            <p className={styles.eventTime}>{event.time}</p>
                          )}
                        </div>
                      </div>
                      <dl
                        className={styles.availability}
                        aria-label={`Ride availability for ${event.name}`}
                      >
                        {RIDE_TYPES.map((type) => {
                          const availability = event.rideAvailability?.find(
                            (r) => r.rideType === type.value,
                          )
                          const status = availability?.status || 'available'
                          const waitlistCount =
                            waitlistCounts[`${event._id}:${type.value}`] || 0
                          return (
                            <div key={type.value}>
                              <dt className={styles.rideName}>{type.label}</dt>
                              <dd>
                                <p className={styles.rideCapacity}>
                                  {type.capacity}
                                </p>
                                <RideStatus
                                  status={status}
                                  notes={availability?.notes}
                                />
                                {status === 'reserved' && (
                                  <div className={styles.waitlist}>
                                    <span className={styles.waitlistCount}>
                                      {waitlistCount} on waitlist
                                    </span>
                                    <button
                                      type="button"
                                      className={styles.waitlistButton}
                                      aria-label={`Join the waitlist for ${type.label} at ${event.name}`}
                                      onClick={() =>
                                        setWaitlist({
                                          eventId: event._id,
                                          eventName: event.name,
                                          eventDate: dateInfo.full,
                                          eventDateIso: dateInfo.iso,
                                          eventTime: event.time,
                                          venueName: venue.name,
                                          rideType: type.value,
                                          rideTypeLabel: type.label,
                                        })
                                      }
                                    >
                                      Join waitlist
                                    </button>
                                  </div>
                                )}
                              </dd>
                            </div>
                          )
                        })}
                      </dl>
                    </article>
                  )
                })}
              </section>
            ))
          )}
          <section
            className={styles.rideLegend}
            aria-labelledby="ride-types-heading"
          >
            <h2 id="ride-types-heading">Ride Types</h2>
            <dl className={styles.legendGrid}>
              {RIDE_TYPES.map((type) => (
                <div key={type.value}>
                  <dt>{type.label}</dt>
                  <dd>{type.capacity}</dd>
                </div>
              ))}
            </dl>
          </section>
          <div className={styles.actions}>
            <Link href="/book" className={styles.button}>
              Book Your Ride Online
            </Link>
            <p className={styles.phone}>
              Or call <a href="tel:573-206-9499">(573) 206-9499</a>
            </p>
          </div>
        </div>
      </section>
      <EventWaitlistDialog waitlist={waitlist} onClose={closeWaitlist} />
    </>
  )
}

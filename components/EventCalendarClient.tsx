'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Search } from 'lucide-react'
import { Event, Venue } from '@/lib/api/payload'
import { getMediaUrl } from '@/lib/utils'
import RideAvailabilityBadge from './RideAvailabilityBadge'

interface EventCalendarClientProps {
  events: Event[]
  venues: Venue[]
}

// Ride type configuration
const RIDE_TYPES = [
  { value: 'flex', label: 'Flex', capacity: 'Seats 1-4' },
  { value: 'elite', label: 'Elite', capacity: 'Seats 1-7' },
  { value: 'lrp-black', label: 'LRP Black', capacity: 'Seats 1-6' },
  { value: 'limo-bus', label: 'Limo Bus', capacity: 'Up to 14' },
  { value: 'rescue-squad', label: 'Rescue Squad', capacity: 'Up to 14' },
  { value: 'luxury-sprinter', label: 'Luxury Sprinter', capacity: 'Up to 13' },
  { value: 'luxury-shuttle', label: 'Luxury Shuttle', capacity: 'Up to 37' },
] as const

export default function EventCalendarClient({ events, venues }: EventCalendarClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [venueFilter, setVenueFilter] = useState<string>('')

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const venueId = typeof event.venue === 'object' ? event.venue?.id : event.venue
      const matchesVenue = !venueFilter || venueId === venueFilter

      return matchesSearch && matchesVenue
    })
  }, [events, searchTerm, venueFilter])

  // Group events by venue for display
  const eventsByVenue = useMemo(() => {
    const grouped: Record<string, { venue: Venue; events: Event[] }> = {}

    filteredEvents.forEach((event) => {
      const venue = typeof event.venue === 'object' ? event.venue : null
      if (!venue) return

      if (!grouped[venue.id]) {
        grouped[venue.id] = { venue, events: [] }
      }
      grouped[venue.id].events.push(event)
    })

    return Object.values(grouped)
  }, [filteredEvents])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    }
  }

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-gray-50 dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Venue Filter */}
            <div className="md:w-64">
              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-primary text-lrp-black dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Venues</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.shortName || venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Display */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {eventsByVenue.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                {events.length === 0
                  ? 'No upcoming events at this time. Check back soon!'
                  : 'No events found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {eventsByVenue.map(({ venue, events: venueEvents }) => (
                <div key={venue.id} className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Venue Header */}
                  <div className="bg-lrp-black text-white p-6">
                    <div className="flex items-center gap-4">
                      {venue.image && typeof venue.image === 'object' && (
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getMediaUrl(venue.image.url)}
                            alt={venue.image.alt || venue.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold">{venue.name}</h2>
                        {venue.address && (
                          <p className="text-gray-300 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {venue.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Events Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-dark-bg-primary border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left px-6 py-4 font-semibold text-lrp-black dark:text-white">
                            Event
                          </th>
                          {RIDE_TYPES.map((type) => (
                            <th
                              key={type.value}
                              className="text-center px-3 py-4 font-semibold text-lrp-black dark:text-white text-sm"
                            >
                              <div>{type.label}</div>
                              <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                                {type.capacity}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {venueEvents.map((event, index) => {
                          const dateInfo = formatDate(event.date)
                          return (
                            <tr
                              key={event.id}
                              className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-bg-primary/50 transition-colors ${
                                index % 2 === 0 ? 'bg-white dark:bg-dark-bg-secondary' : 'bg-gray-50/50 dark:bg-dark-bg-primary/30'
                              }`}
                            >
                              {/* Event Info */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  {/* Date Badge */}
                                  <div className="flex-shrink-0 w-14 text-center">
                                    <div className="bg-primary text-black font-bold text-xs py-1 rounded-t">
                                      {dateInfo.month}
                                    </div>
                                    <div className="bg-white dark:bg-dark-bg-primary border border-gray-200 dark:border-gray-600 text-2xl font-bold py-1 rounded-b">
                                      {dateInfo.day}
                                    </div>
                                  </div>
                                  {/* Event Details */}
                                  <div>
                                    <Link
                                      href={`/events/${event.slug}`}
                                      className="font-bold text-lrp-black dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                      {event.name}
                                    </Link>
                                    {event.time && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {event.time}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Ride Availability Columns */}
                              {RIDE_TYPES.map((type) => {
                                const availability = event.rideAvailability?.find(
                                  (r) => r.rideType === type.value
                                )
                                return (
                                  <td key={type.value} className="px-3 py-4 text-center">
                                    <RideAvailabilityBadge
                                      status={availability?.status || 'available'}
                                      notes={availability?.notes}
                                    />
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ride Types Legend */}
          <div className="mt-12 bg-gray-50 dark:bg-dark-bg-secondary rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-4">
              Ride Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {RIDE_TYPES.map((type) => (
                <div key={type.value} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <span className="font-semibold text-lrp-black dark:text-white">{type.label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({type.capacity})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Book Your Ride Online
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
              Or call <a href="tel:573-206-9499" className="text-primary hover:text-primary-dark">(573) 206-9499</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

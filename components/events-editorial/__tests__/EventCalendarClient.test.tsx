import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventCalendarClient from '../EventCalendarClient'
import type { Event, Venue } from '@/lib/api/sanity'
import type { EventWaitlistContext } from '@/components/EventWaitlistModal'

vi.mock('../EventWaitlistDialog', () => ({
  default: ({ waitlist }: { waitlist: EventWaitlistContext | null }) =>
    waitlist ? (
      <output data-testid="waitlist-context">{JSON.stringify(waitlist)}</output>
    ) : null,
}))

const firstVenue: Venue = {
  _id: 'v1',
  name: 'First Venue',
  slug: 'first-venue',
  active: true,
  order: 0,
}
const secondVenue: Venue = {
  _id: 'v2',
  name: 'Second Venue',
  slug: 'second-venue',
  active: true,
  order: 1,
}
const base: Event = {
  _id: 'e1',
  name: 'Lake Concert',
  slug: 'lake-concert',
  date: '2026-09-06T00:00:00.000Z',
  time: '7:30 PM',
  venue: firstVenue,
  active: true,
  featured: false,
  order: 0,
}

describe('editorial event calendar preservation', () => {
  it('keeps all eight capacities and defaults missing availability to available', () => {
    render(<EventCalendarClient events={[base]} venues={[firstVenue]} />)
    expect(
      within(
        screen.getByLabelText('Ride availability for Lake Concert'),
      ).getAllByText('Available'),
    ).toHaveLength(8)
    expect(screen.getAllByText('Up to 23')).toHaveLength(2)
    expect(
      screen.queryByRole('button', { name: /join the waitlist/i }),
    ).not.toBeInTheDocument()
  })

  it('keeps venue ordering, description search, venue filtering, and reset', async () => {
    const user = userEvent.setup()
    const other = {
      ...base,
      _id: 'e2',
      name: 'Another Event',
      slug: 'another-event',
      description: 'A lakeside evening',
      venue: secondVenue,
    }
    render(
      <EventCalendarClient
        events={[other, base]}
        venues={[firstVenue, secondVenue]}
      />,
    )
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.slice(0, 2).map((h) => h.textContent)).toEqual([
      'First Venue',
      'Second Venue',
    ])
    await user.type(
      screen.getByRole('searchbox', { name: 'Find an event' }),
      'lakeside',
    )
    expect(
      screen.getByRole('link', { name: 'Another Event' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Lake Concert' }),
    ).not.toBeInTheDocument()
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Venue' }),
      'v1',
    )
    expect(
      screen.getByText('No events found matching your search.'),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByRole('status')).toHaveTextContent('2 upcoming events')
    expect(screen.getByRole('link', { name: 'Lake Concert' })).toHaveAttribute(
      'href',
      '/events/lake-concert',
    )
  })

  it.each(['2026-09-06T00:00:00.000Z', '2026-09-06T12:00:00.000Z'])(
    'preserves the stored calendar date and full waitlist context for %s',
    async (date) => {
      const user = userEvent.setup()
      const event: Event = {
        ...base,
        date,
        rideAvailability: [
          {
            rideType: 'pink-patrol',
            status: 'reserved',
            notes: 'Fully booked',
          },
          { rideType: 'elite', status: 'limited' },
        ],
      }
      render(
        <EventCalendarClient
          events={[event]}
          venues={[firstVenue]}
          waitlistCounts={{ 'e1:pink-patrol': 3 }}
        />,
      )
      expect(screen.getByText('Fully booked')).toBeInTheDocument()
      expect(screen.getByText('3 on waitlist')).toBeInTheDocument()
      expect(
        within(
          screen.getByLabelText('Ride availability for Lake Concert'),
        ).getByText('Limited'),
      ).toBeInTheDocument()
      await user.click(
        screen.getByRole('button', {
          name: 'Join the waitlist for Pink Patrol at Lake Concert',
        }),
      )
      expect(
        JSON.parse(screen.getByTestId('waitlist-context').textContent || '{}'),
      ).toEqual({
        eventId: 'e1',
        eventName: 'Lake Concert',
        eventDate: 'Sunday, September 6',
        eventDateIso: '2026-09-06',
        eventTime: '7:30 PM',
        venueName: 'First Venue',
        rideType: 'pink-patrol',
        rideTypeLabel: 'Pink Patrol',
      })
    },
  )

  it('shows the existing empty-state guidance when no upcoming events exist', () => {
    render(<EventCalendarClient events={[]} venues={[firstVenue]} />)
    expect(
      screen.getByText('No upcoming events at this time. Check back soon!'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Book Your Ride Online' }),
    ).toHaveAttribute('href', '/book')
  })
})

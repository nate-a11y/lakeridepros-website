import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MoovsBookingLink } from '../MoovsBookingLink'
import BookingWidget from '../BookingWidget'
import { trackServiceEvent } from '@/lib/analytics'
import { BOOKING_ATTRIBUTION_EVENT, MOOVS_PORTAL_URL } from '@/lib/booking-attribution'
vi.mock('@/lib/analytics', () => ({ trackServiceEvent: vi.fn().mockResolvedValue(undefined) }))

beforeEach(() => { vi.clearAllMocks(); window.sessionStorage.clear(); window.location.href = 'https://www.lakeridepros.com/'; window.dataLayer = [] })

describe('MoovsBookingLink', () => {
  it('renders a real accessible direct anchor containing allowed campaign parameters', () => {
    window.history.replaceState({}, '', '/?utm_source=google&gclid=example&email=private')
    render(<MoovsBookingLink>Book now</MoovsBookingLink>)
    const anchor = screen.getByRole('link', { name: 'Book now' })
    expect(anchor).toHaveAttribute('href', `${MOOVS_PORTAL_URL}?utm_source=google&gclid=example`)
    expect(anchor.className).toContain('focus-visible:ring-2')
  })
  it('preserves attribution after an internal route without parameters', () => {
    window.history.replaceState({}, '', '/?utm_source=google')
    render(<MoovsBookingLink>Book now</MoovsBookingLink>)
    window.history.replaceState({}, '', '/services')
    fireEvent(window, new Event(BOOKING_ATTRIBUTION_EVENT))
    expect(screen.getByRole('link')).toHaveAttribute('href', `${MOOVS_PORTAL_URL}?utm_source=google`)
  })
  it('tracks actual clicks without preventing navigation or removing a Google linker', () => {
    render(<MoovsBookingLink serviceSlug="airport" location="hero">Book now</MoovsBookingLink>)
    const anchor = screen.getByRole('link')
    anchor.setAttribute('href', `${MOOVS_PORTAL_URL}?_gl=fresh`)
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true })
    fireEvent(anchor, event)
    expect(event.defaultPrevented).toBe(false)
    expect(anchor).toHaveAttribute('href', `${MOOVS_PORTAL_URL}?_gl=fresh`)
    expect(trackServiceEvent).toHaveBeenCalledWith('airport', 'booking')
    expect(window.dataLayer).toEqual([{ event: 'booking_portal_click', booking_location: 'hero', service_slug: 'airport', booking_destination: MOOVS_PORTAL_URL }])
  })
  it('tracks middle clicks but not other auxiliary buttons', () => {
    render(<MoovsBookingLink>Book now</MoovsBookingLink>)
    fireEvent(screen.getByRole('link'), new MouseEvent('auxclick', { bubbles: true, button: 1 }))
    fireEvent(screen.getByRole('link'), new MouseEvent('auxclick', { bubbles: true, button: 2 }))
    expect(window.dataLayer).toHaveLength(1)
  })
  it('respects caller cancellation', () => {
    render(<MoovsBookingLink onClick={e => e.preventDefault()}>Book now</MoovsBookingLink>)
    fireEvent.click(screen.getByRole('link'))
    expect(window.dataLayer).toHaveLength(0)
  })
  it('renders a booking card without any iframe or impression counted as a booking', () => {
    const { container } = render(<BookingWidget serviceSlug="airport" />)
    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('link', { name: /Open Customer Portal/ })).toHaveAttribute('href', MOOVS_PORTAL_URL)
    expect(trackServiceEvent).not.toHaveBeenCalled()
  })
})

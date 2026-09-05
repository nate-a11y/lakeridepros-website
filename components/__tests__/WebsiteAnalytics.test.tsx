import { fireEvent, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WebsiteAnalytics } from '../WebsiteAnalytics'
import { contactClickEvent, isPublicMarketingPath, trackWebsiteEvent } from '@/lib/website-tracking'
const route = vi.hoisted(() => ({ path: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => route.path }))

beforeEach(() => { route.path = '/'; window.location.href = 'https://www.lakeridepros.com/'; window.dataLayer = [] })

describe('website business events', () => {
  it('tracks public service and fleet views once per navigation, not rerender', () => {
    route.path = '/services/airport'
    const view = render(<WebsiteAnalytics />)
    view.rerender(<WebsiteAnalytics />)
    expect(window.dataLayer).toEqual([{ event: 'view_service', service_slug: 'airport' }])
    route.path = '/fleet/sprinter-van'; view.rerender(<WebsiteAnalytics />)
    expect(window.dataLayer[1]).toEqual({ event: 'view_vehicle', vehicle_slug: 'sprinter-van' })
  })
  it('tracks only LRP business contact links, not partners or private recipients', () => {
    for (const phone of ['5732069499', '+15732069499', '573-206-9499']) expect(contactClickEvent(`tel:${phone}`)).toBe('phone_click')
    expect(contactClickEvent('sms:5732069499?body=private')).toBe('sms_click')
    expect(contactClickEvent('mailto:contactus@lakeridepros.com?subject=private')).toBe('email_click')
    for (const href of ['tel:5551234567', 'mailto:private@example.com', 'mailto:owners@lakeridepros.com', 'https://example.com']) expect(contactClickEvent(href)).toBeNull()
  })
  it('captures nested-icon and keyboard-generated contact clicks without sensitive link contents', () => {
    const { container } = render(<><WebsiteAnalytics /><footer><a href="sms:+15732069499?body=private"><span>Text</span></a></footer></>)
    fireEvent.click(container.querySelector('span')!)
    expect(window.dataLayer).toEqual([{ event: 'sms_click', contact_location: 'footer' }])
  })
  it('tracks internal booking intent separately from portal departure', () => {
    const { container } = render(<><WebsiteAnalytics /><a href="/book" onClick={e => e.preventDefault()}>Book</a></>)
    fireEvent.click(container.querySelector('a')!)
    expect(window.dataLayer).toEqual([{ event: 'booking_intent', booking_location: 'content' }])
  })
  it('ignores cancelled actions and right clicks', () => {
    const { container } = render(<><WebsiteAnalytics /><a href="tel:5732069499" onClick={e => e.preventDefault()}>Call</a></>)
    fireEvent.click(container.querySelector('a')!)
    fireEvent(container.querySelector('a')!, new MouseEvent('auxclick', { button: 2, bubbles: true }))
    expect(window.dataLayer).toEqual([])
  })
  it('excludes private, admin, application and account paths', () => {
    for (const path of ['/camden/requests/private', '/insiders/welcome/token', '/events-waitlist-admin', '/careers/application-status', '/checkout/success']) {
      expect(isPublicMarketingPath(path)).toBe(false)
      window.history.replaceState({}, '', path)
      trackWebsiteEvent('phone_click')
    }
    expect(window.dataLayer).toEqual([])
  })
  it('limits context to supported fields and never throws if analytics is blocked', () => {
    trackWebsiteEvent('contact_form_submit', { form_id: 'contact', email: 'private', error_type: 'x'.repeat(101) } as never)
    expect(window.dataLayer).toEqual([{ event: 'contact_form_submit', form_id: 'contact' }])
    vi.spyOn(window.dataLayer, 'push').mockImplementation(() => { throw new Error('blocked') })
    expect(() => trackWebsiteEvent('contact_form_submit')).not.toThrow()
    vi.restoreAllMocks()
  })
})

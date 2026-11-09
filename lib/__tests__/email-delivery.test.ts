import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as email from '../email'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))
const details = { name: 'Test <Member>', email: 'member@example.com', eventName: 'Example & Event', eventDate: '2026-11-09', rideTypeLabel: 'Shuttle', partySize: 2 }
beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  send.mockReset().mockResolvedValue({ data: { id: 'test-email' }, error: null })
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks() })

describe.each([
  ['contact notification', () => email.sendContactNotification('Test Member', 'member@example.com', 'Line 1\nLine 2')],
  ['contact confirmation', () => email.sendContactConfirmation('Test Member', 'member@example.com')],
  ['waitlist confirmation', () => email.sendEventWaitlistConfirmation(details)],
  ['waitlist admin', () => email.sendEventWaitlistAdminNotification(details)],
  ['waitlist OTP', () => email.sendEventWaitlistOtpCode('member@example.com', '123456')],
] as const)('%s delivery contract', (_name, run) => {
  it('uses only the mocked provider and the approved sender/reply-to contract', async () => {
    expect(await run()).toBe(true)
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ from: 'Lake Ride Pros <contactus@updates.lakeridepros.com>', html: expect.stringContaining('<html lang="en">') }))
  })
  it('reports provider rejection and transport failures as false', async () => {
    send.mockResolvedValueOnce({ data: null, error: { message: 'rejected' } })
    expect(await run()).toBe(false)
    send.mockRejectedValueOnce(new Error('offline'))
    expect(await run()).toBe(false)
  })
  it('does not contact the provider without configuration', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(await run()).toBe(false)
    expect(send).not.toHaveBeenCalled()
  })
})

it.each([email.sendEventWaitlistConfirmation, email.sendEventWaitlistAdminNotification])('escapes complete waitlist content and renders optional trip details', async run => {
  expect(await run({ ...details, phone: '+15555550123', eventTime: '19:00', venueName: 'Example Venue', pickupLocation: 'Hotel', dropoffLocation: 'Venue', desiredPickupTime: '18:00', notes: '<script>\nExample "note"' })).toBe(true)
  const html = send.mock.calls[0][0].html
  for (const text of ['Test &lt;Member&gt;', 'Example &amp; Event', 'Example Venue', 'Hotel', '18:00', '&lt;script&gt;<br>Example &quot;note&quot;']) expect(html).toContain(text)
  expect(html).not.toContain('<script>')
})

it('renders optional contact fields and waitlist OTP content', async () => {
  await email.sendContactNotification('Member', 'member@example.com', 'Line 1\nLine 2', '+15555550123', 'Trip question')
  expect(send.mock.calls[0][0]).toMatchObject({ replyTo: 'member@example.com', to: 'contactus@lakeridepros.com' })
  expect(send.mock.calls[0][0].html).toContain('Line 1<br>Line 2')
  expect(send.mock.calls[0][0].html).toContain('Trip question')
  await email.sendEventWaitlistOtpCode('member@example.com', '<123456>')
  expect(send.mock.calls[1][0].html).toContain('&lt;123456&gt;')
})

it('handles scheduled, personal-use and promotional owner gift-card notifications', async () => {
  await email.sendOwnerGiftCardNotification('TEST-CARD', 'digital', 120, 'Buyer', 'buyer@example.com', null, 'buyer@example.com', 'scheduled', null, 100, 20)
  expect(send.mock.calls[0][0].html).toContain('Scheduled for')
  expect(send.mock.calls[0][0].html).toContain('personal use')
  expect(send.mock.calls[0][0].subject).toContain('Holiday Bonus')
  await email.sendOwnerGiftCardNotification('TEST-CARD', 'physical', 50, 'Buyer', 'buyer@example.com', 'Recipient', 'recipient@example.com')
  expect(send.mock.calls[1][0].html).toContain('pending fulfillment')
  expect(send.mock.calls[1][0].html).toContain('Recipient Information')
})

import { NextRequest } from 'next/server'
import { beforeEach, expect, it, vi } from 'vitest'
import { POST } from '../route'

const { insert, send } = vi.hoisted(() => ({ insert: vi.fn(), send: vi.fn() }))
vi.mock('@/lib/supabase/client', () => ({ getSupabaseServerClient: () => ({ from: () => ({ insert }) }) }))
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))

const input = {
  fullName: 'Test Applicant', email: 'applicant@example.com', phone: '5735550101', cityState: 'Camdenton, MO',
  availability: 'Weekends & evenings, 20 hours weekly.', earliestStartDate: '2026-10-01',
  detailingExperience: 'Interior cleaning <training>', detailingApproach: 'Use a checklist and report damage.',
  dispatchExperience: 'Phone support <training>', dispatchScenario: 'Confirm timing and update both customers.',
  aboutYourself: 'Reliable team member.', workExperience: 'Customer service.', turnstileToken: 'test-token',
}
function request(patch: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/careers/general-application', { method: 'POST', body: JSON.stringify({ ...input, ...patch }) })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-turnstile')
  vi.stubEnv('RESEND_API_KEY', 'test-resend')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }))))
  insert.mockReturnValue({ select: () => ({ single: async () => ({ data: { id: 'test-application' }, error: null }) }) })
  send.mockResolvedValue({ data: { id: 'test-email' }, error: null })
})

it.each(['Part-Time Detailer', 'Dispatcher', 'Sales', 'Brand Ambassador'])('saves %s as a non-driver application and labels the owner email correctly', async (position) => {
  const response = await POST(request({ positions: [position] }))
  expect(response.status).toBe(200)
  expect(insert.mock.calls[0][0][0]).toMatchObject({ position_applied: `Staff: ${position}`, status: 'submitted' })
  expect(send.mock.calls[0][0]).toMatchObject({ subject: `New Application: ${position} - Test Applicant` })
  expect(send.mock.calls[0][0].html).toContain('New General Application')
  expect(send.mock.calls[1][0].html).toContain(position)
})

it('preserves Other details in the review queue and both emails', async () => {
  const response = await POST(request({ positions: ['Dispatcher', 'Other'], otherPosition: 'Fleet <support>' }))
  expect(response.status).toBe(200)
  expect(insert.mock.calls[0][0][0].position_applied).toBe('Staff: Dispatcher, Other')
  expect(insert.mock.calls[0][0][0].other_qualifications).toContain('Fleet <support>')
  expect(send.mock.calls[0][0].html).toContain('Fleet &lt;support&gt;')
  expect(send.mock.calls[1][0].html).toContain('Fleet &lt;support&gt;')
})

it.each([
  { positions: ['Other'] }, { positions: ['Other'], otherPosition: '   ' },
  { positions: ['Driver'] }, { positions: 'Dispatcher' }, { positions: [] },
])('rejects invalid role selection without saving or emailing: %j', async (patch) => {
  const response = await POST(request(patch))
  expect(response.status).toBe(400)
  expect(insert).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
})

it('persists and emails availability and both selected role answers with safe HTML', async () => {
  const response = await POST(request({ positions: ['Part-Time Detailer', 'Dispatcher'] }))
  expect(response.status).toBe(200)
  const saved = insert.mock.calls[0][0][0]
  for (const value of [input.availability, input.earliestStartDate, input.detailingExperience, input.detailingApproach, input.dispatchExperience, input.dispatchScenario]) {
    expect(saved.other_qualifications).toContain(value)
  }
  for (const [message] of send.mock.calls) {
    expect(message.html).toContain('Weekends &amp; evenings')
    expect(message.html).toContain('2026-10-01')
    expect(message.html).toContain('Interior cleaning &lt;training&gt;')
    expect(message.html).toContain('Phone support &lt;training&gt;')
    expect(message.html).not.toContain('<training>')
  }
})
it('does not persist or email stale answers for unselected roles', async () => {
  expect((await POST(request({ positions: ['Sales'] }))).status).toBe(200)
  expect(insert.mock.calls[0][0][0].other_qualifications).not.toContain('Interior cleaning')
  expect(insert.mock.calls[0][0][0].other_qualifications).not.toContain('Phone support')
  for (const [message] of send.mock.calls) expect(message.html).not.toContain('&lt;training&gt;')
})
it.each([
  { availability: '' }, { earliestStartDate: '2026-02-30' },
  { positions: ['Part-Time Detailer'], detailingExperience: '' },
  { positions: ['Part-Time Detailer'], detailingApproach: '' },
  { dispatchExperience: '' }, { dispatchScenario: '' },
])('rejects missing/invalid screening answers before saving or emailing: %j', async patch => {
  expect((await POST(request({ positions: ['Dispatcher'], ...patch }))).status).toBe(400)
  expect(insert).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
  expect(fetch).not.toHaveBeenCalled()
})

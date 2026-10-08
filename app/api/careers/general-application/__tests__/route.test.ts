import { NextRequest } from 'next/server'
import { beforeEach, expect, it, vi } from 'vitest'
import { POST } from '../route'

const { insert, send, upload, remove } = vi.hoisted(() => ({ insert: vi.fn(), send: vi.fn(), upload: vi.fn(), remove: vi.fn() }))
vi.mock('@/lib/supabase/client', () => ({ getSupabaseServerClient: () => ({ from: () => ({ insert }), storage: { from: () => ({ upload, remove }) } }) }))
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))

const input = {
  current_license_number: 'TEST-ID-01', current_license_state: 'MO', current_license_expiration: '2020-01-01',
  fullName: 'Test Applicant', email: 'applicant@example.com', phone: '5735550101', cityState: 'Camdenton, MO',
  availability: 'Weekends & evenings, 20 hours weekly.', earliestStartDate: '2026-10-01',
  detailingExperience: 'Interior cleaning <training>', detailingApproach: 'Use a checklist and report damage.',
  dispatchExperience: 'Phone support <training>', dispatchScenario: 'Confirm timing and update both customers.',
  aboutYourself: 'Reliable team member.', workExperience: 'Customer service.', turnstileToken: 'test-token',
}
const image = () => new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'id.jpg', { type: 'image/jpeg' })
function request(patch: Record<string, unknown>, front: File | null = image(), back: File | null = image()) {
  const form = new FormData()
  form.set('application', JSON.stringify({ ...input, ...patch }))
  if (front) form.set('licenseFront', front)
  if (back) form.set('licenseBack', back)
  return new NextRequest('http://localhost/api/careers/general-application', { method: 'POST', body: form })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-turnstile')
  vi.stubEnv('RESEND_API_KEY', 'test-resend')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }))))
  insert.mockReturnValue({ select: () => ({ single: async () => ({ data: { id: 'test-application' }, error: null }) }) })
  upload.mockResolvedValue({ data: { path: 'test-path' }, error: null })
  remove.mockResolvedValue({ error: null })
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

it('stores private identity paths but never attaches/photos/emails ID values', async () => {
  expect((await POST(request({ positions: ['Sales'], applicationId: '../victim' }))).status).toBe(200)
  const saved = insert.mock.calls[0][0][0]
  expect(saved).toMatchObject({ current_license_number: 'TEST-ID-01', current_license_state: 'MO', current_license_expiration: '2020-01-01' })
  expect(saved.id).toMatch(/^[a-f0-9-]{36}$/)
  expect(saved.license_front_url).toMatch(new RegExp(`^${saved.id}/identity_front_[a-f0-9-]+\\.jpg$`))
  expect(saved.license_back_url).toMatch(new RegExp(`^${saved.id}/identity_back_[a-f0-9-]+\\.jpg$`))
  expect(upload).toHaveBeenCalledTimes(2)
  for (const [message] of send.mock.calls) {
    expect(message).not.toHaveProperty('attachments')
    expect(message.html).not.toContain('TEST-ID-01')
    expect(message.html).not.toContain('identity_front')
  }
  expect(saved).not.toHaveProperty('authorize_license_record_check')
  expect(remove).not.toHaveBeenCalled()
})
it('rejects missing photos and spoofed image data before saving or emailing', async () => {
  expect((await POST(request({ positions: ['Sales'] }, null))).status).toBe(400)
  expect((await POST(request({ positions: ['Sales'] }, new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' })))).status).toBe(400)
  expect(insert).not.toHaveBeenCalled()
  expect(upload).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
})
it('does not upload identity photos when Turnstile fails', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ success: false })))
  expect((await POST(request({ positions: ['Sales'] }))).status).toBe(400)
  expect(upload).not.toHaveBeenCalled()
  expect(insert).not.toHaveBeenCalled()
})
it('cleans up only newly uploaded photos if the second upload fails', async () => {
  upload.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: { message: 'failure' } })
  expect((await POST(request({ positions: ['Sales'] }))).status).toBe(500)
  expect(remove).toHaveBeenCalledWith([upload.mock.calls[0][0]])
  expect(insert).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
})
it('cleans up new photos if application persistence fails', async () => {
  insert.mockReturnValue({ select: () => ({ single: async () => ({ error: { message: 'failure' } }) }) })
  expect((await POST(request({ positions: ['Sales'] }))).status).toBe(500)
  expect(remove).toHaveBeenCalledWith(upload.mock.calls.map(call => call[0]))
  expect(send).not.toHaveBeenCalled()
})
it('retains saved identity documents if email delivery fails', async () => {
  send.mockResolvedValueOnce({ error: { message: 'failure' } })
  expect((await POST(request({ positions: ['Sales'] }))).status).toBe(500)
  expect(insert).toHaveBeenCalledOnce()
  expect(remove).not.toHaveBeenCalled()
})

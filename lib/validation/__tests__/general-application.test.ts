import { expect, it } from 'vitest'
import { generalApplicationSchema } from '../general-application'

const base = {
  current_license_number: 'TEST-ID-01', current_license_state: 'MO', current_license_expiration: '2020-01-01',
  positions: ['Sales'], fullName: 'Test Applicant', email: 'applicant@example.com', phone: '5735550101',
  cityState: 'Camdenton, MO', aboutYourself: 'Ready to learn.', workExperience: 'Customer service.',
  availability: 'Mon–Fri after 4 pm, weekends flexible; 15–20 hours weekly.', earliestStartDate: '2026-10-01',
}
it('requires availability and a real calendar start date for every staff role', () => {
  expect(generalApplicationSchema.safeParse(base).success).toBe(true)
  for (const patch of [{ availability: '' }, { availability: '  ' }, { earliestStartDate: '' }, { earliestStartDate: '2026-02-30' }, { earliestStartDate: 'soon' }]) {
    expect(generalApplicationSchema.safeParse({ ...base, ...patch }).success).toBe(false)
  }
})
it.each([
  ['Part-Time Detailer', { detailingExperience: 'New to detailing; willing to train.', detailingApproach: 'Check the interior and exterior against a checklist.' }],
  ['Dispatcher', { dispatchExperience: 'Phone support and scheduling software.', dispatchScenario: 'Confirm the delay, contact the driver, and update the customer.' }],
])('requires only relevant questions for %s and allows new applicants', (position, answers) => {
  expect(generalApplicationSchema.safeParse({ ...base, positions: [position] }).success).toBe(false)
  expect(generalApplicationSchema.safeParse({ ...base, positions: [position], ...answers }).success).toBe(true)
  for (const field of Object.keys(answers)) {
    expect(generalApplicationSchema.safeParse({ ...base, positions: [position], ...answers, [field]: ' ' }).success).toBe(false)
  }
})
it('requires both sets of answers when both roles are selected', () => {
  expect(generalApplicationSchema.safeParse({ ...base, positions: ['Part-Time Detailer', 'Dispatcher'], detailingExperience: 'Training', detailingApproach: 'Checklist' }).success).toBe(false)
})
it('limits free-text answers', () => {
  expect(generalApplicationSchema.safeParse({ ...base, availability: 'a'.repeat(2001) }).success).toBe(false)
  expect(generalApplicationSchema.safeParse({ ...base, positions: ['Dispatcher'], dispatchExperience: 'a'.repeat(3001), dispatchScenario: 'Call the driver' }).success).toBe(false)
})

it('requires identity details but accepts an expired ID without driving eligibility or MVR consent', () => {
  const parsed = generalApplicationSchema.safeParse({ ...base, current_license_expiration: '2000-01-01' })
  expect(parsed.success).toBe(true)
  for (const patch of [{ current_license_number: ' ' }, { current_license_state: 'XX' }, { current_license_expiration: '2026-02-30' }]) {
    expect(generalApplicationSchema.safeParse({ ...base, ...patch }).success).toBe(false)
  }
  if (parsed.success) {
    expect(parsed.data).not.toHaveProperty('current_license_class')
    expect(parsed.data).not.toHaveProperty('authorize_license_record_check')
  }
})

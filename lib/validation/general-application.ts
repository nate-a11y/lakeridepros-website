import { z } from 'zod'

export const GENERAL_APPLICATION_POSITIONS = [
  'Sales', 'Brand Ambassador', 'Part-Time Detailer', 'Dispatcher', 'Other',
] as const

export const ROLE_QUESTIONS = [
  { role: 'Part-Time Detailer', name: 'detailingExperience', label: 'Vehicle detailing experience', hint: 'Describe any interior/exterior cleaning or detailing experience, including tools and products you have used. If you are new, tell us what you would like to learn.' },
  { role: 'Part-Time Detailer', name: 'detailingApproach', label: 'Getting a vehicle guest-ready', hint: 'How would you clean and check a vehicle before its next trip? Include how you would report damage, missing supplies, or a tight turnaround.' },
  { role: 'Dispatcher', name: 'dispatchExperience', label: 'Dispatch and customer service experience', hint: 'Describe your experience with scheduling, phones, customer service, maps, or dispatch software. No dispatch experience yet? Share any transferable skills.' },
  { role: 'Dispatcher', name: 'dispatchScenario', label: 'Handling a delayed pickup', hint: 'A driver is running late while another customer calls to change a pickup. How would you prioritize, communicate, and keep the schedule accurate?' },
] as const

export const generalApplicationSchema = z.object({
  positions: z.array(z.enum(GENERAL_APPLICATION_POSITIONS)).min(1, 'Please select at least one position').max(GENERAL_APPLICATION_POSITIONS.length),
  otherPosition: z.string().trim().max(200).optional(),
  fullName: z.string().trim().min(1, 'Full name is required').max(200),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  cityState: z.string().trim().min(1, 'City, State is required').max(200),
  availability: z.string().trim().min(1, 'Please describe your availability').max(2000),
  earliestStartDate: z.iso.date('Please enter a valid earliest start date'),
  detailingExperience: z.string().trim().max(3000).optional(),
  detailingApproach: z.string().trim().max(3000).optional(),
  dispatchExperience: z.string().trim().max(3000).optional(),
  dispatchScenario: z.string().trim().max(3000).optional(),
  howDidYouHear: z.string().max(500).optional(),
  socialFacebook: z.string().max(200).optional(),
  socialInstagram: z.string().max(200).optional(),
  socialX: z.string().max(200).optional(),
  socialTikTok: z.string().max(200).optional(),
  aboutYourself: z.string().trim().min(1, 'Please tell us about yourself').max(5000),
  workExperience: z.string().trim().min(1, 'Please provide your work experience').max(5000),
}).superRefine((data, context) => {
  for (const question of ROLE_QUESTIONS) {
    if (data.positions.includes(question.role) && !data[question.name]) {
      context.addIssue({ code: 'custom', path: [question.name], message: `Please answer: ${question.label}` })
    }
  }
  if (data.positions.includes('Other') && !data.otherPosition) {
    context.addIssue({ code: 'custom', path: ['otherPosition'], message: 'Please specify the other position you are interested in' })
  }
})

export type GeneralApplicationFormData = z.infer<typeof generalApplicationSchema>

/** Shared by the review record and emails; ignore stale answers for deselected roles. */
export function generalApplicationDetails(data: GeneralApplicationFormData): string {
  return [
    `Availability (days, times, weekly hours): ${data.availability}`,
    `Earliest start date: ${data.earliestStartDate}`,
    ...ROLE_QUESTIONS.filter(question => data.positions.includes(question.role))
      .map(question => `${question.label}: ${data[question.name]}`),
  ].join('\n\n')
}

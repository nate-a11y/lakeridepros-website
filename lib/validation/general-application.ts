import { z } from 'zod'

export const GENERAL_APPLICATION_POSITIONS = [
  'Sales', 'Brand Ambassador', 'Part-Time Detailer', 'Dispatcher', 'Other',
] as const

export const generalApplicationSchema = z.object({
  positions: z.array(z.enum(GENERAL_APPLICATION_POSITIONS)).min(1, 'Please select at least one position').max(GENERAL_APPLICATION_POSITIONS.length),
  otherPosition: z.string().trim().max(200).optional(),
  fullName: z.string().trim().min(1, 'Full name is required').max(200),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  cityState: z.string().trim().min(1, 'City, State is required').max(200),
  howDidYouHear: z.string().max(500).optional(),
  socialFacebook: z.string().max(200).optional(),
  socialInstagram: z.string().max(200).optional(),
  socialX: z.string().max(200).optional(),
  socialTikTok: z.string().max(200).optional(),
  aboutYourself: z.string().trim().min(1, 'Please tell us about yourself').max(5000),
  workExperience: z.string().trim().min(1, 'Please provide your work experience').max(5000),
}).superRefine((data, context) => {
  if (data.positions.includes('Other') && !data.otherPosition) {
    context.addIssue({ code: 'custom', path: ['otherPosition'], message: 'Please specify the other position you are interested in' })
  }
})

export type GeneralApplicationFormData = z.infer<typeof generalApplicationSchema>

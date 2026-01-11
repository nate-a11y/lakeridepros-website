/**
 * Zod validation schema for bridal show registration form
 */

import { z } from 'zod'

// Helper to validate phone numbers
const phoneRegex = /^[\d\s\-\(\)]+$/

export const bridalShowRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  transportation_needs: z.string()
    .min(1, 'Please tell us about your transportation needs')
    .max(1000, 'Transportation needs must be less than 1000 characters'),
})

export type BridalShowRegistrationData = z.infer<typeof bridalShowRegistrationSchema>

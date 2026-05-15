import { z } from 'zod'

const requiredString = (field: string, max = 200) =>
  z
    .string({ error: `${field} is required` })
    .trim()
    .min(1, `${field} is required`)
    .max(max, `${field} is too long`)

const optionalString = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or less`)
    .optional()
    .or(z.literal(''))

export const eventWaitlistSubmitSchema = z.object({
  eventId: requiredString('Event ID', 120),
  eventName: requiredString('Event name', 200),
  eventDate: requiredString('Event date', 80),
  eventTime: optionalString(80),
  venueName: optionalString(200),
  rideType: requiredString('Vehicle type', 80),
  rideTypeLabel: requiredString('Vehicle type', 120),
  name: requiredString('Name', 200),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  phone: optionalString(30),
  partySize: z.coerce
    .number({ error: 'Party size is required' })
    .int('Party size must be a whole number')
    .min(1, 'Party size must be at least 1')
    .max(99, 'Party size must be 99 or less'),
  pickupLocation: optionalString(300),
  dropoffLocation: optionalString(300),
  desiredPickupTime: optionalString(80),
  notes: optionalString(1000),
  _honeypot: optionalString(200),
  _timestamp: z.number().optional(),
})

export type EventWaitlistSubmitInput = z.infer<typeof eventWaitlistSubmitSchema>

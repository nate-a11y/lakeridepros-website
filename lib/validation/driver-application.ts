/**
 * Zod validation schemas for driver application form
 * Complies with 49 CFR 391.21 federal regulations
 */

import { z } from 'zod'

// Helper to validate date is at least 18 years ago
const minAge = 18
const maxAgeDate = new Date()
maxAgeDate.setFullYear(maxAgeDate.getFullYear() - minAge)

// Helper to validate phone numbers
const phoneRegex = /^[\d\s\-\(\)]+$/

// Helper to validate SSN format
const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/

// US States
const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC'
] as const

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().min(1, 'Last name is required').max(100),
  date_of_birth: z.string().refine((date) => {
    const dob = new Date(date)
    return dob <= maxAgeDate
  }, `Must be at least ${minAge} years old`),
  ssn: z.string().regex(ssnRegex, 'SSN must be in format XXX-XX-XXXX'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').min(10, 'Phone number must be at least 10 digits'),
  address_street: z.string().min(1, 'Street address is required'),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.enum(usStates, { message: 'Invalid state' }),
  address_zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format XXXXX or XXXXX-XXXX'),
  legal_right_to_work: z.literal(true, { message: 'You must have legal right to work in the US' })
})

// Step 2: Residence History
export const residenceSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.enum(usStates),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false)
})

export const residenceHistorySchema = z.object({
  residences: z.array(residenceSchema).min(1, 'At least one residence is required').refine(
    (residences) => {
      // Validate that residences cover at least 3 years
      const threeYearsAgo = new Date()
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

      const sortedResidences = [...residences].sort((a, b) =>
        new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()
      )

      const oldestDate = new Date(sortedResidences[0].fromDate)
      return oldestDate <= threeYearsAgo
    },
    'Residence history must cover at least 3 years'
  )
})

// Step 3: License Verification
export const licenseVerificationSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseState: z.enum(usStates),
  licenseClass: z.string().min(1, 'License class is required'),
  licenseExpiration: z.string().refine((date) => {
    const expDate = new Date(date)
    return expDate > new Date()
  }, 'License must not be expired'),
  licenseEndorsements: z.string().optional(),
  licenseRestrictions: z.string().optional(),
  hasRevocations: z.boolean(),
  revocationDetails: z.string().optional(),
  signature: z.string().min(1, 'Signature is required for license verification authorization')
}).refine(
  (data) => !data.hasRevocations || (data.revocationDetails && data.revocationDetails.length > 0),
  {
    message: 'Please provide details about license revocations',
    path: ['revocationDetails']
  }
)

// Step 4: License History
export const licenseHistoryItemSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required'),
  state: z.enum(usStates),
  licenseClass: z.string().min(1, 'License class is required'),
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false)
})

export const licenseHistorySchema = z.object({
  licenses: z.array(licenseHistoryItemSchema)
})

// Step 5: Driving Experience
export const drivingExperienceItemSchema = z.object({
  equipmentClass: z.string().min(1, 'Equipment class is required'),
  equipmentType: z.string().min(1, 'Equipment type is required'),
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  approximateMiles: z.number().min(0, 'Miles must be positive').optional()
})

export const drivingExperienceSchema = z.object({
  experiences: z.array(drivingExperienceItemSchema)
})

// Step 6: Safety History - Accidents
export const accidentSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  fatalities: z.number().min(0).default(0),
  injuries: z.number().min(0).default(0)
})

export const accidentsSchema = z.object({
  hasAccidents: z.boolean(),
  accidents: z.array(accidentSchema)
}).refine(
  (data) => !data.hasAccidents || data.accidents.length > 0,
  {
    message: 'Please add at least one accident or indicate you have no accidents',
    path: ['accidents']
  }
)

// Step 7: Safety History - Traffic Convictions
export const convictionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  charge: z.string().min(1, 'Charge is required'),
  penalty: z.string().min(1, 'Penalty is required')
})

export const convictionsSchema = z.object({
  hasConvictions: z.boolean(),
  convictions: z.array(convictionSchema)
}).refine(
  (data) => !data.hasConvictions || data.convictions.length > 0,
  {
    message: 'Please add at least one conviction or indicate you have no convictions',
    path: ['convictions']
  }
)

// Step 8: Employment History
export const employmentHistoryItemSchema = z.object({
  employerName: z.string().min(1, 'Employer name is required'),
  employerAddress: z.string().min(1, 'Employer address is required'),
  employerPhone: z.string().regex(phoneRegex, 'Invalid phone number'),
  positionHeld: z.string().min(1, 'Position is required'),
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  reasonForLeaving: z.string().optional(),
  wasCMVDriver: z.boolean().default(false),
  supervisorName: z.string().optional(),
  mayContact: z.boolean().default(true)
})

export const employmentHistorySchema = z.object({
  employment: z.array(employmentHistoryItemSchema).min(1, 'At least one employment record is required'),
  gapsExplanation: z.string().optional()
}).refine(
  (data) => {
    // Check if employment history covers required time period
    // For CMV drivers: 10 years, others: 3 years
    const hasCMVExperience = data.employment.some(emp => emp.wasCMVDriver)
    const requiredYears = hasCMVExperience ? 10 : 3

    const yearsAgo = new Date()
    yearsAgo.setFullYear(yearsAgo.getFullYear() - requiredYears)

    const sortedEmployment = [...data.employment].sort((a, b) =>
      new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()
    )

    const oldestDate = new Date(sortedEmployment[0].fromDate)
    return oldestDate <= yearsAgo
  },
  {
    message: 'Employment history must cover at least 3 years (10 years for prior CMV drivers)',
    path: ['employment']
  }
)

// Step 9: Education & Qualifications
export const educationSchema = z.object({
  highSchoolName: z.string().optional(),
  highSchoolLocation: z.string().optional(),
  highSchoolGraduated: z.boolean().default(false),
  collegeName: z.string().optional(),
  collegeLocation: z.string().optional(),
  collegeDegree: z.string().optional(),
  otherTraining: z.string().optional()
})

// Step 10: Upload Documents
export const documentsSchema = z.object({
  licenseFrontUrl: z.string().min(1, 'License front image is required'),
  licenseBackUrl: z.string().min(1, 'License back image is required')
})

// Step 11: Review & Sign
export const certificationSchema = z.object({
  signature: z.string().min(1, 'Signature is required to submit application'),
  certify: z.literal(true, { message: 'You must certify that all information is true and correct' })
})

// Complete application schema
export const completeApplicationSchema = z.object({
  personalInfo: personalInfoSchema,
  residenceHistory: residenceHistorySchema,
  licenseVerification: licenseVerificationSchema,
  licenseHistory: licenseHistorySchema,
  drivingExperience: drivingExperienceSchema,
  accidents: accidentsSchema,
  convictions: convictionsSchema,
  employmentHistory: employmentHistorySchema,
  education: educationSchema,
  documents: documentsSchema,
  certification: certificationSchema
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type ResidenceHistory = z.infer<typeof residenceHistorySchema>
export type LicenseVerification = z.infer<typeof licenseVerificationSchema>
export type LicenseHistory = z.infer<typeof licenseHistorySchema>
export type DrivingExperience = z.infer<typeof drivingExperienceSchema>
export type Accidents = z.infer<typeof accidentsSchema>
export type Convictions = z.infer<typeof convictionsSchema>
export type EmploymentHistory = z.infer<typeof employmentHistorySchema>
export type Education = z.infer<typeof educationSchema>
export type Documents = z.infer<typeof documentsSchema>
export type Certification = z.infer<typeof certificationSchema>
export type CompleteApplication = z.infer<typeof completeApplicationSchema>

'use client'

/**
 * Step 1: Personal Information
 * Complies with 49 CFR 391.21(b)(1) - Application for employment
 */

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'

// US States
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const

// Validation schema
const personalInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().min(1, 'Last name is required').max(100),
  date_of_birth: z.string().refine((date) => {
    const dob = new Date(date)
    const eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
    return dob <= eighteenYearsAgo
  }, 'Must be at least 18 years old'),
  ssn: z.string().refine((val) => {
    // Accept either full SSN format (123-45-6789) or masked format (XXX-XX-1234)
    return /^\d{3}-?\d{2}-?\d{4}$/.test(val) || /^XXX-XX-\d{4}$/.test(val)
  }, 'SSN must be in format XXX-XX-XXXX'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address_street: z.string().min(1, 'Street address is required'),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.enum(US_STATES, { message: 'Invalid state' }),
  address_zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format XXXXX or XXXXX-XXXX'),
  legal_right_to_work: z.literal(true, { message: 'You must have legal right to work in the US' })
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

interface Step1PersonalProps {
  onNext: () => void
}

export default function Step1Personal({ onNext }: Step1PersonalProps) {
  const { applicationData, updateApplicationData } = useApplication()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [ssnMasked, setSSNMasked] = useState(false)
  const [fullSSN, setFullSSN] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: applicationData.first_name || '',
      middle_name: applicationData.middle_name || '',
      last_name: applicationData.last_name || '',
      date_of_birth: applicationData.date_of_birth || '',
      ssn: '', // Never pre-fill SSN for security
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      address_street: applicationData.address_street || '',
      address_city: applicationData.address_city || '',
      address_state: (applicationData.address_state as typeof US_STATES[number]) || undefined,
      address_zip: applicationData.address_zip || '',
      legal_right_to_work: applicationData.legal_right_to_work === true ? true : undefined as unknown as true
    }
  })

  // Format SSN as user types
  const ssnValue = watch('ssn')
  useEffect(() => {
    if (ssnValue && !ssnMasked) {
      const cleaned = ssnValue.replace(/\D/g, '')
      if (cleaned.length <= 9) {
        let formatted = cleaned
        if (cleaned.length > 3) {
          formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
        }
        if (cleaned.length > 5) {
          formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`
        }
        if (formatted !== ssnValue) {
          setValue('ssn', formatted)
        }
        // Store full SSN
        setFullSSN(cleaned)
      }
    }
  }, [ssnValue, setValue, ssnMasked])

  // Mask SSN on blur (show last 4 digits only)
  const handleSSNBlur = () => {
    const ssn = watch('ssn')
    if (ssn && ssn.replace(/\D/g, '').length === 9) {
      const cleaned = ssn.replace(/\D/g, '')
      setFullSSN(cleaned) // Store full SSN before masking
      const masked = `XXX-XX-${cleaned.slice(5)}`
      setValue('ssn', masked)
      setSSNMasked(true)
    }
  }

  // Unmask SSN on focus
  const handleSSNFocus = () => {
    const ssn = watch('ssn')
    if (ssnMasked && ssn.startsWith('XXX-XX-')) {
      setValue('ssn', '')
      setSSNMasked(false)
    }
  }

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsEncrypting(true)
    try {
      // Use the stored full SSN or the current value
      const ssnToEncrypt = ssnMasked && fullSSN ? fullSSN : data.ssn.replace(/\D/g, '')

      // Validate SSN length
      if (ssnToEncrypt.length !== 9) {
        throw new Error('Please enter a valid 9-digit SSN')
      }

      // Encrypt SSN via Edge Function
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration is missing')
      }

      const encryptResponse = await fetch(`${supabaseUrl}/functions/v1/encrypt-ssn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ ssn: ssnToEncrypt })
      })

      if (!encryptResponse.ok) {
        const errorData = await encryptResponse.json()
        throw new Error(errorData.error || 'Failed to encrypt SSN')
      }

      const { encryptedSSN } = await encryptResponse.json()

      // Update application data
      updateApplicationData({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        ssn_encrypted: encryptedSSN,
        email: data.email,
        phone: data.phone,
        address_street: data.address_street,
        address_city: data.address_city,
        address_state: data.address_state,
        address_zip: data.address_zip,
        legal_right_to_work: data.legal_right_to_work
      })

      onNext()
    } catch (error) {
      console.error('Error processing application:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your information. Please try again.'
      )
    } finally {
      setIsEncrypting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Personal Information</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        Please provide your personal information as it appears on your driver's license.
        All fields marked with * are required by federal regulation 49 CFR 391.21.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate aria-label="Personal information form">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              First Name *
            </label>
            <input
              {...register('first_name')}
              type="text"
              id="first_name"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.first_name ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.first_name && (
              <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="middle_name" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Middle Name
            </label>
            <input
              {...register('middle_name')}
              type="text"
              id="middle_name"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:ring-primary focus:border-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Last Name *
            </label>
            <input
              {...register('last_name')}
              type="text"
              id="last_name"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.last_name ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.last_name && (
              <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth and SSN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Date of Birth *
            </label>
            <input
              {...register('date_of_birth')}
              type="date"
              id="date_of_birth"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.date_of_birth ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.date_of_birth && (
              <p className="text-red-600 text-sm mt-1">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ssn" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Social Security Number *
            </label>
            <input
              {...register('ssn')}
              type="text"
              id="ssn"
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              onBlur={handleSSNBlur}
              onFocus={handleSSNFocus}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.ssn ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.ssn && (
              <p className="text-red-600 text-sm mt-1">{errors.ssn.message}</p>
            )}
            <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mt-1">
              Your SSN will be encrypted server-side before storage and is required by federal regulation.
            </p>
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="(555) 123-4567"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address_street" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
            Street Address *
          </label>
          <input
            {...register('address_street')}
            type="text"
            id="address_street"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.address_street ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
            }`}
          />
          {errors.address_street && (
            <p className="text-red-600 text-sm mt-1">{errors.address_street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="address_city" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              City *
            </label>
            <input
              {...register('address_city')}
              type="text"
              id="address_city"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.address_city ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.address_city && (
              <p className="text-red-600 text-sm mt-1">{errors.address_city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address_state" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              State *
            </label>
            <select
              {...register('address_state')}
              id="address_state"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.address_state ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            >
              <option value="">Select State</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.address_state && (
              <p className="text-red-600 text-sm mt-1">{errors.address_state.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address_zip" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
              ZIP Code *
            </label>
            <input
              {...register('address_zip')}
              type="text"
              id="address_zip"
              placeholder="12345"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.address_zip ? 'border-red-500' : 'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors'
              }`}
            />
            {errors.address_zip && (
              <p className="text-red-600 text-sm mt-1">{errors.address_zip.message}</p>
            )}
          </div>
        </div>

        {/* Legal Right to Work */}
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-md p-4">
          <div className="flex items-start">
            <input
              {...register('legal_right_to_work')}
              type="checkbox"
              id="legal_right_to_work"
              className="mt-1 h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded"
            />
            <label htmlFor="legal_right_to_work" className="ml-3 text-sm text-neutral-900 dark:text-white">
              I certify that I have the legal right to work in the United States *
            </label>
          </div>
          {errors.legal_right_to_work && (
            <p className="text-red-600 text-sm mt-2">{errors.legal_right_to_work.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isEncrypting}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isEncrypting
                ? 'bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed text-white'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
            aria-label={isEncrypting ? 'Processing personal information' : 'Continue to residence history step'}
          >
            {isEncrypting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Continue to Residence History'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

/**
 * Step 3: License Verification
 * Complies with 49 CFR 391.23 - Previous Driving Record Authorization
 */

import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import SignatureCanvas from 'react-signature-canvas'

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const

const licenseVerificationSchema = z.object({
  current_license_number: z.string().min(1, 'License number is required'),
  current_license_state: z.enum(US_STATES),
  current_license_class: z.string().min(1, 'License class is required'),
  current_license_expiration: z.string().refine((date) => {
    const expDate = new Date(date)
    return expDate > new Date()
  }, 'License must not be expired'),
  license_revoked_past_3_years: z.boolean(),
  accidents_past_3_years: z.boolean(),
  accidents_explanation: z.string().optional(),
  authorize_license_record_check: z.literal(true, {
    errorMap: () => ({ message: 'You must authorize the license record check' })
  })
})

type LicenseVerificationFormData = z.infer<typeof licenseVerificationSchema>

interface Step3LicenseVerificationProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Step3LicenseVerification({ onNext, onPrevious }: Step3LicenseVerificationProps) {
  const { applicationData, updateApplicationData } = useApplication()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signatureError, setSignatureError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<LicenseVerificationFormData>({
    resolver: zodResolver(licenseVerificationSchema),
    defaultValues: {
      current_license_number: applicationData.current_license_number || '',
      current_license_state: applicationData.current_license_state || 'MO',
      current_license_class: applicationData.current_license_class || '',
      current_license_expiration: applicationData.current_license_expiration || '',
      license_revoked_past_3_years: applicationData.license_revoked_past_3_years || false,
      accidents_past_3_years: applicationData.accidents_past_3_years || false,
      accidents_explanation: applicationData.accidents_explanation || '',
      authorize_license_record_check: applicationData.authorize_license_record_check || undefined
    }
  })

  const hasAccidents = watch('accidents_past_3_years')

  const clearSignature = () => {
    signatureRef.current?.clear()
    setSignatureError(null)
  }

  const onSubmit = (data: LicenseVerificationFormData) => {
    // Validate signature
    if (signatureRef.current?.isEmpty()) {
      setSignatureError('Signature is required for license verification authorization')
      return
    }

    // Get signature as base64
    const signatureData = signatureRef.current?.toDataURL()

    updateApplicationData({
      current_license_number: data.current_license_number,
      current_license_state: data.current_license_state,
      current_license_class: data.current_license_class,
      current_license_expiration: data.current_license_expiration,
      license_revoked_past_3_years: data.license_revoked_past_3_years,
      accidents_past_3_years: data.accidents_past_3_years,
      accidents_explanation: data.accidents_explanation,
      authorize_license_record_check: data.authorize_license_record_check,
      license_verification_signature: signatureData,
      license_verification_signature_date: new Date().toISOString()
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Current Driver's License Verification</h2>
      <p className="text-gray-600 mb-6">
        Provide information about your current driver's license (49 CFR 391.21(b)(3)).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number *
            </label>
            <input
              {...register('current_license_number')}
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.current_license_number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.current_license_number && (
              <p className="text-red-600 text-sm mt-1">{errors.current_license_number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              {...register('current_license_state')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Class *
            </label>
            <input
              {...register('current_license_class')}
              type="text"
              placeholder="e.g., Class A, Class B, CDL"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.current_license_class ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.current_license_class && (
              <p className="text-red-600 text-sm mt-1">{errors.current_license_class.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date *
            </label>
            <input
              {...register('current_license_expiration')}
              type="date"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.current_license_expiration ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.current_license_expiration && (
              <p className="text-red-600 text-sm mt-1">{errors.current_license_expiration.message}</p>
            )}
          </div>
        </div>

        {/* Safety Questions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
          <div>
            <div className="flex items-center">
              <input
                {...register('license_revoked_past_3_years')}
                type="checkbox"
                id="revoked"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="revoked" className="ml-2 text-sm text-gray-700">
                Has your license been revoked, suspended, or denied in the past 3 years?
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                {...register('accidents_past_3_years')}
                type="checkbox"
                id="accidents"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="accidents" className="ml-2 text-sm text-gray-700">
                Have you been involved in any accidents in the past 3 years?
              </label>
            </div>
          </div>

          {hasAccidents && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Please explain:
              </label>
              <textarea
                {...register('accidents_explanation')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Provide details about the accident(s)"
              />
            </div>
          )}
        </div>

        {/* Authorization Statement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Authorization for Previous Driving Record (49 CFR 391.23)</h3>
          <p className="text-sm text-gray-700 mb-4">
            I authorize you to make such investigations and inquiries of my personal, employment, financial,
            or medical history and other related matters as may be necessary in arriving at an employment
            decision. I hereby release employers, schools, health care providers, and other persons from all
            liability in responding to inquiries and releasing information in connection with my application.
          </p>

          <div className="flex items-start mb-4">
            <input
              {...register('authorize_license_record_check')}
              type="checkbox"
              id="authorize"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="authorize" className="ml-3 text-sm text-gray-700">
              I authorize the investigation of my previous driving record *
            </label>
          </div>
          {errors.authorize_license_record_check && (
            <p className="text-red-600 text-sm mb-4">{errors.authorize_license_record_check.message}</p>
          )}

          {/* Signature Canvas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature *
            </label>
            <div className="border-2 border-gray-300 rounded-md bg-white">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: 'w-full h-40',
                  style: { touchAction: 'none' }
                }}
                backgroundColor="white"
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear Signature
              </button>
              <p className="text-xs text-gray-500">Sign with your mouse or finger</p>
            </div>
            {signatureError && (
              <p className="text-red-600 text-sm mt-1">{signatureError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

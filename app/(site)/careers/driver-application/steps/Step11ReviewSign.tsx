'use client'

/**
 * Step 11: Review & Final Certification
 * Final review of all application data and certification signature
 */

import React, { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApplication } from '../context/ApplicationContext'
import { submitApplication } from '@/lib/supabase/driver-application'
import { downloadApplicationPDF } from '@/lib/pdf-generator'
import SignatureCanvas from 'react-signature-canvas'
import { CheckCircle2, Download, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const certificationSchema = z.object({
  certification_name_printed: z.string().min(1, 'Printed name is required'),
  certify: z.boolean().refine(val => val === true, {
    message: 'You must certify that all information is true and correct'
  })
})

type CertificationFormData = z.infer<typeof certificationSchema>

interface Step11ReviewSignProps {
  onPrevious: () => void
}

export default function Step11ReviewSign({ onPrevious }: Step11ReviewSignProps) {
  const { applicationData, applicationId } = useApplication()
  const router = useRouter()
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signatureError, setSignatureError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Anti-bot protection
  const [honeypot, setHoneypot] = useState('')
  const formLoadTime = useRef<number>(0)

  // Track when the form was loaded
  useEffect(() => {
    formLoadTime.current = Date.now()
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certification_name_printed: `${applicationData.first_name || ''} ${applicationData.last_name || ''}`.trim(),
      certify: undefined
    }
  })

  const clearSignature = () => {
    signatureRef.current?.clear()
    setSignatureError(null)
  }

  const handleDownloadPDF = () => {
    const filename = `driver-application-${applicationData.last_name || 'preview'}-${new Date().toISOString().split('T')[0]}.pdf`
    downloadApplicationPDF(applicationData, filename)
  }

  const onSubmit = async (data: CertificationFormData) => {
    // Anti-bot validation: Check if honeypot field is filled
    if (honeypot) {
      setSubmitError('Invalid submission detected.')
      return
    }

    // Anti-bot validation: Check if form was submitted too quickly (less than 3 seconds)
    const timeSinceLoad = Date.now() - formLoadTime.current
    if (timeSinceLoad < 3000) {
      setSubmitError('Please take your time to review the application before submitting.')
      return
    }

    // Validate signature
    if (signatureRef.current?.isEmpty()) {
      setSignatureError('Signature is required to submit application')
      return
    }

    if (!applicationId) {
      setSubmitError('Application ID not found. Please start over.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Get signature as base64
      const signatureData = signatureRef.current?.toDataURL()

      // Submit application (IP and user agent captured server-side)
      // Include anti-bot metadata
      const { error } = await submitApplication(
        applicationId,
        {
          ...applicationData,
          certification_signature: signatureData,
          certification_name_printed: data.certification_name_printed,
          // Anti-bot fields (will be stripped server-side)
          _honeypot: honeypot,
          _timestamp: formLoadTime.current
        } as any
      )

      if (error) {
        setSubmitError(error.message)
        setIsSubmitting(false)
        return
      }

      // Send notification email and SMS
      await fetch('/api/driver-application/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: applicationId,
          applicantName: `${applicationData.first_name} ${applicationData.last_name}`,
          applicantEmail: applicationData.email,
          applicantPhone: applicationData.phone
        })
      })

      // Clear localStorage
      localStorage.removeItem('driver-application-id')

      // Redirect to success page
      router.push(`/careers/application-received?id=${applicationId}`)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">Review & Certification</h2>
      <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
        Please review your application carefully before signing and submitting.
      </p>

      {/* Application Summary */}
      <div className="space-y-4 mb-8">
        {/* Personal Information */}
        <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {applicationData.first_name} {applicationData.middle_name} {applicationData.last_name}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span> {applicationData.date_of_birth}
            </div>
            <div>
              <span className="font-medium">Email:</span> {applicationData.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {applicationData.phone}
            </div>
            <div className="md:col-span-2">
              <span className="font-medium">Address:</span> {applicationData.address_street}, {applicationData.address_city}, {applicationData.address_state} {applicationData.address_zip}
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Current License</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">License #:</span> {applicationData.current_license_number}
            </div>
            <div>
              <span className="font-medium">State:</span> {applicationData.current_license_state}
            </div>
            <div>
              <span className="font-medium">Class:</span> {applicationData.current_license_class}
            </div>
            <div>
              <span className="font-medium">Expiration:</span> {applicationData.current_license_expiration}
            </div>
          </div>
        </div>

        {/* Residence History */}
        {applicationData.residences && applicationData.residences.length > 0 && (
          <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Residence History</h3>
            <div className="space-y-2 text-sm">
              {applicationData.residences.map((res, idx) => (
                <div key={idx}>
                  {res.street}, {res.city}, {res.state} {res.zip}
                  {res.is_current && <span className="ml-2 text-primary">(Current)</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employment History */}
        {applicationData.employment_history && applicationData.employment_history.length > 0 && (
          <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Employment History</h3>
            <div className="space-y-3 text-sm">
              {applicationData.employment_history.map((emp, idx) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-3">
                  <div className="font-medium">{emp.name} - {emp.position}</div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {emp.from_date} to {emp.to_date || 'Present'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Driving Experience */}
        {applicationData.driving_experience && applicationData.driving_experience.length > 0 && (
          <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Driving Experience</h3>
            <div className="space-y-2 text-sm">
              {applicationData.driving_experience.map((exp, idx) => (
                <div key={idx}>
                  {exp.class_of_equipment} - {exp.type} ({exp.date_from} to {exp.date_to || 'Present'})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety History */}
        <div className="border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Safety History</h3>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Accidents (past 3 years):</span>{' '}
              {applicationData.accidents && applicationData.accidents.length > 0 ?
                `${applicationData.accidents.length} reported` : 'None'}
            </div>
            <div>
              <span className="font-medium">Traffic Convictions (past 3 years):</span>{' '}
              {applicationData.traffic_convictions && applicationData.traffic_convictions.length > 0 ?
                `${applicationData.traffic_convictions.length} reported` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 text-red-700">
          {submitError}
        </div>
      )}

      {/* PDF Download Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-primary/30 dark:border-primary/40 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Download Application Preview
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Download a PDF preview of your complete application before signing and submitting.
              This allows you to review all information one final time.
            </p>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg transition-colors hover:bg-primary-dark transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF Preview
            </button>
          </div>
        </div>
      </div>

      {/* Certification Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Final Certification (49 CFR 391.21)</h3>
          <p className="text-sm text-neutral-900 dark:text-white mb-4">
            I certify that this application was completed by me, and that all entries on it and information
            in it are true and complete to the best of my knowledge. I understand that falsification of any
            information may result in the refusal to hire me or immediate discharge.
          </p>

          <div className="flex items-start mb-4">
            <input
              {...register('certify')}
              type="checkbox"
              id="certify"
              className="mt-1 h-4 w-4 text-primary focus:ring-primary focus:ring-primary border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded"
            />
            <label htmlFor="certify" className="ml-3 text-sm text-neutral-900 dark:text-white">
              I certify that all information provided in this application is true and correct *
            </label>
          </div>
          {errors.certify && (
            <p className="text-red-600 text-sm mb-4">{errors.certify.message}</p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Print Full Name *
            </label>
            <input
              {...register('certification_name_printed')}
              type="text"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md"
            />
            {errors.certification_name_printed && (
              <p className="text-red-600 text-sm mt-1">{errors.certification_name_printed.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Signature *
            </label>
            <div className="border-2 border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
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
                className="text-sm text-primary hover:text-blue-700"
              >
                Clear Signature
              </button>
              <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary">Sign with your mouse or finger</p>
            </div>
            {signatureError && (
              <p className="text-red-600 text-sm mt-1">{signatureError}</p>
            )}
          </div>

          <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mt-4">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Honeypot field - hidden from real users but visible to bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company_website">Company Website (leave blank)</label>
          <input
            type="text"
            id="company_website"
            name="company_website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="px-6 py-3 border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white transition-colors  font-semibold rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

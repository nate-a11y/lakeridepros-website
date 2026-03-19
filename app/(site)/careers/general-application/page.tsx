'use client'

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Upload, X } from 'lucide-react'
import Turnstile from '@/components/Turnstile'

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const applicationSchema = z.object({
  positions: z.array(z.string()).min(1, 'Please select at least one position'),
  fullName: z.string().min(1, 'Full name is required').max(200),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  cityState: z.string().min(1, 'City, State is required').max(200),
  howDidYouHear: z.string().max(500).optional(),
  aboutYourself: z.string().min(1, 'Please tell us about yourself').max(5000),
  workExperience: z.string().min(1, 'Please provide your work experience').max(5000),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export default function GeneralApplicationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      positions: [],
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      howDidYouHear: '',
      aboutYourself: '',
      workExperience: '',
    },
  })

  const selectedPositions = watch('positions')

  const handlePositionChange = (position: string) => {
    const current = selectedPositions || []
    if (current.includes(position)) {
      setValue('positions', current.filter((p) => p !== position), { shouldValidate: true })
    } else {
      setValue('positions', [...current, position], { shouldValidate: true })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (!file) {
      setResumeFile(null)
      return
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError('Please upload a .pdf, .doc, or .docx file')
      setResumeFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File must be under 5MB')
      setResumeFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setResumeFile(file)
  }

  const removeFile = () => {
    setResumeFile(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:...;base64, prefix
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!turnstileToken) {
      setSubmitError('Please complete the security verification')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let resumeBase64: string | undefined
      let resumeFileName: string | undefined

      if (resumeFile) {
        resumeBase64 = await fileToBase64(resumeFile)
        resumeFileName = resumeFile.name
      }

      const response = await fetch('/api/careers/general-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          turnstileToken,
          resumeBase64,
          resumeFileName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }

      setIsSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-8 sm:p-12 text-center transition-colors">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
              Thank you for your interest in joining the Lake Ride Pros team.
            </p>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
              Someone from our team will be in touch within 2-3 business days.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const inputBaseClass =
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary transition-colors'
  const inputNormalClass =
    'border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-bg-primary text-neutral-900 dark:text-white'
  const inputErrorClass = 'border-red-500'

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8" role="banner">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Sales &amp; Brand Ambassador Application
          </h1>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
            Help grow the Lake Ride Pros brand across the Lake of the Ozarks area.
          </p>
        </header>

        {/* Form Card */}
        <main
          className="bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-dark-border rounded-lg p-6 sm:p-8 transition-colors"
          role="main"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
            aria-label="Sales and Brand Ambassador application form"
          >
            {/* Position Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                Position(s) of Interest *
              </legend>
              <div className="flex flex-wrap gap-4">
                {['Sales', 'Brand Ambassador'].map((position) => (
                  <label
                    key={position}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPositions?.includes(position) || false}
                      onChange={() => handlePositionChange(position)}
                      className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 dark:border-dark-border rounded"
                      aria-describedby={errors.positions ? 'positions-error' : undefined}
                    />
                    <span className="text-sm text-neutral-900 dark:text-white">{position}</span>
                  </label>
                ))}
              </div>
              {errors.positions && (
                <p id="positions-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.positions.message}
                </p>
              )}
            </fieldset>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Full Name *
              </label>
              <input
                {...register('fullName')}
                type="text"
                id="fullName"
                autoComplete="name"
                className={`${inputBaseClass} ${errors.fullName ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Phone *
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                className={`${inputBaseClass} ${errors.phone ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* City, State */}
            <div>
              <label htmlFor="cityState" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                City, State *
              </label>
              <input
                {...register('cityState')}
                type="text"
                id="cityState"
                placeholder="Osage Beach, MO"
                className={`${inputBaseClass} ${errors.cityState ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.cityState ? 'true' : 'false'}
                aria-describedby={errors.cityState ? 'cityState-error' : undefined}
              />
              {errors.cityState && (
                <p id="cityState-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.cityState.message}
                </p>
              )}
            </div>

            {/* How did you hear about us? */}
            <div>
              <label htmlFor="howDidYouHear" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                How did you hear about us?
              </label>
              <input
                {...register('howDidYouHear')}
                type="text"
                id="howDidYouHear"
                className={`${inputBaseClass} ${inputNormalClass}`}
              />
            </div>

            {/* Tell us about yourself */}
            <div>
              <label htmlFor="aboutYourself" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Tell us about yourself *
              </label>
              <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
                Brief summary of your background, relevant experience, and why you&apos;d be a great fit.
              </p>
              <textarea
                {...register('aboutYourself')}
                id="aboutYourself"
                rows={5}
                className={`${inputBaseClass} ${errors.aboutYourself ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.aboutYourself ? 'true' : 'false'}
                aria-describedby={errors.aboutYourself ? 'aboutYourself-error' : undefined}
              />
              {errors.aboutYourself && (
                <p id="aboutYourself-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.aboutYourself.message}
                </p>
              )}
            </div>

            {/* Previous Work Experience */}
            <div>
              <label htmlFor="workExperience" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Previous Work Experience *
              </label>
              <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
                List your most recent positions (company, role, dates).
              </p>
              <textarea
                {...register('workExperience')}
                id="workExperience"
                rows={5}
                className={`${inputBaseClass} ${errors.workExperience ? inputErrorClass : inputNormalClass}`}
                aria-invalid={errors.workExperience ? 'true' : 'false'}
                aria-describedby={errors.workExperience ? 'workExperience-error' : undefined}
              />
              {errors.workExperience && (
                <p id="workExperience-error" className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {errors.workExperience.message}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Resume Upload <span className="text-lrp-text-secondary dark:text-dark-text-secondary font-normal">(optional)</span>
              </label>
              <p className="text-xs text-lrp-text-secondary dark:text-dark-text-secondary mb-2">
                Accepted formats: .pdf, .doc, .docx (max 5MB)
              </p>

              {resumeFile ? (
                <div className="flex items-center gap-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-md">
                  <Upload className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-neutral-900 dark:text-white truncate flex-grow">
                    {resumeFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label="Remove uploaded resume"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-lrp-text-secondary dark:text-dark-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer file:transition-colors"
                />
              )}
              {fileError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
                  {fileError}
                </p>
              )}
            </div>

            {/* Turnstile */}
            <div className="flex justify-center">
              <Turnstile
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md" role="alert">
                <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed text-white'
                    : 'bg-primary text-lrp-black hover:bg-primary-dark'
                }`}
                aria-label={isSubmitting ? 'Submitting application' : 'Submit application'}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </main>

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-lrp-text-secondary dark:text-dark-text-secondary" role="contentinfo">
          <p>
            Questions? Contact us at{' '}
            <a
              href="mailto:owners@lakeridepros.com"
              className="text-primary hover:text-primary-dark underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              owners@lakeridepros.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

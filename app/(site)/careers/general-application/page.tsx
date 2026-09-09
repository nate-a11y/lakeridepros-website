'use client'

import styles from '@/components/support-editorial/SupportEditorial.module.css'
import React, { useState, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { GENERAL_APPLICATION_POSITIONS, ROLE_QUESTIONS, generalApplicationSchema, type GeneralApplicationFormData } from '@/lib/validation/general-application'
import { CheckCircle, Upload, X } from 'lucide-react'
import Turnstile from '@/components/Turnstile'
import GeneralApplicationDetails from '@/components/careers/GeneralApplicationDetails'

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

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
    control,
  } = useForm<GeneralApplicationFormData>({
    resolver: zodResolver(generalApplicationSchema),
    defaultValues: {
      positions: [],
      availability: '',
      earliestStartDate: '',
      detailingExperience: '',
      detailingApproach: '',
      dispatchExperience: '',
      dispatchScenario: '',
      otherPosition: '',
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      howDidYouHear: '',
      socialFacebook: '',
      socialInstagram: '',
      socialX: '',
      socialTikTok: '',
      aboutYourself: '',
      workExperience: '',
    },
  })

  const selectedPositions = useWatch({ control, name: 'positions' })

  const handlePositionChange = (position: GeneralApplicationFormData['positions'][number]) => {
    const current = selectedPositions || []
    if (current.includes(position)) {
      for (const question of ROLE_QUESTIONS.filter(question => question.role === position)) {
        setValue(question.name, '', { shouldValidate: false })
      }
      if (position === 'Other') setValue('otherPosition', '', { shouldValidate: false })
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

  const onSubmit = async (data: GeneralApplicationFormData) => {
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
      <div className={`${styles.page} ${styles.forms}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-neutral-200 rounded-lg p-8 sm:p-12 text-center transition-colors">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-lrp-text-secondary mb-2">
              Thank you for your interest in joining the Lake Ride Pros team.
            </p>
            <p className="text-lrp-text-secondary">
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
    'border-neutral-300  bg-white  text-neutral-900 '
  const inputErrorClass = 'border-red-500'

  return (
    <div className={`${styles.page} ${styles.forms}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            General Application
          </h1>
          <p className="text-lg text-lrp-text-secondary">
            Join our team in detailing, dispatch, sales, brand ambassador, or another non-driving role.
          </p>
          <p className="mt-3 text-sm text-lrp-text-secondary">
            Interested in driving? Use our{' '}
            <Link href="/careers/driver-application" className="underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">driver application</Link>.
          </p>
        </header>

        {/* Form Card */}
        <section
          className={styles.formPanel}

        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
            aria-label="General employment application form"
          >
            {/* Position Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-neutral-900 mb-2">
                Position(s) of Interest *
              </legend>
              <div className="flex flex-wrap gap-4">
                {GENERAL_APPLICATION_POSITIONS.map((position) => (
                  <label
                    key={position}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPositions?.includes(position) || false}
                      onChange={() => handlePositionChange(position)}
                      className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                      aria-describedby={errors.positions ? 'positions-error' : undefined}
                    />
                    <span className="text-sm text-neutral-900">{position}</span>
                  </label>
                ))}
              </div>
              {errors.positions && (
                <p id="positions-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.positions.message}
                </p>
              )}
            </fieldset>

            {selectedPositions?.includes('Other') && (
              <div>
                <label htmlFor="otherPosition" className="block text-sm font-medium text-neutral-900 mb-1">Other position of interest *</label>
                <input
                  {...register('otherPosition')}
                  id="otherPosition"
                  type="text"
                  maxLength={200}
                  className={`${inputBaseClass} ${errors.otherPosition ? inputErrorClass : inputNormalClass}`}
                  aria-invalid={errors.otherPosition ? 'true' : 'false'}
                  aria-describedby={errors.otherPosition ? 'otherPosition-error' : undefined}
                />
                {errors.otherPosition && <p id="otherPosition-error" className="text-red-600 text-sm mt-1" role="alert">{errors.otherPosition.message}</p>}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-900 mb-1">
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
                <p id="fullName-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">
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
                <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-900 mb-1">
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
                <p id="phone-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* City, State */}
            <div>
              <label htmlFor="cityState" className="block text-sm font-medium text-neutral-900 mb-1">
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
                <p id="cityState-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.cityState.message}
                </p>
              )}
            </div>

            {/* How did you hear about us? */}
            <div>
              <label htmlFor="howDidYouHear" className="block text-sm font-medium text-neutral-900 mb-1">
                How did you hear about us?
              </label>
              <input
                {...register('howDidYouHear')}
                type="text"
                id="howDidYouHear"
                className={`${inputBaseClass} ${inputNormalClass}`}
              />
            </div>

            {/* Social Media Handles */}
            <fieldset>
              <legend className="block text-sm font-medium text-neutral-900 mb-3">
                Social Media Handles <span className="text-lrp-text-secondary font-normal">(optional)</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="socialFacebook" className="block text-xs text-lrp-text-secondary mb-1">
                    Facebook
                  </label>
                  <input
                    {...register('socialFacebook')}
                    type="text"
                    id="socialFacebook"
                    placeholder="@yourname"
                    className={`${inputBaseClass} ${inputNormalClass}`}
                  />
                </div>
                <div>
                  <label htmlFor="socialInstagram" className="block text-xs text-lrp-text-secondary mb-1">
                    Instagram
                  </label>
                  <input
                    {...register('socialInstagram')}
                    type="text"
                    id="socialInstagram"
                    placeholder="@yourhandle"
                    className={`${inputBaseClass} ${inputNormalClass}`}
                  />
                </div>
                <div>
                  <label htmlFor="socialX" className="block text-xs text-lrp-text-secondary mb-1">
                    X (Twitter)
                  </label>
                  <input
                    {...register('socialX')}
                    type="text"
                    id="socialX"
                    placeholder="@yourhandle"
                    className={`${inputBaseClass} ${inputNormalClass}`}
                  />
                </div>
                <div>
                  <label htmlFor="socialTikTok" className="block text-xs text-lrp-text-secondary mb-1">
                    TikTok
                  </label>
                  <input
                    {...register('socialTikTok')}
                    type="text"
                    id="socialTikTok"
                    placeholder="@yourhandle"
                    className={`${inputBaseClass} ${inputNormalClass}`}
                  />
                </div>
              </div>
            </fieldset>

            <GeneralApplicationDetails register={register} errors={errors} positions={selectedPositions || []} />

            {/* Tell us about yourself */}
            <div>
              <label htmlFor="aboutYourself" className="block text-sm font-medium text-neutral-900 mb-1">
                Tell us about yourself *
              </label>
              <p className="text-xs text-lrp-text-secondary mb-2">
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
                <p id="aboutYourself-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.aboutYourself.message}
                </p>
              )}
            </div>

            {/* Previous Work Experience */}
            <div>
              <label htmlFor="workExperience" className="block text-sm font-medium text-neutral-900 mb-1">
                Previous Work Experience *
              </label>
              <p className="text-xs text-lrp-text-secondary mb-2">
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
                <p id="workExperience-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.workExperience.message}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-neutral-900 mb-1">
                Resume Upload <span className="text-lrp-text-secondary font-normal">(optional)</span>
              </label>
              <p className="text-xs text-lrp-text-secondary mb-2">
                Accepted formats: .pdf, .doc, .docx (max 5MB)
              </p>

              {resumeFile ? (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <Upload className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-neutral-900 truncate flex-grow">
                    {resumeFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-neutral-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
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
                  className="block w-full text-sm text-lrp-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer file:transition-colors"
                />
              )}
              {fileError && (
                <p className="text-red-600 text-sm mt-1" role="alert">
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-neutral-400  cursor-not-allowed text-white'
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
        </section>

        {/* Footer Info */}
        <footer className="mt-8 text-center text-sm text-lrp-text-secondary">
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

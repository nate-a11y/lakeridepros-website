'use client'

/**
 * Application Status Tracking Page
 * Allows applicants to check their driver application status
 * Route: /careers/application-status
 */

import styles from '@/components/support-editorial/SupportEditorial.module.css'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, CheckCircle2, Clock, Eye, XCircle, Mail, Phone } from 'lucide-react'

const statusLookupSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  email: z.string().email('Valid email is required')
})

type StatusLookupFormData = z.infer<typeof statusLookupSchema>

interface ApplicationStatus {
  id: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  created_at: string
  submitted_at?: string
  first_name: string
  last_name: string
  email: string
}

const STATUS_INFO = {
  draft: {
    icon: Clock,
    color: 'gray',
    label: 'Draft',
    description: 'Application not yet submitted'
  },
  submitted: {
    icon: CheckCircle2,
    color: 'blue',
    label: 'Submitted',
    description: 'Application received and awaiting review'
  },
  under_review: {
    icon: Eye,
    color: 'yellow',
    label: 'Under Review',
    description: 'Our hiring team is reviewing your application'
  },
  approved: {
    icon: CheckCircle2,
    color: 'green',
    label: 'Approved',
    description: 'Application approved - We will contact you soon'
  },
  rejected: {
    icon: XCircle,
    color: 'red',
    label: 'Not Selected',
    description: 'Thank you for your interest'
  }
}

export default function ApplicationStatusPage() {
  const [application, setApplication] = useState<ApplicationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<StatusLookupFormData>({
    resolver: zodResolver(statusLookupSchema)
  })

  const onSubmit = async (data: StatusLookupFormData) => {
    setIsLoading(true)
    setError(null)
    setApplication(null)

    try {
      const response = await fetch('/api/driver-application/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch application status')
      }

      const appData = await response.json()
      setApplication(appData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch application')
    } finally {
      setIsLoading(false)
    }
  }

  const renderTimeline = () => {
    if (!application) return null

    const currentStatus = application.status
    const statuses: Array<keyof typeof STATUS_INFO> = ['submitted', 'under_review', 'approved']

    // If rejected, show different timeline
    if (currentStatus === 'rejected') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center transition-colors">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Application Not Selected</h2>
          <p className="text-red-700">
            Thank you for your interest in joining Lake Ride Pros. We have carefully reviewed your application
            and have decided to move forward with other candidates at this time.
          </p>
          <p className="text-red-700 mt-4">
            We encourage you to apply again in the future if you continue to be interested in opportunities with us.
          </p>
        </div>
      )
    }

    const currentIndex = statuses.indexOf(currentStatus)

    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-8 transition-colors">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6 text-center">Application Progress</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className={`${styles.timelineLine} absolute top-8 left-8 right-8 h-1 bg-neutral-200`} />
          <div
            className={`${styles.timelineLine} absolute top-8 left-8 h-1 bg-primary transition-all duration-500`}
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (statuses.length - 1)) * (100 - 8)}%` : '0%'
            }}
          />

          {/* Timeline steps */}
          <div className={styles.timeline}>
            {statuses.map((status, index) => {
              const StatusIcon = STATUS_INFO[status].icon
              const isActive = index <= currentIndex
              const isCurrent = status === currentStatus

              return (
                <div key={status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      isActive
                        ? 'bg-primary border-primary text-lrp-black'
                        : 'bg-white  border-neutral-300  text-neutral-400 '
                    } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                  >
                    <StatusIcon className="w-8 h-8" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className={`font-semibold ${isActive ? 'text-primary ' : 'text-lrp-text-muted '}`}>
                      {STATUS_INFO[status].label}
                    </p>
                    <p className="text-xs text-lrp-text-secondary mt-1 max-w-[120px]">
                      {STATUS_INFO[status].description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Status Message */}
        <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-4 transition-colors">
          <p className="text-sm font-medium text-neutral-900">
            {currentStatus === 'submitted' && 'Your application has been received and is in our queue for review.'}
            {currentStatus === 'under_review' && 'Our hiring team is currently reviewing your application and qualifications.'}
            {currentStatus === 'approved' && 'Congratulations! Your application has been approved. We will contact you soon to discuss next steps.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.page} ${styles.forms}`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Check Application Status
          </h1>
          <p className="text-lrp-text-secondary">
            Enter your application ID and email to view your current status
          </p>
        </header>

        {/* Lookup Form */}
        <div className={`${styles.formPanel} mb-8`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="applicationId" className="block text-sm font-medium text-neutral-900 mb-1">
                Application ID *
              </label>
              <input
                {...register('applicationId')}
                type="text"
                id="applicationId"
                aria-invalid={!!errors.applicationId}
                aria-describedby={errors.applicationId ? "applicationId-error applicationId-help" : "applicationId-help"}
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white  text-neutral-900  transition-colors ${
                  errors.applicationId ? 'border-red-500' : 'border-neutral-300 '
                }`}
              />
              {errors.applicationId && (
                <p id="applicationId-error" role="alert" className="text-red-600 text-sm mt-1">{errors.applicationId.message}</p>
              )}
              <p id="applicationId-help" className="text-xs text-lrp-text-muted mt-1">
                You received this ID when you submitted your application
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-1">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error email-help" : "email-help"}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-white  text-neutral-900  transition-colors ${
                  errors.email ? 'border-red-500' : 'border-neutral-300 '
                }`}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
              <p id="email-help" className="text-xs text-lrp-text-muted mt-1">
                The email you used when applying
              </p>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-300 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-lrp-black font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </button>
          </form>
        </div>

        {/* Application Details */}
        {application && (
          <div className="space-y-6" role="status" aria-live="polite">
            {/* Applicant Info */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 transition-colors">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-neutral-900">
                  <span className="font-medium text-lrp-text-secondary">Applicant:</span>{' '}
                  {application.first_name} {application.last_name}
                </div>
                <div className="text-neutral-900">
                  <span className="font-medium text-lrp-text-secondary">Email:</span>{' '}
                  {application.email}
                </div>
                <div className="text-neutral-900">
                  <span className="font-medium text-lrp-text-secondary">Application ID:</span>{' '}
                  <code className="text-xs bg-neutral-100 px-2 py-1 rounded break-all">{application.id}</code>
                </div>
                <div className="text-neutral-900">
                  <span className="font-medium text-lrp-text-secondary">Submitted:</span>{' '}
                  {application.submitted_at
                    ? new Date(application.submitted_at).toLocaleDateString()
                    : 'Not submitted'}
                </div>
              </div>
            </div>

            {/* Timeline */}
            {renderTimeline()}

            {/* Contact Info */}
            <div className="bg-neutral-50 rounded-lg p-6 transition-colors">
              <h2 className="font-semibold text-neutral-900 mb-4">Questions about your application?</h2>
              <div className="space-y-3">
                <a
                  href="mailto:owners@lakeridepros.com"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  owners@lakeridepros.com
                </a>
                <a
                  href="tel:+15735522628"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  (573) 552-2628
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

/**
 * Driver Application Received - Confirmation Page
 * Displayed after successful submission of driver application
 */

import styles from '@/components/support-editorial/SupportEditorial.module.css'
import React, { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

function ApplicationReceivedContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get('id')
  const [copied, setCopied] = useState(false)

  const copyApplicationId = () => {
    if (applicationId) {
      navigator.clipboard.writeText(applicationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`${styles.page} ${styles.forms}`}>
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className={`${styles.formPanel} ${styles.confirmation}`}>
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Application Received!
          </h1>

          <p className="text-lg text-lrp-text-secondary mb-6">
            Thank you for submitting your driver employment application.
            We have received your application and will review it shortly.
          </p>

          {/* Application ID */}
          {applicationId && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-8 transition-colors">
              <p className="text-sm font-medium text-neutral-900 mb-2">
                Your Application ID
              </p>
              <div className={styles.idRow}>
                <code className="text-lg font-mono text-primary bg-white px-4 py-2 rounded border border-primary/30">
                  {applicationId}
                </code>
                <button
                  onClick={copyApplicationId}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-lrp-text-secondary mt-2">
                Save this ID for your records. You'll receive a confirmation email and SMS shortly.
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              What Happens Next?
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Email & SMS Confirmation</p>
                  <p className="text-sm text-lrp-text-secondary">
                    You'll receive a confirmation email and text message with your application details.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Application Review</p>
                  <p className="text-sm text-lrp-text-secondary">
                    Our hiring team will review your application and documents within 2-3 business days.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Background & License Verification</p>
                  <p className="text-sm text-lrp-text-secondary">
                    We'll verify your driving record and conduct necessary background checks as authorized.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Interview</p>
                  <p className="text-sm text-lrp-text-secondary">
                    If your application meets our requirements, we'll contact you to schedule an interview.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact Information */}
          <div className="bg-neutral-50 rounded-lg p-6 mb-8 transition-colors">
            <h3 className="font-semibold text-neutral-900 mb-4">Questions?</h3>
            <div className="space-y-3">
              <a
                href="mailto:owners@lakeridepros.com"
                className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <Mail className="w-5 h-5" />
                owners@lakeridepros.com
              </a>
              <a
                href="tel:+15735522628"
                className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors"
              >
                <Phone className="w-5 h-5" />
                (573) 552-2628
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers/application-status"
              className="px-6 py-3 bg-primary text-lrp-black font-medium rounded-md hover:bg-primary-dark transition-colors"
            >
              Track Application Status
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-neutral-300 text-neutral-900 font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/careers/driver-application"
              className="px-6 py-3 border border-neutral-300 text-neutral-900 font-medium rounded-md hover:bg-neutral-50 transition-colors"
            >
              View Other Positions
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-lrp-text-muted">
          <p>
            Lake Ride Pros is an equal opportunity employer committed to diversity and inclusion.
          </p>
          <p className="mt-2">
            All employment decisions are made without regard to race, color, religion, sex, national origin,
            age, disability, veteran status, or any other legally protected status.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ApplicationReceivedPage() {
  return (
    <Suspense fallback={
      <div className={`${styles.page} ${styles.forms}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lrp-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <ApplicationReceivedContent />
    </Suspense>
  )
}

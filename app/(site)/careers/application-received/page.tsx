'use client'

/**
 * Driver Application Received - Confirmation Page
 * Displayed after successful submission of driver application
 */

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Application Received!
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Thank you for submitting your driver employment application.
            We have received your application and will review it shortly.
          </p>

          {/* Application ID */}
          {applicationId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Your Application ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-lg font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-4 py-2 rounded border border-blue-300 dark:border-blue-700">
                  {applicationId}
                </code>
                <button
                  onClick={copyApplicationId}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                Save this ID for your records. You'll receive a confirmation email and SMS shortly.
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What Happens Next?
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email & SMS Confirmation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll receive a confirmation email and text message with your application details.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Application Review</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our hiring team will review your application and documents within 2-3 business days.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Background & License Verification</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll verify your driving record and conduct necessary background checks as authorized.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Interview</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If your application meets our requirements, we'll contact you to schedule an interview.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Questions?</h3>
            <div className="space-y-3">
              <a
                href="mailto:owners@lakeridepros.com"
                className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <Mail className="w-5 h-5" />
                owners@lakeridepros.com
              </a>
              <a
                href="tel:+15735522628"
                className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Track Application Status
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Other Positions
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ApplicationReceivedContent />
    </Suspense>
  )
}

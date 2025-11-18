'use client'

/**
 * Driver Application Received - Confirmation Page
 * Displayed after successful submission of driver application
 */

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Download, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationReceivedPage() {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Received!
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Thank you for submitting your driver employment application.
            We have received your application and will review it shortly.
          </p>

          {/* Application ID */}
          {applicationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Your Application ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-lg font-mono text-blue-700 bg-white px-4 py-2 rounded border border-blue-300">
                  {applicationId}
                </code>
                <button
                  onClick={copyApplicationId}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Save this ID for your records. You'll receive a confirmation email and SMS shortly.
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="text-left mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What Happens Next?
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email & SMS Confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email and text message with your application details.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Application Review</p>
                  <p className="text-sm text-gray-600">
                    Our hiring team will review your application and documents within 2-3 business days.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Background & License Verification</p>
                  <p className="text-sm text-gray-600">
                    We'll verify your driving record and conduct necessary background checks as authorized.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Interview</p>
                  <p className="text-sm text-gray-600">
                    If your application meets our requirements, we'll contact you to schedule an interview.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Questions?</h3>
            <div className="space-y-3">
              <a
                href="mailto:owners@lakeridepros.com"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-5 h-5" />
                owners@lakeridepros.com
              </a>
              <a
                href="tel:+15735522628"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
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
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              View Other Positions
            </Link>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
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

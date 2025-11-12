'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Product page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Unable to Load Product
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8">
            We're having trouble loading this product right now. This could be due to a temporary
            network issue or server problem.
          </p>

          {/* Error Details (dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg p-4 mb-8 text-left">
              <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Shop
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-8">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-lrp-green hover:underline">
              contact us
            </Link>
            {' '}for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

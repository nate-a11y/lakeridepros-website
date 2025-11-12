'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Gift, Mail, Download, Loader2 } from 'lucide-react'

function GiftCardSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [giftCardData, setGiftCardData] = useState<any>(null)

  useEffect(() => {
    async function fetchGiftCardDetails() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        // Fetch session details to get gift card info
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        const data = await response.json()
        setGiftCardData(data)
      } catch (error) {
        console.error('Error fetching gift card details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGiftCardDetails()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg-primary flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-lrp-green animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-lrp-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Gift Card Purchased!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Your Lake Ride Pros gift card has been created and sent via email.
          </p>
        </div>

        {/* What's Next Card */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border dark:border-dark-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lrp-green/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-lrp-green" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                  Check Your Email
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Your gift card code has been sent to{' '}
                  {giftCardData?.customerEmail || 'your email address'}.
                  The email includes your unique gift card code and instructions for redemption.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lrp-green/10 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-lrp-green" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                  Share with Recipient
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  If you purchased this as a gift, the recipient will receive their own email
                  with the gift card code and your personal message.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lrp-green/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-lrp-green" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                  Never Expires
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Your gift card never expires and can be used for any Lake Ride Pros service
                  at Lake of the Ozarks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Redeem */}
        <div className="bg-lrp-green/10 border-2 border-lrp-green rounded-lg p-6 mb-8">
          <h3 className="font-bold text-neutral-900 dark:text-white mb-4">
            How to Redeem Your Gift Card:
          </h3>
          <ol className="space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>1. Call us at (573) 206-9499 to book your ride</li>
            <li>2. Provide your gift card code when booking</li>
            <li>3. Enjoy luxury transportation at Lake of the Ozarks!</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/gift-card-balance"
            className="flex-1 bg-lrp-green hover:bg-lrp-green-dark text-white text-center py-4 rounded-lg font-bold transition-all"
          >
            Check Balance
          </Link>
          <Link
            href="/gift-cards"
            className="flex-1 border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary text-neutral-900 dark:text-white text-center py-4 rounded-lg font-bold transition-all"
          >
            Buy Another Gift Card
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            Questions about your gift card?
          </p>
          <a
            href="mailto:contactus@lakeridepros.com"
            className="text-lrp-green hover:text-lrp-green-dark font-semibold"
          >
            Contact Us: contactus@lakeridepros.com
          </a>
        </div>
      </div>
    </div>
  )
}

export default function GiftCardSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-dark-bg-primary flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-lrp-green animate-spin" />
        </div>
      }
    >
      <GiftCardSuccessContent />
    </Suspense>
  )
}

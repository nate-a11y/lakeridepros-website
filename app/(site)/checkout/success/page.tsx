'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<any>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart
    clearCart()

    // Fetch order details from session
    async function fetchOrderDetails() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        const data = await response.json()
        setOrderData(data)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, clearCart])

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
            Order Confirmed!
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Thank you for your purchase from Lake Ride Pros!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg border dark:border-dark-border p-8 mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            What's Next?
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
                  We've sent a confirmation email with your order details to{' '}
                  {orderData?.customerEmail || 'your email address'}.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lrp-green/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-lrp-green" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                  Order Processing
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Your order is being prepared for shipment. You'll receive a tracking number
                  via email within 1-2 business days.
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
                  Estimated Delivery
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  7-14 business days from order date
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session ID (for testing) */}
        {sessionId && (
          <div className="bg-neutral-100 dark:bg-dark-bg-primary rounded-lg p-4 mb-8">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Order Reference:</strong> {sessionId.slice(0, 20)}...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 bg-lrp-green hover:bg-lrp-green-dark text-white text-center py-4 rounded-lg font-bold transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary text-neutral-900 dark:text-white text-center py-4 rounded-lg font-bold transition-all"
          >
            Back to Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
            Questions about your order?
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-dark-bg-primary flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-lrp-green animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}

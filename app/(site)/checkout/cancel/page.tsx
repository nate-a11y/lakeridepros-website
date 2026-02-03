import Link from 'next/link'
import { XCircle, ShoppingCart } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary py-20">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-neutral-200 dark:bg-dark-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-neutral-600 dark:text-neutral-400" />
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Your order was not completed. Your cart items are still saved.
        </p>

        <div className="bg-lrp-green/10 border-2 border-lrp-green rounded-lg p-6 mb-8">
          <p className="text-neutral-700 dark:text-neutral-300">
            If you experienced any issues during checkout, please{' '}
            <a
              href="mailto:contactus@lakeridepros.com"
              className="text-lrp-green hover:text-lrp-green-dark font-semibold underline"
            >
              contact us
            </a>{' '}
            and we'll be happy to help!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 bg-lrp-green hover:bg-lrp-green-dark text-white px-8 py-4 rounded-lg font-bold transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Return to Cart
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border-2 border-neutral-300 dark:border-dark-border hover:bg-neutral-100 dark:hover:bg-dark-bg-secondary text-neutral-900 dark:text-white px-8 py-4 rounded-lg font-bold transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

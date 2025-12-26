import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Return Policy | Lake Ride Pros',
  description: 'Return and refund policy for Lake Ride Pros merchandise and products.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/return-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-boardson text-4xl md:text-5xl font-bold text-white text-center">
            Return Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8">
            <strong>Effective Date:</strong> January 1, 2025
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            All Sales Are Final
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            All merchandise and products purchased through the Lake Ride Pros online shop are sold on a final sale basis.
            We do not offer refunds, returns, or exchanges on any products.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Why No Returns?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Many of our products are custom-made, printed on demand, or personalized items. Due to the nature of these
            products, we are unable to accept returns or process refunds once an order has been placed.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Damaged or Defective Items
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            If you receive a damaged or defective item, please contact us within 7 days of delivery at{' '}
            <a
              href="mailto:contactus@lakeridepros.com"
              className="text-primary hover:text-primary-dark"
            >
              contactus@lakeridepros.com
            </a>
            {' '}with photos of the damage. We will review your case and may offer a replacement at our discretion.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Order Cancellations
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Orders cannot be cancelled once placed, as production begins immediately. Please review your order carefully
            before completing your purchase.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Gift Cards
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Gift cards are non-refundable and cannot be exchanged for cash. Gift cards do not expire.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Transportation Services
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            This return policy applies only to merchandise and products purchased through our online shop.
            For information about cancellation policies for transportation services, please visit our{' '}
            <Link href="/terms-of-service" className="text-primary hover:text-primary-dark">
              Terms of Service
            </Link>
            {' '}or contact us directly.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            Questions?
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            If you have any questions about this policy, please contact us:
          </p>
          <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-6">
            <li>
              Email:{' '}
              <a
                href="mailto:contactus@lakeridepros.com"
                className="text-primary hover:text-primary-dark"
              >
                contactus@lakeridepros.com
              </a>
            </li>
            <li>
              Phone:{' '}
              <a
                href="tel:+15732069499"
                className="text-primary hover:text-primary-dark"
              >
                (573) 206-9499
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            href="/shop"
            className="inline-block bg-primary hover:bg-primary-dark text-lrp-black px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    </div>
  )
}

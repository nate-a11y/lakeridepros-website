import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, FileText, Shield, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Lake Ride Pros',
  description: 'Lake Ride Pros terms of service and booking conditions.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Header */}
      <div className="bg-lrp-green py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Terms of Service
          </h1>
          <p className="text-white/90 text-center mt-4">
            Booking Terms & Conditions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Main Notice */}
        <div className="bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-8 mb-12">
          <div className="flex items-start gap-4">
            <FileText className="w-8 h-8 text-lrp-green flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-lrp-black dark:text-white mb-4">
                Booking Terms & Conditions
              </h2>
              <p className="text-lrp-black dark:text-dark-text-secondary mb-6">
                Our transportation booking terms and conditions are managed through our booking platform partner, Moovs.
                By booking any transportation service with Lake Ride Pros, you agree to these terms.
              </p>
              <a
                href="https://customer.moovs.app/lake-ride-pros/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-lrp-green hover:bg-lrp-green-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                View Full Terms & Conditions
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Key Points Summary */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Key Terms Summary
          </h2>
          <p className="text-lrp-black dark:text-dark-text-secondary mb-6">
            While the complete terms are available through the link above, here are some key points:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cancellation Policy */}
            <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-lrp-green" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white">
                  Cancellation Policy
                </h3>
              </div>
              <ul className="space-y-2 text-lrp-black dark:text-dark-text-secondary">
                <li>• 48+ hours: Full refund (minus processing fee)</li>
                <li>• 24-48 hours: 50% refund</li>
                <li>• Less than 24 hours: No refund</li>
                <li>• Weather exceptions apply</li>
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-lrp-green" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white">
                  Payment & Pricing
                </h3>
              </div>
              <ul className="space-y-2 text-lrp-black dark:text-dark-text-secondary">
                <li>• Payment required at booking</li>
                <li>• Prices subject to availability</li>
                <li>• Additional charges may apply</li>
                <li>• Secure payment processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Policies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Additional Policies
          </h2>

          <div className="space-y-6">
            {/* Passenger Conduct */}
            <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Passenger Conduct
              </h3>
              <p className="text-lrp-black dark:text-dark-text-secondary mb-3">
                All passengers must:
              </p>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-1">
                <li>Treat drivers and vehicles with respect</li>
                <li>Follow driver instructions for safety</li>
                <li>Not smoke in vehicles</li>
                <li>Not bring illegal substances or weapons</li>
                <li>Be responsible for any damage caused</li>
              </ul>
            </div>

            {/* Age Requirements */}
            <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Age Requirements
              </h3>
              <p className="text-lrp-black dark:text-dark-text-secondary">
                Bookings must be made by someone 18 years or older. Minors must be accompanied by an adult.
                The person making the booking accepts financial responsibility for the reservation.
              </p>
            </div>

            {/* Liability */}
            <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Liability & Insurance
              </h3>
              <p className="text-lrp-black dark:text-dark-text-secondary">
                Lake Ride Pros maintains full commercial liability insurance and all required licenses.
                We are not responsible for personal belongings left in vehicles. Passengers travel at their own risk.
              </p>
            </div>
          </div>
        </div>

        {/* Service Expectations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Service Expectations
          </h2>

          <div className="space-y-6">
            {/* Pickup & Drop-off */}
            <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Pickup & Drop-off
              </h3>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-2">
                <li>Please be ready 5 minutes before scheduled pickup time</li>
                <li>Driver will wait up to 10 minutes before charging a no-show fee</li>
                <li>Provide accurate location details to ensure smooth service</li>
                <li>Contact us immediately if pickup location changes</li>
              </ul>
            </div>

            {/* Vehicle Capacity */}
            <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Vehicle Capacity & Luggage
              </h3>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-2">
                <li>Do not exceed the passenger capacity of your booked vehicle</li>
                <li>Inform us in advance of excessive luggage or special items</li>
                <li>Car seats must be requested at time of booking</li>
                <li>We reserve the right to refuse service if capacity is exceeded</li>
              </ul>
            </div>

            {/* Special Requests */}
            <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border p-6 rounded-lg">
              <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                Special Requests
              </h3>
              <p className="text-lrp-black dark:text-dark-text-secondary mb-3">
                We accommodate special requests when possible, including:
              </p>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-2">
                <li>Wheelchair accessibility (must be requested in advance)</li>
                <li>Car seats for children</li>
                <li>Pet transportation (service animals always welcome)</li>
                <li>Multiple stops (additional charges apply)</li>
              </ul>
              <p className="text-lrp-black dark:text-dark-text-secondary mt-3">
                Please contact us at least 24 hours in advance for special requests to ensure availability.
              </p>
            </div>
          </div>
        </div>

        {/* Gift Cards & Merchandise */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Gift Cards & Merchandise
          </h2>

          <div className="space-y-4">
            <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-lrp-black dark:text-white mb-2">
                Gift Cards
              </h3>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-2">
                <li>Gift cards are non-refundable and cannot be redeemed for cash</li>
                <li>Gift cards do not expire</li>
                <li>Can be used toward any Lake Ride Pros transportation service</li>
                <li>Lost or stolen gift cards cannot be replaced</li>
                <li>Check gift card balance by contacting us</li>
              </ul>
            </div>

            <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-lrp-black dark:text-white mb-2">
                Merchandise Returns
              </h3>
              <ul className="list-disc pl-6 text-lrp-black dark:text-dark-text-secondary space-y-2">
                <li>Returns must be requested within 14 days of delivery</li>
                <li>Items must be unworn and in original condition with tags</li>
                <li>A 20% restocking fee applies to all returns</li>
                <li>Shipping costs are non-refundable</li>
                <li>Contact us to initiate a return</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Dispute Resolution
          </h2>
          <div className="bg-white dark:bg-dark-bg-secondary border border-lrp-gray dark:border-dark-border p-6 rounded-lg">
            <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
              If you have any concerns about our service, please contact us first at{' '}
              <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:text-lrp-green-light">
                contactus@lakeridepros.com
              </a>
              {' '}or{' '}
              <a href="tel:5732069499" className="text-lrp-green hover:text-lrp-green-light">
                (573) 206-9499
              </a>
              . We are committed to resolving any issues promptly and fairly.
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Any disputes that cannot be resolved informally will be governed by the laws of the State
              of Missouri and subject to the exclusive jurisdiction of the courts in Camden County, Missouri.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-6">
            Changes to Terms
          </h2>
          <p className="text-lrp-black dark:text-dark-text-secondary">
            We reserve the right to modify these terms at any time. Changes will be posted on this page
            with an updated revision date. Your continued use of our services after changes are posted
            constitutes acceptance of the modified terms.
          </p>
        </div>

        {/* Related Links */}
        <div className="bg-lrp-green/10 dark:bg-lrp-green/20 rounded-lg p-6 mb-12">
          <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-4">
            Related Policies
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/privacy-policy"
              className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-light font-semibold"
            >
              <FileText className="w-5 h-5" />
              Privacy Policy
            </Link>
            <Link
              href="/accessibility"
              className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-light font-semibold"
            >
              <Shield className="w-5 h-5" />
              Accessibility Statement
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
          <h2 className="text-xl font-bold text-lrp-black dark:text-white mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-lrp-black dark:text-dark-text-secondary mb-4">
            If you have questions about our terms of service or booking conditions, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-neutral-700 dark:text-white">
              <strong>Lake Ride Pros LLC</strong>
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Lake of the Ozarks, Missouri
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Email:{' '}
              <a href="mailto:contactus@lakeridepros.com" className="text-lrp-green hover:text-lrp-green-light">
                contactus@lakeridepros.com
              </a>
            </p>
            <p className="text-lrp-black dark:text-dark-text-secondary">
              Phone:{' '}
              <a href="tel:5732069499" className="text-lrp-green hover:text-lrp-green-light">
                (573) 206-9499
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

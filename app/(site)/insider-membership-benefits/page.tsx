import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insider Membership Benefits - Lake Ride Pros',
  description: 'Unlock VIP benefits with the Lake Ride Pros Insider Membership - from exclusive offers to up to 20% off rides, experience luxury travel at Lake of the Ozarks.',
  keywords: ['insider membership', 'Lake Ride Pros membership', 'transportation benefits', 'member discounts', 'Lake Ozarks VIP', 'luxury travel'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-membership-benefits',
  },
  openGraph: {
    title: 'Insider Membership Benefits - Lake Ride Pros',
    description: 'Unlock VIP benefits with the Lake Ride Pros Insider Membership - from exclusive offers to up to 20% off rides, experience luxury travel at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/insider-membership-benefits',
    siteName: 'Lake Ride Pros',
    type: 'website',
  },
}

export default function InsiderMembershipBenefitsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Insider Membership Benefits
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-semibold">
              Save & Enjoy
            </p>
          </div>
        </div>
      </section>

      {/* Membership Overview Section */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-heading mb-6">
              Exclusive VIP Benefits for Lake Ride Pros Members
            </h2>
            <p className="text-lg text-body mb-8">
              Experience luxury travel at Lake of the Ozarks like never before. As an Insider member, you&apos;ll enjoy exclusive perks, priority service, and savings of up to <strong className="text-primary">20% off</strong> on all your rides.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-heading text-center mb-12">
            Member Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-themed text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Up to 20% Off</h3>
              <p className="text-body-secondary">
                Enjoy significant savings on every ride with member-exclusive discounts.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-themed text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Exclusive Offers</h3>
              <p className="text-body-secondary">
                Access special promotions and deals available only to Insider members.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-themed text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">Priority Booking</h3>
              <p className="text-body-secondary">
                Get first access to booking during peak times and special events.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border border-themed text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-heading mb-2">VIP Treatment</h3>
              <p className="text-body-secondary">
                Experience premium service with personalized attention on every ride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Widget Section */}
      <section className="py-16 bg-section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-heading text-center mb-8">
            Choose Your Membership
          </h2>
          <div
            id="pricify-hosted-pricing-page"
            data-pricify-site="01JH3A1YVSSYZYY4TNPCTMCVB7"
            data-pricify-pricingpage="01JH3A1ZZA7XFPWXCVXEBH0RR4"
            data-pricify-viewport-defaultheight="556px"
          />
        </div>
      </section>

      {/* Terms Link Section */}
      <section className="py-12 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-body-secondary">
            By joining, you agree to our{' '}
            <Link href="/insider-terms-and-conditions" className="text-primary hover:text-primary-dark underline font-semibold">
              Insider Terms and Conditions
            </Link>
          </p>
          <p className="text-muted mt-4">
            Already a member?{' '}
            <Link href="/insider-login" className="text-primary hover:text-primary-dark underline">
              Log in to your account
            </Link>
          </p>
        </div>
      </section>

      {/* Chargebee Pricify Script */}
      <Script
        src="https://js.chargebee.com/atomicpricing/pricify.js"
        data-pricify-auto-bootstrap="true"
        strategy="lazyOnload"
      />
    </>
  )
}

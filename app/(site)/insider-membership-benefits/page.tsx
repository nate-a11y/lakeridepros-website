import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Insider Membership Benefits - Lake Ride Pros',
  description: 'Discover exclusive benefits and savings with Lake Ride Pros Insider membership. Get priority booking, member discounts, and special perks for your Lake Ozarks transportation needs.',
  keywords: ['insider membership', 'Lake Ride Pros membership', 'transportation benefits', 'member discounts', 'Lake Ozarks VIP'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-membership-benefits',
  },
}

export default function InsiderMembershipBenefitsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Insider Membership Benefits
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the Lake Ride Pros Insider program and unlock exclusive benefits, priority service, and member-only savings.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Widget Section */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="pricify-hosted-pricing-page"
            data-pricify-site="01JH3A1YVSSYZYY4TNPCTMCVB7"
            data-pricify-pricingpage="01JH3A1ZZA7XFPWXCVXEBH0RR4"
            data-pricify-viewport-defaultheight="556px"
          />
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

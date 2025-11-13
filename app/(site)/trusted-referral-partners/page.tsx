import { getPartners } from '@/lib/api/payload'
import Link from 'next/link'
import TrustedReferralPartnersClient from '@/components/TrustedReferralPartnersClient'

export const metadata = {
  title: 'Trusted Referral Partners | Lake Ride Pros',
  description: 'Our trusted referral partners. Quality services recommended by Lake Ride Pros.',
}

// Force dynamic rendering so Payload CMS is available at request time
export const dynamic = 'force-dynamic'

// Subcategory labels mapping
const subcategoryLabels: Record<string, string> = {
  'advertising-marketing-technology': 'Advertising / Marketing / Technology',
  'auto-marine-services': 'Auto & Marine Services',
  'bars-restaurants': 'Bars & Restaurants',
  'boat-captains-charters': 'Boat Captains & Charters',
  'lodging-rentals': 'Condos / Hotels / Short Term / Long Term Rentals / Airbnb-VRBO',
  'construction-developers': 'Construction / Developers',
  'home-services': 'Home Services',
  'campgrounds-rv-parks': 'Campgrounds / RV Parks / Camps',
  'entertainers-venues': 'Entertainers / Venues',
  'event-planners-concierge': 'Event Planners & Concierge Services',
  'family-fun': 'Family Fun',
  'nutrition-personal-care': 'Nutrition Services / Personal Care',
  'golf': 'Golf Courses / Golf Simulators / Golf Equipment / Golf Carts',
  'real-estate-financial': 'Real Estate / Financial Services',
  'shopping': 'Shopping',
}

export default async function TrustedReferralPartnersPage() {
  // Fetch both trusted referral partners and wedding partners
  const trustedPartners = await getPartners('trusted-referral')
  const weddingPartners = await getPartners('wedding')

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Trusted Referral Partners</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Businesses and services we trust and recommend. Our referral partners meet our high standards for quality and professionalism.
          </p>
        </div>
      </section>

      {/* Client Component with Filters and Partner Display */}
      <TrustedReferralPartnersClient
        trustedPartners={trustedPartners}
        weddingPartners={weddingPartners}
        subcategoryLabels={subcategoryLabels}
      />

      {/* CTA Section */}
      <section className="bg-lrp-green py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Transportation Services?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Experience the Lake Ride Pros difference - luxury transportation you can trust.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Book Your Ride
          </Link>
        </div>
      </section>
    </div>
  )
}

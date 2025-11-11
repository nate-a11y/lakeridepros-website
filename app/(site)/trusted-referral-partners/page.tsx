import { getPartners } from '@/lib/api/payload'
import { getMediaUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react'

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
  const partners = await getPartners('trusted-referral')

  // Group partners by subcategory
  const partnersBySubcategory = partners.reduce((acc, partner) => {
    const subcategory = partner.subcategory || 'other'
    if (!acc[subcategory]) {
      acc[subcategory] = []
    }
    acc[subcategory].push(partner)
    return acc
  }, {} as Record<string, typeof partners>)

  // Sort subcategories alphabetically
  const sortedSubcategories = Object.keys(partnersBySubcategory).sort()

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

      {/* Partners by Subcategory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                No referral partners to display at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {sortedSubcategories.map((subcategory) => (
                <div key={subcategory}>
                  {/* Subcategory Header */}
                  <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 pb-4 border-b-4 border-lrp-green">
                    {subcategoryLabels[subcategory] || subcategory}
                  </h2>

                  {/* Partners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partnersBySubcategory[subcategory].map((partner) => (
                <div
                  key={partner.id}
                  className="bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg p-6 hover:shadow-xl transition-all"
                >
                  {/* Logo */}
                  {partner.logo && (
                    <div className="relative h-32 mb-4 bg-white dark:bg-dark-bg-primary rounded-lg p-4 flex items-center justify-center">
                      <Image
                        src={getMediaUrl(partner.logo.url)}
                        alt={partner.logo.alt || partner.name}
                        width={200}
                        height={100}
                        className="object-contain max-h-full"
                      />
                    </div>
                  )}

                  {/* Name */}
                  <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-2">
                    {partner.name}
                  </h3>

                  {/* Description */}
                  {partner.description && (
                    <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-4">
                      {partner.description}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    )}
                    {partner.phone && (
                      <a
                        href={`tel:${partner.phone}`}
                        className="flex items-center gap-2 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {partner.phone}
                      </a>
                    )}
                    {partner.email && (
                      <a
                        href={`mailto:${partner.email}`}
                        className="flex items-center gap-2 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {partner.email}
                      </a>
                    )}
                    {partner.address && (
                      <div className="flex items-start gap-2 text-lrp-text-secondary dark:text-dark-text-secondary">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{partner.address}</span>
                      </div>
                    )}
                  </div>
                    </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

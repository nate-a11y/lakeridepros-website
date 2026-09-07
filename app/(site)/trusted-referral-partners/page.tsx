import PartnerDirectoryShell from '@/components/partners/PartnerDirectoryShell'
import PartnerDirectory from '@/components/partners/PartnerDirectory'
import { getPartners } from '@/lib/api/sanity'

export const metadata = {
  title: 'Trusted Referral Partners | Lake Ride Pros',
  description: 'Explore trusted Lake of the Ozarks businesses recommended by Lake Ride Pros for dining, lodging, events, home services, recreation, and more.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/trusted-referral-partners',
  },
  openGraph: {
    title: 'Trusted Referral Partners | Lake Ride Pros',
    description: 'Explore trusted Lake of the Ozarks businesses recommended by Lake Ride Pros for dining, lodging, events, home services, recreation, and more.',
    url: 'https://www.lakeridepros.com/trusted-referral-partners',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Trusted Partners' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trusted Referral Partners | Lake Ride Pros',
    description: 'Explore trusted Lake of the Ozarks businesses recommended by Lake Ride Pros for dining, lodging, events, home services, recreation, and more.',
    images: ['/og-image.jpg'],
  },
}

export const dynamic = 'force-dynamic'

// Subcategory labels mapping
const subcategoryLabels: Record<string, string> = {
  'advertising-marketing-technology': 'Advertising / Marketing / Technology',
  'auto-marine-services': 'Auto & Marine Services',
  'bars-restaurants': 'Bars & Restaurants',
  'catering-services': 'Catering Services',
  'boat-captains-charters': 'Boat Captains & Charters',
  'lodging-rentals': 'Condos / Hotels / Short Term / Long Term Rentals / Airbnb-VRBO',
  'construction-developers': 'Construction / Developers',
  'home-services': 'Home Services',
  'campgrounds-rv-parks': 'Campgrounds / RV Parks / Camps',
  'entertainers-venues': 'Entertainers / Venues',
  'event-planners-concierge': 'Event Planner / Concierge Services / Travel Agents',
  'family-fun': 'Family Fun',
  'nutrition-personal-care': 'Nutrition Services / Personal Care',
  'golf': 'Golf Courses / Golf Simulators / Golf Equipment / Golf Carts',
  'real-estate-financial': 'Real Estate / Financial Services',
  'shopping': 'Shopping',
}

export default async function TrustedReferralPartnersPage() {
  const partners = await getPartners('trusted-referral')

  return (
    <PartnerDirectoryShell
      title="Trusted Referral Partners"
      description="Businesses and services we trust and recommend. Our referral partners meet our high standards for quality and professionalism."
      currentPath="/trusted-referral-partners"
      ctaTitle="Need Transportation Services?"
      ctaDescription="Experience the Lake Ride Pros difference - luxury transportation you can trust."
      ctaLabel="Book Your Ride"
    >
      <PartnerDirectory partners={partners} kind="referral" subcategoryLabels={subcategoryLabels} />
    </PartnerDirectoryShell>
  )
}

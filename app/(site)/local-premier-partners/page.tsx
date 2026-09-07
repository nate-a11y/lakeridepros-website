import PartnerDirectoryShell from '@/components/partners/PartnerDirectoryShell'
import PartnerDirectory from '@/components/partners/PartnerDirectory'
import { getPartners } from '@/lib/api/sanity'

export const metadata = {
  title: 'Local Premier Partners | Lake Ride Pros',
  description: 'Discover Lake Ride Pros local premier partners: trusted Lake of the Ozarks businesses offering standout services, experiences, and community connections.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/local-premier-partners',
  },
  openGraph: {
    title: 'Local Premier Partners | Lake Ride Pros',
    description: 'Discover Lake Ride Pros local premier partners: trusted Lake of the Ozarks businesses offering standout services, experiences, and community connections.',
    url: 'https://www.lakeridepros.com/local-premier-partners',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Local Partners' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local Premier Partners | Lake Ride Pros',
    description: 'Discover Lake Ride Pros local premier partners: trusted Lake of the Ozarks businesses offering standout services, experiences, and community connections.',
    images: ['/og-image.jpg'],
  },
}

export const dynamic = 'force-dynamic'

export default async function LocalPremierPartnersPage() {
  const partners = await getPartners('local-premier')

  return (
    <PartnerDirectoryShell
      title="Local Premier Partners"
      description="Supporting the best local businesses at Lake of the Ozarks. Our premier partners share our commitment to excellence."
      currentPath="/local-premier-partners"
      ctaTitle="Interested in Partnering?"
      ctaDescription="We're always looking to connect with exceptional local businesses."
      ctaLabel="Get in Touch"
    >
      <PartnerDirectory partners={partners} kind="premier" />
    </PartnerDirectoryShell>
  )
}

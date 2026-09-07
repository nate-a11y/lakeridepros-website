import PartnerDirectoryShell from '@/components/partners/PartnerDirectoryShell'
import PartnerDirectory from '@/components/partners/PartnerDirectory'
import { getPartners } from '@/lib/api/sanity'

export const metadata = {
  title: 'Wedding Partners | Lake Ride Pros',
  description: 'Our trusted wedding vendor partners at Lake of the Ozarks. Luxury transportation for your special day.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/wedding-partners',
  },
  openGraph: {
    title: 'Wedding Partners | Lake Ride Pros',
    description: 'Our trusted wedding vendor partners at Lake of the Ozarks. Luxury transportation for your special day.',
    url: 'https://www.lakeridepros.com/wedding-partners',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Wedding Partners' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding Partners | Lake Ride Pros',
    description: 'Our trusted wedding vendor partners at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

export const dynamic = 'force-dynamic'

export default async function WeddingPartnersPage() {
  const partners = await getPartners('wedding')

  return (
    <PartnerDirectoryShell
      title="Wedding Partners"
      description="Our trusted network of wedding professionals at Lake of the Ozarks. Make your special day unforgettable with the best vendors in the area."
      currentPath="/wedding-partners"
      ctaTitle="Planning a Wedding at the Lake?"
      ctaDescription="Let us handle your transportation needs so you can focus on making memories."
      ctaLabel="Request a Quote"
    >
      <PartnerDirectory partners={partners} kind="wedding" />
    </PartnerDirectoryShell>
  )
}

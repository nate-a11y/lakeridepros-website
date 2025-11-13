import { getPartners } from '@/lib/api/payload'
import Link from 'next/link'
import WeddingPartnersClient from '@/components/WeddingPartnersClient'

export const metadata = {
  title: 'Wedding Partners | Lake Ride Pros',
  description: 'Our trusted wedding vendor partners at Lake of the Ozarks. Luxury transportation for your special day.',
}

// Force dynamic rendering so Payload CMS is available at request time
export const dynamic = 'force-dynamic'

export default async function WeddingPartnersPage() {
  const partners = await getPartners('wedding')

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Wedding Partners</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Our trusted network of wedding professionals at Lake of the Ozarks. Make your special day unforgettable with the best vendors in the area.
          </p>
        </div>
      </section>

      {/* Client Component with Filters and Partner Display */}
      <WeddingPartnersClient partners={partners} />

      {/* CTA Section */}
      <section className="bg-lrp-green py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Planning a Wedding at the Lake?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Let us handle your transportation needs so you can focus on making memories.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}

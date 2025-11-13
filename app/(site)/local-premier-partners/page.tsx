import { getPartners } from '@/lib/api/payload'
import Link from 'next/link'
import LocalPremierPartnersClient from '@/components/LocalPremierPartnersClient'

export const metadata = {
  title: 'Local Premier Partners | Lake Ride Pros',
  description: 'Our premier local business partners at Lake of the Ozarks. Supporting local excellence.',
}

// Force dynamic rendering so Payload CMS is available at request time
export const dynamic = 'force-dynamic'

export default async function LocalPremierPartnersPage() {
  const partners = await getPartners('local-premier')

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">Local Premier Partners</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto text-center">
            Supporting the best local businesses at Lake of the Ozarks. Our premier partners share our commitment to excellence.
          </p>
        </div>
      </section>

      {/* Client Component with Filters and Partner Display */}
      <LocalPremierPartnersClient partners={partners} />

      {/* CTA Section */}
      <section className="bg-lrp-green py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interested in Partnering?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            We're always looking to connect with exceptional local businesses.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

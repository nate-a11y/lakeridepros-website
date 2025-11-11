import { getPartners } from '@/lib/api/payload'
import { getMediaUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react'

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

      {/* Partners Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                No wedding partners to display at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
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
          )}
        </div>
      </section>

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

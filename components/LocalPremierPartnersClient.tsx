'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, ArrowRight } from 'lucide-react'
import { Partner } from '@/src/payload-types'
import { getMediaUrl } from '@/lib/utils'
import PartnerFilters from './PartnerFilters'

interface LocalPremierPartnersClientProps {
  partners: Partner[]
}

export default function LocalPremierPartnersClient({ partners }: LocalPremierPartnersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      return (
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [partners, searchTerm])

  return (
    <>
      {/* Filters */}
      <section className="py-8 bg-white dark:bg-dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                {partners.length === 0
                  ? 'No premier partners to display at this time.'
                  : 'No premier partners found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {/* Logo */}
                  {partner.logo && typeof partner.logo === 'object' && (
                    <div className="relative h-40 bg-gray-50 dark:bg-dark-bg-primary p-6 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                      <Image
                        src={getMediaUrl(partner.logo.url)}
                        alt={partner.logo.alt || partner.name}
                        width={200}
                        height={120}
                        className="object-contain max-h-full"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Name */}
                    <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                      {partner.name}
                    </h3>

                    {/* Blurb or Description */}
                    {(partner.blurb || partner.description) && (
                      <p className="text-lrp-text-secondary dark:text-dark-text-secondary text-sm mb-4 line-clamp-3">
                        {partner.blurb || partner.description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-lrp-green hover:text-lrp-green-dark transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Visit Website</span>
                        </a>
                      )}
                      {partner.phone && (
                        <a
                          href={`tel:${partner.phone}`}
                          className="flex items-center gap-2 text-sm text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{partner.phone}</span>
                        </a>
                      )}
                    </div>

                    {/* Learn More Button */}
                    {partner.slug && (
                      <Link
                        href={`/partners/${partner.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-lrp-green hover:bg-lrp-green-dark text-white rounded-md font-medium transition-colors text-sm"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

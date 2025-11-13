'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react'
import { Partner } from '@/lib/types'
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
    </>
  )
}

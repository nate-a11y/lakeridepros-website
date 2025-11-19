'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, ArrowRight } from 'lucide-react'
import { Partner } from '@/src/payload-types'
import { getMediaUrl } from '@/lib/utils'
import PartnerFilters from './PartnerFilters'

interface TrustedReferralPartnersClientProps {
  trustedPartners: Partner[]
  weddingPartners: Partner[]
  subcategoryLabels: Record<string, string>
}

export default function TrustedReferralPartnersClient({
  trustedPartners,
  weddingPartners,
  subcategoryLabels,
}: TrustedReferralPartnersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')

  // Get unique subcategories from trusted partners
  const subcategories = useMemo(() => {
    const uniqueSubcategories = new Set<string>()
    trustedPartners.forEach((partner) => {
      if (partner.subcategory) {
        uniqueSubcategories.add(partner.subcategory)
      }
    })
    return Array.from(uniqueSubcategories).sort()
  }, [trustedPartners])

  // Filter trusted partners by search and subcategory
  const filteredTrustedPartners = useMemo(() => {
    return trustedPartners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSubcategory =
        subcategoryFilter === 'all' || partner.subcategory === subcategoryFilter

      return matchesSearch && matchesSubcategory
    })
  }, [trustedPartners, searchTerm, subcategoryFilter])

  // Filter wedding partners by search
  const filteredWeddingPartners = useMemo(() => {
    return weddingPartners.filter((partner) => {
      return (
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [weddingPartners, searchTerm])

  // Group filtered trusted partners by subcategory
  const partnersBySubcategory = useMemo(() => {
    const grouped = filteredTrustedPartners.reduce((acc, partner) => {
      const subcategory = partner.subcategory || 'other'
      if (!acc[subcategory]) {
        acc[subcategory] = []
      }
      acc[subcategory].push(partner)
      return acc
    }, {} as Record<string, Partner[]>)

    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key]
        return acc
      }, {} as Record<string, Partner[]>)
  }, [filteredTrustedPartners])

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
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
              className="flex items-center gap-2 text-sm text-lrp-green-dark hover:text-lrp-green transition-colors"
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
  )

  return (
    <>
      {/* Filters */}
      <section className="py-8 bg-white dark:bg-dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            subcategoryFilter={subcategoryFilter}
            onSubcategoryFilterChange={setSubcategoryFilter}
            subcategories={subcategories}
            subcategoryLabels={subcategoryLabels}
          />
        </div>
      </section>

      {/* Trusted Referral Partners by Subcategory */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTrustedPartners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                No referral partners found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.keys(partnersBySubcategory).map((subcategory) => (
                <div key={subcategory}>
                  {/* Subcategory Header */}
                  <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 pb-4 border-b-4 border-lrp-green">
                    {subcategoryLabels[subcategory] || subcategory}
                  </h2>

                  {/* Partners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partnersBySubcategory[subcategory].map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Wedding Partners Section */}
      {filteredWeddingPartners.length > 0 && (
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Wedding Partners Header */}
            <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 pb-4 border-b-4 border-lrp-green">
              Wedding Partners
            </h2>

            {/* Wedding Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWeddingPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

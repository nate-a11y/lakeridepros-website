'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
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
    <div className="bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg hover:shadow-xl transition-all overflow-hidden">
      <Link href={`/partners/${partner.slug}`} className="block p-6">
        {/* Logo */}
        {partner.logo && typeof partner.logo === 'object' && (
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

        {/* Blurb (short description) */}
        {partner.blurb && (
          <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-4">
            {partner.blurb}
          </p>
        )}

        {/* Learn More Link */}
        <div className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark font-medium mt-4">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Contact Info - Outside the link so they're still clickable */}
      <div className="px-6 pb-6 space-y-2 text-sm border-t pt-4">
        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lrp-green hover:text-lrp-green-dark transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </a>
        )}
        {partner.phone && (
          <a
            href={`tel:${partner.phone}`}
            className="flex items-center gap-2 text-lrp-text-secondary dark:text-dark-text-secondary hover:text-lrp-green transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
            {partner.phone}
          </a>
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

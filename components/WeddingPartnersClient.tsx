'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone, ArrowRight } from 'lucide-react'
import { Partner } from '@/src/payload-types'
import { getMediaUrl } from '@/lib/utils'
import PartnerFilters from './PartnerFilters'

// Wedding category labels mapping
const weddingCategoryLabels: Record<string, string> = {
  'venues-destinations': 'Venues & Destinations',
  'photography-videography': 'Photography & Videography',
  'catering-culinary': 'Catering/Culinary',
  'floral-decor': 'Floral & Decor',
  'planning-coordination': 'Planning & Coordination',
  'bridal-beauty-style': 'Bridal Beauty & Style',
  'transportation': 'Transportation',
  'hotels-lodging': 'Hotels & Lodging',
  'other-services': 'Other Services',
}

// Order for wedding categories display
const weddingCategoryOrder = [
  'venues-destinations',
  'photography-videography',
  'catering-culinary',
  'floral-decor',
  'planning-coordination',
  'bridal-beauty-style',
  'transportation',
  'hotels-lodging',
  'other-services',
]

interface WeddingPartnersClientProps {
  partners: Partner[]
}

export default function WeddingPartnersClient({ partners }: WeddingPartnersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Get unique wedding categories from partners
  const weddingCategories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    partners.forEach((partner) => {
      if (partner.weddingCategory) {
        uniqueCategories.add(partner.weddingCategory)
      }
    })
    // Sort by predefined order
    return weddingCategoryOrder.filter(cat => uniqueCategories.has(cat))
  }, [partners])

  // Filter partners by search and category
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      // Use wedding-specific blurb/description if available, otherwise fall back to main
      const weddingBlurb = partner.weddingBlurb || partner.blurb
      const weddingDescription = partner.weddingDescription || partner.description

      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weddingDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weddingBlurb?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || partner.weddingCategory === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [partners, searchTerm, categoryFilter])

  // Group filtered partners by wedding category
  const partnersByCategory = useMemo(() => {
    const grouped = filteredPartners.reduce((acc, partner) => {
      const category = partner.weddingCategory || 'other-services'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(partner)
      return acc
    }, {} as Record<string, Partner[]>)

    // Sort by predefined order
    return weddingCategoryOrder.reduce((acc, key) => {
      if (grouped[key]) {
        acc[key] = grouped[key]
      }
      return acc
    }, {} as Record<string, Partner[]>)
  }, [filteredPartners])

  const PartnerCard = ({ partner }: { partner: Partner }) => {
    // Use wedding-specific content if available
    const displayBlurb = partner.weddingBlurb || partner.blurb
    const displayDescription = partner.weddingDescription || partner.description

    return (
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

          {/* Blurb or Description - use wedding-specific if available */}
          {(displayBlurb || displayDescription) && (
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary text-sm mb-4 line-clamp-3">
              {displayBlurb || displayDescription}
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
              <span>Learn More About {partner.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filters */}
      <section className="py-8 bg-white dark:bg-dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            subcategoryFilter={categoryFilter}
            onSubcategoryFilterChange={setCategoryFilter}
            subcategories={weddingCategories}
            subcategoryLabels={weddingCategoryLabels}
          />
        </div>
      </section>

      {/* Partners by Category */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary">
                {partners.length === 0
                  ? 'No wedding partners to display at this time.'
                  : 'No wedding partners found matching your criteria.'}
              </p>
            </div>
          ) : categoryFilter === 'all' && Object.keys(partnersByCategory).length > 0 ? (
            // Show grouped by category when no filter is applied
            <div className="space-y-16">
              {Object.keys(partnersByCategory).map((category) => (
                <div key={category}>
                  {/* Category Header */}
                  <h2 className="text-3xl font-bold text-lrp-black dark:text-white mb-8 pb-4 border-b-4 border-lrp-green">
                    {weddingCategoryLabels[category] || category}
                  </h2>

                  {/* Partners Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partnersByCategory[category].map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show flat grid when a category filter is applied
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

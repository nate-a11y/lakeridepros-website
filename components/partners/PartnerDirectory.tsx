'use client'

import { useId, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Partner } from '@/types/sanity'
import { getMediaUrl } from '@/lib/utils'

export const weddingCategoryLabels: Record<string, string> = {
  'venues-destinations': 'Venues & Destinations',
  'photography-videography': 'Photography & Videography',
  'catering-culinary': 'Catering/Culinary',
  'floral-decor': 'Floral & Decor',
  'planning-coordination': 'Planning & Coordination',
  'bridal-beauty-style': 'Bridal Beauty & Style',
  transportation: 'Transportation',
  'hotels-lodging': 'Hotels & Lodging',
  'travel-agents': 'Travel Agents',
  'djs-live-bands': 'DJs / Live Bands',
  'bartenders-mobile-bar-services': 'Bartenders / Mobile Bar Services',
  'other-services': 'Other Services',
}

type DirectoryKind = 'premier' | 'wedding' | 'referral'

interface PartnerDirectoryProps {
  partners: Partner[]
  kind: DirectoryKind
  subcategoryLabels?: Record<string, string>
}

function partnerPath(partner: Partner, kind: DirectoryKind) {
  if (kind === 'premier' || (kind === 'referral' && (partner.isPremierPartner || partner.category === 'local-premier'))) {
    return `/local-premier-partners/${partner.slug}`
  }
  if (kind === 'wedding' || partner.isWeddingPartner || partner.category === 'wedding') {
    return `/wedding-partners/${partner.slug}`
  }
  return `/partners/${partner.slug}`
}

function PartnerEntry({ partner, kind }: { partner: Partner; kind: DirectoryKind }) {
  const blurb = kind === 'wedding' ? partner.weddingBlurb || partner.blurb : partner.blurb
  const description = kind === 'wedding' ? partner.weddingDescription || partner.description : partner.description
  const logo = partner.logo && typeof partner.logo === 'object' ? partner.logo : null

  return (
    <article className="grid min-w-0 content-start gap-5 border-t border-lrp-gray py-8 sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[160px_minmax(0,1fr)]">
      {logo && (
        <div className="flex h-36 w-full items-center justify-start bg-white sm:h-40 sm:justify-center">
          <Image
            src={getMediaUrl(logo)}
            alt={logo.alt || partner.name}
            width={240}
            height={180}
            sizes="(min-width: 1024px) 160px, 144px"
            className="max-h-36 w-auto max-w-[200px] object-contain sm:max-h-40 sm:max-w-full"
          />
        </div>
      )}
      <div className={`min-w-0 ${logo ? '' : 'sm:col-span-2'}`}>
        <h3 className="text-balance font-celebri text-2xl leading-tight tracking-tight">{partner.name}</h3>
        {(blurb || description) && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-lrp-black/75">{blurb || description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-0 text-sm">
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${partner.name} website (opens in new tab)`}
              className="min-h-11 font-semibold text-lrp-black underline decoration-lrp-green decoration-2 underline-offset-4 hover:decoration-lrp-black"
            >
              Visit Website
            </a>
          )}
          {partner.phone && (
            <a href={`tel:${partner.phone}`} className="min-h-11 text-lrp-black hover:underline">{partner.phone}</a>
          )}
        </div>
        {partner.slug && (
          <Link
            href={partnerPath(partner, kind)}
            className="mt-2 min-h-11 max-w-full !justify-start text-sm font-bold text-lrp-black underline decoration-lrp-green decoration-2 underline-offset-4 hover:decoration-lrp-black"
          >
            Learn More About {partner.name}
          </Link>
        )}
      </div>
    </article>
  )
}

export default function PartnerDirectory({ partners, kind, subcategoryLabels = {} }: PartnerDirectoryProps) {
  const id = useId()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const labels = kind === 'wedding' ? weddingCategoryLabels : subcategoryLabels
  const getCategory = (partner: Partner) => kind === 'wedding' ? partner.weddingCategory || 'other-services' : partner.subcategory || 'other'
  const categories = Array.from(new Set(partners.map(getCategory))).sort((a, b) => (
    kind === 'wedding' ? Object.keys(weddingCategoryLabels).indexOf(a) - Object.keys(weddingCategoryLabels).indexOf(b) : a.localeCompare(b)
  ))
  const filteredPartners = useMemo(() => partners.filter(partner => {
    const description = kind === 'wedding' ? partner.weddingDescription || partner.description : partner.description
    const blurb = kind === 'wedding' ? partner.weddingBlurb || partner.blurb : partner.blurb
    const matchesSearch = [partner.name, description, blurb].some(text => text?.toLowerCase().includes(searchTerm.toLowerCase()))
    const category = kind === 'wedding' ? partner.weddingCategory || 'other-services' : partner.subcategory || 'other'
    return matchesSearch && (categoryFilter === 'all' || category === categoryFilter)
  }), [partners, kind, searchTerm, categoryFilter])
  const grouped = kind === 'premier'
    ? [{ key: 'premier', label: 'Local Premier Partners', partners: filteredPartners }]
    : categories.map(category => ({ key: category, label: labels[category] || category, partners: filteredPartners.filter(partner => getCategory(partner) === category) })).filter(group => group.partners.length > 0)

  const emptyMessage = kind === 'premier'
    ? partners.length === 0 ? 'No premier partners to display at this time.' : 'No premier partners found matching your search.'
    : kind === 'wedding'
      ? partners.length === 0 ? 'No wedding partners to display at this time.' : 'No wedding partners found matching your criteria.'
      : 'No referral partners found matching your criteria.'

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8" aria-label="Find a partner">
      <div className="grid items-end gap-5 md:grid-cols-2 lg:max-w-4xl">
        <div className="min-w-0">
          <label htmlFor={`${id}-search`} className="mb-2 block text-sm font-bold">Search partners</label>
          <div className="flex min-w-0 items-center border border-lrp-black/50 bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-lrp-black">
            <input
              id={`${id}-search`}
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search partners..."
              aria-label="Search partners by name or description"
              className="min-h-12 min-w-0 w-full appearance-none bg-white px-4 py-3 text-base text-lrp-black placeholder:text-lrp-black/60"
            />
            {searchTerm && <button type="button" aria-label="Clear search" onClick={() => setSearchTerm('')} className="min-h-12 shrink-0 px-4 text-sm font-semibold text-lrp-black hover:underline">Clear</button>}
          </div>
        </div>
        {kind !== 'premier' && (
          <div className="min-w-0">
            <label htmlFor={`${id}-category`} className="mb-2 block text-sm font-bold">Filter by category</label>
            <select
              id={`${id}-category`}
              value={categoryFilter}
              onChange={event => setCategoryFilter(event.target.value)}
              aria-label="Filter partners by category"
              className="min-h-12 w-full min-w-0 max-w-full border border-lrp-black/50 bg-white px-3 py-3 text-base text-lrp-black"
            >
              <option value="all">All Categories</option>
              {categories.map(category => <option key={category} value={category}>{labels[category] || category}</option>)}
            </select>
          </div>
        )}
      </div>
      <p role="status" className="mb-8 mt-4 text-sm text-lrp-black/70">{filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'}</p>
      {filteredPartners.length === 0 ? (
        <p className="py-12 text-lg text-lrp-black/75">{emptyMessage}</p>
      ) : (
        <div className="space-y-12">
          {grouped.map(group => (
            <section key={group.key} aria-labelledby={`${id}-${group.key}`}>
              <h2 id={`${id}-${group.key}`} className={kind === 'premier' ? 'sr-only' : 'mb-6 max-w-3xl text-balance font-celebri text-3xl leading-tight tracking-tight sm:text-4xl'}>{group.label}</h2>
              <div className="grid gap-x-12 lg:grid-cols-2">
                {group.partners.map(partner => <PartnerEntry key={partner._id} partner={partner} kind={kind} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}

import { resolveSlug, type SanitySlug } from '@/types/sanity'

interface PartnerRouting {
  isPremierPartner?: boolean | null
  isWeddingPartner?: boolean | null
  category?: string | null
}

/** Keep links, detail routes and the sitemap on the same partner URL. */
export function getPartnerPath(partner: PartnerRouting, slug: SanitySlug): string {
  const encodedSlug = encodeURIComponent(resolveSlug(slug))
  if (partner.isPremierPartner || partner.category === 'local-premier') {
    return `/local-premier-partners/${encodedSlug}`
  }
  if (partner.isWeddingPartner || partner.category === 'wedding') {
    return `/wedding-partners/${encodedSlug}`
  }
  return `/partners/${encodedSlug}`
}

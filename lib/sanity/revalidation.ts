/**
 * Sanity Cache Revalidation Utilities
 *
 * Replaces the Payload CMS hook-based revalidation system.
 * With Sanity, revalidation is triggered by:
 * 1. Sanity webhooks → /api/sanity-webhook (automatic, no code needed in schemas)
 * 2. Manual revalidation via these utility functions (for API routes that mutate data)
 */

import { revalidatePath, updateTag } from 'next/cache'

/**
 * Map of Sanity document types to their URL paths and cache tags.
 * Used by both the webhook handler and manual revalidation.
 */
const REVALIDATION_MAP: Record<string, { paths: (slug?: string) => string[]; tags: string[] }> = {
  service: {
    paths: (slug) => ['/services', '/', ...(slug ? [`/services/${slug}`] : [])],
    tags: ['services'],
  },
  product: {
    paths: (slug) => ['/shop', '/', ...(slug ? [`/shop/products/${slug}`] : [])],
    tags: ['products'],
  },
  vehicle: {
    paths: (slug) => ['/fleet', '/', ...(slug ? [`/fleet/${slug}`] : [])],
    tags: ['vehicles'],
  },
  blogPost: {
    paths: (slug) => ['/blog', '/', ...(slug ? [`/blog/${slug}`] : [])],
    tags: ['blog'],
  },
  partner: {
    paths: () => ['/trusted-referral-partners', '/local-premier-partners', '/wedding-partners', '/'],
    tags: ['partners'],
  },
  testimonial: {
    paths: () => ['/', '/services', '/fleet'],
    tags: ['testimonials'],
  },
  event: {
    paths: (slug) => ['/events', ...(slug ? [`/events/${slug}`] : [])],
    tags: ['events'],
  },
  venue: {
    paths: (slug) => ['/events', ...(slug ? [`/events/venues/${slug}`] : [])],
    tags: ['venues'],
  },
  page: {
    paths: (slug) => [...(slug ? [`/${slug}`] : [])],
    tags: ['pages'],
  },
  giftCard: {
    paths: () => ['/gift-cards'],
    tags: ['gift-cards'],
  },
  order: {
    paths: () => [],
    tags: ['orders'],
  },
}

/**
 * Manually revalidate cache for a Sanity document type.
 * Use this in API routes that create/update documents via the Sanity write client.
 *
 * @example
 * ```ts
 * // After creating an order via Sanity write client:
 * await revalidateDocument('order')
 *
 * // After updating a service:
 * await revalidateDocument('service', 'wedding-transportation')
 * ```
 */
export function revalidateDocument(documentType: string, slug?: string) {
  const config = REVALIDATION_MAP[documentType]

  if (!config) {
    // Unknown type — just revalidate homepage
    revalidatePath('/')
    return
  }

  // Revalidate tags
  for (const tag of config.tags) {
    updateTag(tag)
  }

  // Revalidate paths
  for (const path of config.paths(slug)) {
    revalidatePath(path)
  }
}

/**
 * Revalidate multiple paths at once.
 */
export function revalidatePaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path)
  }
}

/**
 * Revalidate multiple tags at once.
 */
export function revalidateTags(tags: string[]) {
  for (const tag of tags) {
    updateTag(tag)
  }
}

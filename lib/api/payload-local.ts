import { getPayload } from 'payload'
import config from '@payload-config'
import type { Service, Partner, BlogPost, Vehicle, Testimonial } from '@/src/payload-types'

/**
 * Server-side only functions to query Payload directly without HTTP requests
 * This avoids issues with self-referential API calls during build/runtime
 */

let payloadPromise: ReturnType<typeof getPayload> | null = null

async function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config })
  }
  return payloadPromise
}

interface ServiceParams {
  limit?: number
}

interface ServiceResponse {
  docs: Service[]
}

export async function getServicesLocal(params?: ServiceParams): Promise<ServiceResponse> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: {
        active: {
          equals: true,
        },
      },
      sort: 'order',
      depth: 2,
      limit: params?.limit ?? 1000,
    })

    return { docs: result.docs as unknown as Service[] }
  } catch (error) {
    console.error('[Payload Local] Error fetching services:', error)
    return { docs: [] }
  }
}

export async function getServiceBySlugLocal(slug: string): Promise<Service | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: {
        and: [
          { slug: { equals: slug } },
          { active: { equals: true } },
        ],
      },
      depth: 2,
      limit: 1,
    })

    return result.docs[0] as unknown as Service || null
  } catch (error) {
    console.error(`[Payload Local] Error fetching service ${slug}:`, error)
    return null
  }
}

// Partner type for filtering
export type PartnerType = 'premier' | 'referral' | 'wedding' | 'promotion';

export async function getPartnersLocal(category?: string, featured = false): Promise<Partner[]> {
  try {
    const payload = await getPayloadClient()
    const whereClause: Record<string, unknown> = {
      active: {
        equals: true,
      },
    }

    if (featured) {
      whereClause.featured = {
        equals: true,
      }
    }

    const result = await payload.find({
      collection: 'partners',
      where: whereClause,
      sort: 'order',
      depth: 2,
      limit: 1000,
    })

    let partners = result.docs as unknown as Partner[]

    // Filter by partner type using new checkbox fields
    // Legacy category field is only used if NO checkboxes have been set (old records)
    if (category) {
      partners = partners.filter(p => {
        // Check if any checkbox has been explicitly set (new system)
        const hasCheckboxSet = p.isPremierPartner === true || p.isReferralPartner === true ||
                               p.isWeddingPartner === true || p.isPromotion === true

        if (category === 'local-premier') {
          return hasCheckboxSet ? p.isPremierPartner === true : p.category === 'local-premier'
        }
        if (category === 'trusted-referral') {
          // Referral partners include: those with isReferralPartner checked OR Premier Partners (they get dual exposure)
          if (hasCheckboxSet) {
            return p.isReferralPartner === true || p.isPremierPartner === true
          }
          return p.category === 'trusted-referral' || p.category === 'local-premier'
        }
        if (category === 'wedding') {
          return hasCheckboxSet ? p.isWeddingPartner === true : p.category === 'wedding'
        }
        if (category === 'promotions') {
          return hasCheckboxSet ? p.isPromotion === true : p.category === 'promotions'
        }
        // Fallback to legacy category
        return p.category === category
      })
    }

    return partners
  } catch (error) {
    console.error('[Payload Local] Error fetching partners:', error)
    return []
  }
}

// Get partners by specific type using new checkbox fields
export async function getPartnersByTypeLocal(type: PartnerType, featured = false): Promise<Partner[]> {
  try {
    const payload = await getPayloadClient()
    const whereClause: Record<string, unknown> = {
      active: {
        equals: true,
      },
    }

    if (featured) {
      whereClause.featured = {
        equals: true,
      }
    }

    const result = await payload.find({
      collection: 'partners',
      where: whereClause,
      sort: 'order',
      depth: 2,
      limit: 1000,
    })

    let partners = result.docs as unknown as Partner[]

    // Filter by partner type using new checkbox fields
    // Legacy category field is only used if NO checkboxes have been set (old records)
    partners = partners.filter(p => {
      const hasCheckboxSet = p.isPremierPartner === true || p.isReferralPartner === true ||
                             p.isWeddingPartner === true || p.isPromotion === true

      switch (type) {
        case 'premier':
          return hasCheckboxSet ? p.isPremierPartner === true : p.category === 'local-premier'
        case 'referral':
          if (hasCheckboxSet) {
            return p.isReferralPartner === true || p.isPremierPartner === true
          }
          return p.category === 'trusted-referral' || p.category === 'local-premier'
        case 'wedding':
          return hasCheckboxSet ? p.isWeddingPartner === true : p.category === 'wedding'
        case 'promotion':
          return hasCheckboxSet ? p.isPromotion === true : p.category === 'promotions'
        default:
          return false
      }
    })

    return partners
  } catch (error) {
    console.error('[Payload Local] Error fetching partners:', error)
    return []
  }
}

export async function getPartnerBySlugLocal(slug: string): Promise<Partner | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'partners',
      where: {
        and: [
          { slug: { equals: slug } },
          { active: { equals: true } },
        ],
      },
      depth: 2,
      limit: 1,
    })

    return result.docs[0] as unknown as Partner || null
  } catch (error) {
    console.error(`[Payload Local] Error fetching partner ${slug}:`, error)
    return null
  }
}

interface BlogPostsLocalParams {
  limit?: number
  page?: number
}

interface BlogPostsLocalResponse {
  docs: BlogPost[]
  hasNextPage: boolean
  page: number
  totalDocs: number
  totalPages: number
}

export async function getBlogPostsLocal(params?: BlogPostsLocalParams): Promise<BlogPostsLocalResponse> {
  const { limit = 12, page = 1 } = params || {}
  const now = new Date()

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          {
            published: {
              equals: true,
            },
          },
          {
            publishedDate: {
              less_than_equal: now.toISOString(),
            },
          },
        ],
      },
      sort: '-publishedDate',
      depth: 2,
      limit,
      page,
    })

    return {
      docs: result.docs as unknown as BlogPost[],
      hasNextPage: result.hasNextPage,
      page: result.page,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
    }
  } catch (error) {
    console.error('[Payload Local] Error fetching blog posts:', error)
    return { docs: [], hasNextPage: false, page: 1, totalDocs: 0, totalPages: 0 }
  }
}

export async function getLatestBlogPostsLocal(limit = 3): Promise<BlogPost[]> {
  const result = await getBlogPostsLocal({ limit })
  return result.docs
}

export async function getBlogPostBySlugLocal(slug: string): Promise<BlogPost | null> {
  const now = new Date()

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { slug: { equals: slug } },
          { published: { equals: true } },
          { publishedDate: { less_than_equal: now.toISOString() } },
        ],
      },
      depth: 2,
      limit: 1,
    })

    return (result.docs[0] as unknown as BlogPost) || null
  } catch (error) {
    console.error(`[Payload Local] Error fetching blog post ${slug}:`, error)
    return null
  }
}

export async function getAdjacentBlogPostsLocal(currentSlug: string): Promise<{
  previous: BlogPost | null
  next: BlogPost | null
}> {
  const now = new Date()

  try {
    const payload = await getPayloadClient()
    // Get all published posts sorted by date
    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        and: [
          { published: { equals: true } },
          { publishedDate: { less_than_equal: now.toISOString() } },
        ],
      },
      sort: '-publishedDate',
      depth: 1,
      limit: 100,
    })

    const posts = result.docs as unknown as BlogPost[]
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

    if (currentIndex === -1) {
      return { previous: null, next: null }
    }

    return {
      previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    }
  } catch (error) {
    console.error('[Payload Local] Error fetching adjacent blog posts:', error)
    return { previous: null, next: null }
  }
}

export async function getFeaturedVehiclesLocal(limit = 6): Promise<Vehicle[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'vehicles',
      where: {
        featured: {
          equals: true,
        },
        available: {
          equals: true,
        },
      },
      sort: 'order',
      depth: 2,
      limit,
    })

    return result.docs as unknown as Vehicle[]
  } catch (error) {
    console.error('[Payload Local] Error fetching featured vehicles:', error)
    return []
  }
}

export async function getVehiclesLocal(): Promise<Vehicle[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'vehicles',
      limit: 100,
      depth: 1,
    })
    return result.docs as unknown as Vehicle[]
  } catch (error) {
    console.error('[Payload Local] Error fetching vehicles:', error)
    return []
  }
}

export async function getProductsLocal(): Promise<unknown[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
      },
      limit: 100,
      depth: 1,
    })
    return result.docs
  } catch (error) {
    console.error('[Payload Local] Error fetching products:', error)
    return []
  }
}

export async function getPagesLocal(): Promise<unknown[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: {
        published: { equals: true },
      },
      limit: 100,
      depth: 1,
    })
    return result.docs
  } catch (error) {
    console.error('[Payload Local] Error fetching pages:', error)
    return []
  }
}

export async function getTestimonialsLocal(minRating = 5): Promise<Testimonial[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'testimonials',
      where: {
        rating: {
          greater_than_equal: minRating,
        },
      },
      sort: 'order',
      depth: 2,
      limit: 500,
      pagination: false,
    })

    // Filter out testimonials with placeholder content
    const placeholderTexts = ['No comment provided', 'No content provided', '']
    const validTestimonials = (result.docs as unknown as Testimonial[]).filter(testimonial => {
      const content = testimonial.content?.trim() || ''
      return content.length > 0 && !placeholderTexts.includes(content)
    })

    return validTestimonials
  } catch (error) {
    console.error('[Payload Local] Error fetching testimonials:', error)
    return []
  }
}

export async function getRandomTestimonialsLocal(count = 3, _showAll = false, minRating = 5): Promise<Testimonial[]> {
  // Note: _showAll parameter exists for API compatibility but is unused (we always filter by minRating)
  const allTestimonials = await getTestimonialsLocal(minRating)

  if (allTestimonials.length <= count) {
    return allTestimonials
  }

  // Fisher-Yates shuffle algorithm for randomization
  const shuffled = [...allTestimonials]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

// Helper to get full media URL
export function getMediaUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url

  // Media is served from Payload API - prioritize PAYLOAD_API_URL
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
                  process.env.NEXT_PUBLIC_SERVER_URL ||
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return `${baseUrl}${url}`
}

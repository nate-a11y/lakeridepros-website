/**
 * Sanity CMS Fetch Layer
 *
 * Drop-in replacement for payload.ts and payload-local.ts.
 * Since Sanity is a hosted API there is no distinction between "local" and
 * "remote" — every query goes through the Sanity client. The "Local" function
 * variants are therefore simple aliases (or thin wrappers where the original
 * had a different default behaviour).
 */

import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import {
  servicesQuery,
  serviceBySlugQuery,
  vehiclesQuery,
  featuredVehiclesQuery,
  vehicleBySlugQuery,
  blogPostsQuery,
  latestBlogPostsQuery,
  blogPostBySlugQuery,
  adjacentBlogPostsQuery,
  productsQuery,
  featuredProductsQuery,
  productBySlugQuery,
  testimonialsQuery,
  partnersQuery,
  pageBySlugQuery,
  venuesQuery,
  venueBySlugQuery,
  eventsQuery,
  upcomingEventsQuery,
  eventsByVenueQuery,
  eventBySlugQuery,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

// ---------------------------------------------------------------------------
// Loose types — keeps every consumer happy until Sanity codegen is added
// ---------------------------------------------------------------------------

interface Service {
  [key: string]: any
}
interface Vehicle {
  [key: string]: any
}
interface BlogPost {
  [key: string]: any
}
interface Product {
  [key: string]: any
}
interface Testimonial {
  [key: string]: any
}
interface Partner {
  [key: string]: any
}

export interface Venue {
  id: string
  name: string
  shortName?: string
  slug: string
  description?: string
  image?: any
  gallery?: Array<{ image: any; caption?: string; id?: string }>
  address?: string
  website?: string
  phone?: string
  active: boolean
  additionalInfo?: any
  order: number
  [key: string]: any
}

export interface Event {
  id: string
  name: string
  slug: string
  venue: Venue | string
  date: string
  time?: string
  description?: string
  image?: any
  rideAvailability?: {
    rideType:
      | 'flex'
      | 'elite'
      | 'lrp-black'
      | 'limo-bus'
      | 'rescue-squad'
      | 'luxury-sprinter'
      | 'luxury-shuttle'
    status: 'available' | 'limited' | 'reserved'
    notes?: string
  }[]
  featured: boolean
  active: boolean
  order: number
  [key: string]: any
}

interface PaginationParams {
  limit?: number
  page?: number
}

// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

/**
 * Convert a Sanity document into a shape the existing consuming code expects:
 *  - `_id`  is mirrored as `id`
 *  - `slug` objects (`{ _type: 'slug', current: '...' }`) are flattened to
 *    plain strings so that `doc.slug === 'my-slug'` works
 *  - Known resolved references (`venue`, `author`) are recursively normalised
 */
function normalizeDoc<T = any>(doc: T): T {
  if (!doc || typeof doc !== 'object') return doc

  const normalized: any = { ...(doc as any) }

  // Map _id -> id
  if (normalized._id) {
    normalized.id = normalized._id
  }

  // Flatten Sanity slug objects to plain strings
  if (
    normalized.slug &&
    typeof normalized.slug === 'object' &&
    'current' in normalized.slug
  ) {
    normalized.slug = normalized.slug.current
  }

  // Recursively normalise known resolved-reference fields
  if (normalized.venue && typeof normalized.venue === 'object' && normalized.venue._id) {
    normalized.venue = normalizeDoc(normalized.venue)
  }
  if (normalized.author && typeof normalized.author === 'object' && normalized.author._id) {
    normalized.author = normalizeDoc(normalized.author)
  }
  if (normalized.service && typeof normalized.service === 'object' && normalized.service._id) {
    normalized.service = normalizeDoc(normalized.service)
  }

  return normalized as T
}

function normalizeDocs<T = any>(docs: T[]): T[] {
  return (docs || []).map(normalizeDoc)
}

// ---------------------------------------------------------------------------
// Fisher-Yates shuffle (same algorithm used by the Payload layer)
// ---------------------------------------------------------------------------

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

/**
 * Apply limit/page slicing to an already-fetched array of documents and
 * return just the `{ docs }` wrapper that the consuming code expects.
 */
function paginateSimple<T>(docs: T[], params?: PaginationParams): { docs: T[] } {
  if (!params?.limit && !params?.page) return { docs }
  const limit = params.limit ?? 1000
  const page = params.page ?? 1
  const start = (page - 1) * limit
  return { docs: docs.slice(start, start + limit) }
}

// ============================================================================
// SERVICES
// ============================================================================

/** Get all active services sorted by display order. */
export async function getServices(
  params?: PaginationParams,
): Promise<{ docs: Service[] }> {
  try {
    const raw: any[] = await client.fetch(servicesQuery, {}, { next: { revalidate: 60 } })
    const docs = normalizeDocs(raw)
    return paginateSimple(docs, params)
  } catch (error) {
    console.error('[Sanity] Error fetching services:', error)
    return { docs: [] }
  }
}

/** Get a single active service by its slug. */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const raw = await client.fetch(serviceBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc<Service>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching service ${slug}:`, error)
    return null
  }
}

// Local aliases — identical behaviour since Sanity is always remote
export const getServicesLocal = getServices
export const getServiceBySlugLocal = getServiceBySlug

// ============================================================================
// VEHICLES
// ============================================================================

/** Get all available vehicles sorted by display order. */
export async function getVehicles(
  params?: PaginationParams,
): Promise<{ docs: Vehicle[] }> {
  try {
    const raw: any[] = await client.fetch(vehiclesQuery, {}, { next: { revalidate: 60 } })
    const docs = normalizeDocs(raw)
    return paginateSimple(docs, params)
  } catch (error) {
    console.error('[Sanity] Error fetching vehicles:', error)
    return { docs: [] }
  }
}

/** Get featured + available vehicles, limited to `limit`. */
export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  try {
    const raw: any[] = await client.fetch(
      featuredVehiclesQuery,
      { limit },
      { next: { revalidate: 60 } },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching featured vehicles:', error)
    return []
  }
}

/** Return `limit` randomly-selected available vehicles. */
export async function getRandomVehicles(limit = 3): Promise<Vehicle[]> {
  try {
    const raw: any[] = await client.fetch(vehiclesQuery, {}, { next: { revalidate: 60 } })
    const vehicles = normalizeDocs(raw)
    return fisherYatesShuffle(vehicles).slice(0, limit)
  } catch (error) {
    console.error('[Sanity] Error fetching random vehicles:', error)
    return []
  }
}

/** Get a single vehicle by its slug. */
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const raw = await client.fetch(vehicleBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc<Vehicle>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching vehicle ${slug}:`, error)
    return null
  }
}

/**
 * Local variant — returns ALL vehicles regardless of `available` status.
 * Matches the original payload-local.ts behaviour used for sitemap generation.
 */
export const getVehiclesLocal = async (): Promise<Vehicle[]> => {
  try {
    const raw: any[] = await client.fetch(
      groq`*[_type == "vehicle"] | order(order asc) {
        _id, _type, name, slug, type, description, capacity,
        featuredImage { ..., asset-> { _id, url, metadata } },
        images[] { ..., image { ..., asset-> { _id, url, metadata } }, alt },
        amenities, specifications, pricing, pricingTiers,
        available, featured, order
      }`,
      {},
      { next: { revalidate: 60 } },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching all vehicles:', error)
    return []
  }
}

export const getFeaturedVehiclesLocal = getFeaturedVehicles

// ============================================================================
// BLOG POSTS
// ============================================================================

/**
 * Get published blog posts with full pagination metadata.
 * Uses an inline compound GROQ query that fetches both the page of docs and
 * the total count in a single request.
 */
export async function getBlogPosts(
  params?: PaginationParams,
): Promise<{
  docs: BlogPost[]
  hasNextPage: boolean
  page: number
  totalDocs: number
  totalPages: number
}> {
  const limit = params?.limit ?? 12
  const page = params?.page ?? 1
  const start = (page - 1) * limit
  const end = start + limit

  try {
    const result = await client.fetch(
      groq`{
        "docs": *[_type == "blogPost" && published == true && publishedDate <= now()]
          | order(publishedDate desc) [$start...$end] {
            _id, _type, title, slug, excerpt, content,
            featuredImage { ..., asset-> { _id, url, metadata } },
            author-> { _id, name, email },
            publishedDate, categories, published
          },
        "total": count(*[_type == "blogPost" && published == true && publishedDate <= now()])
      }`,
      { start, end },
      { next: { revalidate: 60 } },
    )

    const docs = normalizeDocs(result.docs || [])
    const totalDocs = result.total ?? 0
    const totalPages = Math.ceil(totalDocs / limit) || 1

    return {
      docs,
      hasNextPage: page < totalPages,
      page,
      totalDocs,
      totalPages,
    }
  } catch (error) {
    console.error('[Sanity] Error fetching blog posts:', error)
    return { docs: [], hasNextPage: false, page: 1, totalDocs: 0, totalPages: 0 }
  }
}

/** Get the N most recent published blog posts. */
export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const raw: any[] = await client.fetch(
      latestBlogPostsQuery,
      { limit },
      { next: { revalidate: 60 } },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching latest blog posts:', error)
    return []
  }
}

/** Get a single published blog post by its slug. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await client.fetch(blogPostBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc<BlogPost>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching blog post ${slug}:`, error)
    return null
  }
}

/**
 * Get the previous and next blog posts relative to `currentSlug`.
 * Fetches all published posts sorted by date and locates neighbours in JS.
 */
export async function getAdjacentBlogPosts(
  currentSlug: string,
): Promise<{ previous: BlogPost | null; next: BlogPost | null }> {
  try {
    const raw: any[] = await client.fetch(
      adjacentBlogPostsQuery,
      {},
      { next: { revalidate: 60 } },
    )
    const posts = normalizeDocs(raw)
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug)

    if (currentIndex === -1) {
      return { previous: null, next: null }
    }

    return {
      previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    }
  } catch (error) {
    console.error('[Sanity] Error fetching adjacent blog posts:', error)
    return { previous: null, next: null }
  }
}

// Local aliases
export const getBlogPostsLocal = getBlogPosts
export const getLatestBlogPostsLocal = getLatestBlogPosts
export const getBlogPostBySlugLocal = getBlogPostBySlug
export const getAdjacentBlogPostsLocal = getAdjacentBlogPosts

// ============================================================================
// PRODUCTS
// ============================================================================

/** Get all active products. */
export async function getProducts(
  params?: PaginationParams,
): Promise<{ docs: Product[] }> {
  try {
    const raw: any[] = await client.fetch(productsQuery, {}, { next: { revalidate: 60 } })
    const docs = normalizeDocs(raw)
    return paginateSimple(docs, params)
  } catch (error) {
    console.error('[Sanity] Error fetching products:', error)
    return { docs: [] }
  }
}

/** Get featured active products, limited to `limit`. */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const raw: any[] = await client.fetch(
      featuredProductsQuery,
      { limit },
      { next: { revalidate: 60 } },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching featured products:', error)
    return []
  }
}

/** Get a single active product by its slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const raw = await client.fetch(productBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc<Product>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching product ${slug}:`, error)
    return null
  }
}

/** Local variant — returns all active products (unwrapped array). */
export const getProductsLocal = async (): Promise<unknown[]> => {
  try {
    const raw: any[] = await client.fetch(productsQuery, {}, { next: { revalidate: 60 } })
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching all products:', error)
    return []
  }
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

/** Placeholder strings to filter out empty / stub testimonials. */
const placeholderTexts = ['No comment provided', 'No content provided', '']

/**
 * Get testimonials, optionally filtering by `featured` and `minRating`.
 * Placeholder content is always stripped in JS for safety.
 */
export async function getTestimonials(
  featured = false,
  minRating?: number,
): Promise<Testimonial[]> {
  try {
    const raw: any[] = await client.fetch(
      testimonialsQuery,
      {
        featured: featured === true,
        minRating: minRating ?? 0,
      },
      { next: { revalidate: 60 } },
    )

    const docs = normalizeDocs(raw)

    // Strip testimonials with placeholder / empty content
    return docs.filter((t) => {
      const content = (t.content ?? '').trim()
      return content.length > 0 && !placeholderTexts.includes(content)
    })
  } catch (error) {
    console.error('[Sanity] Error fetching testimonials:', error)
    return []
  }
}

/**
 * Get `count` randomly-selected testimonials.
 * @param count   Number to return (default 3)
 * @param featured Only featured testimonials
 * @param minRating Minimum star rating (default 5 for public display)
 */
export async function getRandomTestimonials(
  count = 3,
  featured = false,
  minRating = 5,
): Promise<Testimonial[]> {
  const all = await getTestimonials(featured, minRating)

  if (all.length <= count) return all

  return fisherYatesShuffle(all).slice(0, count)
}

/**
 * Get vehicle-related testimonials filtered by transport-related keywords.
 * Falls back to the full pool when not enough keyword-matched reviews exist.
 */
export async function getVehicleRelatedTestimonials(
  count = 3,
  minRating = 5,
): Promise<Testimonial[]> {
  const all = await getTestimonials(false, minRating)

  // Keywords that indicate a vehicle-related review
  const vehicleKeywords = [
    'vehicle', 'car', 'suv', 'suburban', 'van', 'bus', 'limo', 'sprinter', 'shuttle',
    'ride', 'driver', 'driving', 'drove', 'driven',
    'clean', 'comfortable', 'spacious', 'luxury', 'luxurious',
    'seats', 'seating', 'capacity', 'room', 'roomy',
    'air conditioning', 'ac', 'amenities', 'amenity',
    'pickup', 'drop off', 'transport', 'transportation',
    'professional driver', 'chauffeur',
  ]

  const vehicleTestimonials = all.filter((t) => {
    const searchText = `${(t.content ?? '').toLowerCase()} ${(t.name ?? '').toLowerCase()} ${(t.title ?? '').toLowerCase()}`
    return vehicleKeywords.some((kw) => searchText.includes(kw))
  })

  // If we don't have enough vehicle-specific reviews, fall back to all testimonials
  const pool = vehicleTestimonials.length >= count ? vehicleTestimonials : all

  if (pool.length <= count) return pool

  return fisherYatesShuffle(pool).slice(0, count)
}

// Local aliases
export const getTestimonialsLocal = getTestimonials
export const getRandomTestimonialsLocal = getRandomTestimonials

// ============================================================================
// PARTNERS
// ============================================================================

export type PartnerType = 'premier' | 'referral' | 'wedding' | 'promotion'

/**
 * Complex partner filtering logic — preserved exactly from the Payload layer.
 *
 * Uses new checkbox fields (`isPremierPartner`, `isReferralPartner`,
 * `isWeddingPartner`, `isPromotion`) when any of them is `true`; otherwise
 * falls back to the legacy `category` string.
 */
function filterPartnersByCategory(partners: Partner[], category: string): Partner[] {
  return partners.filter((p) => {
    const hasCheckboxSet =
      p.isPremierPartner === true ||
      p.isReferralPartner === true ||
      p.isWeddingPartner === true ||
      p.isPromotion === true

    if (category === 'local-premier') {
      return hasCheckboxSet ? p.isPremierPartner === true : p.category === 'local-premier'
    }
    if (category === 'trusted-referral') {
      // Referral partners include Premier Partners (dual exposure)
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

function filterPartnersByType(partners: Partner[], type: PartnerType): Partner[] {
  return partners.filter((p) => {
    const hasCheckboxSet =
      p.isPremierPartner === true ||
      p.isReferralPartner === true ||
      p.isWeddingPartner === true ||
      p.isPromotion === true

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
}

/**
 * Fetch all active partners, optionally filtered by legacy `category` string
 * and/or `featured` flag.
 */
export async function getPartners(
  category?: string,
  featured = false,
): Promise<Partner[]> {
  try {
    const raw: any[] = await client.fetch(partnersQuery, {}, { next: { revalidate: 60 } })
    let partners = normalizeDocs(raw)

    // GROQ already filters by active, but double-check in JS for safety
    partners = partners.filter((p) => p.active === true)

    if (category) {
      partners = filterPartnersByCategory(partners, category)
    }

    if (featured) {
      partners = partners.filter((p) => p.featured === true)
    }

    return partners
  } catch (error) {
    console.warn('[Sanity] Partners collection not found or error, returning empty array:', error)
    return []
  }
}

/**
 * Get partners by logical type using the new checkbox fields.
 */
export async function getPartnersByType(
  type: PartnerType,
  featured = false,
): Promise<Partner[]> {
  try {
    const raw: any[] = await client.fetch(partnersQuery, {}, { next: { revalidate: 60 } })
    let partners = normalizeDocs(raw)

    partners = partners.filter((p) => p.active === true)
    partners = filterPartnersByType(partners, type)

    if (featured) {
      partners = partners.filter((p) => p.featured === true)
    }

    return partners
  } catch (error) {
    console.warn('[Sanity] Partners collection not found or error, returning empty array:', error)
    return []
  }
}

/** Get a single active partner by its slug. */
export async function getPartnerBySlugLocal(slug: string): Promise<Partner | null> {
  try {
    const raw = await client.fetch(
      groq`*[_type == "partner" && slug.current == $slug && active == true][0] {
        _id, _type, name, slug,
        isPromotion, isPremierPartner, isReferralPartner, isWeddingPartner,
        promotionCategory, promotionStartDate, promotionEndDate, promotionDetails,
        category, subcategory,
        weddingCategory, weddingDescription, weddingBlurb,
        logo { ..., asset-> { _id, url, metadata } },
        description, website, phone, email, address,
        featured, order, blurb, sms_template,
        images[] { ..., image { ..., asset-> { _id, url, metadata } } },
        active, publish_date
      }`,
      { slug },
      { next: { revalidate: 60 } },
    )
    return raw ? normalizeDoc<Partner>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching partner ${slug}:`, error)
    return null
  }
}

// Local aliases
export const getPartnersLocal = getPartners
export const getPartnersByTypeLocal = getPartnersByType

// ============================================================================
// PAGES
// ============================================================================

/** Get a single published page by its slug. */
export async function getPageBySlug(slug: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await client.fetch(pageBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching page ${slug}:`, error)
    return null
  }
}

/** Local variant — returns all published pages (unwrapped array). */
export const getPagesLocal = async (): Promise<unknown[]> => {
  try {
    const raw: any[] = await client.fetch(
      groq`*[_type == "page" && published == true] | order(title asc) {
        _id, _type, title, slug, content,
        featuredImage { ..., asset-> { _id, url, metadata } },
        published
      }`,
      {},
      { next: { revalidate: 60 } },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error('[Sanity] Error fetching all pages:', error)
    return []
  }
}

// ============================================================================
// VENUES
// ============================================================================

/** Get all active venues sorted by display order. */
export async function getVenues(
  params?: PaginationParams,
): Promise<{ docs: Venue[] }> {
  try {
    const raw: any[] = await client.fetch(venuesQuery, {}, { next: { revalidate: 60 } })
    const docs = normalizeDocs(raw)
    return paginateSimple(docs, params)
  } catch (error) {
    console.error('[Sanity] Error fetching venues:', error)
    return { docs: [] }
  }
}

/** Get a single active venue by its slug. */
export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  try {
    const raw = await client.fetch(venueBySlugQuery, { slug }, { next: { revalidate: 60 } })
    return raw ? normalizeDoc<Venue>(raw) : null
  } catch (error) {
    console.error(`[Sanity] Error fetching venue ${slug}:`, error)
    return null
  }
}

// ============================================================================
// EVENTS
// ============================================================================

/** Get all active events sorted by date. */
export async function getEvents(
  params?: PaginationParams,
): Promise<{ docs: Event[] }> {
  try {
    const raw: any[] = await client.fetch(eventsQuery, {}, { next: { revalidate: 60 } })
    const docs = normalizeDocs(raw)
    return paginateSimple(docs, params)
  } catch (error) {
    console.error('[Sanity] Error fetching events:', error)
    return { docs: [] }
  }
}

/**
 * Get upcoming (today or later) active events.
 * Uses `cache: 'no-store'` so the events calendar is always fresh.
 * Includes a JS date guard to ensure events from today are included even when
 * `now()` in GROQ evaluates to a time after midnight.
 */
export async function getUpcomingEvents(limit = 50): Promise<Event[]> {
  try {
    // Fetch all active events and filter for upcoming in JS.
    // This avoids the edge-case where GROQ's now() excludes today's events
    // whose datetime is set to midnight.
    const raw: any[] = await client.fetch(eventsQuery, {}, { cache: 'no-store' })
    const docs = normalizeDocs(raw)

    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const upcoming = docs.filter((event) => {
      const eventDateStr = (event.date || '').split('T')[0]
      return event.active !== false && eventDateStr >= todayStr
    })

    // Already sorted by date from the GROQ query
    return upcoming.slice(0, limit)
  } catch (error) {
    console.error('[Sanity] Error fetching upcoming events:', error)
    return []
  }
}

/** Get upcoming active events for a specific venue. */
export async function getEventsByVenue(venueId: string): Promise<Event[]> {
  try {
    const raw: any[] = await client.fetch(
      eventsByVenueQuery,
      { venueId },
      { cache: 'no-store' },
    )
    return normalizeDocs(raw)
  } catch (error) {
    console.error(`[Sanity] Error fetching events for venue ${venueId}:`, error)
    return []
  }
}

/**
 * Get a single active event by its slug.
 * Only returns events whose date is today or in the future.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const raw = await client.fetch(eventBySlugQuery, { slug }, { cache: 'no-store' })
    if (!raw) return null

    const event = normalizeDoc<Event>(raw)

    // Verify the event is still upcoming (today or future)
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const eventDateStr = (event.date || '').split('T')[0]

    if (eventDateStr < todayStr) return null

    return event
  } catch (error) {
    console.error(`[Sanity] Error fetching event ${slug}:`, error)
    return null
  }
}

// ============================================================================
// MEDIA HELPERS
// ============================================================================

/**
 * Get a URL string from a media source. Handles:
 *
 * 1. **Sanity image references** — objects containing an `asset` field or a
 *    `_ref` string. Resolved via the Sanity image URL builder.
 * 2. **Absolute URLs** (starting with `http`) — returned as-is. Covers legacy
 *    Supabase / Payload-hosted images during migration.
 * 3. **Relative paths** — prefixed with the site's base URL (legacy Payload
 *    media that was served from the same origin).
 * 4. **Falsy / empty values** — returns an empty string.
 */
export function getMediaUrl(source: any): string {
  if (!source) return ''

  // Already a full URL string (legacy Supabase / external images)
  if (typeof source === 'string') {
    if (source.startsWith('http')) return source

    // Relative path — prefix with base URL (legacy Payload media)
    const mediaBaseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      'https://www.lakeridepros.com'
    return `${mediaBaseUrl}${source}`
  }

  // Sanity image reference object
  if (typeof source === 'object') {
    // If the resolved asset already has a URL, use it directly
    if (source.asset?.url) return source.asset.url

    // Use the Sanity image URL builder for proper CDN URLs
    try {
      return urlFor(source).url()
    } catch {
      // Fall through — the source might not be a valid Sanity image ref
    }

    // Legacy Payload image object with a `url` field
    if (typeof source.url === 'string') {
      return getMediaUrl(source.url)
    }
  }

  return ''
}

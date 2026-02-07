/**
 * Server-only analytics functions
 * Uses Sanity client to fetch service analytics data
 */

import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

/**
 * Fetch popular services from Sanity (server-side only, for build time)
 * @param limit - Maximum number of services to return (default: 5)
 * @returns Promise that resolves to array of popular services
 */
export async function getPopularServicesLocal(limit: number = 5): Promise<Array<{
  name: string
  slug: string
  popularityScore: number
  views: number
  bookings: number
}>> {
  try {
    const results = await client.fetch(
      groq`*[_type == "serviceAnalytics" && defined(service)] | order(popularityScore desc) [0...$limit] {
        popularityScore,
        views,
        bookings,
        service-> {
          title,
          "slug": slug.current
        }
      }`,
      { limit },
      { next: { revalidate: 300 } }
    )

    return (results || [])
      .filter((item: any) => item.service && typeof item.service === 'object')
      .map((item: any) => ({
        name: item.service.title,
        slug: item.service.slug,
        popularityScore: item.popularityScore || 0,
        views: item.views || 0,
        bookings: item.bookings || 0,
      }))
  } catch (error) {
    console.error('Error fetching popular services from Sanity:', error)
    return []
  }
}

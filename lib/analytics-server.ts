/**
 * Server-only analytics functions
 * This file contains functions that use Payload directly and should only be imported server-side
 */

import { getPayload } from 'payload'
import config from '@payload-config'

interface ServiceAnalytics {
  service: {
    title: string
    slug: string
  } | string
  popularityScore: number
  views: number
  bookings: number
}

/**
 * Fetch popular services directly from Payload (server-side only, for build time)
 * This avoids HTTP request issues during static site generation
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
    const payload = await getPayload({ config })

    // Fetch analytics sorted by popularity score
    const analyticsResponse = await payload.find({
      collection: 'service-analytics',
      sort: '-popularityScore',
      limit,
      depth: 2,
    })

    // Map to service info
    const popularServices = analyticsResponse.docs
      .map((analytics) => {
        // Type assertion needed because Payload types are complex
        const typedAnalytics = analytics as unknown as ServiceAnalytics
        if (!typedAnalytics.service || typeof typedAnalytics.service === 'string') {
          return null
        }
        return {
          name: typedAnalytics.service.title,
          slug: typedAnalytics.service.slug,
          popularityScore: typedAnalytics.popularityScore,
          views: typedAnalytics.views,
          bookings: typedAnalytics.bookings,
        }
      })
      .filter((service): service is NonNullable<typeof service> => service !== null)

    return popularServices
  } catch (error) {
    console.error('Error fetching popular services locally:', error)
    return []
  }
}

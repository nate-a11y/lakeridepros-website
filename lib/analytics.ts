/**
 * Get the base URL for API requests
 * During build time (SSG), we need to use an absolute URL
 */
function getBaseUrl(): string {
  // Browser should use relative URL
  if (typeof window !== 'undefined') return ''

  // For Vercel deployments (preview or production)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // For local development
  return 'http://localhost:3000'
}

/**
 * Track a service analytics event
 * @param serviceSlug - The slug of the service to track
 * @param eventType - Type of event: 'view' or 'booking'
 * @returns Promise that resolves when tracking is complete
 */
export async function trackServiceEvent(
  serviceSlug: string,
  eventType: 'view' | 'booking'
): Promise<void> {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceSlug,
        eventType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to track ${eventType}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // Log error but don't throw - analytics failures shouldn't break the app
    console.error(`Analytics tracking error (${eventType}):`, error)
  }
}

/**
 * Fetch popular services based on analytics (client-side or runtime)
 * @param limit - Maximum number of services to return (default: 5)
 * @returns Promise that resolves to array of popular services
 */
export async function getPopularServices(limit: number = 5): Promise<Array<{
  name: string
  slug: string
  popularityScore: number
  views: number
  bookings: number
}>> {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}/api/analytics/popular-services?limit=${limit}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch popular services: ${response.statusText}`)
    }

    const data = await response.json()
    return data.services || []
  } catch (error) {
    console.error('Error fetching popular services:', error)
    return []
  }
}


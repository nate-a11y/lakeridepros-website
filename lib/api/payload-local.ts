import { getPayload } from 'payload'
import config from '@payload-config'
import type { Service } from '@/lib/types'

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

export async function getServicesLocal(): Promise<Service[]> {
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
      limit: 1000,
    })

    return result.docs as unknown as Service[]
  } catch (error) {
    console.error('[Payload Local] Error fetching services:', error)
    return []
  }
}

export async function getServiceBySlugLocal(slug: string): Promise<Service | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: slug,
        },
        active: {
          equals: true,
        },
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

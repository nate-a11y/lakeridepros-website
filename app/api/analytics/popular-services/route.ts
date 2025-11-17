import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    const payload = await getPayload({ config })

    // Fetch analytics sorted by popularity score
    const analyticsResponse = await payload.find({
      collection: 'service-analytics',
      sort: '-popularityScore', // Sort by popularity descending
      limit,
      depth: 2, // Include related service data
    })

    // Map to service info
    const popularServices = analyticsResponse.docs
      .map((analytics: any) => {
        if (!analytics.service || typeof analytics.service === 'string') {
          return null
        }
        return {
          name: analytics.service.title,
          slug: analytics.service.slug,
          popularityScore: analytics.popularityScore,
          views: analytics.views,
          bookings: analytics.bookings,
        }
      })
      .filter((service: any) => service !== null)

    return NextResponse.json(
      {
        services: popularServices,
        total: analyticsResponse.totalDocs,
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching popular services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular services' },
      { status: 500 }
    )
  }
}

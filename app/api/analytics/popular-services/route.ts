import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5', 10)

    // Fetch analytics sorted by popularity score, with related service data
    const analyticsResults = await writeClient.fetch(
      groq`*[_type == "serviceAnalytics"] | order(popularityScore desc) [0...$limit] {
        popularityScore,
        views,
        bookings,
        "service": service->{ title, "slug": slug.current }
      }`,
      { limit }
    )

    // Map to service info
    const popularServices = analyticsResults
      .filter((analytics: any) => analytics.service)
      .map((analytics: any) => ({
        name: analytics.service.title,
        slug: analytics.service.slug,
        popularityScore: analytics.popularityScore,
        views: analytics.views,
        bookings: analytics.bookings,
      }))

    return NextResponse.json(
      {
        services: popularServices,
        total: analyticsResults.length,
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

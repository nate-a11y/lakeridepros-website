import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

interface TrackEventRequest {
  serviceSlug: string
  eventType: 'view' | 'booking'
}

interface DailyStat {
  date: string
  views: number
  bookings: number
  _key: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackEventRequest = await request.json()
    const { serviceSlug, eventType } = body

    // Validate request
    if (!serviceSlug || !eventType) {
      return NextResponse.json(
        { error: 'serviceSlug and eventType are required' },
        { status: 400 }
      )
    }

    if (eventType !== 'view' && eventType !== 'booking') {
      return NextResponse.json(
        { error: 'eventType must be "view" or "booking"' },
        { status: 400 }
      )
    }

    // Find the service by slug
    const service = await writeClient.fetch(
      groq`*[_type == "service" && slug.current == $slug][0] { _id }`,
      { slug: serviceSlug }
    )

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayStr = today.toISOString()

    // Find or create analytics record for this service
    let analytics = await writeClient.fetch(
      groq`*[_type == "serviceAnalytics" && service._ref == $serviceId][0]`,
      { serviceId: service._id }
    )

    if (!analytics) {
      // Create new analytics record
      analytics = await writeClient.create({
        _type: 'serviceAnalytics',
        service: { _type: 'reference', _ref: service._id },
        views: eventType === 'view' ? 1 : 0,
        bookings: eventType === 'booking' ? 1 : 0,
        viewsLast30Days: eventType === 'view' ? 1 : 0,
        bookingsLast30Days: eventType === 'booking' ? 1 : 0,
        popularityScore: eventType === 'booking' ? 10 : 1,
        lastViewedAt: eventType === 'view' ? now.toISOString() : undefined,
        lastBookedAt: eventType === 'booking' ? now.toISOString() : undefined,
        dailyStats: [
          {
            _key: crypto.randomUUID().slice(0, 8),
            date: todayStr,
            views: eventType === 'view' ? 1 : 0,
            bookings: eventType === 'booking' ? 1 : 0,
          },
        ],
      })
    } else {
      // Update existing analytics record
      const dailyStats: DailyStat[] = Array.isArray(analytics.dailyStats) ? [...analytics.dailyStats] : []

      // Find today's stats
      const todayStats = dailyStats.find((stat) => {
        const statDate = new Date(stat.date)
        return statDate.toDateString() === today.toDateString()
      })

      if (todayStats) {
        if (eventType === 'view') {
          todayStats.views = (todayStats.views || 0) + 1
        } else {
          todayStats.bookings = (todayStats.bookings || 0) + 1
        }
      } else {
        dailyStats.push({
          _key: crypto.randomUUID().slice(0, 8),
          date: todayStr,
          views: eventType === 'view' ? 1 : 0,
          bookings: eventType === 'booking' ? 1 : 0,
        })
      }

      // Keep only last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const recentStats = dailyStats
        .filter((stat) => new Date(stat.date) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)

      const viewsLast30Days = recentStats.reduce((sum, stat) => sum + (stat.views || 0), 0)
      const bookingsLast30Days = recentStats.reduce((sum, stat) => sum + (stat.bookings || 0), 0)

      analytics = await writeClient
        .patch(analytics._id)
        .set({
          views: (analytics.views || 0) + (eventType === 'view' ? 1 : 0),
          bookings: (analytics.bookings || 0) + (eventType === 'booking' ? 1 : 0),
          viewsLast30Days,
          bookingsLast30Days,
          popularityScore: (bookingsLast30Days * 10) + viewsLast30Days,
          lastViewedAt: eventType === 'view' ? now.toISOString() : analytics.lastViewedAt,
          lastBookedAt: eventType === 'booking' ? now.toISOString() : analytics.lastBookedAt,
          dailyStats: recentStats,
        })
        .commit()
    }

    return NextResponse.json(
      {
        success: true,
        popularityScore: analytics.popularityScore,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    )
  }
}

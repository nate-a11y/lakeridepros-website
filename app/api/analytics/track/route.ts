import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

interface TrackEventRequest {
  serviceSlug: string
  eventType: 'view' | 'booking'
}

interface DailyStat {
  date: string
  views: number
  bookings: number
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

    const payload = await getPayload({ config })

    // Find the service by slug
    const servicesResponse = await payload.find({
      collection: 'services',
      where: {
        slug: {
          equals: serviceSlug,
        },
      },
      limit: 1,
    })

    if (!servicesResponse.docs.length) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const service = servicesResponse.docs[0]
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Find or create analytics record for this service
    const analyticsResponse = await payload.find({
      collection: 'service-analytics',
      where: {
        service: {
          equals: service.id,
        },
      },
      limit: 1,
    })

    let analytics = analyticsResponse.docs[0]

    if (!analytics) {
      // Create new analytics record
      analytics = await payload.create({
        collection: 'service-analytics',
        data: {
          service: service.id,
          views: eventType === 'view' ? 1 : 0,
          bookings: eventType === 'booking' ? 1 : 0,
          viewsLast30Days: eventType === 'view' ? 1 : 0,
          bookingsLast30Days: eventType === 'booking' ? 1 : 0,
          popularityScore: eventType === 'booking' ? 10 : 1,
          lastViewedAt: eventType === 'view' ? now.toISOString() : undefined,
          lastBookedAt: eventType === 'booking' ? now.toISOString() : undefined,
          dailyStats: [
            {
              date: today.toISOString(),
              views: eventType === 'view' ? 1 : 0,
              bookings: eventType === 'booking' ? 1 : 0,
            },
          ],
        },
      })
    } else {
      // Update existing analytics record
      const dailyStats = Array.isArray(analytics.dailyStats) ? [...analytics.dailyStats] : []

      // Find today's stats
      const todayStats = dailyStats.find((stat) => {
        const typedStat = stat as DailyStat
        const statDate = new Date(typedStat.date)
        return statDate.toDateString() === today.toDateString()
      }) as DailyStat | undefined

      if (todayStats) {
        // Update today's stats
        if (eventType === 'view') {
          todayStats.views = (todayStats.views || 0) + 1
        } else {
          todayStats.bookings = (todayStats.bookings || 0) + 1
        }
      } else {
        // Add new day
        dailyStats.push({
          date: today.toISOString(),
          views: eventType === 'view' ? 1 : 0,
          bookings: eventType === 'booking' ? 1 : 0,
        })
      }

      // Keep only last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const recentStats = dailyStats.filter((stat) => {
        const typedStat = stat as DailyStat
        return new Date(typedStat.date) >= thirtyDaysAgo
      })

      // Sort by date descending and limit to 30 entries
      recentStats.sort((a, b) => {
        const typedA = a as DailyStat
        const typedB = b as DailyStat
        return new Date(typedB.date).getTime() - new Date(typedA.date).getTime()
      })
      const limitedStats = recentStats.slice(0, 30)

      // Calculate last 30 days totals
      const viewsLast30Days = limitedStats.reduce((sum: number, stat) => {
        const typedStat = stat as DailyStat
        return sum + (typedStat.views || 0)
      }, 0)
      const bookingsLast30Days = limitedStats.reduce((sum: number, stat) => {
        const typedStat = stat as DailyStat
        return sum + (typedStat.bookings || 0)
      }, 0)

      // Update analytics
      analytics = await payload.update({
        collection: 'service-analytics',
        id: analytics.id,
        data: {
          views: (analytics.views || 0) + (eventType === 'view' ? 1 : 0),
          bookings: (analytics.bookings || 0) + (eventType === 'booking' ? 1 : 0),
          viewsLast30Days,
          bookingsLast30Days,
          lastViewedAt: eventType === 'view' ? now.toISOString() : analytics.lastViewedAt,
          lastBookedAt: eventType === 'booking' ? now.toISOString() : analytics.lastBookedAt,
          dailyStats: limitedStats,
        },
      })
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

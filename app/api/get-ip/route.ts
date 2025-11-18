/**
 * API Route: Get Client IP Address
 * Returns the client's IP address for audit purposes
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Try to get IP from headers (works with most reverse proxies)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

    let ip = 'unknown'

    if (forwarded) {
      // x-forwarded-for may contain multiple IPs, take the first one
      ip = forwarded.split(',')[0].trim()
    } else if (realIp) {
      ip = realIp
    } else if (cfConnectingIp) {
      ip = cfConnectingIp
    }

    return NextResponse.json({
      ip,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting IP:', error)
    return NextResponse.json(
      { ip: 'unknown', error: 'Failed to determine IP' },
      { status: 500 }
    )
  }
}

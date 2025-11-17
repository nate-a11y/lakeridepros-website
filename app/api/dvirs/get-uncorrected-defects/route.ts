import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vehicleId = searchParams.get('vehicleId')

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Missing required parameter: vehicleId' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Find all uncorrected defects for this vehicle
    const uncorrectedDefects = await payload.find({
      collection: 'defects',
      where: {
        and: [
          {
            vehicle: {
              equals: vehicleId,
            },
          },
          {
            status: {
              not_equals: 'corrected',
            },
          },
        ],
      },
      limit: 1000,
      depth: 2, // Include related data like vehicle and DVIR info
    })

    return NextResponse.json(
      {
        defects: uncorrectedDefects.docs,
        count: uncorrectedDefects.totalDocs,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching uncorrected defects:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching defects. Please try again later.' },
      { status: 500 }
    )
  }
}

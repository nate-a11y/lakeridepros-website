import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.vehicle || !body.inspector || !body.inspectionDate || !body.inspectionType) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicle, inspector, inspectionDate, inspectionType' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Create the DVIR
    // The beforeChange hook will automatically populate carried over defects
    const dvir = await payload.create({
      collection: 'dvirs',
      data: {
        vehicle: body.vehicle,
        inspector: body.inspector,
        inspectionDate: body.inspectionDate,
        inspectionType: body.inspectionType,
        status: body.status || 'draft',
        odometerReading: body.odometerReading,
        inspectionItems: body.inspectionItems || [],
        safeToOperate: body.safeToOperate !== undefined ? body.safeToOperate : true,
        inspectorNotes: body.inspectorNotes,
      },
    })

    return NextResponse.json(
      {
        message: 'DVIR created successfully',
        dvir,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('DVIR creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the DVIR. Please try again later.' },
      { status: 500 }
    )
  }
}

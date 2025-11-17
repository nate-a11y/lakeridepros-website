import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.vehicle || !body.originDvir || !body.description || !body.identifiedBy || !body.identifiedDate) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicle, originDvir, description, identifiedBy, identifiedDate' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Create the defect
    const defect = await payload.create({
      collection: 'defects',
      data: {
        vehicle: body.vehicle,
        originDvir: body.originDvir,
        description: body.description,
        location: body.location,
        severity: body.severity || 'minor',
        status: 'open',
        identifiedBy: body.identifiedBy,
        identifiedDate: body.identifiedDate,
      },
    })

    return NextResponse.json(
      {
        message: 'Defect created successfully',
        defect,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Defect creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the defect. Please try again later.' },
      { status: 500 }
    )
  }
}

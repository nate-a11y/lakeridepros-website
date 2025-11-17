import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.defectId || !body.correctedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: defectId, correctedBy' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Update the defect status to corrected
    const defect = await payload.update({
      collection: 'defects',
      id: body.defectId,
      data: {
        status: 'corrected',
        correctedBy: body.correctedBy,
        correctedDate: new Date().toISOString(),
        correctionNotes: body.correctionNotes || '',
      },
    })

    return NextResponse.json(
      {
        message: 'Defect marked as corrected successfully',
        defect,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error marking defect as corrected:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the defect. Please try again later.' },
      { status: 500 }
    )
  }
}

/**
 * API Route: Submit Driver Application
 * Changes status from draft to submitted
 * Uses service role key to bypass RLS
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, data } = body

    if (!applicationId || !data) {
      return NextResponse.json(
        { error: 'Application ID and data are required' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get singleton Supabase client
    const supabase = getSupabaseServerClient()

    const submissionData = {
      ...data,
      status: 'submitted',
      submission_ip: ip,
      submission_user_agent: userAgent,
      certification_signature_date: new Date().toISOString(),
      date_of_application: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }

    const { data: submitted, error } = (await supabase
      .from('driver_applications')
      .update(submissionData as any)
      .eq('id', applicationId)
      .eq('status', 'draft') // Only submit if still in draft status
      .select()
      .single()) as { data: any; error: any }

    if (error) {
      console.error('Error submitting application:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!submitted) {
      return NextResponse.json(
        { error: 'Application not found or already submitted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: submitted })
  } catch (error) {
    console.error('Unexpected error in submit API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

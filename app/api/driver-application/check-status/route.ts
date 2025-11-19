/**
 * API Route: Driver Application Status Lookup
 * Allows applicants to check their application status
 * Requires application ID + email for security
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Create fresh client to avoid singleton caching issues in serverless
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
 
    const { applicationId, email } = await request.json()

    if (!applicationId || !email) {
      return NextResponse.json(
        { error: 'Application ID and email are required' },
        { status: 400 }
      )
    }

    // Query application with matching ID and email for security
    const { data, error } = await supabase
      .from('driver_applications')
      .select('id, status, created_at, submitted_at, first_name, last_name, email')
      .eq('id', applicationId)
      .eq('email', email.toLowerCase())
      .single() as { data: any; error: any }

    if (error || !data) {
      console.error('Application lookup failed:', {
        applicationId,
        email: email.toLowerCase(),
        error: error?.message || 'No data returned',
        errorCode: error?.code
      })
      return NextResponse.json(
        { error: 'Application not found. Please check your Application ID and email address.' },
        { status: 404 }
      )
    }

    // Return only safe, non-sensitive data
    return NextResponse.json({
      id: data.id,
      status: data.status,
      created_at: data.created_at,
      submitted_at: data.submitted_at,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email
    })
  } catch (error) {
    console.error('Error fetching application status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application status' },
      { status: 500 }
    )
  }
}

// GET handler for health check
export async function GET() {
  return NextResponse.json({ status: 'ok', route: 'driver-application-status' })
}

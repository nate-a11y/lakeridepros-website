/**
 * API Route: Save/Update Driver Application Draft
 * Uses service role key to bypass RLS
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import type { DriverApplicationData } from '@/lib/supabase/driver-application'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, data } = body

    if (!data) {
      return NextResponse.json(
        { error: 'Application data is required' },
        { status: 400 }
      )
    }

    // Get singleton Supabase client
    const supabase = getSupabaseServerClient()

    // Ensure status is draft
    const draftData: Partial<DriverApplicationData> = {
      ...data,
      status: 'draft' as const,
      updated_at: new Date().toISOString()
    }

    if (applicationId) {
      // Update existing draft
      const { data: updated, error } = (await supabase
        .from('driver_applications')
        .update(draftData as any)
        .eq('id', applicationId)
        .eq('status', 'draft') // Only update if still in draft status
        .select()
        .single()) as { data: any; error: any }

      if (error) {
        console.error('Error updating draft:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data: updated })
    } else {
      // Create new draft
      const { data: created, error } = (await supabase
        .from('driver_applications')
        .insert([draftData as any])
        .select()
        .single()) as { data: any; error: any }

      if (error) {
        console.error('Error creating draft:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data: created })
    }
  } catch (error) {
    console.error('Unexpected error in draft API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('id')

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Get singleton Supabase client
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('driver_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error) {
      console.error('Error fetching application:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error in draft GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('id')

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Get singleton Supabase client
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('driver_applications')
      .delete()
      .eq('id', applicationId)
      .eq('status', 'draft') // Only delete if in draft status

    if (error) {
      console.error('Error deleting draft:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in draft DELETE API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

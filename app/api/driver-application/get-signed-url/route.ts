/**
 * API Route: Get Signed URL for existing file
 * Uses service role key to generate signed URLs for private storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Get singleton Supabase client
    const supabase = getSupabaseServerClient()

    // Extract path from full URL if needed
    let path = filePath
    if (filePath.includes('/storage/v1/object/')) {
      // Extract path from full URL
      const matches = filePath.match(/\/storage\/v1\/object\/(?:public|sign)\/driver-applications\/(.+?)(\?|$)/)
      if (matches && matches[1]) {
        path = matches[1]
      }
    } else if (filePath.includes('driver-applications/')) {
      // Extract path after bucket name
      path = filePath.split('driver-applications/')[1]?.split('?')[0] || filePath
    }

    // Generate a signed URL for private bucket (expires in 1 year)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('driver-applications')
      .createSignedUrl(path, 31536000) // 1 year in seconds

    if (urlError || !signedUrlData) {
      console.error('Error generating signed URL:', urlError)
      return NextResponse.json(
        { error: 'Failed to generate signed URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: signedUrlData.signedUrl })
  } catch (error) {
    console.error('Unexpected error in get-signed-url API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

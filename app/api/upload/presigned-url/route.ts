import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const bucket = 'media'

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType } = await req.json()

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing filename or contentType' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const url = process.env.SUPABASE_URL?.trim()
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(url, key)

    // Generate unique filename to avoid collisions
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${filename}`

    // Create signed upload URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(uniqueFilename)

    if (error) {
      console.error('[Presigned URL] Error:', error)
      return NextResponse.json(
        { error: 'Failed to create upload URL' },
        { status: 500 }
      )
    }

    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFilename)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: uniqueFilename,
      publicUrl: publicUrlData.publicUrl,
    })
  } catch (error) {
    console.error('[Presigned URL] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

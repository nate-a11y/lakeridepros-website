import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/src/payload.config'

/**
 * Creates a media record from a file that was already uploaded to Supabase.
 * This bypasses Payload's normal upload flow for files already in storage.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Verify user is authenticated
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { filename, mimeType, filesize, width, height, url, alt } = body

    if (!filename || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the media document directly
    // This creates a record that points to the already-uploaded file
    const media = await payload.create({
      collection: 'media',
      data: {
        filename,
        mimeType: mimeType || 'image/webp',
        filesize: filesize ? parseInt(filesize) : 0,
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        url,
        alt: alt || filename.replace(/\.[^.]+$/, ''),
      },
    })

    return NextResponse.json({ doc: media })
  } catch (error) {
    console.error('[Create Media] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create media record' },
      { status: 500 }
    )
  }
}

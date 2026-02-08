import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

/**
 * Creates a media/asset record in Sanity.
 *
 * TODO: Sanity handles media through its asset pipeline differently from Payload/Supabase.
 * For files already uploaded externally, we create a document referencing the URL.
 * For new uploads, prefer using writeClient.assets.upload('image', buffer) instead.
 * This route may need further refinement to fully align with Sanity's asset model.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication via secret header
    const adminSecret = req.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_API_SECRET) {
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

    // TODO: For Sanity, media should ideally be uploaded through the asset pipeline:
    //   const asset = await writeClient.assets.upload('image', buffer, { filename })
    // For now, create a media document that references the external URL.
    const media = await writeClient.create({
      _type: 'media',
      filename,
      mimeType: mimeType || 'image/webp',
      filesize: filesize ? parseInt(filesize) : 0,
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      url,
      alt: alt || filename.replace(/\.[^.]+$/, ''),
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

import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

/**
 * Create a media reference in Sanity.
 * For files already uploaded to Sanity (via /api/upload/presigned-url),
 * or for registering external URLs as media records.
 *
 * POST /api/upload/create-media
 * Headers: x-admin-secret
 * Body: { assetId?, url?, filename, alt? }
 */
export async function POST(req: NextRequest) {
  try {
    const adminSecret = req.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { assetId, url, filename, alt } = body

    if (!assetId && !url) {
      return NextResponse.json(
        { error: 'Either assetId or url is required' },
        { status: 400 }
      )
    }

    if (assetId) {
      // Reference an existing Sanity asset
      const media = await writeClient.create({
        _type: 'media',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        },
        alt: alt || filename?.replace(/\.[^.]+$/, '') || 'Uploaded image',
      })
      return NextResponse.json({ doc: media })
    }

    // External URL reference
    const media = await writeClient.create({
      _type: 'media',
      filename: filename || 'external-media',
      url,
      alt: alt || filename?.replace(/\.[^.]+$/, '') || 'External image',
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

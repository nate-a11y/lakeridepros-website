import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

/**
 * Upload a file directly to Sanity's asset pipeline.
 * Accepts multipart form data with a 'file' field.
 *
 * POST /api/upload/presigned-url
 * Headers: x-admin-secret
 * Body: FormData with 'file' field
 */
export async function POST(req: NextRequest) {
  try {
    const adminSecret = req.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const assetType = file.type.startsWith('image/') ? 'image' : 'file'

    const asset = await writeClient.assets.upload(assetType, buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({
      asset,
      url: asset.url,
      assetId: asset._id,
    })
  } catch (error) {
    console.error('[Upload] Error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

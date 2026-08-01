import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import {
  createCustomerPhotoSessionToken,
  CUSTOMER_PHOTO_BUCKET,
  CUSTOMER_PHOTO_SESSION_TTL_SECONDS,
  sanitizeCustomerPhotoFilename,
  validateCustomerPhotoFiles,
  verifyCustomerPhotoSessionToken,
  type CustomerPhotoFileInput,
  type CustomerPhotoSession,
} from '@/lib/customer-photo-upload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getServerConfiguration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const uploadSecret = process.env.CUSTOMER_PHOTO_UPLOAD_SECRET
    || process.env.ADMIN_API_SECRET

  if (!url || !serviceKey || !uploadSecret) {
    throw new Error('Customer photo upload is not configured')
  }

  return {
    uploadSecret,
    supabase: createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  }
}

async function verifyTurnstile(request: NextRequest, token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) throw new Error('Security verification is not configured')

  const remoteIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || ''
  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  )
  const result = await response.json() as { success?: boolean }
  if (!response.ok || !result.success) {
    throw new Error('Security verification failed. Please try again.')
  }
}

async function prepareUpload(request: NextRequest, body: Record<string, unknown>) {
  const turnstileToken = String(body.turnstileToken || '')
  const customerName = String(body.customerName || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80)
  const caption = String(body.caption || '').trim().slice(0, 1000) || null

  if (!customerName) throw new Error('Please enter your name.')
  if (body.consent !== true) {
    throw new Error('Please confirm you have permission to share these photos.')
  }
  if (!turnstileToken) throw new Error('Please complete the security check.')

  const files = validateCustomerPhotoFiles(
    Array.isArray(body.files) ? body.files as CustomerPhotoFileInput[] : [],
  )
  await verifyTurnstile(request, turnstileToken)

  const { supabase, uploadSecret } = getServerConfiguration()
  const sessionId = randomUUID()
  const month = new Date().toISOString().slice(0, 7)
  const sessionFiles = files.map((file) => ({
    path: `customer/${month}/${sessionId}/${randomUUID()}-${sanitizeCustomerPhotoFilename(file.filename)}`,
    ...file,
  }))

  const uploads = []
  for (const file of sessionFiles) {
    const { data, error } = await supabase.storage
      .from(CUSTOMER_PHOTO_BUCKET)
      .createSignedUploadUrl(file.path)
    if (error || !data?.token) {
      throw error || new Error('Could not prepare photo upload')
    }
    uploads.push({
      path: file.path,
      uploadToken: data.token,
      mimeType: file.mimeType,
    })
  }

  const session: CustomerPhotoSession = {
    version: 1,
    expiresAt: Date.now() + CUSTOMER_PHOTO_SESSION_TTL_SECONDS * 1000,
    sessionId,
    customerName,
    caption,
    files: sessionFiles,
  }

  return NextResponse.json({
    sessionToken: createCustomerPhotoSessionToken(session, uploadSecret),
    uploads,
  })
}

async function finalizeUpload(body: Record<string, unknown>) {
  const { supabase, uploadSecret } = getServerConfiguration()
  const session = verifyCustomerPhotoSessionToken(
    String(body.sessionToken || ''),
    uploadSecret,
  )
  const expectedSessionSegment = `/${session.sessionId}/`

  if (session.files.some((file) => (
    !file.path.startsWith('customer/')
    || !file.path.includes(expectedSessionSegment)
  ))) {
    throw new Error('Invalid upload session')
  }

  const folder = session.files[0].path.split('/').slice(0, -1).join('/')
  const { data: storedObjects, error: listError } = await supabase.storage
    .from(CUSTOMER_PHOTO_BUCKET)
    .list(folder, { limit: 100 })
  if (listError) throw listError

  const storedByName = new Map(
    (storedObjects || []).map((object) => [object.name, object]),
  )
  for (const file of session.files) {
    const objectName = file.path.split('/').pop() || ''
    if (!storedByName.has(objectName)) {
      throw new Error('One or more photos did not finish uploading. Please retry.')
    }
  }

  const rows = session.files.map((file) => ({
    storage_bucket: CUSTOMER_PHOTO_BUCKET,
    storage_path: file.path,
    filename: file.filename,
    mime_type: file.mimeType,
    size_bytes: file.size,
    caption: session.caption,
    uploaded_by: null,
    author_name: session.customerName,
    upload_source: 'customer_link',
  }))
  const { error: insertError } = await supabase
    .from('photo_board_posts')
    .upsert(rows, {
      onConflict: 'storage_bucket,storage_path',
      ignoreDuplicates: true,
    })
  if (insertError) throw insertError

  return NextResponse.json({ success: true, count: rows.length })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>
    if (body.action === 'prepare') return await prepareUpload(request, body)
    if (body.action === 'finalize') return await finalizeUpload(body)
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Photo upload failed'
    const configurationError = message.includes('not configured')
    console.error('[Customer Photo Upload]', configurationError ? message : 'Request rejected')
    return NextResponse.json(
      { error: configurationError ? 'Photo upload is temporarily unavailable.' : message },
      { status: configurationError ? 500 : 400 },
    )
  }
}

import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SIGNATURE_HEADER = 'x-fourthwall-hmac-sha256'
const MAX_WEBHOOK_BYTES = 1_048_576
const EVENT_TTL_MS = 10 * 60 * 1000
const MAX_RECENT_EVENTS = 1_000
const recentEvents = new Map<string, number>()

export const runtime = 'nodejs'

const webhookEventSchema = z.object({
  id: z.string().min(1).max(256),
  webhookId: z.string().min(1).max(256).optional(),
  type: z.string().min(1).max(128),
}).passthrough()

const SHOP_REVALIDATION_EVENTS = new Set([
  'PRODUCT_CREATED',
  'PRODUCT_UPDATED',
  'COLLECTION_UPDATED',
])

function signaturesMatch(payload: string, providedSignature: string, secret: string) {
  const expected = createHmac('sha256', secret).update(payload).digest()
  const normalizedSignature = providedSignature.trim()

  // HMAC-SHA256 is exactly 32 bytes, or 44 canonical base64 characters.
  if (!/^[A-Za-z0-9+/]{43}=$/.test(normalizedSignature)) return false

  let provided: Buffer
  try {
    provided = Buffer.from(normalizedSignature, 'base64')
  } catch {
    return false
  }

  return (
    provided.length === expected.length &&
    provided.toString('base64') === normalizedSignature &&
    timingSafeEqual(provided, expected)
  )
}

function isDuplicateEvent(eventId: string) {
  const now = Date.now()

  for (const [id, expiresAt] of recentEvents) {
    if (expiresAt <= now) recentEvents.delete(id)
  }

  return recentEvents.has(eventId)
}

function rememberEvent(eventId: string) {
  if (recentEvents.size >= MAX_RECENT_EVENTS) {
    const oldestEventId = recentEvents.keys().next().value
    if (oldestEventId) recentEvents.delete(oldestEventId)
  }

  recentEvents.set(eventId, Date.now() + EVENT_TTL_MS)
}

export async function GET() {
  return NextResponse.json(
    {
      service: 'fourthwall-webhook',
      configured: Boolean(process.env.FOURTHWALL_WEBHOOK_SECRET?.trim()),
      webhookIdConfigured: Boolean(process.env.FOURTHWALL_WEBHOOK_ID?.trim()),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(request: NextRequest) {
  const secret = process.env.FOURTHWALL_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 })
  }

  const signature = request.headers.get(SIGNATURE_HEADER)
  const payload = await request.text()

  if (Buffer.byteLength(payload, 'utf8') > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Webhook payload is too large' }, { status: 413 })
  }

  if (!signature || !signaturesMatch(payload, signature, secret)) {
    console.warn('[Fourthwall webhook] Signature verification failed', {
      payloadBytes: Buffer.byteLength(payload, 'utf8'),
      signaturePresent: Boolean(signature),
      signatureFormatValid: Boolean(signature && /^[A-Za-z0-9+/]{43}=$/.test(signature.trim())),
    })
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const parsed = webhookEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid webhook event' }, { status: 400 })
  }

  const event = parsed.data
  const configuredWebhookId = process.env.FOURTHWALL_WEBHOOK_ID?.trim()
  if (configuredWebhookId && event.webhookId !== configuredWebhookId) {
    return NextResponse.json({ error: 'Webhook configuration mismatch' }, { status: 401 })
  }

  if (isDuplicateEvent(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Revalidation fetches current Fourthwall state, so replayed or out-of-order
  // catalog events remain safe even across instances where the local dedupe cache differs.
  if (SHOP_REVALIDATION_EVENTS.has(event.type)) {
    revalidatePath('/shop', 'layout')
  }

  console.info('[Fourthwall webhook]', {
    eventId: event.id,
    eventType: event.type,
  })
  rememberEvent(event.id)

  return NextResponse.json({ received: true })
}

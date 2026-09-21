import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const SIGNATURE_HEADER = 'x-fourthwall-hmac-sha256'

function signaturesMatch(payload: string, providedSignature: string, secret: string) {
  const expected = createHmac('sha256', secret).update(payload).digest()

  let provided: Buffer
  try {
    provided = Buffer.from(providedSignature, 'base64')
  } catch {
    return false
  }

  return provided.length === expected.length && timingSafeEqual(provided, expected)
}

export async function GET() {
  return NextResponse.json({
    service: 'fourthwall-webhook',
    configured: Boolean(process.env.FOURTHWALL_WEBHOOK_SECRET),
  })
}

export async function POST(request: NextRequest) {
  const secret = process.env.FOURTHWALL_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 })
  }

  const signature = request.headers.get(SIGNATURE_HEADER)
  const payload = await request.text()

  if (!signature || !signaturesMatch(payload, signature, secret)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  let event: { id?: string; type?: string }
  try {
    event = JSON.parse(payload) as { id?: string; type?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (
    event.type === 'PRODUCT_CREATED' ||
    event.type === 'PRODUCT_UPDATED' ||
    event.type === 'COLLECTION_UPDATED'
  ) {
    revalidatePath('/shop', 'layout')
  }

  console.info('[Fourthwall webhook]', {
    eventId: event.id || 'unknown',
    eventType: event.type || 'unknown',
  })

  return NextResponse.json({ received: true })
}

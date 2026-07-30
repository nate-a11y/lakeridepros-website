import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'
import {
  extractChargebeeSubscriptionId,
  INSIDER_CHARGEBEE_EVENTS,
  type ChargebeeWebhookPayload,
} from '@/lib/chargebee/insider-sync'

export const runtime = 'nodejs'

type ChargebeeSyncMode = 'off' | 'dry-run' | 'apply'

function getChargebeeSyncMode(): ChargebeeSyncMode {
  const mode = process.env.INSIDERS_CHARGEBEE_SYNC_MODE?.trim().toLowerCase()
  if (mode === 'dry-run' || mode === 'apply') return mode
  return 'off'
}

function constantTimeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

function hasValidBasicAuthentication(request: NextRequest): boolean {
  const username = process.env.CHARGEBEE_WEBHOOK_USERNAME
  const password = process.env.CHARGEBEE_WEBHOOK_PASSWORD
  if (!username || !password) return false

  const expected = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
  return constantTimeEqual(
    request.headers.get('authorization') || '',
    expected,
  )
}

export async function POST(request: NextRequest) {
  if (
    !process.env.CHARGEBEE_WEBHOOK_USERNAME ||
    !process.env.CHARGEBEE_WEBHOOK_PASSWORD
  ) {
    console.error('[Chargebee Webhook] Missing basic-auth configuration')
    return NextResponse.json(
      { error: 'Webhook configuration missing' },
      { status: 500 },
    )
  }

  if (!hasValidBasicAuthentication(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: ChargebeeWebhookPayload
  try {
    payload = (await request.json()) as ChargebeeWebhookPayload
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 },
    )
  }

  if (
    payload.object !== 'event' ||
    payload.api_version !== 'v2' ||
    !payload.id ||
    !payload.event_type ||
    !Number.isFinite(payload.occurred_at)
  ) {
    return NextResponse.json(
      { error: 'Invalid Chargebee event' },
      { status: 400 },
    )
  }

  if (!INSIDER_CHARGEBEE_EVENTS.has(payload.event_type)) {
    return NextResponse.json(
      { received: true, ignored: true },
      { status: 200 },
    )
  }

  const subscriptionId = extractChargebeeSubscriptionId(payload)
  if (!subscriptionId) {
    return NextResponse.json(
      { error: 'Subscription ID missing' },
      { status: 400 },
    )
  }

  const syncMode = getChargebeeSyncMode()
  if (syncMode === 'off') {
    return NextResponse.json(
      { error: 'Insider billing sync is disabled' },
      {
        status: 503,
        headers: { 'retry-after': '3600' },
      },
    )
  }

  if (syncMode === 'dry-run') {
    return NextResponse.json(
      { received: true, dryRun: true },
      { status: 200 },
    )
  }

  await inngest.send({
    id: `chargebee:${payload.id}`,
    name: 'chargebee/insider.subscription.sync.requested',
    data: {
      chargebeeEventId: payload.id,
      eventType: payload.event_type,
      subscriptionId,
      occurredAt: payload.occurred_at,
    },
  })

  return NextResponse.json({ received: true }, { status: 200 })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import {
  createFourthwallCart,
  FourthwallCheckoutError,
  FourthwallConfigurationError,
  getFourthwallCheckoutUrl,
  validateFourthwallCheckoutItems,
} from '@/lib/fourthwall/checkout'

const MAX_BODY_BYTES = 16_384

export const runtime = 'nodejs'

const checkoutRequestSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.uuid(),
      quantity: z.number().int().min(1).max(20),
    }),
  ).min(1).max(20),
}).superRefine(({ items }, context) => {
  const variantIds = new Set<string>()
  for (const item of items) {
    if (variantIds.has(item.variantId)) {
      context.addIssue({
        code: 'custom',
        message: 'Each variant may only appear once',
        path: ['items'],
      })
      return
    }
    variantIds.add(item.variantId)
  }
})

function jsonError(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...headers,
      },
    },
  )
}

export async function POST(request: Request) {
  if (process.env.FOURTHWALL_CHECKOUT_ENABLED !== 'true') {
    return jsonError('Fourthwall checkout is not currently available', 503)
  }

  const ip = getClientIp(request)
  const limit = rateLimit(`fourthwall-checkout:${ip}`, {
    limit: 10,
    windowMs: 60_000,
  })

  if (!limit.success) {
    return jsonError('Too many checkout attempts. Please try again shortly.', 429, {
      'Retry-After': String(Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))),
    })
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase()
  if (contentType !== 'application/json') {
    return jsonError('Checkout requests must use application/json', 415)
  }

  const rawBody = await request.text()
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return jsonError('Checkout request is too large', 413)
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return jsonError('Invalid checkout request', 400)
  }

  const parsed = checkoutRequestSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Your cart contains invalid items', 400)
  }

  try {
    await validateFourthwallCheckoutItems(parsed.data.items)
    const cartId = await createFourthwallCart(parsed.data.items)
    const url = getFourthwallCheckoutUrl(cartId)

    return NextResponse.json(
      { url, cartId },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof FourthwallConfigurationError) {
      console.error('[Fourthwall checkout] Configuration error', { error: error.message })
      return jsonError('Fourthwall checkout is not configured', 503)
    }

    if (error instanceof FourthwallCheckoutError) {
      return jsonError(error.message, error.status)
    }

    console.error('[Fourthwall checkout] Unexpected error', {
      error: error instanceof Error ? error.name : 'Unknown error',
    })
    return jsonError('Fourthwall checkout is temporarily unavailable', 502)
  }
}

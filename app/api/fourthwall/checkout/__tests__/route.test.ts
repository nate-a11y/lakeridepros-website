import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { createCart, getCheckoutUrl, validateItems } = vi.hoisted(() => ({
  createCart: vi.fn(),
  getCheckoutUrl: vi.fn(),
  validateItems: vi.fn(),
}))

vi.mock('@/lib/fourthwall/checkout', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/fourthwall/checkout')>()
  return {
    ...original,
    createFourthwallCart: createCart,
    getFourthwallCheckoutUrl: getCheckoutUrl,
    validateFourthwallCheckoutItems: validateItems,
  }
})

import {
  FourthwallCheckoutError,
  FourthwallConfigurationError,
} from '@/lib/fourthwall/checkout'
import { POST } from '../route'

const FIRST_VARIANT_ID = '5ffbc1e0-40f8-4afa-9bed-03f854f080b7'
const SECOND_VARIANT_ID = '17818403-c6e8-482d-8491-a278b615b297'

function checkoutRequest(
  body: unknown,
  ip = crypto.randomUUID(),
  contentType = 'application/json',
) {
  return new NextRequest('https://www.lakeridepros.com/api/fourthwall/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'X-Forwarded-For': ip,
    },
    body: JSON.stringify(body),
  })
}

describe('Fourthwall checkout route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('FOURTHWALL_CHECKOUT_ENABLED', 'true')
    createCart.mockResolvedValue('cart-123')
    validateItems.mockResolvedValue(undefined)
    getCheckoutUrl.mockReturnValue(
      'https://shop.example.com/checkout/?cartCurrency=USD&cartId=cart-123',
    )
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates a server-side cart from validated variant IDs and quantities', async () => {
    const items = [
      { variantId: FIRST_VARIANT_ID, quantity: 2 },
      { variantId: SECOND_VARIANT_ID, quantity: 1 },
    ]
    const response = await POST(checkoutRequest({ items }))

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    await expect(response.json()).resolves.toEqual({
      url: 'https://shop.example.com/checkout/?cartCurrency=USD&cartId=cart-123',
      cartId: 'cart-123',
    })
    expect(createCart).toHaveBeenCalledWith(items)
    expect(validateItems).toHaveBeenCalledWith(items)
    expect(getCheckoutUrl).toHaveBeenCalledWith('cart-123')
  })

  it.each([
    { items: [] },
    { items: [{ variantId: 'not-a-uuid', quantity: 1 }] },
    { items: [{ variantId: FIRST_VARIANT_ID, quantity: 0 }] },
    {
      items: [
        { variantId: FIRST_VARIANT_ID, quantity: 1 },
        { variantId: FIRST_VARIANT_ID, quantity: 2 },
      ],
    },
  ])('rejects an invalid cart without contacting Fourthwall', async (body) => {
    const response = await POST(checkoutRequest(body))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Your cart contains invalid items',
    })
    expect(createCart).not.toHaveBeenCalled()
  })

  it('keeps checkout behind an explicit release gate', async () => {
    vi.stubEnv('FOURTHWALL_CHECKOUT_ENABLED', 'false')

    const response = await POST(checkoutRequest({
      items: [{ variantId: FIRST_VARIANT_ID, quantity: 1 }],
    }))

    expect(response.status).toBe(503)
    expect(createCart).not.toHaveBeenCalled()
  })

  it('rejects non-JSON requests before contacting Fourthwall', async () => {
    const response = await POST(checkoutRequest(
      { items: [{ variantId: FIRST_VARIANT_ID, quantity: 1 }] },
      crypto.randomUUID(),
      'text/plain',
    ))

    expect(response.status).toBe(415)
    expect(validateItems).not.toHaveBeenCalled()
    expect(createCart).not.toHaveBeenCalled()
  })

  it('maps missing integration configuration to a safe 503 response', async () => {
    createCart.mockRejectedValue(
      new FourthwallConfigurationError('secret internal configuration detail'),
    )

    const response = await POST(checkoutRequest({
      items: [{ variantId: FIRST_VARIANT_ID, quantity: 1 }],
    }))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Fourthwall checkout is not configured',
    })
  })

  it('returns a customer-safe error for rejected upstream cart items', async () => {
    validateItems.mockRejectedValue(new FourthwallCheckoutError(
      'One or more cart items are no longer available. Please refresh your cart and try again.',
      400,
      'CART_OFFER_NOT_AVAILABLE',
    ))

    const response = await POST(checkoutRequest({
      items: [{ variantId: FIRST_VARIANT_ID, quantity: 1 }],
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'One or more cart items are no longer available. Please refresh your cart and try again.',
    })
    expect(createCart).not.toHaveBeenCalled()
  })

  it('rate limits repeated checkout creation attempts', async () => {
    const requestBody = {
      items: [{ variantId: FIRST_VARIANT_ID, quantity: 1 }],
    }
    const ip = `rate-limit-${crypto.randomUUID()}`

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await POST(checkoutRequest(requestBody, ip))
      expect(response.status).toBe(200)
    }

    const response = await POST(checkoutRequest(requestBody, ip))
    expect(response.status).toBe(429)
    expect(Number(response.headers.get('Retry-After'))).toBeGreaterThan(0)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createCheckout } = vi.hoisted(() => ({
  createCheckout: vi.fn(),
}))

vi.mock('@/lib/chargebee/checkout', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@/lib/chargebee/checkout')>()
  return {
    ...original,
    createNewInsiderCheckout: createCheckout,
  }
})

import { POST } from '../route'

function checkoutRequest(
  values: Record<string, string> = {
    membership_type: 'family',
    billing_interval: 'year',
  },
  url = 'https://www.lakeridepros.com/api/insiders/billing/checkout',
) {
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(values),
  })
}

describe('Insider new-member checkout route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('INSIDERS_CHARGEBEE_CHECKOUT_MODE', 'live')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.lakeridepros.com')
    vi.stubEnv('VERCEL_ENV', '')
    createCheckout.mockResolvedValue({
      id: 'hosted-123',
      url: 'https://lakeridepros.chargebee.com/pages/v3/hosted-123/',
      expiresAt: null,
    })
  })

  it('creates hosted checkout for one validated public offer', async () => {
    const response = await POST(checkoutRequest())

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      'https://lakeridepros.chargebee.com/pages/v3/hosted-123/',
    )
    expect(createCheckout).toHaveBeenCalledWith({
      membershipType: 'family',
      billingInterval: 'year',
      redirectUrl:
        'https://www.lakeridepros.com/insider-membership-benefits?checkout=success#join',
      cancelUrl:
        'https://www.lakeridepros.com/insider-membership-benefits?checkout=cancelled#join',
    })
  })

  it('rejects an invalid plan before calling Chargebee', async () => {
    const response = await POST(
      checkoutRequest({
        membership_type: 'hold',
        billing_interval: 'month',
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Select a valid membership and billing option.',
    })
    expect(createCheckout).not.toHaveBeenCalled()
  })

  it('keeps checkout off until the release gate is enabled', async () => {
    vi.stubEnv('INSIDERS_CHARGEBEE_CHECKOUT_MODE', 'off')

    const response = await POST(checkoutRequest())

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insider-membership-benefits?checkout=unavailable#join',
    )
    expect(createCheckout).not.toHaveBeenCalled()
  })

  it('keeps local checkout callbacks on the local dev server', async () => {
    await POST(
      checkoutRequest(
        undefined,
        'http://localhost:3000/api/insiders/billing/checkout',
      ),
    )

    expect(createCheckout).toHaveBeenCalledWith({
      membershipType: 'family',
      billingInterval: 'year',
      redirectUrl:
        'http://localhost:3000/insider-membership-benefits?checkout=success#join',
      cancelUrl:
        'http://localhost:3000/insider-membership-benefits?checkout=cancelled#join',
    })
  })

  it('returns safely to the offer page when Chargebee fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    createCheckout.mockRejectedValue(new Error('upstream unavailable'))

    const response = await POST(checkoutRequest())

    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe(
      'https://www.lakeridepros.com/insider-membership-benefits?checkout=error#join',
    )
    consoleError.mockRestore()
  })
})

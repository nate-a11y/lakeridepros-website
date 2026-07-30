import { describe, expect, it, vi } from 'vitest'
import {
  createNewInsiderCheckout,
  getInsiderCheckoutPriceId,
  isInsiderBillingInterval,
  isInsiderMembershipType,
} from '@/lib/chargebee/checkout'

const ENV = {
  CHARGEBEE_SITE: 'lakeridepros',
  CHARGEBEE_API_KEY: 'test-key',
  CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID: 'individual-monthly',
  CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID: 'individual-annual',
  CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID: 'family-monthly',
  CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID: 'family-annual',
  CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID: 'business-monthly',
  CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID: 'business-annual',
}

describe('Chargebee new-member hosted checkout', () => {
  it('accepts only the approved membership and billing values', () => {
    expect(isInsiderMembershipType('individual')).toBe(true)
    expect(isInsiderMembershipType('hold')).toBe(false)
    expect(isInsiderBillingInterval('year')).toBe(true)
    expect(isInsiderBillingInterval('quarter')).toBe(false)
  })

  it('maps all six public choices to server-only price IDs', () => {
    expect(getInsiderCheckoutPriceId('individual', 'month', ENV)).toBe(
      'individual-monthly',
    )
    expect(getInsiderCheckoutPriceId('individual', 'year', ENV)).toBe(
      'individual-annual',
    )
    expect(getInsiderCheckoutPriceId('family', 'month', ENV)).toBe(
      'family-monthly',
    )
    expect(getInsiderCheckoutPriceId('family', 'year', ENV)).toBe(
      'family-annual',
    )
    expect(getInsiderCheckoutPriceId('business', 'month', ENV)).toBe(
      'business-monthly',
    )
    expect(getInsiderCheckoutPriceId('business', 'year', ENV)).toBe(
      'business-annual',
    )
  })

  it('creates a full-page checkout for exactly one selected price', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          hosted_page: {
            id: 'hosted-123',
            url: 'https://lakeridepros.chargebee.com/pages/v3/hosted-123/',
            expires_at: 1785375000,
            state: 'created',
            type: 'checkout_new',
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      createNewInsiderCheckout({
        membershipType: 'family',
        billingInterval: 'year',
        redirectUrl:
          'https://www.lakeridepros.com/insider-membership-benefits?checkout=success',
        cancelUrl:
          'https://www.lakeridepros.com/insider-membership-benefits?checkout=cancelled',
        env: ENV,
        fetchImpl,
        idempotencyKey: 'idempotency-123',
      }),
    ).resolves.toEqual({
      id: 'hosted-123',
      url: 'https://lakeridepros.chargebee.com/pages/v3/hosted-123/',
      expiresAt: 1785375000,
    })

    const [url, options] = fetchImpl.mock.calls[0]
    expect(url).toBe(
      'https://lakeridepros.chargebee.com/api/v2/hosted_pages/checkout_new_for_items',
    )
    expect(options.headers).toMatchObject({
      'chargebee-idempotency-key': 'idempotency-123',
      'content-type': 'application/x-www-form-urlencoded',
    })

    const body = new URLSearchParams(options.body)
    expect(body.get('subscription_items[item_price_id][0]')).toBe(
      'family-annual',
    )
    expect(body.get('subscription_items[quantity][0]')).toBe('1')
    expect(body.get('layout')).toBe('full_page')
    expect(body.get('redirect_url')).toContain('checkout=success')
    expect(body.get('cancel_url')).toContain('checkout=cancelled')
    expect(Array.from(body.keys())).toHaveLength(5)
  })

  it('rejects an untrusted hosted checkout URL', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          hosted_page: {
            id: 'hosted-123',
            url: 'https://example.com/pages/not-chargebee/',
            state: 'created',
            type: 'checkout_new',
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      createNewInsiderCheckout({
        membershipType: 'individual',
        billingInterval: 'month',
        redirectUrl: 'https://www.lakeridepros.com/success',
        cancelUrl: 'https://www.lakeridepros.com/cancelled',
        env: ENV,
        fetchImpl,
      }),
    ).rejects.toThrow('untrusted hosted-checkout URL')
  })

  it('fails closed when an approved price mapping is missing', () => {
    expect(() =>
      getInsiderCheckoutPriceId('business', 'year', {
        ...ENV,
        CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID: '',
      }),
    ).toThrow('Missing CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID')
  })
})

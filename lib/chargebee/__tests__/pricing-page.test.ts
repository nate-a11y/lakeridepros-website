import { describe, expect, it, vi } from 'vitest'
import {
  createExistingSubscriptionPricingPageSession,
  getInsiderPricingTableKey,
} from '@/lib/chargebee/pricing-page'

const ENV = {
  CHARGEBEE_SITE: 'lakeridepros',
  CHARGEBEE_API_KEY: 'test-key',
  CHARGEBEE_INSIDER_PRICING_TABLE_KEY: 'GPK2OxIlzp',
}

describe('Chargebee Growth pricing-page sessions', () => {
  it('uses the supplied Growth embed key', () => {
    expect(getInsiderPricingTableKey(ENV)).toBe('GPK2OxIlzp')
  })

  it('creates a session for an authenticated existing subscription', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          pricing_page_session: {
            id: 'session-123',
            url: 'https://hosted.atomicpricing.com/sites/site/pricing-session/session-123',
            expires_at: 1785375000,
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      createExistingSubscriptionPricingPageSession({
        subscriptionId: 'subscription-123',
        redirectUrl: 'https://www.lakeridepros.com/insiders/account',
        env: ENV,
        fetchImpl,
        idempotencyKey: 'idempotency-123',
      }),
    ).resolves.toEqual({
      id: 'session-123',
      url: 'https://hosted.atomicpricing.com/sites/site/pricing-session/session-123',
      expiresAt: 1785375000,
    })

    const [url, options] = fetchImpl.mock.calls[0]
    expect(url).toBe(
      'https://lakeridepros.chargebee.com/api/v2/pricing_page_sessions/create_for_existing_subscription',
    )
    expect(options.headers).toMatchObject({
      'chargebee-idempotency-key': 'idempotency-123',
      'content-type': 'application/x-www-form-urlencoded',
    })
    expect(options.body.toString()).toContain('pricing_page%5Bid%5D=GPK2OxIlzp')
    expect(options.body.toString()).toContain(
      'subscription%5Bid%5D=subscription-123',
    )
  })

  it('rejects an untrusted redirect returned by the upstream API', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          pricing_page_session: {
            id: 'session-123',
            url: 'https://example.com/not-chargebee',
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      createExistingSubscriptionPricingPageSession({
        subscriptionId: 'subscription-123',
        redirectUrl: 'https://www.lakeridepros.com/insiders/account',
        env: ENV,
        fetchImpl,
      }),
    ).rejects.toThrow('untrusted pricing-page URL')
  })
})

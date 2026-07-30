import { randomUUID } from 'node:crypto'

export const DEFAULT_INSIDER_PRICING_TABLE_KEY = 'GPK2OxIlzp'

type PricingPageEnvironment = Record<string, string | undefined>

interface CreatePricingPageSessionOptions {
  subscriptionId: string
  redirectUrl: string
  env?: PricingPageEnvironment
  fetchImpl?: typeof fetch
  idempotencyKey?: string
}

interface ChargebeePricingPageResponse {
  pricing_page_session?: {
    id?: string
    url?: string
    expires_at?: number
  }
  message?: string
}

export interface ChargebeePricingPageSession {
  id: string
  url: string
  expiresAt: number | null
}

export function getInsiderPricingTableKey(
  env: PricingPageEnvironment = process.env,
) {
  return (
    env.CHARGEBEE_INSIDER_PRICING_TABLE_KEY?.trim() ||
    DEFAULT_INSIDER_PRICING_TABLE_KEY
  )
}

function requiredEnvironment(
  env: PricingPageEnvironment,
  name: 'CHARGEBEE_SITE' | 'CHARGEBEE_API_KEY',
) {
  const value = env[name]?.trim()
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function trustedPricingPageUrl(value: string) {
  const url = new URL(value)
  const trustedHost =
    url.hostname === 'chargebee.com' ||
    url.hostname.endsWith('.chargebee.com') ||
    url.hostname === 'atomicpricing.com' ||
    url.hostname.endsWith('.atomicpricing.com')

  if (url.protocol !== 'https:' || !trustedHost) {
    throw new Error('Chargebee returned an untrusted pricing-page URL')
  }

  return url.toString()
}

export async function createExistingSubscriptionPricingPageSession({
  subscriptionId,
  redirectUrl,
  env = process.env,
  fetchImpl = fetch,
  idempotencyKey = randomUUID(),
}: CreatePricingPageSessionOptions): Promise<ChargebeePricingPageSession> {
  const site = requiredEnvironment(env, 'CHARGEBEE_SITE')
  const apiKey = requiredEnvironment(env, 'CHARGEBEE_API_KEY')
  if (!/^[a-z0-9-]+$/i.test(site)) {
    throw new Error('Invalid CHARGEBEE_SITE')
  }

  const body = new URLSearchParams({
    'pricing_page[id]': getInsiderPricingTableKey(env),
    'subscription[id]': subscriptionId,
    redirect_url: redirectUrl,
  })
  const response = await fetchImpl(
    `https://${site}.chargebee.com/api/v2/pricing_page_sessions/create_for_existing_subscription`,
    {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
        'chargebee-idempotency-key': idempotencyKey,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
    },
  )
  const payload = (await response
    .json()
    .catch(() => null)) as ChargebeePricingPageResponse | null

  if (!response.ok) {
    throw new Error(
      `Chargebee pricing-page session failed (${response.status}): ${
        payload?.message || 'unknown error'
      }`,
    )
  }

  const session = payload?.pricing_page_session
  if (!session?.id || !session.url) {
    throw new Error('Chargebee pricing-page session was incomplete')
  }

  return {
    id: session.id,
    url: trustedPricingPageUrl(session.url),
    expiresAt:
      typeof session.expires_at === 'number' ? session.expires_at : null,
  }
}

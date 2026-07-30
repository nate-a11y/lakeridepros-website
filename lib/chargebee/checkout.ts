import { randomUUID } from 'node:crypto'

export type InsiderMembershipType = 'individual' | 'family' | 'business'
export type InsiderBillingInterval = 'month' | 'year'

type CheckoutEnvironment = Record<string, string | undefined>

interface CreateNewInsiderCheckoutOptions {
  membershipType: InsiderMembershipType
  billingInterval: InsiderBillingInterval
  redirectUrl: string
  cancelUrl: string
  env?: CheckoutEnvironment
  fetchImpl?: typeof fetch
  idempotencyKey?: string
}

interface ChargebeeHostedPageResponse {
  hosted_page?: {
    id?: string
    url?: string
    expires_at?: number
    state?: string
    type?: string
  }
  message?: string
}

export interface ChargebeeHostedCheckout {
  id: string
  url: string
  expiresAt: number | null
}

const membershipTypes = new Set<InsiderMembershipType>([
  'individual',
  'family',
  'business',
])

const billingIntervals = new Set<InsiderBillingInterval>(['month', 'year'])

const priceEnvironmentNames = {
  individual: {
    month: 'CHARGEBEE_INSIDER_INDIVIDUAL_MONTHLY_PRICE_ID',
    year: 'CHARGEBEE_INSIDER_INDIVIDUAL_ANNUAL_PRICE_ID',
  },
  family: {
    month: 'CHARGEBEE_INSIDER_FAMILY_MONTHLY_PRICE_ID',
    year: 'CHARGEBEE_INSIDER_FAMILY_ANNUAL_PRICE_ID',
  },
  business: {
    month: 'CHARGEBEE_INSIDER_BUSINESS_MONTHLY_PRICE_ID',
    year: 'CHARGEBEE_INSIDER_BUSINESS_ANNUAL_PRICE_ID',
  },
} as const

export function isInsiderMembershipType(
  value: unknown,
): value is InsiderMembershipType {
  return (
    typeof value === 'string' &&
    membershipTypes.has(value as InsiderMembershipType)
  )
}

export function isInsiderBillingInterval(
  value: unknown,
): value is InsiderBillingInterval {
  return (
    typeof value === 'string' &&
    billingIntervals.has(value as InsiderBillingInterval)
  )
}

function requiredEnvironment(
  env: CheckoutEnvironment,
  name: 'CHARGEBEE_SITE' | 'CHARGEBEE_API_KEY',
) {
  const value = env[name]?.trim()
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

export function getInsiderCheckoutPriceId(
  membershipType: InsiderMembershipType,
  billingInterval: InsiderBillingInterval,
  env: CheckoutEnvironment = process.env,
) {
  const environmentName = priceEnvironmentNames[membershipType][billingInterval]
  const priceId = env[environmentName]?.trim()
  if (!priceId) throw new Error(`Missing ${environmentName}`)
  return priceId
}

function trustedHostedPageUrl(value: string, site: string) {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    url.hostname !== `${site}.chargebee.com` ||
    !url.pathname.startsWith('/pages/')
  ) {
    throw new Error('Chargebee returned an untrusted hosted-checkout URL')
  }

  return url.toString()
}

export async function createNewInsiderCheckout({
  membershipType,
  billingInterval,
  redirectUrl,
  cancelUrl,
  env = process.env,
  fetchImpl = fetch,
  idempotencyKey = randomUUID(),
}: CreateNewInsiderCheckoutOptions): Promise<ChargebeeHostedCheckout> {
  const site = requiredEnvironment(env, 'CHARGEBEE_SITE')
  const apiKey = requiredEnvironment(env, 'CHARGEBEE_API_KEY')
  if (!/^[a-z0-9-]+$/i.test(site)) {
    throw new Error('Invalid CHARGEBEE_SITE')
  }

  const body = new URLSearchParams({
    'subscription_items[item_price_id][0]': getInsiderCheckoutPriceId(
      membershipType,
      billingInterval,
      env,
    ),
    'subscription_items[quantity][0]': '1',
    layout: 'full_page',
    redirect_url: redirectUrl,
    cancel_url: cancelUrl,
  })
  const response = await fetchImpl(
    `https://${site}.chargebee.com/api/v2/hosted_pages/checkout_new_for_items`,
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
    .catch(() => null)) as ChargebeeHostedPageResponse | null

  if (!response.ok) {
    throw new Error(
      `Chargebee hosted checkout failed (${response.status}): ${
        payload?.message || 'unknown error'
      }`,
    )
  }

  const hostedPage = payload?.hosted_page
  if (
    !hostedPage?.id ||
    !hostedPage.url ||
    hostedPage.type !== 'checkout_new' ||
    hostedPage.state !== 'created'
  ) {
    throw new Error('Chargebee hosted checkout was incomplete')
  }

  return {
    id: hostedPage.id,
    url: trustedHostedPageUrl(hostedPage.url, site),
    expiresAt:
      typeof hostedPage.expires_at === 'number' ? hostedPage.expires_at : null,
  }
}

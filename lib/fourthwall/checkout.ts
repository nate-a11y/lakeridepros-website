import {
  FourthwallStorefrontError,
  getFourthwallProducts,
  isFourthwallVariantAvailable,
} from '@/lib/fourthwall/storefront'

const STOREFRONT_API_URL = 'https://storefront-api.fourthwall.com/v1'
const CHECKOUT_CURRENCY = 'USD'
const REQUEST_TIMEOUT_MS = 10_000

export interface FourthwallCheckoutItem {
  variantId: string
  quantity: number
}

interface FourthwallCartResponse {
  id?: unknown
}

const FOURTHWALL_CART_ID_PATTERN = /^[A-Za-z0-9_-]{1,256}$/

export class FourthwallConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FourthwallConfigurationError'
  }
}

export class FourthwallCheckoutError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'FourthwallCheckoutError'
    this.status = status
    this.code = code
  }
}

function getStorefrontToken() {
  const token = process.env.FOURTHWALL_STOREFRONT_TOKEN?.trim()
  if (!token) {
    throw new FourthwallConfigurationError('Fourthwall storefront is not configured')
  }
  return token
}

function getShopUrl() {
  const configuredUrl = process.env.FOURTHWALL_SHOP_URL?.trim()
  if (!configuredUrl) {
    throw new FourthwallConfigurationError('Fourthwall checkout is not configured')
  }

  let shopUrl: URL
  try {
    shopUrl = new URL(configuredUrl)
  } catch {
    throw new FourthwallConfigurationError('Fourthwall checkout URL is invalid')
  }

  if (
    shopUrl.protocol !== 'https:' ||
    shopUrl.username ||
    shopUrl.password ||
    !shopUrl.hostname
  ) {
    throw new FourthwallConfigurationError('Fourthwall checkout URL must be a secure public URL')
  }

  return shopUrl
}

function parseFourthwallErrorCode(value: unknown) {
  if (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'string'
  ) {
    return value.code
  }
  return undefined
}

export async function createFourthwallCart(items: FourthwallCheckoutItem[]) {
  const url = new URL(`${STOREFRONT_API_URL}/carts`)
  url.searchParams.set('storefront_token', getStorefrontToken())
  url.searchParams.set('currency', CHECKOUT_CURRENCY)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    console.error('[Fourthwall checkout] Cart request failed', {
      error: error instanceof Error ? error.name : 'Unknown error',
    })
    throw new FourthwallCheckoutError('Fourthwall checkout is temporarily unavailable', 502)
  }

  const responseBody = await response.json().catch(() => null) as FourthwallCartResponse | null

  if (!response.ok) {
    const code = parseFourthwallErrorCode(responseBody)
    console.error('[Fourthwall checkout] Cart creation rejected', {
      status: response.status,
      code: code || 'unknown',
    })

    const isCustomerError = response.status === 400 || response.status === 404 || response.status === 409
    throw new FourthwallCheckoutError(
      isCustomerError
        ? 'One or more cart items are no longer available. Please refresh your cart and try again.'
        : 'Fourthwall checkout is temporarily unavailable',
      isCustomerError ? 400 : 502,
      code,
    )
  }

  if (
    !responseBody ||
    typeof responseBody.id !== 'string' ||
    !FOURTHWALL_CART_ID_PATTERN.test(responseBody.id)
  ) {
    console.error('[Fourthwall checkout] Cart response did not include an id')
    throw new FourthwallCheckoutError('Fourthwall checkout is temporarily unavailable', 502)
  }

  return responseBody.id
}

export async function validateFourthwallCheckoutItems(items: FourthwallCheckoutItem[]) {
  let products
  try {
    products = await getFourthwallProducts({ throwOnError: true })
  } catch (error) {
    if (
      error instanceof FourthwallStorefrontError &&
      error.reason === 'configuration'
    ) {
      throw new FourthwallConfigurationError('Fourthwall storefront is not configured')
    }
    throw new FourthwallCheckoutError('Fourthwall checkout is temporarily unavailable', 502)
  }

  const availableVariantIds = new Set(
    products.flatMap(product => product.variants
      .filter(isFourthwallVariantAvailable)
      .map(variant => variant.id)),
  )

  if (items.some(item => !availableVariantIds.has(item.variantId))) {
    throw new FourthwallCheckoutError(
      'One or more cart items are no longer available. Please refresh your cart and try again.',
      400,
      'CART_ITEM_NOT_PUBLIC',
    )
  }
}

export function getFourthwallCheckoutUrl(cartId: string) {
  const checkoutUrl = new URL('/checkout/', getShopUrl())
  checkoutUrl.searchParams.set('cartCurrency', CHECKOUT_CURRENCY)
  checkoutUrl.searchParams.set('cartId', cartId)
  return checkoutUrl.toString()
}

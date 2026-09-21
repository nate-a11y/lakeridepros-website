const STOREFRONT_API_URL = 'https://storefront-api.fourthwall.com/v1'
const STOREFRONT_TIMEOUT_MS = 10_000

export interface FourthwallImage {
  id: string
  url: string
  transformedUrl?: string
  width: number
  height: number
}

export interface FourthwallMoney {
  value: number
  currency: string
}

export interface FourthwallVariant {
  id: string
  name: string
  sku: string
  unitPrice: FourthwallMoney
  compareAtPrice?: FourthwallMoney
  attributes: {
    description: string
    color?: { name?: string; swatch?: string }
    size?: { name?: string }
  }
  stock: {
    type: 'UNLIMITED' | 'LIMITED'
    inStock?: number
  }
  images: FourthwallImage[]
}

export interface FourthwallProduct {
  type: 'PRODUCT'
  id: string
  name: string
  slug: string
  description: string
  state: { type: 'AVAILABLE' | 'SOLD_OUT' }
  access: { type: string }
  images: FourthwallImage[]
  variants: FourthwallVariant[]
  createdAt: string
  updatedAt: string
}

interface FourthwallPage<T> {
  results: T[]
  paging?: {
    hasNextPage: boolean
    pageNumber: number
    totalPages: number
  }
}

export class FourthwallStorefrontError extends Error {
  readonly reason: 'configuration' | 'upstream'

  constructor(message: string, reason: 'configuration' | 'upstream') {
    super(message)
    this.name = 'FourthwallStorefrontError'
    this.reason = reason
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFourthwallImage(value: unknown): value is FourthwallImage {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.url === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    (value.transformedUrl === undefined || typeof value.transformedUrl === 'string')
  )
}

function isFourthwallVariant(value: unknown): value is FourthwallVariant {
  if (!isRecord(value) || !isRecord(value.unitPrice) || !isRecord(value.attributes)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.sku === 'string' &&
    typeof value.unitPrice.value === 'number' &&
    Number.isFinite(value.unitPrice.value) &&
    typeof value.unitPrice.currency === 'string' &&
    typeof value.attributes.description === 'string' &&
    isRecord(value.stock) &&
    (value.stock.type === 'UNLIMITED' || value.stock.type === 'LIMITED') &&
    Array.isArray(value.images) &&
    value.images.every(isFourthwallImage)
  )
}

function isFourthwallProduct(value: unknown): value is FourthwallProduct {
  if (!isRecord(value)) return false

  return (
    value.type === 'PRODUCT' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.description === 'string' &&
    isRecord(value.state) &&
    (value.state.type === 'AVAILABLE' || value.state.type === 'SOLD_OUT') &&
    isRecord(value.access) &&
    typeof value.access.type === 'string' &&
    Array.isArray(value.images) &&
    value.images.every(isFourthwallImage) &&
    Array.isArray(value.variants) &&
    value.variants.every(isFourthwallVariant)
  )
}

function isPublicPurchasableProduct(product: FourthwallProduct) {
  return (
    product.access.type === 'PUBLIC' &&
    product.state.type === 'AVAILABLE' &&
    product.variants.some(isFourthwallVariantAvailable)
  )
}

function getStorefrontToken() {
  return process.env.FOURTHWALL_STOREFRONT_TOKEN?.trim() || ''
}

function isStorefrontEnabled() {
  return process.env.FOURTHWALL_STOREFRONT_ENABLED === 'true'
}

async function storefrontRequest<T>(path: string, throwOnError = false): Promise<T | null> {
  const token = getStorefrontToken()
  if (!token) {
    if (throwOnError) {
      throw new FourthwallStorefrontError(
        'Fourthwall Storefront API is not configured',
        'configuration',
      )
    }
    return null
  }

  const url = new URL(`${STOREFRONT_API_URL}${path}`)
  url.searchParams.set('storefront_token', token)

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      ...(throwOnError
        ? { cache: 'no-store' as const }
        : { next: { revalidate: 300 } }),
      signal: AbortSignal.timeout(STOREFRONT_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.error('[Fourthwall storefront] Request failed', {
        path,
        status: response.status,
      })
      if (throwOnError) {
        throw new FourthwallStorefrontError(
          'Fourthwall Storefront API rejected the catalog request',
          'upstream',
        )
      }
      return null
    }

    return await response.json() as T
  } catch (error) {
    if (error instanceof FourthwallStorefrontError) throw error

    console.error('[Fourthwall storefront] Request error', {
      path,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    if (throwOnError) {
      throw new FourthwallStorefrontError(
        'Fourthwall Storefront API is temporarily unavailable',
        'upstream',
      )
    }
    return null
  }
}

export async function getFourthwallProducts(options: { throwOnError?: boolean } = {}) {
  if (!isStorefrontEnabled()) {
    if (options.throwOnError) {
      throw new FourthwallStorefrontError(
        'Fourthwall storefront is not enabled',
        'configuration',
      )
    }
    return []
  }

  const collection = process.env.FOURTHWALL_COLLECTION_SLUG?.trim() || 'all'
  const page = await storefrontRequest<FourthwallPage<unknown>>(
    `/collections/${encodeURIComponent(collection)}/products?page=0&size=100&currency=USD`,
    options.throwOnError,
  )

  return Array.isArray(page?.results)
    ? page.results.filter(isFourthwallProduct).filter(isPublicPurchasableProduct)
    : []
}

export async function getFourthwallProduct(slug: string): Promise<FourthwallProduct | null> {
  if (!isStorefrontEnabled()) return null

  const product = await storefrontRequest<unknown>(
    `/products/${encodeURIComponent(slug)}?currency=USD`
  )

  return isFourthwallProduct(product) && isPublicPurchasableProduct(product)
    ? product
    : null
}

export function isFourthwallVariantAvailable(variant: FourthwallVariant) {
  return variant.stock.type === 'UNLIMITED' || (variant.stock.inStock || 0) > 0
}

export function getFourthwallProductImage(product: FourthwallProduct) {
  const image = product.images[0] || product.variants.flatMap(variant => variant.images)[0]
  return image?.transformedUrl || image?.url || ''
}

export function getFourthwallStartingPrice(product: FourthwallProduct) {
  const prices = product.variants
    .filter(isFourthwallVariantAvailable)
    .map(variant => variant.unitPrice.value)

  return prices.length > 0 ? Math.min(...prices) : null
}

export function plainFourthwallDescription(description: string) {
  return description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

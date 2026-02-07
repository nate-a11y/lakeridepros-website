/**
 * Sanity CMS type definitions
 *
 * These replace the auto-generated @/src/payload-types from Payload CMS.
 * Types are intentionally loose (index signature) to allow gradual tightening
 * as the migration progresses. Key fields are explicitly typed for IDE support.
 */

// Base Sanity document fields
interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// Sanity image reference
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
    metadata?: Record<string, unknown>
  }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
  caption?: string
}

// Sanity slug
interface SanitySlug {
  _type: 'slug'
  current: string
}

// Portable Text block (simplified)
type PortableTextBlock = Record<string, unknown>

export interface Service extends SanityDocument {
  title: string
  slug: SanitySlug
  description: string
  shortDescription?: string
  icon?: string
  image?: SanityImage
  features?: Array<{ feature: string; _key: string }>
  pricing?: { basePrice?: number; pricingType?: string; notes?: string }
  active: boolean
  order: number
  [key: string]: unknown
}

export interface Vehicle extends SanityDocument {
  name: string
  slug: SanitySlug
  type: string
  description: string
  capacity: number
  featuredImage?: SanityImage
  images?: Array<{ image: SanityImage; alt?: string; _key: string }>
  amenities?: Array<{ amenity: string; _key: string }>
  specifications?: { make?: string; model?: string; year?: string; color?: string }
  pricing?: { pointToPointMinimum?: number; hourlyRate?: number; dailyRate?: number; notes?: string }
  pricingTiers?: string[]
  available: boolean
  featured: boolean
  order: number
  [key: string]: unknown
}

export interface BlogPost extends SanityDocument {
  title: string
  slug: SanitySlug
  excerpt: string
  content: PortableTextBlock[]
  featuredImage?: SanityImage
  author?: { _ref: string; name?: string } | string
  publishedDate: string
  categories?: string[]
  published: boolean
  socialShared?: boolean
  [key: string]: unknown
}

export interface Product extends SanityDocument {
  name: string
  slug: SanitySlug
  description: PortableTextBlock[]
  shortDescription?: string
  featuredImage: SanityImage
  images?: SanityImage[]
  price: number
  compareAtPrice?: number
  sku?: string
  categories?: string[]
  tags?: Array<{ tag: string; _key: string }>
  inStock: boolean
  stockQuantity?: number
  featured: boolean
  variants?: Array<{
    name: string
    sku: string
    price?: number
    compareAtPrice?: number
    inStock?: boolean
    stockQuantity?: number
    size?: string
    color?: string
    colorHex?: string
    printifyVariantId?: string
    _key: string
  }>
  printifyProductId?: string
  printifyBlueprintId?: string
  printifyPrintProviderId?: string
  personalization?: { enabled?: boolean; instructions?: string; maxLength?: number }
  status: 'draft' | 'active'
  metaTitle?: string
  metaDescription?: string
  [key: string]: unknown
}

export interface Testimonial extends SanityDocument {
  name: string
  title?: string
  company?: string
  content: string
  rating?: number
  image?: SanityImage
  featured: boolean
  order: number
  source: string
  externalId?: string
  externalUrl?: string
  syncedAt?: string
  [key: string]: unknown
}

export interface Partner extends SanityDocument {
  name: string
  slug: SanitySlug
  isPremierPartner?: boolean
  isReferralPartner?: boolean
  isWeddingPartner?: boolean
  isPromotion?: boolean
  promotionCategory?: string
  promotionStartDate?: string
  promotionEndDate?: string
  promotionDetails?: string
  category?: string
  subcategory?: string
  weddingCategory?: string
  weddingDescription?: string
  weddingBlurb?: string
  logo?: SanityImage
  description?: string
  website?: string
  phone?: string
  email?: string
  address?: string
  featured: boolean
  order: number
  blurb?: string
  smsTemplate?: string
  images?: SanityImage[]
  active: boolean
  publishDate?: string
  [key: string]: unknown
}

export interface Media extends SanityDocument {
  // In Sanity, media is just a SanityImage asset. This type exists for compatibility.
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  mimeType?: string
  [key: string]: unknown
}

export interface Page extends SanityDocument {
  title: string
  slug: SanitySlug
  content: PortableTextBlock[]
  featuredImage?: SanityImage
  published: boolean
  [key: string]: unknown
}

export interface Order extends SanityDocument {
  orderNumber: string
  customerName: string
  customerEmail: string
  status: string
  items: Array<{
    productId: string
    productName: string
    variantId?: string
    variantName?: string
    quantity: number
    price: number
    _key: string
  }>
  shippingAddress?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  subtotal: number
  shipping: number
  tax: number
  total: number
  stripePaymentIntentId?: string
  stripeCheckoutSessionId?: string
  printifyOrderId?: string
  trackingNumber?: string
  trackingUrl?: string
  [key: string]: unknown
}

export interface GiftCard extends SanityDocument {
  type: 'digital' | 'physical'
  code: string
  initialAmount: number
  currentBalance: number
  status: string
  purchaserName: string
  purchaserEmail?: string
  recipientName?: string
  recipientEmail?: string
  message?: string
  deliveryMethod?: string
  scheduledDeliveryDate?: string
  deliveryStatus?: string
  sentDate?: string
  stripePaymentIntentId?: string
  stripeCheckoutSessionId?: string
  [key: string]: unknown
}

// Re-export User for compatibility
export interface User extends SanityDocument {
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  [key: string]: unknown
}

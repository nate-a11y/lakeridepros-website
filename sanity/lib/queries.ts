import { groq } from 'next-sanity'

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/** All active services, sorted by display order. Resolves image references. */
export const servicesQuery = groq`
  *[_type == "service" && active == true] | order(order asc) {
    _id,
    _type,
    title,
    slug,
    description,
    shortDescription,
    icon,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    features,
    pricing,
    active,
    order
  }
`

/** Single active service by slug. */
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug && active == true][0] {
    _id,
    _type,
    title,
    slug,
    description,
    shortDescription,
    icon,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    features,
    pricing,
    active,
    order
  }
`

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------

/** All available vehicles, sorted by display order. */
export const vehiclesQuery = groq`
  *[_type == "vehicle" && available == true] | order(order asc) {
    _id,
    _type,
    name,
    slug,
    type,
    description,
    capacity,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    images[] {
      ...,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata
        }
      },
      alt
    },
    amenities,
    specifications,
    pricing,
    pricingTiers,
    available,
    featured,
    order
  }
`

/** Featured + available vehicles with a configurable limit. */
export const featuredVehiclesQuery = groq`
  *[_type == "vehicle" && featured == true && available == true] | order(order asc) [0...$limit] {
    _id,
    _type,
    name,
    slug,
    type,
    description,
    capacity,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    amenities,
    specifications,
    pricing,
    pricingTiers,
    available,
    featured,
    order
  }
`

/** Single vehicle by slug. */
export const vehicleBySlugQuery = groq`
  *[_type == "vehicle" && slug.current == $slug][0] {
    _id,
    _type,
    name,
    slug,
    type,
    description,
    capacity,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    images[] {
      ...,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata
        }
      },
      alt
    },
    amenities,
    specifications,
    pricing,
    pricingTiers,
    available,
    featured,
    order
  }
`

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

/** All published blog posts where publishedDate is in the past, newest first. */
export const blogPostsQuery = groq`
  *[_type == "blogPost" && published == true && publishedDate <= now()] | order(publishedDate desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    author-> {
      _id,
      name,
      email
    },
    publishedDate,
    categories,
    published
  }
`

/** Latest published blog posts with a configurable limit. */
export const latestBlogPostsQuery = groq`
  *[_type == "blogPost" && published == true && publishedDate <= now()] | order(publishedDate desc) [0...$limit] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    author-> {
      _id,
      name,
      email
    },
    publishedDate,
    categories,
    published
  }
`

/** Single published blog post by slug. */
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && published == true][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    author-> {
      _id,
      name,
      email
    },
    publishedDate,
    categories,
    published
  }
`

/**
 * All published blog posts sorted by date (descending).
 * The caller finds the adjacent posts in JS by locating the target slug.
 */
export const adjacentBlogPostsQuery = groq`
  *[_type == "blogPost" && published == true && publishedDate <= now()] | order(publishedDate desc) {
    _id,
    title,
    slug,
    publishedDate,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    }
  }
`

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** All active products. */
export const productsQuery = groq`
  *[_type == "product" && status == "active"] | order(order asc) {
    _id,
    _type,
    name,
    slug,
    description,
    shortDescription,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    images[] {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    price,
    compareAtPrice,
    sku,
    categories,
    tags,
    inStock,
    stockQuantity,
    featured,
    variants,
    printifyProductId,
    printifyBlueprintId,
    printifyPrintProviderId,
    personalization,
    status,
    metaTitle,
    metaDescription
  }
`

/** Featured + active products with a configurable limit. */
export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true && status == "active"] | order(order asc) [0...$limit] {
    _id,
    _type,
    name,
    slug,
    shortDescription,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    price,
    compareAtPrice,
    categories,
    inStock,
    featured,
    variants,
    status
  }
`

/** Single active product by slug. */
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && status == "active"][0] {
    _id,
    _type,
    name,
    slug,
    description,
    shortDescription,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    images[] {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    price,
    compareAtPrice,
    sku,
    categories,
    tags,
    inStock,
    stockQuantity,
    featured,
    variants,
    printifyProductId,
    printifyBlueprintId,
    printifyPrintProviderId,
    personalization,
    status,
    metaTitle,
    metaDescription
  }
`

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

/**
 * All testimonials sorted by display order.
 * Accepts optional `featured` (boolean) and `minRating` (number) params.
 * Placeholder content filtering is handled in JS.
 */
export const testimonialsQuery = groq`
  *[_type == "testimonial"
    && ($featured == false || featured == true)
    && ($minRating == 0 || rating >= $minRating)
  ] | order(order asc) {
    _id,
    _type,
    name,
    title,
    company,
    content,
    rating,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    featured,
    order,
    source,
    externalId,
    externalUrl,
    syncedAt
  }
`

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

/**
 * All active partners sorted by display order.
 * Filtering by partner type (isPremierPartner, isReferralPartner, etc.)
 * happens in JS because of complex checkbox logic.
 */
export const partnersQuery = groq`
  *[_type == "partner" && active == true] | order(order asc) {
    _id,
    _type,
    name,
    slug,
    isPromotion,
    isPremierPartner,
    isReferralPartner,
    isWeddingPartner,
    promotionCategory,
    promotionStartDate,
    promotionEndDate,
    promotionDetails,
    category,
    subcategory,
    weddingCategory,
    weddingDescription,
    weddingBlurb,
    logo {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    description,
    website,
    phone,
    email,
    address,
    featured,
    order,
    blurb,
    sms_template,
    images[] {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    active,
    publish_date
  }
`

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

/** Single published page by slug. */
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && published == true][0] {
    _id,
    _type,
    title,
    slug,
    content,
    featuredImage {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    published
  }
`

// ---------------------------------------------------------------------------
// Venues
// ---------------------------------------------------------------------------

/** All active venues sorted by display order. */
export const venuesQuery = groq`
  *[_type == "venue" && active == true] | order(order asc) {
    _id,
    _type,
    name,
    shortName,
    slug,
    description,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    gallery[] {
      ...,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata
        }
      },
      caption
    },
    address,
    website,
    phone,
    active,
    additionalInfo,
    order
  }
`

/** Single active venue by slug. */
export const venueBySlugQuery = groq`
  *[_type == "venue" && slug.current == $slug && active == true][0] {
    _id,
    _type,
    name,
    shortName,
    slug,
    description,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    gallery[] {
      ...,
      image {
        ...,
        asset-> {
          _id,
          url,
          metadata
        }
      },
      caption
    },
    address,
    website,
    phone,
    active,
    additionalInfo,
    order
  }
`

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** Shared projection for event queries. */
const eventProjection = `
  _id,
  _type,
  name,
  slug,
  venue-> {
    _id,
    name,
    shortName,
    slug,
    address,
    website,
    phone,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    }
  },
  date,
  time,
  description,
  image {
    ...,
    asset-> {
      _id,
      url,
      metadata
    }
  },
  rideAvailability,
  featured,
  active,
  order
`

/** All active events sorted by date. Resolves venue reference. */
export const eventsQuery = groq`
  *[_type == "event" && active == true] | order(date asc) {
    ${eventProjection}
  }
`

/** Active events where date >= today, sorted by date. */
export const upcomingEventsQuery = groq`
  *[_type == "event" && active == true && date >= now()] | order(date asc) {
    ${eventProjection}
  }
`

/** Active upcoming events filtered by venue reference. */
export const eventsByVenueQuery = groq`
  *[_type == "event" && active == true && date >= now() && venue._ref == $venueId] | order(date asc) {
    ${eventProjection}
  }
`

/** Single active event by slug with venue resolved. */
export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug && active == true][0] {
    ${eventProjection}
  }
`

// ---------------------------------------------------------------------------
// Driver Profiles
// ---------------------------------------------------------------------------

/** All active, display-ready driver profiles sorted by display order. */
export const driverProfilesQuery = groq`
  *[_type == "driverProfile" && displayOnWebsite == true && active == true] | order(order asc) {
    _id,
    _type,
    name,
    slug,
    bio,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    displayOnWebsite,
    active,
    role,
    vehicles,
    assignmentNumber,
    order
  }
`

/** Single driver profile by slug. */
export const driverProfileBySlugQuery = groq`
  *[_type == "driverProfile" && slug.current == $slug && displayOnWebsite == true && active == true][0] {
    _id,
    _type,
    name,
    slug,
    bio,
    image {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    displayOnWebsite,
    active,
    role,
    vehicles,
    assignmentNumber,
    order
  }
`

// ---------------------------------------------------------------------------
// Service Analytics
// ---------------------------------------------------------------------------

/** Analytics record for a specific service (by service reference ID). */
export const serviceAnalyticsQuery = groq`
  *[_type == "serviceAnalytics" && service._ref == $serviceId][0] {
    _id,
    _type,
    service-> {
      _id,
      title,
      slug
    },
    views,
    bookings,
    viewsLast30Days,
    bookingsLast30Days,
    popularityScore,
    lastViewedAt,
    lastBookedAt,
    dailyStats
  }
`

// ---------------------------------------------------------------------------
// Gift Cards
// ---------------------------------------------------------------------------

/** Single gift card by code. */
export const giftCardByCodeQuery = groq`
  *[_type == "giftCard" && code == $code][0] {
    _id,
    _type,
    type,
    code,
    initialAmount,
    currentBalance,
    status,
    purchaserName,
    purchaserEmail,
    recipientName,
    recipientEmail,
    message,
    deliveryMethod,
    scheduledDeliveryDate,
    deliveryStatus,
    sentDate,
    shippingAddress,
    fulfillmentStatus,
    trackingNumber,
    shippedDate,
    stripePaymentIntentId,
    stripeCheckoutSessionId
  }
`

/** Digital gift cards with pending delivery whose scheduled date has passed. */
export const scheduledGiftCardsQuery = groq`
  *[_type == "giftCard"
    && type == "digital"
    && deliveryStatus == "pending"
    && scheduledDeliveryDate <= now()
  ] {
    _id,
    _type,
    type,
    code,
    initialAmount,
    currentBalance,
    status,
    purchaserName,
    purchaserEmail,
    recipientName,
    recipientEmail,
    message,
    deliveryMethod,
    scheduledDeliveryDate,
    deliveryStatus
  }
`

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Member Logos
// ---------------------------------------------------------------------------

/** All active member logos sorted by display order. */
export const memberLogosQuery = groq`
  *[_type == "memberLogo" && active == true] | order(order asc) {
    _id,
    _type,
    name,
    logo {
      ...,
      asset-> {
        _id,
        url,
        metadata
      }
    },
    order,
    active
  }
`

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

/** Single order by order number. */
export const orderByNumberQuery = groq`
  *[_type == "order" && orderNumber == $orderNumber][0] {
    _id,
    _type,
    orderNumber,
    customerName,
    customerEmail,
    status,
    items,
    shippingAddress,
    subtotal,
    shipping,
    tax,
    total,
    stripePaymentIntentId,
    stripeCheckoutSessionId,
    printifyOrderId,
    trackingNumber,
    trackingUrl
  }
`

/**
 * Google Analytics 4 event tracking utilities
 * Use these functions to track custom events throughout the app
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  params?: {
    category?: string
    label?: string
    value?: number
    [key: string]: unknown
  }
) => {
  if (!GA_MEASUREMENT_ID) return

  window.gtag('event', action, params)
}

// Predefined events for common actions
export const trackServiceView = (serviceName: string, serviceSlug: string) => {
  event('view_service', {
    category: 'engagement',
    label: serviceName,
    service_slug: serviceSlug,
  })
}

export const trackBookingIntent = (serviceName: string, serviceSlug: string) => {
  event('booking_intent', {
    category: 'conversion',
    label: serviceName,
    service_slug: serviceSlug,
  })
}

export const trackVehicleView = (vehicleName: string, vehicleSlug: string) => {
  event('view_vehicle', {
    category: 'engagement',
    label: vehicleName,
    vehicle_slug: vehicleSlug,
  })
}

export const trackProductView = (productName: string, productId: string) => {
  event('view_item', {
    category: 'ecommerce',
    label: productName,
    product_id: productId,
  })
}

export const trackAddToCart = (productName: string, productId: string, price: number) => {
  event('add_to_cart', {
    category: 'ecommerce',
    label: productName,
    product_id: productId,
    value: price,
  })
}

export const trackPurchase = (orderId: string, value: number, items: number) => {
  event('purchase', {
    category: 'ecommerce',
    transaction_id: orderId,
    value,
    items,
  })
}

export const trackGiftCardPurchase = (amount: number, type: 'digital' | 'physical') => {
  event('purchase_gift_card', {
    category: 'ecommerce',
    value: amount,
    gift_card_type: type,
  })
}

export const trackContactFormSubmit = () => {
  event('contact_form_submit', {
    category: 'engagement',
  })
}

export const trackPhoneClick = () => {
  event('phone_click', {
    category: 'engagement',
  })
}

export const trackEmailClick = () => {
  event('email_click', {
    category: 'engagement',
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

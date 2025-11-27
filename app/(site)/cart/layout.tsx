import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | Lake Ride Pros',
  description: 'Review your Lake Ride Pros merchandise order',
  openGraph: {
    title: 'Shopping Cart | Lake Ride Pros',
    description: 'Review your Lake Ride Pros merchandise order',
    url: 'https://www.lakeridepros.com/cart',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Cart' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping Cart | Lake Ride Pros',
    description: 'Review your Lake Ride Pros merchandise order',
    images: ['/og-image.jpg'],
  },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}

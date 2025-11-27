import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Card Balance Checker | Lake Ride Pros',
  description: 'Check your Lake Ride Pros gift card balance. Enter your gift card code to see your remaining balance and use it for luxury transportation services.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/gift-card-balance',
  },
  openGraph: {
    title: 'Gift Card Balance Checker | Lake Ride Pros',
    description: 'Check your Lake Ride Pros gift card balance. Enter your gift card code to see your remaining balance.',
    url: 'https://www.lakeridepros.com/gift-card-balance',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Gift Card Balance' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gift Card Balance Checker | Lake Ride Pros',
    description: 'Check your Lake Ride Pros gift card balance.',
    images: ['/og-image.jpg'],
  },
}

export default function GiftCardBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

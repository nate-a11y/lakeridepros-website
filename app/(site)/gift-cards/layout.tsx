import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Cards | Lake Ride Pros',
  description: 'Purchase Lake Ride Pros gift cards. Give the gift of luxury transportation at Lake of the Ozarks. Perfect for any occasion.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/gift-cards',
  },
  openGraph: {
    title: 'Gift Cards | Lake Ride Pros',
    description: 'Purchase Lake Ride Pros gift cards. Give the gift of luxury transportation at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/gift-cards',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Gift Cards' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gift Cards | Lake Ride Pros',
    description: 'Purchase Lake Ride Pros gift cards. Give the gift of luxury transportation.',
    images: ['/og-image.jpg'],
  },
}

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

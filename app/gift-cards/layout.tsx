import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Cards | Lake Ride Pros',
  description: 'Purchase Lake Ride Pros gift cards. Give the gift of luxury transportation at Lake of the Ozarks. Perfect for any occasion.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/gift-cards',
  },
}

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

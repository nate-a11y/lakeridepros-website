import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Card Balance Checker | Lake Ride Pros',
  description: 'Check your Lake Ride Pros gift card balance. Enter your gift card code to see your remaining balance and use it for luxury transportation services.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/gift-card-balance',
  },
}

export default function GiftCardBalanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

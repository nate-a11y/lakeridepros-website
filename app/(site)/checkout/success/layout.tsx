import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed | Lake Ride Pros',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}

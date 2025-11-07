import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | Lake Ride Pros',
  description: 'Review your Lake Ride Pros merchandise order',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Lake Ride Pros Shop — New Merch Coming Soon',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ProductPage() {
  return redirect('/shop')
}

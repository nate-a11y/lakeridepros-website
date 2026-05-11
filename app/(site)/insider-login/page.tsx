import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insider Login | Lake Ride Pros',
  robots: {
    index: false,
    follow: false,
  },
}

export default function InsiderLoginPage() {
  redirect('https://lakeridepros.chargebeeportal.com/portal/v2/login?forward=portal_main')
}

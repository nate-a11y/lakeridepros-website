import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bridal Show Admin | Lake Ride Pros',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BridalShowAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}

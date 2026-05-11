import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giveaways Admin | Lake Ride Pros',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GiveawaysAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}

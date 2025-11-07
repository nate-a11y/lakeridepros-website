import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Lake Ride Pros',
  description: 'Get in touch with Lake Ride Pros. Contact us for luxury transportation at Lake of the Ozarks. Available 24/7 for bookings and inquiries.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

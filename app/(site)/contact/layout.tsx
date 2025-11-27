import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Lake Ride Pros',
  description: 'Get in touch with Lake Ride Pros. Contact us for luxury transportation at Lake of the Ozarks. Available 24/7 for bookings and inquiries.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Lake Ride Pros',
    description: 'Get in touch with Lake Ride Pros. Contact us for luxury transportation at Lake of the Ozarks. Available 24/7 for bookings and inquiries.',
    url: 'https://www.lakeridepros.com/contact',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Contact' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Lake Ride Pros',
    description: 'Get in touch with Lake Ride Pros. Contact us for luxury transportation at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

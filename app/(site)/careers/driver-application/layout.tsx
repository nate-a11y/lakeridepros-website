import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Driver Application | Lake Ride Pros Careers',
  description: 'Apply to become a professional driver at Lake Ride Pros. Join our team providing luxury transportation at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers/driver-application',
  },
  openGraph: {
    title: 'Driver Application | Lake Ride Pros Careers',
    description: 'Apply to become a professional driver at Lake Ride Pros. Join our team at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/careers/driver-application',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Driver Application' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Driver Application | Lake Ride Pros Careers',
    description: 'Apply to become a professional driver at Lake Ride Pros.',
    images: ['/og-image.jpg'],
  },
}

export default function DriverApplicationLayout({ children }: { children: React.ReactNode }) {
  return children
}

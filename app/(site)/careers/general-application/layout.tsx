import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'General Application | Lake Ride Pros Careers',
  description: 'Apply for part-time detailer, dispatcher, sales, brand ambassador, and other non-driving roles at Lake Ride Pros at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers/general-application',
  },
  openGraph: {
    title: 'General Application | Lake Ride Pros Careers',
    description: 'Apply for detailing, dispatch, sales, and other non-driving roles at Lake Ride Pros at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/careers/general-application',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros General Application' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'General Application | Lake Ride Pros Careers',
    description: 'Apply for detailing, dispatch, sales, and other non-driving roles at Lake Ride Pros.',
    images: ['/og-image.jpg'],
  },
}

export default function GeneralApplicationLayout({ children }: { children: React.ReactNode }) {
  return children
}

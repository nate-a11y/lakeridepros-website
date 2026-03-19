import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sales & Brand Ambassador Application | Lake Ride Pros Careers',
  description: 'Apply for a sales or brand ambassador position at Lake Ride Pros. Help grow Missouri\'s Best award-winning luxury transportation company at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers/general-application',
  },
  openGraph: {
    title: 'Sales & Brand Ambassador Application | Lake Ride Pros Careers',
    description: 'Apply for a sales or brand ambassador position at Lake Ride Pros at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/careers/general-application',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Sales & Brand Ambassador Application' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales & Brand Ambassador Application | Lake Ride Pros Careers',
    description: 'Apply for a sales or brand ambassador position at Lake Ride Pros.',
    images: ['/og-image.jpg'],
  },
}

export default function GeneralApplicationLayout({ children }: { children: React.ReactNode }) {
  return children
}

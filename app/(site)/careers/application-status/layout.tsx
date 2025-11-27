import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Application Status | Lake Ride Pros Careers',
  description: 'Check the status of your Lake Ride Pros driver application.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/careers/application-status',
  },
  openGraph: {
    title: 'Application Status | Lake Ride Pros Careers',
    description: 'Check the status of your Lake Ride Pros driver application.',
    url: 'https://www.lakeridepros.com/careers/application-status',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Application Status' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Application Status | Lake Ride Pros Careers',
    description: 'Check the status of your Lake Ride Pros driver application.',
    images: ['/og-image.jpg'],
  },
}

export default function ApplicationStatusLayout({ children }: { children: React.ReactNode }) {
  return children
}

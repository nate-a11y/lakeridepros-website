import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team | Lake Ride Pros',
  description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners providing premium transportation services at Lake of the Ozarks.',
  keywords: 'Lake Ride Pros team, professional drivers, transportation team, Lake of the Ozarks, our drivers, meet the team',
  alternates: {
    canonical: 'https://www.lakeridepros.com/our-drivers',
  },
  openGraph: {
    title: 'Our Team | Lake Ride Pros',
    description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners providing premium transportation services.',
    url: 'https://www.lakeridepros.com/our-drivers',
    siteName: 'Lake Ride Pros',
    images: [
      {
        url: 'https://www.lakeridepros.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake Ride Pros Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team | Lake Ride Pros',
    description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners.',
    images: ['https://www.lakeridepros.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function OurDriversPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">
            Meet Our Team
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            The professionals behind your premium transportation experience
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
              We&apos;re working on something great. Check back soon to meet our amazing team!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

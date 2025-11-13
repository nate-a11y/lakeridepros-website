import { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import BookingWidget from '@/components/BookingWidget';
import { getServices } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Transportation Services | Lake Ride Pros',
  description: 'Explore our premium transportation services including airport transfers, corporate transportation, special events, and more at Lake of the Ozarks.',
  keywords: 'Lake of the Ozarks transportation services, airport shuttle, corporate transportation, wedding transportation, special events, luxury rides, professional drivers',
  alternates: {
    canonical: 'https://www.lakeridepros.com/services',
  },
  openGraph: {
    title: 'Transportation Services | Lake Ride Pros',
    description: 'Explore our premium transportation services including airport transfers, corporate transportation, special events, and more at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/services',
    siteName: 'Lake Ride Pros',
    images: [
      {
        url: 'https://www.lakeridepros.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake Ride Pros Transportation Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation Services | Lake Ride Pros',
    description: 'Explore our premium transportation services including airport transfers, corporate transportation, special events, and more at Lake of the Ozarks.',
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

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const servicesData = await getServices().catch(() => ({ docs: [] }));
  const services = servicesData.docs || [];

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lake Ride Pros Transportation Services',
    description: 'Premium transportation services at Lake of the Ozarks',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.shortDescription || service.description,
        url: `https://www.lakeridepros.com/services/${service.slug}`,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lake Ride Pros',
          url: 'https://www.lakeridepros.com',
        },
      },
    })),
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.lakeridepros.com/#organization',
    name: 'Lake Ride Pros',
    url: 'https://www.lakeridepros.com',
    logo: 'https://www.lakeridepros.com/logo.png',
    description: 'Premium transportation services at Lake of the Ozarks',
    telephone: '+1-573-346-4300',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lake of the Ozarks',
      addressRegion: 'MO',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 38.1515,
        longitude: -92.6379,
      },
      geoRadius: '50000',
    },
  };

  return (
    <>
      {/* Structured Data */}
      {services.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
          />
        </>
      )}
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Transportation Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Professional, reliable, and luxurious transportation for every occasion
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                Services information will be available soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Book?
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Reserve your luxury transportation today
            </p>
          </div>
          <BookingWidget />
        </div>
      </section>
    </>
  );
}

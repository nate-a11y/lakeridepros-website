import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from '@/components/BookingWidget';
import { getServices, getMediaUrl } from '@/lib/api/sanity';
import { DynamicIcon } from '@/lib/iconMapper';
import { ChevronRight } from 'lucide-react';
import { seoServicePageList } from './_data/seoServicePages';

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

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const servicesData = await getServices({ limit: 100 }).catch(() => ({ docs: [] }));
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
    image: 'https://www.lakeridepros.com/og-image.jpg',
    url: 'https://www.lakeridepros.com',
    logo: 'https://www.lakeridepros.com/logo.png',
    description: 'Premium transportation services at Lake of the Ozarks',
    telephone: '+1-573-206-9499',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lake of the Ozarks',
      addressRegion: 'MO',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.1515,
      longitude: -92.6379,
    },
    areaServed: {
      '@type': 'State',
      name: 'Missouri',
    },
    priceRange: '$$-$$$',
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
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">
            Our Transportation Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Professional, reliable, and luxurious transportation for every occasion
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="group bg-white dark:bg-dark-bg-tertiary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{ width: '100%' }}
                >
                  {/* Image */}
                  <Link href={`/services/${service.slug}`} className="block" style={{ display: 'block', width: '100%' }}>
                    <div style={{ display: 'block', position: 'relative', height: '12rem', width: '100%', overflow: 'hidden' }}>
                      {service.image && typeof service.image === 'object' && (
                        <Image
                          src={getMediaUrl(service.image)}
                          alt={service.image.alt || service.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {/* Icon badge */}
                      {service.icon && (
                        <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-lrp-black shadow-lg">
                          <DynamicIcon name={service.icon} size={20} />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link
                      href={`/services/${service.slug}`}
                      className="font-bold text-neutral-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary-light transition-colors text-lg block focus:outline-none focus:underline"
                    >
                      {service.title}
                    </Link>
                    <p className="text-lrp-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-4 text-sm leading-relaxed">
                      {service.shortDescription || service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                      {service.pricing?.basePrice ? (
                        <span className="text-primary dark:text-primary-light font-semibold text-sm">
                          From ${service.pricing.basePrice}
                        </span>
                      ) : (
                        <span className="text-lrp-text-secondary dark:text-dark-text-secondary text-sm">
                          Custom Pricing
                        </span>
                      )}
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center text-primary dark:text-primary-light font-semibold text-sm hover:gap-2 gap-1 transition-all focus:outline-none focus:underline"
                        aria-label={`Learn more about ${service.title}`}
                      >
                        Learn More
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
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

      {/* Specialty SEO Landing Pages */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Specialty Transportation Guides
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Planning a more specific Lake of the Ozarks itinerary? These private transportation pages cover common restaurant, dock, hotel, resort, and vacation rental scenarios.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoServicePageList.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-2xl bg-white dark:bg-dark-bg-primary p-6 shadow-sm hover:shadow-lg hover:border-primary border-2 border-transparent transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mb-4">
                  {service.metadataDescription}
                </p>
                <span className="inline-flex items-center text-primary dark:text-primary-light font-semibold text-sm">
                  View guide
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
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

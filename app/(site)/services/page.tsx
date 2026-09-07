import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BookingWidget from '@/components/BookingWidget';
import { getServices, getMediaUrl } from '@/lib/api/sanity';
import { DynamicIcon } from '@/lib/iconMapper';
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
      <section aria-labelledby="services-heading" className="bg-lrp-black py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-8">
          <div className="min-w-0 lg:col-span-8">
            <p className="font-boardson text-3xl text-primary-light">At the Lake. Across Missouri.</p>
            <h1 id="services-heading" className="mt-5 max-w-4xl text-balance font-celebri text-[clamp(2.6rem,12vw,3rem)] font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Our Transportation Services
            </h1>
          </div>
          <div className="min-w-0 lg:col-span-4">
            <p className="max-w-md text-lg leading-relaxed text-white/75">
              Professional, reliable, and luxurious transportation for every occasion
            </p>
            <a href="#all-services" className="mt-5 min-h-11 border-b border-primary pb-1 font-bold text-white hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light">
              Find your service
            </a>
          </div>
        </div>
      </section>

      <section id="all-services" aria-label="All transportation services" className="scroll-mt-28 bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
              {services.map((service) => (
                <article key={service._id} className="min-w-0 border-b border-black/25 pb-8">
                  <Link
                    href={`/services/${service.slug}`}
                    prefetch={false}
                    className="group w-full text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-dark"
                    style={{ display: 'block' }}
                  >
                    {service.image && typeof service.image === 'object' && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-lrp-gray">
                        <Image
                          src={getMediaUrl(service.image)}
                          alt={service.image.alt || service.title}
                          fill
                          sizes="(min-width: 1280px) 584px, (min-width: 768px) 46vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="mt-6 flex items-start gap-3">
                      {service.icon && (
                        <span aria-hidden="true" className="mt-1 shrink-0 text-primary-dark">
                          <DynamicIcon name={service.icon} size={24} />
                        </span>
                      )}
                      <h2 className="font-celebri text-3xl font-black leading-tight tracking-[-0.025em] group-hover:underline group-hover:decoration-primary-dark group-hover:underline-offset-4">
                        {service.title}
                      </h2>
                    </div>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-black/65">
                      {service.shortDescription || service.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 text-sm">
                      <span className="text-black/65">
                        {service.pricing?.basePrice ? `From $${service.pricing.basePrice}` : 'Custom Pricing'}
                      </span>
                      <span className="font-bold underline decoration-primary-dark underline-offset-4">
                        Learn More<span className="sr-only"> about {service.title}</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-12 text-black/65">Services information will be available soon.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="specialty-guides-heading" className="bg-lrp-black py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 id="specialty-guides-heading" className="max-w-xl font-celebri text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-5xl">
              Specialty Transportation Guides
            </h2>
            <p className="max-w-xl leading-relaxed text-white/75">
              Planning a more specific Lake of the Ozarks itinerary? These private transportation pages cover common restaurant, dock, hotel, resort, and vacation rental scenarios.
            </p>
          </header>
          <div className="mt-10 grid gap-x-12 md:grid-cols-2">
            {seoServicePageList.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                prefetch={false}
                className="group border-t border-white/25 py-7 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
                style={{ display: 'block' }}
              >
                <h3 className="text-xl font-bold group-hover:text-primary-light">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{service.metadataDescription}</p>
                <span className="mt-4 inline-block text-sm font-bold underline decoration-primary underline-offset-4">View guide</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="services-booking-heading" className="bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 border-t border-black/25 pt-6">
            <h2 id="services-booking-heading" className="font-celebri text-4xl font-black tracking-[-0.035em] sm:text-5xl">Ready to Book?</h2>
            <p className="mt-3 text-lg text-black/65">Reserve your luxury transportation today</p>
          </header>
          <BookingWidget />
        </div>
      </section>
    </>
  );
}

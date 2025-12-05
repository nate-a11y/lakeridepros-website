import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getServiceBySlugLocal, getMediaUrl, getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/payload-local';
import BookingWidget from '@/components/BookingWidget';
import TestimonialsSection from '@/components/TestimonialsSection';
import { DynamicIcon } from '@/lib/iconMapper';
import { getFAQsForService, generateFAQSchema } from '@/lib/serviceFAQs';
import ServiceFAQ from '@/components/ServiceFAQ';
import ServiceViewTracker from '@/components/ServiceViewTracker';

type Props = {
  params: Promise<{ slug: string }>;
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugLocal(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Lake Ride Pros',
    };
  }

  const description = service.shortDescription || service.description || '';
  const serviceImage = typeof service.image === 'object' ? service.image : null;
  const imageUrl = serviceImage?.url
    ? getMediaUrl(serviceImage.url)
    : 'https://www.lakeridepros.com/og-image.jpg';

  // Enhanced title with location
  const title = `${service.title} at Lake Ozarks | Lake Ride Pros`;

  // Enhanced description with location + CTA
  const metaDescription = description
    ? `${description.slice(0, 140)} at Lake of the Ozarks. Book now!`
    : `Professional ${service.title.toLowerCase()} at Lake of the Ozarks, Missouri. Professional drivers, luxury vehicles, 24/7 service. Book your ride today.`;

  return {
    title,
    description: metaDescription.slice(0, 160),
    keywords: `${service.title}, Lake of the Ozarks transportation, luxury transportation Missouri, ${service.slug.replace(/-/g, ' ')}, professional drivers, Lake Ozarks, Osage Beach`,
    alternates: {
      canonical: `https://www.lakeridepros.com/services/${slug}`,
    },
    openGraph: {
      title,
      description: metaDescription.slice(0, 160),
      url: `https://www.lakeridepros.com/services/${slug}`,
      siteName: 'Lake Ride Pros',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription.slice(0, 160),
      images: [imageUrl],
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
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlugLocal(slug);

  if (!service) {
    notFound();
  }

  // Fetch testimonials (only 5-star reviews)
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

  const serviceImageObj = typeof service.image === 'object' ? service.image : null;
  const imageUrl = serviceImageObj?.url
    ? getMediaUrl(serviceImageObj.url)
    : '/placeholder-service.jpg';

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Lake Ride Pros',
      url: 'https://www.lakeridepros.com',
      logo: 'https://www.lakeridepros.com/Color%20logo%20-%20no%20background.png',
      telephone: '+1-573-206-9499',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lake of the Ozarks',
        addressRegion: 'MO',
        addressCountry: 'US',
      },
    },
    ...(serviceImageObj?.url && {
      image: getMediaUrl(serviceImageObj.url),
    }),
    ...(service.pricing?.basePrice && {
      offers: {
        '@type': 'Offer',
        price: service.pricing.basePrice,
        priceCurrency: 'USD',
        ...(service.pricing.pricingType === 'hourly' && {
          unitText: 'HOUR',
        }),
      },
    }),
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lakeridepros.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://www.lakeridepros.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://www.lakeridepros.com/services/${slug}`,
      },
    ],
  };

  // FAQ Structured Data for SEO
  const faqStructuredData = generateFAQSchema(slug, service.title);
  const faqs = getFAQsForService(slug);

  return (
    <>
      {/* Track page view for analytics */}
      <ServiceViewTracker serviceSlug={slug} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {/* Breadcrumb Navigation */}
      <nav className="bg-neutral-50 dark:bg-dark-bg-secondary py-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-lrp-text-secondary dark:text-dark-text-secondary">/</li>
            <li>
              <Link
                href="/services"
                className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Services
              </Link>
            </li>
            <li className="text-lrp-text-secondary dark:text-dark-text-secondary">/</li>
            <li className="text-neutral-900 dark:text-white font-medium" aria-current="page">
              {service.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {service.icon && (
            <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <DynamicIcon name={service.icon} size={32} className="text-white" />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {service.title}
          </h1>
          {service.shortDescription && (
            <p className="text-xl text-white/90 max-w-3xl">
              {service.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={serviceImageObj?.alt || service.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                About This Service
              </h2>
              <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-8 whitespace-pre-wrap">
                {service.description}
              </p>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                    Features & Benefits
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start text-lrp-text-secondary dark:text-dark-text-secondary"
                      >
                        <Check className="w-5 h-5 text-primary dark:text-primary-light mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing */}
              {service.pricing && (
                <div className="bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                    Pricing Information
                  </h3>
                  {service.pricing.basePrice && (
                    <p className="text-3xl font-bold text-primary dark:text-primary-light mb-2">
                      ${service.pricing.basePrice}
                      {service.pricing.pricingType === 'hourly' && (
                        <span className="text-lg font-normal text-lrp-text-secondary dark:text-dark-text-secondary">
                          /hour
                        </span>
                      )}
                    </p>
                  )}
                  {service.pricing.pricingType && (
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mb-2 capitalize">
                      {service.pricing.pricingType} rate
                    </p>
                  )}
                  {service.pricing.notes && (
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mt-4">
                      {service.pricing.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Common questions about {service.title.toLowerCase()}
            </p>
          </div>
          <ServiceFAQ faqs={faqs} />
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          title="What Our Clients Say"
          subtitle={`See why customers love our ${service.title.toLowerCase()}`}
          showCount={3}
          includeSchema={false}
        />
      )}

      {/* Booking Section */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Ready to Book This Service?
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Reserve your {service.title.toLowerCase()} today
            </p>
          </div>
          <BookingWidget serviceSlug={slug} />
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getServiceBySlugLocal, getMediaUrl, getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity';
import BookingWidget from '@/components/BookingWidget';
import DynamicServiceReviews from '../_components/DynamicServiceReviews';
import { DynamicIcon } from '@/lib/iconMapper';
import { getFAQsForService, generateFAQSchema } from '@/lib/serviceFAQs';
import ServiceViewTracker from '@/components/ServiceViewTracker';
import { MoovsBookingLink } from '@/components/MoovsBookingLink';
import { metaDescription, metaTitle } from '@/lib/seo/metadata';

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
  const imageUrl = serviceImage
    ? getMediaUrl(serviceImage)
    : 'https://www.lakeridepros.com/og-image.jpg';

  // Enhanced title with location
  const title = metaTitle(`${service.title} at Lake Ozarks`);

  // Enhanced description with location + CTA
  const descriptionText = metaDescription(
    description
      ? `${description} at Lake of the Ozarks. Book now.`
      : '',
    `Professional ${service.title.toLowerCase()} at Lake of the Ozarks, Missouri. Professional drivers, luxury vehicles, 24/7 service.`
  );

  return {
    title,
    description: descriptionText,
    keywords: `${service.title}, Lake of the Ozarks transportation, luxury transportation Missouri, ${slug.replace(/-/g, ' ')}, professional drivers, Lake Ozarks, Osage Beach`,
    alternates: {
      canonical: `https://www.lakeridepros.com/services/${slug}`,
    },
    openGraph: {
      title,
      description: descriptionText,
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
      description: descriptionText,
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
    permanentRedirect('/services');
  }

  // Fetch testimonials (only 5-star reviews)
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

  const serviceImageObj = typeof service.image === 'object' ? service.image : null;
  const imageUrl = serviceImageObj
    ? getMediaUrl(serviceImageObj)
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
    ...(serviceImageObj && {
      image: getMediaUrl(serviceImageObj),
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
      <section aria-labelledby="service-heading" className="bg-lrp-black text-white">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-6 sm:pb-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-10 border-b border-white/25 pb-4">
            <ol className="flex flex-wrap items-center gap-x-3 text-sm text-white/75">
              <li><Link href="/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/services" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="py-3 font-semibold text-white">{service.title}</li>
            </ol>
          </nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="min-w-0">
              <p className="font-boardson text-3xl text-primary-light">Lake of the Ozarks · Missouri</p>
              <h1 id="service-heading" className="mt-5 text-balance font-celebri text-[clamp(2.6rem,12vw,3rem)] font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {service.title}
              </h1>
              {service.shortDescription && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{service.shortDescription}</p>}
              <a href="#service-booking" className="mt-7 min-h-12 border-b border-primary pb-1 font-bold hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light">
                Plan this ride
              </a>
            </div>
            <div className="relative aspect-[4/3] min-w-0 overflow-hidden bg-lrp-gray">
              <Image
                src={imageUrl}
                alt={serviceImageObj?.alt || service.title}
                fill
                sizes="(min-width: 1280px) 580px, (min-width: 1024px) 46vw, 100vw"
                quality={65}
                fetchPriority="high"
                loading="eager"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="service-about-heading" className="bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              {service.icon && <span aria-hidden="true" className="shrink-0 text-primary-dark"><DynamicIcon name={service.icon} size={28} /></span>}
              <h2 id="service-about-heading" className="font-celebri text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">About This Service</h2>
            </div>
            <p className="mt-6 max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-black/65">{service.description}</p>
          </div>
          <div className="min-w-0 lg:col-span-5">
            {service.features && service.features.length > 0 && (
              <div className="border-t border-black/25 pt-5">
                <h3 className="text-xl font-bold">Features & Benefits</h3>
                <ul className="mt-4 divide-y divide-black/15">
                  {service.features.map((item, index) => (
                    <li key={item._key || index} className="flex items-start gap-3 py-4 text-black/65">
                      <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-dark" />
                      <span>{item.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service.pricing && (
              <div className="mt-8 border-t border-black/25 pt-6">
                {service.pricing.pricingType === 'custom' ? (
                  <>
                    <h3 className="text-2xl font-bold">Get a Quote Today</h3>
                    <p className="mt-3 leading-relaxed text-black/65">{service.pricing.notes || 'Contact Lake Ride Pros for personalized pricing tailored to your needs.'}</p>
                    <MoovsBookingLink location="quote_card" className="mt-6 min-h-14 bg-primary px-7 py-4 font-bold text-lrp-black hover:bg-primary-light">
                      Quote Now
                    </MoovsBookingLink>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">Pricing Information</h3>
                    {!!service.pricing.basePrice && (
                      <p className="mt-4 text-4xl font-black tracking-[-0.035em]">
                        ${service.pricing.basePrice}
                        {service.pricing.pricingType === 'hourly' && <span className="text-lg font-normal tracking-normal text-black/65">/hour</span>}
                      </p>
                    )}
                    {service.pricing.pricingType && <p className="mt-2 text-sm capitalize text-black/65">{service.pricing.pricingType} rate</p>}
                    {service.pricing.notes && <p className="mt-4 text-sm leading-relaxed text-black/65">{service.pricing.notes}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-faq-heading" className="bg-lrp-black py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <header className="lg:col-span-4">
            <h2 id="service-faq-heading" className="font-celebri text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-5xl">Frequently Asked Questions</h2>
            <p className="mt-5 leading-relaxed text-white/75">Common questions about {service.title.toLowerCase()}</p>
          </header>
          <div className="min-w-0 border-t border-white/25 lg:col-span-8">
            {faqs.map((faq, index) => (
              <details key={faq.question} name="service-faq" className="group border-b border-white/25">
                <summary className="flex min-h-16 cursor-pointer list-none items-start justify-between gap-5 py-6 text-left text-lg font-semibold hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-primary-light group-open:hidden">+</span>
                  <span aria-hidden="true" className="hidden shrink-0 text-primary-light group-open:block">−</span>
                </summary>
                <p id={`faq-answer-${index}`} className="max-w-3xl pb-6 leading-relaxed text-white/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <DynamicServiceReviews testimonials={testimonials} serviceTitle={service.title} />

      <section id="service-booking" aria-labelledby="service-booking-heading" className="scroll-mt-28 bg-lrp-gray py-16 text-lrp-black sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 border-t border-black/25 pt-6">
            <h2 id="service-booking-heading" className="font-celebri text-4xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">Ready to Book This Service?</h2>
            <p className="mt-3 text-lg text-black/65">Reserve your {service.title.toLowerCase()} today</p>
          </header>
          <BookingWidget serviceSlug={slug} />
        </div>
      </section>
    </>
  );
}

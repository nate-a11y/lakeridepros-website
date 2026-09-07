import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Phone } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import { PhoneLink } from '@/components/PhoneLink';
import type { SeoServicePageData } from '../_data/seoServicePages';

const baseUrl = 'https://www.lakeridepros.com';

// Existing, verified LRP fleet photography. Keep these static specialty pages
// independent of runtime CMS requests; these assets also appear in the homepage fleet.
const servicePhotography = {
  suv: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/5e4ab6a319db44a0b0f60eddec7f1d7f4718c65c-1024x768.avif',
    alt: 'Black Lake Ride Pros SUV with green running-board lighting',
  },
  sprinter: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/c8efb814caf7a52fbd14beaf84ba755d02316f26-2048x1536.jpg',
    alt: 'Lake Ride Pros Executive Sprinter parked beside a private aircraft',
  },
  shuttle: {
    src: 'https://cdn.sanity.io/images/1hcdphjr/production/cf3f2f162997d40f0d47ca91362d91d808a4130e-4000x3000.png',
    alt: 'Lake Ride Pros Executive Shuttle Bus parked along a tree-lined drive',
  },
};

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current';
const focusRingOnDark = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';
const sectionHeading = 'font-celebri text-3xl font-black leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl';

interface SeoServiceLandingPageProps {
  page: SeoServicePageData;
}

export default function SeoServiceLandingPage({ page }: SeoServiceLandingPageProps) {
  const photography = page.slug === 'executive-black-car-service' || page.slug === 'restaurant-shuttle'
    ? servicePhotography.suv
    : page.slug === 'hotel-shuttle-service' || page.slug === 'lodge-of-four-seasons-transportation'
      ? servicePhotography.shuttle
      : servicePhotography.sprinter;
  const canonical = `${baseUrl}/services/${page.slug}`;
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical}#service`,
    name: page.title,
    serviceType: page.title,
    description: page.metadataDescription,
    url: canonical,
    areaServed: [
      { '@type': 'Place', name: 'Lake of the Ozarks' },
      { '@type': 'City', name: 'Osage Beach, MO' },
      { '@type': 'City', name: 'Lake Ozark, MO' },
      { '@type': 'City', name: 'Camdenton, MO' },
      { '@type': 'City', name: 'Sunrise Beach, MO' },
      { '@type': 'City', name: 'Laurie, MO' },
    ],
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: 'Lake Ride Pros',
      url: baseUrl,
      image: `${baseUrl}/og-image.jpg`,
      logo: `${baseUrl}/Color%20logo%20-%20no%20background.png`,
      telephone: '+1-573-206-9499',
      email: 'contactus@lakeridepros.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lake of the Ozarks',
        addressRegion: 'MO',
        addressCountry: 'US',
      },
      priceRange: '$$-$$$',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      description: page.priceNote,
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/book`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
      { '@type': 'ListItem', position: 3, name: page.title, item: canonical },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="bg-lrp-black text-white" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/25 py-5 text-sm">
            <li><Link href="/" className={`text-white/75 hover:text-white ${focusRing}`}>Home</Link></li>
            <li aria-hidden="true" className="text-white/50">/</li>
            <li><Link href="/services" className={`text-white/75 hover:text-white ${focusRing}`}>Services</Link></li>
            <li aria-hidden="true" className="text-white/50">/</li>
            <li className="font-medium" aria-current="page">{page.title}</li>
          </ol>
        </div>
      </nav>

      <section aria-labelledby="service-heading" className="bg-lrp-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div className="min-w-0 lg:col-span-7">
            <p className="mb-5 font-boardson text-2xl leading-tight text-primary-light sm:text-3xl">
              {page.heroKicker}
            </p>
            <h1 id="service-heading" className="text-balance font-celebri text-[clamp(2.6rem,5.6vw,5.25rem)] font-black leading-[0.95] tracking-[-0.045em]">
              {page.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/80">
              {page.heroDescription}
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-start">
              <Link href="/book" className={`inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-6 py-4 text-center font-bold text-lrp-black hover:bg-primary-light ${focusRingOnDark}`}>
                {page.primaryCta}
                <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
              </Link>
              <PhoneLink className={`inline-flex min-h-14 items-center justify-center gap-2 border border-white/50 px-6 py-4 font-bold text-white hover:border-white hover:bg-white hover:text-lrp-black ${focusRingOnDark}`}>
                <Phone className="size-5 shrink-0" aria-hidden="true" />
                Call/Text (573) 206-9499
              </PhoneLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-5">
            <Image
              src={photography.src}
              alt={photography.alt}
              fill
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 42vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              quality={65}
              loading="eager"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="service-intro-heading" className="bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 id="service-intro-heading" className={sectionHeading}>{page.introHeading}</h2>
              <div className="mt-7 max-w-prose space-y-5 text-lg leading-relaxed text-black/70">
                {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            <aside className="border-t-2 border-lrp-black pt-6 lg:col-span-5">
              <h2 className="font-celebri text-2xl font-bold tracking-tight">Good Fit For</h2>
              <ul className="mt-5 divide-y divide-black/15 border-b border-black/15">
                {page.bestFor.map((item) => (
                  <li key={item} className="py-3 leading-relaxed text-black/70">{item}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-black/70">
                <strong className="mb-2 block text-lrp-black">Pricing note</strong>
                {page.priceNote}
              </p>
            </aside>
          </div>
          <div className="mt-14 grid gap-8 border-t border-black/25 pt-8 md:grid-cols-3 md:gap-10">
            {page.highlights.map((highlight) => (
              <div key={highlight.title}>
                <h2 className="font-celebri text-2xl font-bold tracking-tight">{highlight.title}</h2>
                <p className="mt-3 leading-relaxed text-black/70">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-stops-heading" className="border-t border-black/20 bg-white pb-16 pt-10 text-lrp-black sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="service-stops-heading" className={`${sectionHeading} lg:col-span-7`}>{page.popularStopsTitle}</h2>
            <p className="max-w-xl text-lg leading-relaxed text-black/70 lg:col-span-5">
              Every itinerary is private and customized, but these are common places and scenarios customers ask us to connect.
            </p>
          </div>
          <div className="grid gap-x-12 md:grid-cols-2">
            {page.popularStops.map((stop) => (
              <div key={stop.name} className="border-t border-black/20 py-6">
                <h3 className="text-xl font-bold">{stop.name}</h3>
                <p className="mt-3 max-w-prose leading-relaxed text-black/70">{stop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-planning-heading" className="bg-lrp-black py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-5">
            <h2 id="service-planning-heading" className={sectionHeading}>{page.planningTitle}</h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-white/75">
              A little upfront detail helps us quote accurately, choose the right vehicle, and avoid day-of surprises.
            </p>
          </div>
          <div className="divide-y divide-white/25 border-y border-white/25 lg:col-span-7">
            {page.planningTips.map((tip) => (
              <div key={tip.title} className="py-6">
                <h3 className="text-xl font-bold">{tip.title}</h3>
                <p className="mt-3 max-w-prose leading-relaxed text-white/75">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-faq-heading" className="bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-4">
            <h2 id="service-faq-heading" className={sectionHeading}>Frequently Asked Questions</h2>
            <p className="mt-5 text-lg leading-relaxed text-black/70">
              Answers for common {page.title.toLowerCase()} questions.
            </p>
          </div>
          <div className="divide-y divide-black/20 border-y border-black/20 lg:col-span-8">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold [&::-webkit-details-marker]:hidden ${focusRing}`}>
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-4 max-w-prose pr-4 leading-relaxed text-black/70">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {page.related.length > 0 && (
        <section aria-labelledby="service-related-heading" className="bg-lrp-black py-14 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="service-related-heading" className={`${sectionHeading} mb-8`}>You May Also Need</h2>
            <div className="divide-y divide-white/25 border-y border-white/25">
              {page.related.map((service) => (
                <Link key={service.href} href={service.href} className={`group grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-x-8 ${focusRing}`}>
                  <h3 className="text-xl font-bold group-hover:underline group-hover:underline-offset-4">{service.title}</h3>
                  <p className="max-w-prose leading-relaxed text-white/75 sm:row-start-2">{service.description}</p>
                  <ArrowUpRight className="hidden size-6 text-primary-light sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:block sm:self-center" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="service-booking-heading" className="bg-white py-16 text-lrp-black sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 id="service-booking-heading" className={sectionHeading}>Ready to Plan Your Ride?</h2>
            <p className="mt-5 text-lg leading-relaxed text-black/70">
              Tell us your pickup, stops, passenger count, and timing. We’ll help match the right vehicle and route.
            </p>
          </div>
          <BookingWidget serviceSlug={page.slug} />
        </div>
      </section>
    </>
  );
}

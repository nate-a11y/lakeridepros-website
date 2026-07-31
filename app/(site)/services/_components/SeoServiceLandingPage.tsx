import Link from 'next/link';
import { CheckCircle, Clock, MapPin, Phone, Shield, Star } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import RelatedServices from '@/components/RelatedServices';
import { PhoneLink } from '@/components/PhoneLink';
import { DynamicIcon } from '@/lib/iconMapper';
import type { SeoServicePageData } from '../_data/seoServicePages';

const baseUrl = 'https://www.lakeridepros.com';

interface SeoServiceLandingPageProps {
  page: SeoServicePageData;
}

export default function SeoServiceLandingPage({ page }: SeoServiceLandingPageProps) {
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

      <nav className="bg-neutral-50 dark:bg-dark-bg-secondary py-4" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light transition-colors">
                Home
              </Link>
            </li>
            <li className="text-lrp-text-secondary dark:text-dark-text-secondary">/</li>
            <li>
              <Link href="/services" className="text-lrp-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-light transition-colors">
                Services
              </Link>
            </li>
            <li className="text-lrp-text-secondary dark:text-dark-text-secondary">/</li>
            <li className="text-neutral-900 dark:text-white font-medium" aria-current="page">
              {page.title}
            </li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <DynamicIcon name={page.icon} size={18} className="text-white" />
              {page.heroKicker}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {page.heroTitle}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mb-8">
              {page.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 font-bold text-primary-dark transition-all hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                {page.primaryCta}
              </Link>
              <PhoneLink className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                <Phone className="h-5 w-5" />
                Call/Text (573) 206-9499
              </PhoneLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                {page.introHeading}
              </h2>
              <div className="space-y-5 text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
                {page.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl bg-neutral-50 dark:bg-dark-bg-secondary p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Good Fit For
              </h2>
              <ul className="space-y-3">
                {page.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lrp-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-white dark:bg-dark-bg-primary p-4 text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                <strong className="block text-neutral-900 dark:text-white mb-1">Pricing note</strong>
                {page.priceNote}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {page.highlights.map((highlight, index) => {
              const icons = [Shield, Clock, Star];
              const Icon = icons[index % icons.length];
              return (
                <div key={highlight.title} className="rounded-2xl bg-white dark:bg-dark-bg-primary p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {highlight.title}
                  </h2>
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {page.popularStopsTitle}
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Every itinerary is private and customized, but these are common places and scenarios customers ask us to connect.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.popularStops.map((stop) => (
              <div key={stop.name} className="rounded-2xl border border-neutral-200 dark:border-dark-border p-6">
                <div className="mb-3 flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{stop.name}</h3>
                </div>
                <p className="text-lrp-text-secondary dark:text-dark-text-secondary">{stop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                {page.planningTitle}
              </h2>
              <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
                A little upfront detail helps us quote accurately, choose the right vehicle, and avoid day-of surprises.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {page.planningTips.map((tip, index) => (
                <div key={tip.title} className="rounded-2xl bg-white dark:bg-dark-bg-primary p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lrp-black font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{tip.title}</h3>
                  <p className="text-lrp-text-secondary dark:text-dark-text-secondary">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Answers for common {page.title.toLowerCase()} questions.
            </p>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-dark-border rounded-2xl border border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-bg-secondary">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="cursor-pointer list-none text-lg font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  {faq.question}
                </summary>
                <p className="mt-4 text-lrp-text-secondary dark:text-dark-text-secondary">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <RelatedServices services={page.related} />

      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Ready to Plan Your Ride?
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Tell us your pickup, stops, passenger count, and timing. We’ll help match the right vehicle and route.
            </p>
          </div>
          <BookingWidget serviceSlug={page.slug} />
        </div>
      </section>
    </>
  );
}

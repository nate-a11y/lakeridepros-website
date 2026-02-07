import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Transportation in Osage Beach MO | Lake Ride Pros',
  description: 'Premier transportation service in Osage Beach, Missouri. Serving Tan-Tar-A, Margaritaville, Bagnell Dam Strip. Weddings, events, airport shuttle, nightlife.',
  keywords: [
    'Osage Beach transportation',
    'Osage Beach shuttle service',
    'Osage Beach taxi',
    'Tan-Tar-A transportation',
    'Margaritaville shuttle Osage Beach',
    'Bagnell Dam Strip transportation',
    'Osage Beach wedding transportation',
    'Osage Beach airport shuttle'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-osage-beach',
  },
  openGraph: {
    title: 'Transportation in Osage Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Osage Beach. Serving Tan-Tar-A, Margaritaville, Bagnell Dam Strip & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-osage-beach',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Osage Beach Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Osage Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Osage Beach.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Osage Beach Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-osage-beach',
  url: 'https://www.lakeridepros.com/transportation-osage-beach',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lake of the Ozarks',
    addressRegion: 'MO',
    addressCountry: 'US'
  },
  areaServed: {
    '@type': 'City',
    name: 'Osage Beach',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1028,
    longitude: -92.6332
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Osage Beach, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Tan-Tar-A Resort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide transportation to and from Tan-Tar-A Resort for weddings, conferences, and events. We handle shuttles between Tan-Tar-A and nearby hotels, airports, and attractions throughout Osage Beach.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you shuttle guests along the Bagnell Dam Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in Bagnell Dam Strip transportation. Whether you\'re bar hopping or visiting multiple restaurants, we provide safe, reliable shuttle service throughout the Strip in Osage Beach.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates in Osage Beach start at $120/hour for sprinter vans (up to 14 passengers) and $150/hour for larger shuttle buses. Rates vary based on vehicle type, group size, and service duration. Contact us for a custom quote for your Osage Beach transportation needs.'
      }
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book Osage Beach transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For peak season (May-September) and major events, we recommend booking 2-4 weeks in advance. For off-season and last-minute needs in Osage Beach, call us at (573) 206-9499 - we often have availability with 24-48 hour notice.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you service Margaritaville Lake Resort in Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Margaritaville Lake Resort is one of our most frequent pickup and drop-off locations in Osage Beach. We provide wedding transportation, guest shuttles, airport transfers, and event transportation for Margaritaville guests and event attendees.'
      }
    }
  ]
}

export default async function OsageBeachTransportationPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-lrp-green to-lrp-green/80 py-20">
          <div className="container mx-auto px-4 text-center">
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Professional Transportation in Osage Beach, Missouri
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              From Tan-Tar-A to the Bagnell Dam Strip, we know every venue, hotel, and hotspot in Osage Beach. Luxury transportation you can count on.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Osage Beach Ride
            </Link>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Osage Beach Destinations We Serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Tan-Tar-A Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Weddings, conferences, events, and guest shuttles
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Margaritaville Lake Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Wedding venue transportation, party shuttles, corporate events
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Bagnell Dam Strip</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Nightlife transport, bar hopping, restaurant shuttles
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach Premium Outlets</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Shopping shuttles for groups and families
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage National Golf Club</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Golf outing transportation and tournament shuttles
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Waterfront Bars & Restaurants</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Dog Days, Backwater Jack's, Shady Gators, and more
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services in Osage Beach */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services in Osage Beach
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Transportation</h3>
                    <p className="text-sm opacity-80">Tan-Tar-A, Margaritaville, waterfront venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Shuttle</h3>
                    <p className="text-sm opacity-80">KC, STL, Springfield to Osage Beach</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/party-bus-nightlife" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Nightlife & Bar Hopping</h3>
                    <p className="text-sm opacity-80">Bagnell Dam Strip, lakefront bars, party bus</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/corporate-executive-travel" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Transportation</h3>
                    <p className="text-sm opacity-80">Tan-Tar-A conferences, team retreats, client entertainment</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Event Shuttles</h3>
                    <p className="text-sm opacity-80">Concerts, festivals, group events in Osage Beach</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Hotel Transfers</h3>
                    <p className="text-sm opacity-80">Between Osage Beach accommodations and venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros in Osage Beach
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Based in Lake of the Ozarks
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We're locals, not a national chain. Our drivers know every road, venue, and shortcut in Osage Beach.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Know Every Venue
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Tan-Tar-A, Margaritaville, the Strip - we've transported thousands to every Osage Beach location.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  24/7 Availability
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Serving Osage Beach around the clock, year-round. Day trips, late nights, early mornings - we're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Osage Beach Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Tan-Tar-A Resort?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide transportation to and from Tan-Tar-A Resort for weddings, conferences, and events. We handle shuttles between Tan-Tar-A and nearby hotels, airports, and attractions throughout Osage Beach.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you shuttle guests along the Bagnell Dam Strip?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in Bagnell Dam Strip transportation. Whether you're bar hopping or visiting multiple restaurants, we provide safe, reliable shuttle service throughout the Strip in Osage Beach.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does transportation cost in Osage Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates in Osage Beach start at $120/hour for sprinter vans (up to 14 passengers) and $150/hour for larger shuttle buses. Rates vary based on vehicle type, group size, and service duration. Contact us for a custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book Osage Beach transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For peak season (May-September) and major events, we recommend booking 2-4 weeks in advance. For off-season and last-minute needs in Osage Beach, call us at (573) 206-9499 - we often have availability with 24-48 hour notice.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you service Margaritaville Lake Resort in Osage Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Margaritaville Lake Resort is one of our most frequent pickup and drop-off locations in Osage Beach. We provide wedding transportation, guest shuttles, airport transfers, and event transportation for Margaritaville guests and event attendees.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Osage Beach Clients Say"
          subtitle="Real experiences from customers we've served in Osage Beach"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Tan-Tar-A Transportation", href: "/services/tan-tar-a-transportation", description: "Dedicated shuttle service for Tan-Tar-A Resort events" },
          { title: "Margaritaville Transportation", href: "/services/margaritaville-transportation", description: "Resort guest and event transportation for Margaritaville" },
          { title: "Nightlife Transportation", href: "/services/party-bus-nightlife", description: "Bagnell Dam Strip bar hopping and party bus rentals" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Osage Beach Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional, reliable service throughout Osage Beach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Now
              </Link>
              <PhoneLink className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all">
                <Phone className="w-5 h-5" />
                (573) 206-9499
              </PhoneLink>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

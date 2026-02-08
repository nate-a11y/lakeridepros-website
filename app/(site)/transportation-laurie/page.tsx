import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Transportation in Laurie MO | Lake Ride Pros',
  description: 'Premier transportation service in Laurie, Missouri. Serving the west side of Lake of the Ozarks, Hurricane Deck, and the 5A area. Weddings, nightlife, airport shuttles.',
  keywords: [
    'Laurie Missouri transportation',
    'Laurie Lake Ozarks shuttle',
    'Laurie to Osage Beach transportation',
    'West side Lake Ozarks shuttle',
    'Hurricane Deck transportation',
    'Laurie wedding transportation',
    '5A Lake Ozarks transportation'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-laurie',
  },
  openGraph: {
    title: 'Transportation in Laurie MO | Lake Ride Pros',
    description: 'Professional transportation throughout Laurie and the west side of Lake of the Ozarks. Serving Hurricane Deck and the 5A area.',
    url: 'https://www.lakeridepros.com/transportation-laurie',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Laurie Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Laurie MO | Lake Ride Pros',
    description: 'Professional transportation throughout Laurie.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Laurie Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-laurie',
  url: 'https://www.lakeridepros.com/transportation-laurie',
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
    name: 'Laurie',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1933,
    longitude: -92.8247
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Laurie, Missouri on the west side of Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Laurie from Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Laurie is approximately 25 minutes from Osage Beach via MO-5 and MO-135. Lake Ride Pros provides direct transportation between Laurie and all major Lake of the Ozarks destinations including Osage Beach, Bagnell Dam Strip, and Lake Ozark.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Hurricane Deck?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We serve Hurricane Deck, Laurie, Gravois Mills, and the entire west side of Lake of the Ozarks. Our drivers know all the back roads and fastest routes throughout the 5A area.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Laurie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates from Laurie start at $120/hour for sprinter vans (up to 14 passengers). Rates vary based on vehicle type, group size, and destination. Contact us for a custom quote.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide wedding transportation for Laurie area venues?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We provide wedding transportation for west side venues, guest shuttles from Laurie accommodations, and airport transfers for destination wedding guests visiting the Lake.'
      }
    }
  ]
}

export default async function LaurieTransportationPage() {
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
              Professional Transportation in Laurie, Missouri
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Serving the west side of Lake of the Ozarks. From Laurie and Hurricane Deck to Osage Beach, Bagnell Dam Strip, and beyond—reliable luxury transportation.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Laurie Ride
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-lrp-black text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <span className="font-bold text-2xl text-lrp-green">25 min</span>
                <p className="text-sm opacity-80">to Osage Beach</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">5A Area</span>
                <p className="text-sm opacity-80">Full west side coverage</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">65038</span>
                <p className="text-sm opacity-80">ZIP code served</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">MO-5 & MO-135</span>
                <p className="text-sm opacity-80">Highway access</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Serving the West Side of Lake of the Ozarks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Laurie</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Downtown Laurie, residences, vacation rentals
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Hurricane Deck</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lakefront homes, condos, vacation properties
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Gravois Mills</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lake access, rentals, residential areas
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Shopping, dining, Tan-Tar-A, Margaritaville
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Bagnell Dam Strip</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Nightlife, bars, restaurants, entertainment
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  County seat, shopping, services, Old Kinderhook
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services in Laurie
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Transportation</h3>
                    <p className="text-sm opacity-80">West side venues, guest shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/bagnell-dam-strip-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Nightlife Transportation</h3>
                    <p className="text-sm opacity-80">Laurie to Bagnell Dam Strip</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Shuttle</h3>
                    <p className="text-sm opacity-80">KC, STL, Springfield to Laurie</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Group Events</h3>
                    <p className="text-sm opacity-80">Family reunions, corporate retreats</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/transportation-camdenton" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Camdenton Transfers</h3>
                    <p className="text-sm opacity-80">Shopping, dining, Old Kinderhook</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/transportation-sunrise-beach" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sunrise Beach Transfers</h3>
                    <p className="text-sm opacity-80">West side connections</p>
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
              Why Choose Lake Ride Pros in Laurie
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  West Side Experts
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We know Laurie, Hurricane Deck, and Gravois Mills. Every back road, every shortcut, every address.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Reliable Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No rideshare surprises. Book in advance and your ride is guaranteed—even to remote west side locations.
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
                  Early morning airport runs, late night bar pickups, anytime you need us—we're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Laurie Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far is Laurie from Osage Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Laurie is approximately 25 minutes from Osage Beach via MO-5 and MO-135. Lake Ride Pros provides direct transportation between Laurie and all major Lake of the Ozarks destinations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation from Hurricane Deck?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We serve Hurricane Deck, Laurie, Gravois Mills, and the entire west side of Lake of the Ozarks. Our drivers know all the roads throughout the 5A area.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does transportation cost in Laurie?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates from Laurie start at $120/hour for sprinter vans (up to 14 passengers). Rates vary based on vehicle type, group size, and destination. Contact us for a custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide wedding transportation for Laurie area venues?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We provide wedding transportation for west side venues, guest shuttles from Laurie accommodations, and airport transfers for destination wedding guests.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Laurie Clients Say"
          subtitle="Real experiences from customers we've served in Laurie"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Camdenton Transportation", href: "/transportation-camdenton", description: "Old Kinderhook, wine tours, county seat" },
          { title: "Sunrise Beach Transportation", href: "/transportation-sunrise-beach", description: "West side connections" },
          { title: "Wedding Transportation", href: "/services/wedding-transportation", description: "Guest shuttles for Lake weddings" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Laurie Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional, reliable service throughout the west side of Lake of the Ozarks
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

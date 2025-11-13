import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, Star, ArrowRight, Wine } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Transportation in Camdenton MO | Lake Ride Pros',
  description: 'Professional transportation service in Camdenton, Missouri. Serving Old Kinderhook, local wineries, downtown, and all venues. Weddings, wine tours, events.',
  keywords: [
    'Camdenton transportation',
    'Camdenton shuttle service',
    'Old Kinderhook transportation',
    'Camdenton wedding transportation',
    'Camdenton wine tour',
    'Camdenton Missouri taxi',
    'Camdenton airport shuttle'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-camdenton',
  },
  openGraph: {
    title: 'Transportation in Camdenton MO | Lake Ride Pros',
    description: 'Premium transportation in Camdenton. Serving Old Kinderhook, wineries, downtown & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-camdenton',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Camdenton Transportation',
  url: 'https://www.lakeridepros.com/transportation-camdenton',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  areaServed: {
    '@type': 'City',
    name: 'Camdenton',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Camdenton',
      addressRegion: 'MO',
      addressCountry: 'US'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.0097,
    longitude: -92.7451
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Camdenton, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Old Kinderhook Golf Course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Old Kinderhook is one of our most popular wedding and golf outing destinations in Camdenton. We provide shuttles for weddings, corporate golf tournaments, and special events at Old Kinderhook throughout the year.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you offer wine tour transportation in Camdenton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Camdenton and surrounding areas have excellent wineries. We provide custom wine tour transportation visiting multiple vineyards with a designated driver. Perfect for bachelorette parties, birthdays, and group outings.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Camdenton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates in Camdenton start at $120/hour for sprinter vans and $150/hour for larger vehicles. Wine tours and wedding packages have custom pricing based on duration and stops. Contact us for a personalized Camdenton transportation quote.'
      }
    }
  ]
}

export default function CamdentonTransportationPage() {
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
              Professional Transportation in Camdenton, Missouri
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Serving Old Kinderhook, downtown Camdenton, local wineries, and all venues. Luxury transportation with small-town reliability.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Camdenton Ride
            </a>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Camdenton Destinations We Serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Old Kinderhook Golf Course</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Premier wedding venue and golf tournament transportation
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <Wine className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Local Wineries</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Wine tour shuttles to nearby vineyards and tasting rooms
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Downtown Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Restaurants, shops, and local business transportation
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Wedding Venues</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Old Kinderhook and private estate wedding shuttles
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Vacation Rentals</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Residential pickups throughout the Camdenton area
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Local Events</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Community festivals, concerts, and special events
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services in Camdenton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services in Camdenton
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Transportation</h3>
                    <p className="text-sm opacity-80">Old Kinderhook and private venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/wine-tour-shuttle" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wine Tour Shuttles</h3>
                    <p className="text-sm opacity-80">Visit multiple wineries safely</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/airport-shuttle" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Transfers</h3>
                    <p className="text-sm opacity-80">KC, STL, Springfield to/from Camdenton</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/golf-outing-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Golf Outings</h3>
                    <p className="text-sm opacity-80">Old Kinderhook tournament shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/corporate-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Events</h3>
                    <p className="text-sm opacity-80">Business meetings and team events</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Local Shuttles</h3>
                    <p className="text-sm opacity-80">Around town and residential pickups</p>
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
              Why Choose Lake Ride Pros in Camdenton
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Local Knowledge
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We know Camdenton's back roads, shortcuts, and every venue from Old Kinderhook to downtown.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wine className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Wine Tour Specialists
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Custom wine tour routes with designated drivers. Sip safely while exploring local wineries.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Personal Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Small-town service with luxury vehicles. We treat Camdenton customers like neighbors, because you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Camdenton Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Old Kinderhook Golf Course?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Old Kinderhook is one of our most popular wedding and golf outing destinations in Camdenton. We provide shuttles for weddings, corporate golf tournaments, and special events at Old Kinderhook throughout the year.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer wine tour transportation in Camdenton?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Camdenton and surrounding areas have excellent wineries. We provide custom wine tour transportation visiting multiple vineyards with a designated driver. Perfect for bachelorette parties, birthdays, and group outings.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does transportation cost in Camdenton?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates in Camdenton start at $120/hour for sprinter vans and $150/hour for larger vehicles. Wine tours and wedding packages have custom pricing based on duration and stops. Contact us for a personalized quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you pick up from residential areas in Camdenton?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We service all residential areas in Camdenton including vacation rentals, private homes, and neighborhoods throughout the area. Just provide your address when booking.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you transport to other Lake Ozarks areas from Camdenton?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We frequently transport between Camdenton and Osage Beach, Lake Ozark, and other Lake of the Ozarks destinations. Perfect for multi-venue events or exploring different areas.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-lrp-gray text-lg italic mb-4">
                "We had our wedding at Old Kinderhook and used Lake Ride Pros for all our guest transportation. They handled shuttles from 3 different hotels in Camdenton without any issues. Drivers were punctual and professional. Highly recommend for any Camdenton event!"
              </p>
              <p className="font-bold text-lrp-black dark:text-white">
                Lauren & Chris
              </p>
              <p className="text-sm text-gray-600 dark:text-lrp-gray">
                Married at Old Kinderhook, Camdenton
              </p>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Old Kinderhook Transportation", href: "/old-kinderhook-transportation", description: "Golf course wedding and tournament transportation" },
          { title: "Wine Tour Shuttle", href: "/wine-tour-shuttle", description: "Designated driver for Lake Ozarks winery tours" },
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Full-service wedding shuttles for all Lake venues" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Camdenton Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional service throughout Camdenton and surrounding areas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Now
              </a>
              <a
                href="tel:5732069499"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                (573) 206-9499
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

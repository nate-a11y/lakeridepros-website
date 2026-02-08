import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight, Plane, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Lake of the Ozarks Airport Transportation | Grand Glaize Airport Shuttle | Lake Ride Pros',
  description: 'Professional airport shuttle service to/from Lake of the Ozarks. Grand Glaize Airport (KOZS), MCI, STL, SGF. Private aviation, commercial flights. Book now!',
  keywords: [
    'Lake of the Ozarks airport transportation',
    'Grand Glaize Airport shuttle',
    'KOZS airport transportation',
    'Lake Ozarks airport transfer',
    'MCI to Lake of the Ozarks',
    'STL to Lake Ozarks shuttle',
    'private aviation Lake Ozarks',
    'FBO transportation Lake of the Ozarks'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
  },
  openGraph: {
    title: 'Lake of the Ozarks Airport Transportation | Lake Ride Pros',
    description: 'Professional airport shuttle and private aviation transportation at Lake of the Ozarks. Grand Glaize Airport (KOZS), MCI, STL, SGF.',
    url: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ozarks Airport Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake of the Ozarks Airport Transportation | Lake Ride Pros',
    description: 'Professional airport shuttle and private aviation transportation at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Lake of the Ozarks Airport Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
  url: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
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
    name: 'Lake of the Ozarks',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.0963,
    longitude: -92.5495
  },
  priceRange: '$$-$$$',
  description: 'Professional airport transportation service for Lake of the Ozarks including Grand Glaize Airport and major Missouri airports',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the closest airport to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lee C. Fine Memorial Airport (KOZS), also known as Grand Glaize Airport, is located right at Lake of the Ozarks in Osage Beach. It serves private aircraft and charter flights. For commercial flights, Kansas City International (MCI) is 2-2.5 hours away, and St. Louis Lambert (STL) is 2.5-3 hours away.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Grand Glaize Airport (KOZS)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide prompt pickup service from Grand Glaize Airport (Lee C. Fine Memorial Airport - KOZS) in Osage Beach. Perfect for private aircraft arrivals. We can meet you planeside or at the FBO and transport you anywhere around Lake of the Ozarks.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does airport transportation cost at Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Local transfers from Grand Glaize Airport (KOZS) start at $50-100 depending on destination. MCI Airport to Lake Ozarks starts at $220, STL starts at $250, and Springfield (SGF) starts at $180. Prices vary by vehicle type and passenger count. Contact us at (573) 206-9499 for exact quotes.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate private aviation and charter flights?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in private aviation transportation at Lake of the Ozarks. We coordinate with FBOs at Grand Glaize Airport (KOZS) and monitor flight arrival times. Our luxury vehicles are perfect for executive and VIP clients arriving by private jet.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you track commercial flights from MCI and STL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all commercial flights from Kansas City (MCI), St. Louis (STL), Springfield (SGF), and Columbia (COU) in real-time. If your flight is delayed, we automatically adjust pickup times at no extra charge. Your driver will be waiting when you land.'
      }
    },
    {
      '@type': 'Question',
      name: 'What airports do you service for Lake of the Ozarks transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide transportation to/from Grand Glaize Airport (KOZS) at Lake of the Ozarks, Kansas City International (MCI), St. Louis Lambert (STL), Springfield-Branson (SGF), and Columbia Regional (COU). We service both private aviation and commercial flights at all locations.'
      }
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book airport transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend booking 24-48 hours in advance for commercial airport shuttles (MCI, STL, SGF). For private aviation and Grand Glaize Airport pickups, same-day service is often available. Call (573) 206-9499 for last-minute bookings - we accommodate whenever possible.'
      }
    }
  ]
}

export default async function LakeOzarksAirportTransportationPage() {
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
            <Plane className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Lake of the Ozarks Airport Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional shuttle service from Grand Glaize Airport (KOZS), MCI, STL, and all major airports to Lake destinations. Private aviation specialists.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Airport Transportation
            </Link>
          </div>
        </section>

        {/* Airport Coverage */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Airports We Service
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg text-center">
                <Plane className="w-10 h-10 text-lrp-green mx-auto mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Grand Glaize (KOZS)</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm mb-2">
                  Lee C. Fine Memorial Airport
                </p>
                <p className="text-lrp-green font-semibold text-sm">
                  At Lake of the Ozarks
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg text-center">
                <Plane className="w-10 h-10 text-lrp-green mx-auto mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Kansas City (MCI)</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm mb-2">
                  Kansas City International
                </p>
                <p className="text-lrp-green font-semibold text-sm">
                  2-2.5 hours
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg text-center">
                <Plane className="w-10 h-10 text-lrp-green mx-auto mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">St. Louis (STL)</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm mb-2">
                  Lambert International
                </p>
                <p className="text-lrp-green font-semibold text-sm">
                  2.5-3 hours
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg text-center">
                <Plane className="w-10 h-10 text-lrp-green mx-auto mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Springfield (SGF)</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm mb-2">
                  Springfield-Branson Airport
                </p>
                <p className="text-lrp-green font-semibold text-sm">
                  1.5-2 hours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Our Airport Transportation
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flight Tracking
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We monitor all flights in real-time and adjust for delays automatically. No extra charges for late arrivals.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Private Aviation Ready
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  FBO coordination at Grand Glaize Airport. Luxury vehicles perfect for executive and VIP clients.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Door-to-Door Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  From any airport directly to your Lake destination. Hotels, resorts, vacation rentals, private homes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Airport Routes
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/kansas-city-to-lake-ozarks" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">MCI to Lake of the Ozarks</h3>
                    <p className="text-sm opacity-80">Kansas City International to Lake destinations</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/st-louis-to-lake-ozarks" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">STL to Lake of the Ozarks</h3>
                    <p className="text-sm opacity-80">St. Louis Lambert to Lake destinations</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">SGF to Lake of the Ozarks</h3>
                    <p className="text-sm opacity-80">Springfield-Branson to Lake destinations</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Grand Glaize Airport (KOZS)</h3>
                    <p className="text-sm opacity-80">Private aviation transfers at the Lake</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Lake Destinations from Airport */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Lake Destinations We Serve from Airports
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Hotels, resorts, Margaritaville, Tan-Tar-A
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lake homes, vacation rentals, Old Kinderhook
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lake Ozark</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Downtown, Lodge of Four Seasons, waterfront
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Private Lake Homes</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Anywhere around the Lake - door-to-door service
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Wedding Venues</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  All major Lake Ozarks wedding locations
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Golf Resorts</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Tan-Tar-A, Old Kinderhook, Osage National
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transportation Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Airport Transportation Services
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Commercial Flight Shuttles</h3>
                    <p className="text-sm opacity-80">MCI, STL, SGF, COU to Lake Ozarks</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/private-aviation-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Private Aviation</h3>
                    <p className="text-sm opacity-80">FBO coordination, executive service</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Guest Airport Shuttles</h3>
                    <p className="text-sm opacity-80">Multi-passenger coordination from airports</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/corporate-executive-travel" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Airport Transfers</h3>
                    <p className="text-sm opacity-80">Executive transportation for business travelers</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Large Group Airport Service</h3>
                    <p className="text-sm opacity-80">Coordinate 50+ passengers from airports</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Round-Trip Airport Shuttles</h3>
                    <p className="text-sm opacity-80">Discounted rates for round-trip service</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Airport Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What is the closest airport to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Lee C. Fine Memorial Airport (KOZS), also known as Grand Glaize Airport, is located right at Lake of the Ozarks in Osage Beach. It serves private aircraft and charter flights. For commercial flights, Kansas City International (MCI) is 2-2.5 hours away, and St. Louis Lambert (STL) is 2.5-3 hours away.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation from Grand Glaize Airport (KOZS)?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide prompt pickup service from Grand Glaize Airport (Lee C. Fine Memorial Airport - KOZS) in Osage Beach. Perfect for private aircraft arrivals. We can meet you planeside or at the FBO and transport you anywhere around Lake of the Ozarks.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does airport transportation cost at Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Local transfers from Grand Glaize Airport (KOZS) start at $50-100 depending on destination. MCI Airport to Lake Ozarks starts at $220, STL starts at $250, and Springfield (SGF) starts at $180. Prices vary by vehicle type and passenger count. Contact us at (573) 206-9499 for exact quotes.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate private aviation and charter flights?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in private aviation transportation at Lake of the Ozarks. We coordinate with FBOs at Grand Glaize Airport (KOZS) and monitor flight arrival times. Our luxury vehicles are perfect for executive and VIP clients arriving by private jet.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you track commercial flights from MCI and STL?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We track all commercial flights from Kansas City (MCI), St. Louis (STL), Springfield (SGF), and Columbia (COU) in real-time. If your flight is delayed, we automatically adjust pickup times at no extra charge. Your driver will be waiting when you land.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What airports do you service for Lake of the Ozarks transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We provide transportation to/from Grand Glaize Airport (KOZS) at Lake of the Ozarks, Kansas City International (MCI), St. Louis Lambert (STL), Springfield-Branson (SGF), and Columbia Regional (COU). We service both private aviation and commercial flights at all locations.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book airport transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We recommend booking 24-48 hours in advance for commercial airport shuttles (MCI, STL, SGF). For private aviation and Grand Glaize Airport pickups, same-day service is often available. Call (573) 206-9499 for last-minute bookings - we accommodate whenever possible.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Airport Clients Say"
          subtitle="Real experiences from customers using our airport transportation service"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Kansas City to Lake Ozarks", href: "/kansas-city-to-lake-ozarks", description: "Dedicated shuttle service from MCI Airport" },
          { title: "St. Louis to Lake Ozarks", href: "/st-louis-to-lake-ozarks", description: "Professional shuttle from STL Airport" },
          { title: "Private Aviation Transportation", href: "/services/private-aviation-transfers", description: "Executive FBO coordination and luxury transfers" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Airport Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional shuttle service from all major airports to Lake of the Ozarks
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

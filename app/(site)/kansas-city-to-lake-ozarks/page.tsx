import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight, Clock, Users, Shield } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/payload-local'

export const metadata: Metadata = {
  title: 'Kansas City to Lake of the Ozarks Transportation | MCI Airport Shuttle | Lake Ride Pros',
  description: 'Luxury shuttle service from Kansas City (MCI Airport) to Lake of the Ozarks. Professional drivers, comfortable vehicles, door-to-door service. Book your MCI shuttle today!',
  keywords: [
    'Kansas City to Lake of the Ozarks',
    'MCI airport to Lake Ozarks shuttle',
    'Kansas City airport shuttle',
    'MCI to Osage Beach transportation',
    'Kansas City International to Lake of the Ozarks',
    'MCI to Camdenton shuttle',
    'private shuttle KC to Lake Ozarks',
    'group transportation Kansas City to Lake'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
  },
  openGraph: {
    title: 'Kansas City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Professional shuttle service from Kansas City International Airport (MCI) to Lake of the Ozarks. Luxury vehicles, experienced drivers, flight tracking.',
    url: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Kansas City to Lake Ozarks Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kansas City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Professional shuttle service from Kansas City (MCI) to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Kansas City to Lake of the Ozarks Shuttle',
  url: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  areaServed: [
    {
      '@type': 'City',
      name: 'Kansas City',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kansas City',
        addressRegion: 'MO',
        addressCountry: 'US'
      }
    },
    {
      '@type': 'City',
      name: 'Lake of the Ozarks',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lake of the Ozarks',
        addressRegion: 'MO',
        addressCountry: 'US'
      }
    }
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.2979,
    longitude: -94.7139
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury shuttle service from Kansas City International Airport to Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a shuttle from Kansas City to Lake of the Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One-way shuttle service from MCI Airport to Lake of the Ozarks starts at $220 for up to 6 passengers in a luxury Sprinter van. Larger groups and round-trip service available at discounted rates. Contact us at (573) 206-9499 for a custom quote.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long is the drive from Kansas City to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The drive from Kansas City International Airport (MCI) to Lake of the Ozarks is approximately 2 to 2.5 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you track flights from MCI Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all incoming flights from Kansas City International Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate large groups from Kansas City?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in group transportation from Kansas City to Lake of the Ozarks. Our fleet includes Sprinter vans (6-14 passengers), limo buses (14 passengers), and shuttle buses (up to 37 passengers). We can coordinate multiple vehicles for groups of 100+.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where do you pick up at MCI Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We pick up at the new MCI Airport terminal. Your driver will meet you at the designated rideshare/ground transportation area with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide round-trip service from Kansas City to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Round-trip shuttle service from MCI to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, bachelor/bachelorette parties, and lake vacations. Book both legs together and save.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Kansas City or St. Louis closer to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kansas City (MCI Airport) is slightly closer to Lake of the Ozarks at approximately 2-2.5 hours, compared to 2.5-3 hours from St. Louis (STL Airport). Both airports offer convenient access to the Lake, and we provide professional shuttle service from both locations.'
      }
    }
  ]
}

export default async function KansasCityToLakeOzarksPage() {
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
              Kansas City to Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional shuttle service from MCI Airport to Lake of the Ozarks. Flight tracking, luxury vehicles, door-to-door service.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your MCI Shuttle
            </Link>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Our Kansas City to Lake Ozarks Shuttle
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Shortest Route
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  MCI is the closest major airport to Lake of the Ozarks. Only 2-2.5 hours to your lakefront destination.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Perfect for Groups
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bachelor/bachelorette parties, golf trips, family reunions - we handle groups of any size from MCI.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Licensed & Insured
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  DOT-compliant drivers with full commercial insurance. Your safety is guaranteed on every MCI shuttle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Lake Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Destinations from Kansas City
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Tan-Tar-A Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Golf packages, corporate retreats, weddings from KC
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Margaritaville Lake Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Direct shuttle from MCI to Margaritaville
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Hotels, condos, Bagnell Dam Strip nightlife
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lake homes, Ha Ha Tonka State Park access
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lake Ozark</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Downtown dining, shopping, waterfront resorts
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Private Vacation Rentals</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Door-to-door service to any Lake address from MCI
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Available */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Kansas City to Lake Ozarks Transportation Services
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Shuttle</h3>
                    <p className="text-sm opacity-80">MCI Airport to Lake of the Ozarks direct</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/bachelor-party-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bachelor/Bachelorette Parties</h3>
                    <p className="text-sm opacity-80">KC party groups to Lake Ozarks nightlife</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Guest Shuttles</h3>
                    <p className="text-sm opacity-80">MCI Airport for destination weddings</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/corporate-executive-travel" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Transportation</h3>
                    <p className="text-sm opacity-80">KC executives to Lake Ozarks conferences</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Large Group Transport</h3>
                    <p className="text-sm opacity-80">Multi-vehicle coordination for 50+ passengers</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Round-Trip Service</h3>
                    <p className="text-sm opacity-80">Discounted rates for round-trip MCI shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Lake Ride Pros */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Lake Ride Pros for MCI to Lake Ozarks
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  We Know the Route
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Hundreds of MCI to Lake Ozarks trips completed. We know every shortcut, rest stop, and the fastest routes.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  No Cancellations, Ever
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Unlike Uber/Lyft who regularly cancel KC to Lake trips, we've never cancelled on a customer. Guaranteed.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  24/7 MCI Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Early morning flights, red-eyes, late arrivals - we run MCI shuttles around the clock, every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Kansas City to Lake Ozarks Shuttle FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does a shuttle from Kansas City to Lake of the Ozarks cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  One-way shuttle service from MCI Airport to Lake of the Ozarks starts at $220 for up to 6 passengers in a luxury Sprinter van. Larger groups and round-trip service available at discounted rates. Contact us at (573) 206-9499 for a custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How long is the drive from Kansas City to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  The drive from Kansas City International Airport (MCI) to Lake of the Ozarks is approximately 2 to 2.5 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you track flights from MCI Airport?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We track all incoming flights from Kansas City International Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate large groups from Kansas City?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in group transportation from Kansas City to Lake of the Ozarks. Our fleet includes Sprinter vans (6-14 passengers), limo buses (14 passengers), and shuttle buses (up to 37 passengers). We can coordinate multiple vehicles for groups of 100+.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick up at MCI Airport?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We pick up at the new MCI Airport terminal. Your driver will meet you at the designated rideshare/ground transportation area with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide round-trip service from Kansas City to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Round-trip shuttle service from MCI to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, bachelor/bachelorette parties, and lake vacations. Book both legs together and save.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Is Kansas City or St. Louis closer to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Kansas City (MCI Airport) is slightly closer to Lake of the Ozarks at approximately 2-2.5 hours, compared to 2.5-3 hours from St. Louis (STL Airport). Both airports offer convenient access to the Lake, and we provide professional shuttle service from both locations.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Kansas City Clients Say"
          subtitle="Real experiences from customers traveling from Kansas City to Lake of the Ozarks"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "St. Louis to Lake Ozarks", href: "/st-louis-to-lake-ozarks", description: "Professional shuttle from STL Airport to Lake of the Ozarks" },
          { title: "Airport Shuttle Service", href: "/services/airport-transfers", description: "All major Missouri airports to Lake destinations" },
          { title: "Bachelor/Bachelorette Parties", href: "/services/bachelor-party-transportation", description: "Party bus and shuttle service for Lake Ozarks celebrations" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your MCI to Lake Ozarks Shuttle?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional shuttle service from Kansas City International Airport to Lake of the Ozarks
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

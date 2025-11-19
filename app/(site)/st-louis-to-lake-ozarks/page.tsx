import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, Star, ArrowRight, Clock, Users, Shield } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'

export const metadata: Metadata = {
  title: 'St Louis to Lake of the Ozarks Transportation | Airport Shuttle STL | Lake Ride Pros',
  description: 'Luxury shuttle service from St. Louis (STL Airport) to Lake of the Ozarks. Professional drivers, comfortable vehicles, door-to-door service. Book your STL shuttle today!',
  keywords: [
    'St Louis to Lake of the Ozarks',
    'STL airport to Lake Ozarks shuttle',
    'St Louis airport shuttle',
    'STL to Osage Beach transportation',
    'Lambert Airport to Lake of the Ozarks',
    'St Louis to Camdenton shuttle',
    'private shuttle STL to Lake Ozarks',
    'group transportation St Louis to Lake'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
  },
  openGraph: {
    title: 'St Louis to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Professional shuttle service from St. Louis Lambert Airport (STL) to Lake of the Ozarks. Luxury vehicles, experienced drivers, flight tracking.',
    url: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - St Louis to Lake of the Ozarks Shuttle',
  url: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  areaServed: [
    {
      '@type': 'City',
      name: 'St. Louis',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'St. Louis',
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
    latitude: 38.7486,
    longitude: -90.3700
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury shuttle service from St. Louis Lambert Airport to Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a shuttle from St. Louis to Lake of the Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One-way shuttle service from STL Airport to Lake of the Ozarks starts at $250 for up to 6 passengers in a luxury Sprinter van. Larger groups and round-trip service available at discounted rates. Contact us at (573) 206-9499 for a custom quote.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long is the drive from St. Louis to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The drive from St. Louis Lambert Airport (STL) to Lake of the Ozarks is approximately 2.5 to 3 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you track flights from STL Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all incoming flights from St. Louis Lambert Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate large groups from St. Louis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in group transportation from St. Louis to Lake of the Ozarks. Our fleet includes Sprinter vans (6-14 passengers), limo buses (14 passengers), and shuttle buses (up to 37 passengers). We can coordinate multiple vehicles for groups of 100+.'
      }
    },
    {
      '@type': 'Question',
      name: 'Where do you pick up at STL Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We pick up at both Terminal 1 and Terminal 2 at St. Louis Lambert International Airport. Your driver will meet you at baggage claim with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide round-trip service from St. Louis to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Round-trip shuttle service from STL to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, weddings, and lake vacations. Book both legs together and save.'
      }
    },
    {
      '@type': 'Question',
      name: 'What vehicles do you use for St. Louis to Lake Ozarks shuttles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use luxury Mercedes Sprinter vans, comfortable limo buses, and spacious shuttle buses for STL to Lake of the Ozarks routes. All vehicles feature premium seating, climate control, ample luggage space, and are meticulously maintained for safety and comfort.'
      }
    }
  ]
}

export default function StLouisToLakeOzarksPage() {
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
              St. Louis to Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional shuttle service from STL Airport to Lake of the Ozarks. Flight tracking, luxury vehicles, door-to-door service.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your STL Shuttle
            </Link>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Our St. Louis to Lake Ozarks Shuttle
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flight Tracking
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We monitor your STL flight in real-time and adjust pickup for delays automatically at no extra charge.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Group Friendly
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Comfortable vehicles for 2-37 passengers. Perfect for families, wedding parties, and corporate groups.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Drivers
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Licensed, DOT-compliant drivers who know the STL to Lake Ozarks route like the back of their hand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Lake Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Destinations from St. Louis
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Tan-Tar-A Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Weddings, conferences, golf getaways from STL
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Margaritaville Lake Resort</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Direct shuttle from STL Airport to Margaritaville
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Hotels, vacation rentals, Bagnell Dam Strip
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lake homes, vacation properties, event venues
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lake Ozark</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Downtown Lake Ozark, waterfront resorts
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Private Lake Homes</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Door-to-door service to any Lake address
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Available */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              St. Louis to Lake Ozarks Transportation Services
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/airport-shuttle" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Shuttle</h3>
                    <p className="text-sm opacity-80">STL Airport to Lake of the Ozarks direct</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Guest Shuttles</h3>
                    <p className="text-sm opacity-80">STL Airport for destination weddings at the Lake</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/corporate-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Transportation</h3>
                    <p className="text-sm opacity-80">Executive shuttles for Lake Ozarks conferences</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Large Group Transport</h3>
                    <p className="text-sm opacity-80">Multi-vehicle coordination for 50+ passengers</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Round-Trip Service</h3>
                    <p className="text-sm opacity-80">Discounted rates for round-trip STL shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/private-aviation-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Private Aviation</h3>
                    <p className="text-sm opacity-80">FBO pickup at STL, private jet coordination</p>
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
              Why Lake Ride Pros for STL to Lake Ozarks
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  We Know Both Ends
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Familiar with STL Airport terminals and every Lake destination. No GPS guessing, just local expertise.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  We Don't Cancel
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Unlike rideshare services, your shuttle is guaranteed. We've never cancelled on a customer - ever.
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
                  Early morning flights, late arrivals - we run shuttles from STL to Lake Ozarks around the clock.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              St. Louis to Lake Ozarks Shuttle FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does a shuttle from St. Louis to Lake of the Ozarks cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  One-way shuttle service from STL Airport to Lake of the Ozarks starts at $250 for up to 6 passengers in a luxury Sprinter van. Larger groups and round-trip service available at discounted rates. Contact us at (573) 206-9499 for a custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How long is the drive from St. Louis to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  The drive from St. Louis Lambert Airport (STL) to Lake of the Ozarks is approximately 2.5 to 3 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you track flights from STL Airport?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We track all incoming flights from St. Louis Lambert Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate large groups from St. Louis?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in group transportation from St. Louis to Lake of the Ozarks. Our fleet includes Sprinter vans (6-14 passengers), limo buses (14 passengers), and shuttle buses (up to 37 passengers). We can coordinate multiple vehicles for groups of 100+.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick up at STL Airport?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We pick up at both Terminal 1 and Terminal 2 at St. Louis Lambert International Airport. Your driver will meet you at baggage claim with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide round-trip service from St. Louis to Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Round-trip shuttle service from STL to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, weddings, and lake vacations. Book both legs together and save.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What vehicles do you use for St. Louis to Lake Ozarks shuttles?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We use luxury Mercedes Sprinter vans, comfortable limo buses, and spacious shuttle buses for STL to Lake of the Ozarks routes. All vehicles feature premium seating, climate control, ample luggage space, and are meticulously maintained for safety and comfort.
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
                "We fly into STL for our annual Lake trip and have used Lake Ride Pros for 3 years straight. They track our flight, meet us at baggage claim, and have us at our lake house in Camdenton in under 3 hours. Professional, reliable, and way better than renting a car!"
              </p>
              <p className="font-bold text-lrp-black dark:text-white">
                The Martinez Family
              </p>
              <p className="text-sm text-gray-600 dark:text-lrp-gray">
                St. Louis to Camdenton, Annual Lake Vacation
              </p>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Kansas City to Lake Ozarks", href: "/kansas-city-to-lake-ozarks", description: "Professional shuttle from MCI Airport to Lake of the Ozarks" },
          { title: "Airport Shuttle Service", href: "/services/airport-shuttle", description: "All major Missouri airports to Lake destinations" },
          { title: "Wedding Transportation", href: "/services/wedding-transportation", description: "Guest shuttles for destination weddings at the Lake" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your STL to Lake Ozarks Shuttle?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional shuttle service from St. Louis Lambert Airport to Lake of the Ozarks
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

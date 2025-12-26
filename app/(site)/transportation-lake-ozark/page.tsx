import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/payload-local'

export const metadata: Metadata = {
  title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
  description: 'Professional transportation service in Lake Ozark, Missouri. Serving Lodge of Four Seasons, waterfront properties, events. Weddings, corporate, airport shuttle.',
  keywords: [
    'Lake Ozark transportation',
    'Lake Ozark shuttle service',
    'Lodge of Four Seasons transportation',
    'Lake Ozark wedding transportation',
    'Lake Ozark Missouri taxi',
    'Lake Ozark airport shuttle',
    'waterfront property transportation'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-lake-ozark',
  },
  openGraph: {
    title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
    description: 'Premium transportation in Lake Ozark. Serving Lodge of Four Seasons, waterfront properties & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-lake-ozark',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ozark Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
    description: 'Premium transportation in Lake Ozark.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Lake Ozark Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-lake-ozark',
  url: 'https://www.lakeridepros.com/transportation-lake-ozark',
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
    name: 'Lake Ozark',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1967,
    longitude: -92.6351
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Lake Ozark, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Lodge of Four Seasons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Lodge of Four Seasons is a premier destination we service frequently in Lake Ozark. We provide wedding transportation, corporate event shuttles, conference transportation, and guest transfers to and from the Lodge of Four Seasons.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you pick up from waterfront properties in Lake Ozark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in pickups from lakefront homes, vacation rentals, and private waterfront properties throughout Lake Ozark. Our drivers are familiar with all residential areas and can navigate to your exact location.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Lake Ozark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates in Lake Ozark start at $120/hour for sprinter vans (up to 14 passengers) and $150/hour for larger shuttle buses. Wedding and corporate event packages have custom pricing. Contact us for a personalized Lake Ozark transportation quote.'
      }
    }
  ]
}

export default async function LakeOzarkTransportationPage() {
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
              Professional Transportation in Lake Ozark, Missouri
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Serving Lodge of Four Seasons, waterfront properties, and all Lake Ozark venues. Luxury transportation with local expertise.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Lake Ozark Ride
            </Link>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Ozark Destinations We Serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lodge of Four Seasons</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Premier resort wedding and corporate event transportation
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <Home className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Waterfront Properties</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lakefront homes, estates, and vacation rental pickups
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Wedding Venues</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Lodge of Four Seasons and private estate weddings
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Downtown Lake Ozark</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Restaurants, shops, and local attractions
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lake Ozark Marina</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Boat access transportation and marina pickups
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Event Venues</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Corporate retreats, conferences, and special events
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services in Lake Ozark */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services in Lake Ozark
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Transportation</h3>
                    <p className="text-sm opacity-80">Lodge of Four Seasons and estate weddings</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/corporate-executive-travel" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate Events</h3>
                    <p className="text-sm opacity-80">Lodge conferences and team retreats</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-transfers" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Transfers</h3>
                    <p className="text-sm opacity-80">KC, STL, Springfield to/from Lake Ozark</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Group Events</h3>
                    <p className="text-sm opacity-80">Family reunions, celebrations, gatherings</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Waterfront Pickups</h3>
                    <p className="text-sm opacity-80">Lakefront homes and vacation rentals</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Local Shuttles</h3>
                    <p className="text-sm opacity-80">Around town and between venues</p>
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
              Why Choose Lake Ride Pros in Lake Ozark
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Navigate Every Road
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  From lakefront estates to downtown, we know every street and access point in Lake Ozark.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Waterfront Property Experts
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Experienced with lakefront access, narrow roads, and private property navigation.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Premium Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Luxury vehicles and professional drivers that match Lake Ozark's upscale atmosphere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Lake Ozark Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Lodge of Four Seasons?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Lodge of Four Seasons is a premier destination we service frequently in Lake Ozark. We provide wedding transportation, corporate event shuttles, conference transportation, and guest transfers to and from the Lodge of Four Seasons.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you pick up from waterfront properties in Lake Ozark?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in pickups from lakefront homes, vacation rentals, and private waterfront properties throughout Lake Ozark. Our drivers are familiar with all residential areas and can navigate to your exact location.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does transportation cost in Lake Ozark?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates in Lake Ozark start at $120/hour for sprinter vans (up to 14 passengers) and $150/hour for larger shuttle buses. Wedding and corporate event packages have custom pricing. Contact us for a personalized quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you navigate to hard-to-find lakefront addresses?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Our drivers are experienced with Lake Ozark's winding lakefront roads, private drives, and difficult-to-access properties. Just provide your address and any special instructions when booking.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you transport between Lake Ozark and other Lake areas?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We frequently transport between Lake Ozark, Osage Beach, Camdenton, and all Lake of the Ozarks destinations. Perfect for exploring different areas or multi-venue events.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Lake Ozark Clients Say"
          subtitle="Real experiences from customers we've served in Lake Ozark"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Corporate Transportation", href: "/services/corporate-executive-travel", description: "Executive transportation for Lodge of Four Seasons events" },
          { title: "Wedding Transportation", href: "/services/wedding-transportation", description: "Luxury wedding shuttles for waterfront venues" },
          { title: "Airport Shuttle", href: "/services/airport-transfers", description: "Direct transfers from MCI, STL, and SGF airports" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Lake Ozark Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional service throughout Lake Ozark and waterfront properties
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

import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/payload-local'

export const metadata: Metadata = {
  title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
  description: 'Premier transportation service in Sunrise Beach, Missouri. Serving condos, resorts, and vacation rentals along Mile Markers 20-40. Weddings, nightlife, airport shuttles.',
  keywords: [
    'Sunrise Beach transportation',
    'Sunrise Beach shuttle service',
    'Sunrise Beach Missouri taxi',
    'Sunrise Beach to Bagnell Dam',
    'Sunrise Beach wedding transportation',
    'Lake Ozarks west side transportation',
    'Sunrise Beach condo shuttle'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-sunrise-beach',
  },
  openGraph: {
    title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Sunrise Beach. Serving condos, resorts, and vacation rentals on the west side of Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/transportation-sunrise-beach',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Sunrise Beach Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Sunrise Beach.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Sunrise Beach Transportation',
  url: 'https://www.lakeridepros.com/transportation-sunrise-beach',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  areaServed: {
    '@type': 'City',
    name: 'Sunrise Beach',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sunrise Beach',
      addressRegion: 'MO',
      postalCode: '65079',
      addressCountry: 'US'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1667,
    longitude: -92.7833
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Sunrise Beach, Missouri along MO-5 and MO-7',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Sunrise Beach to Bagnell Dam Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Sunrise Beach to Bagnell Dam Strip is one of our most popular routes—just 15-20 minutes. We provide nightlife shuttles, bar hopping transportation, and safe rides home for Sunrise Beach condo guests and vacation renters.'
      }
    },
    {
      '@type': 'Question',
      name: 'What areas of Sunrise Beach do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We serve all of Sunrise Beach including Mile Markers 20-40, condos along MO-5 and MO-7, vacation rentals, and the 65079 ZIP code area. We also cover nearby Gravois Mills and the west side of Lake of the Ozarks.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates in Sunrise Beach start at $120/hour for sprinter vans (up to 14 passengers). Rates vary based on vehicle type, group size, and service duration. Contact us for a custom quote for your Sunrise Beach transportation needs.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide wedding transportation in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We provide wedding transportation for Sunrise Beach venues, guest shuttles between vacation rentals and ceremony/reception locations, and airport transfers for destination wedding guests.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there Uber or Lyft in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rideshare availability in Sunrise Beach and the Lake of the Ozarks area is very limited, especially on weekends and late nights. Lake Ride Pros provides reliable, professional transportation with guaranteed availability when you book in advance.'
      }
    }
  ]
}

export default async function SunriseBeachTransportationPage() {
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
              Professional Transportation in Sunrise Beach, Missouri
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Serving the west side of Lake of the Ozarks. From condos along Mile Markers 20-40 to Bagnell Dam Strip nightlife—reliable transportation when rideshare isn't available.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Sunrise Beach Ride
            </Link>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-lrp-black text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <span className="font-bold text-2xl text-lrp-green">15 min</span>
                <p className="text-sm opacity-80">to Bagnell Dam Strip</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">MM 20-40</span>
                <p className="text-sm opacity-80">Full coverage area</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">65079</span>
                <p className="text-sm opacity-80">ZIP code served</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-lrp-green">MO-5 & MO-7</span>
                <p className="text-sm opacity-80">Highway access</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Sunrise Beach Destinations We Serve
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Sunrise Beach Condos</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Vacation rentals, condo complexes, and lakefront properties
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Bagnell Dam Strip</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Nightlife transportation, bar hopping, safe rides home
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Waterfront Restaurants</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Dinner shuttles to lakefront dining throughout the area
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Osage Beach</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Shopping, Premium Outlets, restaurants, entertainment
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Camdenton</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Camden County seat, shopping, dining, services
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Wedding Venues</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Guest transportation to Lake area wedding locations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services in Sunrise Beach */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services in Sunrise Beach
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/bagnell-dam-strip-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Nightlife Transportation</h3>
                    <p className="text-sm opacity-80">Sunrise Beach to Bagnell Dam Strip (15 min)</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Wedding Transportation</h3>
                    <p className="text-sm opacity-80">Guest shuttles, venue transportation</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/airport-shuttle" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Airport Shuttle</h3>
                    <p className="text-sm opacity-80">KC, STL, Springfield to Sunrise Beach</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Group Event Shuttles</h3>
                    <p className="text-sm opacity-80">Family reunions, corporate retreats, parties</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/bachelor-bachelorette-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bachelor/Bachelorette Parties</h3>
                    <p className="text-sm opacity-80">Party bus, bar crawls, boat party shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/transportation-osage-beach" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Osage Beach Transfers</h3>
                    <p className="text-sm opacity-80">Shopping, dining, entertainment</p>
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
              Why Choose Lake Ride Pros in Sunrise Beach
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  We Know the West Side
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Sunrise Beach, Gravois Mills, Laurie—we know every road, condo complex, and shortcut on the west side of the Lake.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Guaranteed Availability
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Unlike rideshare apps with limited Lake coverage, we guarantee your ride when you book in advance. No surge pricing surprises.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Late Night Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bagnell Dam Strip bars close at 1:30 AM. We provide safe, reliable rides back to Sunrise Beach condos and rentals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Sunrise Beach Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation from Sunrise Beach to Bagnell Dam Strip?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Sunrise Beach to Bagnell Dam Strip is one of our most popular routes—just 15-20 minutes. We provide nightlife shuttles, bar hopping transportation, and safe rides home for Sunrise Beach condo guests and vacation renters.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What areas of Sunrise Beach do you serve?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We serve all of Sunrise Beach including Mile Markers 20-40, condos along MO-5 and MO-7, vacation rentals, and the 65079 ZIP code area. We also cover nearby Gravois Mills and the west side of Lake of the Ozarks.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does transportation cost in Sunrise Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates in Sunrise Beach start at $120/hour for sprinter vans (up to 14 passengers). Rates vary based on vehicle type, group size, and service duration. Contact us for a custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide wedding transportation in Sunrise Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We provide wedding transportation for Sunrise Beach venues, guest shuttles between vacation rentals and ceremony/reception locations, and airport transfers for destination wedding guests.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Is there Uber or Lyft in Sunrise Beach?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Rideshare availability in Sunrise Beach and Lake of the Ozarks is very limited, especially on weekends and late nights. Lake Ride Pros provides reliable, professional transportation with guaranteed availability when you book in advance.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Sunrise Beach Clients Say"
          subtitle="Real experiences from customers we've served in Sunrise Beach"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Bagnell Dam Strip Transportation", href: "/bagnell-dam-strip-transportation", description: "Bar hopping and nightlife shuttles" },
          { title: "Osage Beach Transportation", href: "/transportation-osage-beach", description: "Shopping, dining, and entertainment" },
          { title: "Wedding Transportation", href: "/services/wedding-transportation", description: "Guest shuttles for Lake weddings" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Sunrise Beach Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Professional, reliable service throughout Sunrise Beach and the west side
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

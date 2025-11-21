import type { Metadata } from 'next'
import { MapPin, Clock, Phone, ArrowRight, Plane } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonials } from '@/lib/api/payload'

export const metadata: Metadata = {
  title: 'Springfield MO to Lake of the Ozarks Transportation | Shuttle',
  description: 'Direct shuttle service from Springfield, Missouri to Lake of the Ozarks. Groups, families, airport connections. Serving SGF airport, Missouri State, and all Springfield.',
  keywords: [
    'Springfield to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Springfield',
    'Springfield MO to Lake Ozarks',
    'SGF airport to Lake Ozarks',
    'Missouri State to Lake Ozarks',
    'Springfield to Osage Beach',
    'Bass Pro to Lake Ozarks transportation',
    'Springfield corporate retreat Lake Ozarks',
    'Branson alternative Lake transportation'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/springfield-to-lake-ozarks',
  },
  openGraph: {
    title: 'Springfield MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Springfield to Lake of the Ozarks. SGF airport connections available.',
    url: 'https://www.lakeridepros.com/springfield-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Springfield to Lake of the Ozarks Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Shuttle Transportation',
  areaServed: [
    {
      '@type': 'City',
      name: 'Springfield',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Springfield',
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
  description: 'Direct shuttle transportation service from Springfield, Missouri to Lake of the Ozarks, including SGF airport connections',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Springfield MO from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Springfield, Missouri is approximately 115 miles (2 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend trips easy for Springfield residents and Missouri State students.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Springfield airport (SGF) to Lake Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Springfield-Branson National Airport (SGF) to Lake of the Ozarks is a popular route. We provide direct airport transfers for travelers flying into Springfield who are heading to the Lake for weddings, vacations, or events.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Springfield to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shuttle rates from Springfield to Lake of the Ozarks start at $120/hour with a typical 4-hour round trip minimum. Airport transfers have set rates. Contact us for a custom quote based on your pickup location and Lake destination.'
      }
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.lakeridepros.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Cities',
      item: 'https://www.lakeridepros.com/services'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Springfield to Lake Ozarks',
      item: 'https://www.lakeridepros.com/springfield-to-lake-ozarks'
    }
  ]
}

export default async function SpringfieldToLakeOzarksPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Springfield to Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Direct shuttle service from Springfield, MO to the Lake. SGF airport transfers, group trips, weekend getaways. Just 2 hours to paradise.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Springfield Shuttle
            </Link>
          </div>
        </section>

        {/* Route Info */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
                Springfield to Lake Ozarks: Easy Access
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <MapPin className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">115 Miles</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Springfield to Osage Beach</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Clock className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">2 Hours</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Direct drive time</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Plane className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">SGF Airport</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Direct transfers available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Springfield Residents Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Springfield Chooses Lake Ride Pros
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">
                  <Plane className="inline w-6 h-6 mr-2 text-lrp-green" />
                  SGF Airport to Lake Ozarks
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Flying into Springfield-Branson National Airport (SGF) for a Lake wedding or vacation? We provide direct airport transfers to all Lake of the Ozarks destinations. Popular for destination weddings and fly-in guests.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Missouri State Student Groups</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Missouri State University students love Lake weekends. We pick up from campus, student housing, and anywhere in Springfield. Perfect for spring break trips, birthday weekends, and Greek events.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Bass Pro & Corporate Groups</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Springfield is home to Bass Pro Shops headquarters. We transport corporate groups, executives, and teams from Bass Pro and other Springfield companies for Lake of the Ozarks retreats, team building events, and client entertainment. The Lake is a natural fit for outdoor-focused corporate culture.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Springfield Routes</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• SGF Airport ↔ Lake of the Ozarks venues (weddings, events)</li>
                  <li>• Springfield ↔ Tan-Tar-A Resort</li>
                  <li>• Springfield ↔ Margaritaville Lake Resort</li>
                  <li>• Missouri State campus ↔ Bagnell Dam Strip (nightlife)</li>
                  <li>• Springfield ↔ Lake vacation rentals</li>
                  <li>• Bass Pro HQ ↔ Lake corporate retreats</li>
                </ul>
                <p className="text-gray-700 dark:text-lrp-gray mt-3 text-sm">
                  <strong>Route:</strong> US-65 N to US-54 E • ~115 miles • 2 hours
                </p>
                <p className="text-gray-700 dark:text-lrp-gray mt-2 text-sm">
                  <strong>Not Branson:</strong> Lake of the Ozarks offers a different vibe than Branson—more water activities, nightlife, and lakefront entertainment. We make it easy to experience the Lake from Springfield.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Weekend Getaway Specialist</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  At 2 hours, Springfield to Lake Ozarks is perfect for weekend trips. We drop you off Friday evening, you enjoy the Lake all weekend, and we pick you up Sunday afternoon. Popular for family reunions and friend group getaways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Springfield Trips */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Trips from Springfield
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/airport-shuttle" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">SGF Airport Transfers</h3>
                    <p className="text-sm opacity-80">Direct from Springfield airport to Lake venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Destination Weddings</h3>
                    <p className="text-sm opacity-80">Fly-in guest transportation</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/bachelor-party-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bachelor/Bachelorette Parties</h3>
                    <p className="text-sm opacity-80">Party bus and Lake weekend shuttles</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Family Reunions</h3>
                    <p className="text-sm opacity-80">Large group Lake getaways</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Springfield to Lake Ozarks Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far is Springfield MO from Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Springfield, Missouri is approximately 115 miles (2 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend trips easy for Springfield residents and Missouri State students.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation from Springfield airport (SGF) to Lake Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Springfield-Branson National Airport (SGF) to Lake of the Ozarks is a popular route. We provide direct airport transfers for travelers flying into Springfield who are heading to the Lake for weddings, vacations, or events.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does shuttle service from Springfield to Lake Ozarks cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Shuttle rates from Springfield to Lake of the Ozarks start at $120/hour with a typical 4-hour round trip minimum. Airport transfers have set rates. Contact us for a custom quote based on your pickup location and Lake destination.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you pick up from Missouri State University?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide pickups from Missouri State campus, student housing, and anywhere in Springfield. Popular for student group Lake trips, spring break weekends, and Greek life events.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you do multi-day service for Springfield groups?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Popular for weekend Lake getaways. We drop you off Friday, you enjoy the Lake all weekend, and we pick you up Sunday. We can also provide transportation during your stay if needed.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Springfield Clients Say"
          subtitle="Real experiences from customers traveling from Springfield to Lake of the Ozarks"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Airport Shuttle", href: "/airport-shuttle", description: "Direct airport transfers from SGF, MCI, and STL" },
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Guest shuttles for destination Lake weddings" },
          { title: "Group Event Transportation", href: "/group-event-transportation", description: "Large group shuttle service for weekend trips" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Springfield to Lake Ozarks Shuttle?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              SGF airport transfers and direct Springfield service—2 hours to the Lake
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shuttle
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

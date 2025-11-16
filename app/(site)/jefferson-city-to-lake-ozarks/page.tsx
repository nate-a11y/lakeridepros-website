import type { Metadata } from 'next'
import { MapPin, Building2, Users, Clock, Star, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Jefferson City to Lake of the Ozarks Transportation | Shuttle',
  description: 'Direct shuttle service from Jefferson City, Missouri to Lake of the Ozarks. Corporate groups, families, weekend trips. Just 60 miles—closest major city to the Lake.',
  keywords: [
    'Jefferson City to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Jefferson City',
    'Jeff City to Lake Ozarks',
    'Jefferson City Missouri Lake shuttle',
    'Capitol to Lake Ozarks',
    'Jefferson City to Osage Beach'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks',
  },
  openGraph: {
    title: 'Jefferson City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Missouri\'s capital to Lake of the Ozarks. Just 1 hour away!',
    url: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Jefferson City to Lake of the Ozarks Transportation Service',
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
      name: 'Jefferson City',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jefferson City',
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
  description: 'Direct shuttle transportation service from Jefferson City, Missouri to Lake of the Ozarks, serving state employees, corporate groups, and families',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Jefferson City from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jefferson City is approximately 60 miles (1 hour) from Lake of the Ozarks—the closest major city to the Lake. Lake Ride Pros provides direct shuttle service, making it easy for Jefferson City residents to enjoy quick weekend getaways.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation for state government groups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We regularly transport state government groups, legislative staff, and Capitol employees for retreats, team building events, and conferences at Lake of the Ozarks venues. We offer professional, discrete service for government and corporate groups.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Jefferson City to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shuttle rates from Jefferson City to Lake of the Ozarks start at $120/hour with a typical 2-3 hour round trip minimum (since it\'s only 60 miles). Group rates available. Contact us for a custom quote based on your pickup location and Lake destination.'
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
      name: 'Jefferson City to Lake Ozarks',
      item: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks'
    }
  ]
}

export default function JeffersonCityToLakeOzarksPage() {
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
              Jefferson City to Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Direct shuttle service from Missouri's capital to the Lake. Just 60 miles (1 hour)—the closest major city. Perfect for corporate groups, families, and quick getaways.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Jefferson City Shuttle
            </Link>
          </div>
        </section>

        {/* Route Info */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
                Closest Major City to Lake of the Ozarks
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <MapPin className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">60 Miles</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Jeff City to Osage Beach</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Clock className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">1 Hour</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Direct drive time</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Users className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">All Group Sizes</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">2-56 passengers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Jefferson City Residents Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Jefferson City Chooses Lake Ride Pros
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">
                  <Building2 className="inline w-6 h-6 mr-2 text-lrp-green" />
                  Serving State & Corporate Groups
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We regularly transport Missouri state government groups, legislative staff, lobbyists, and corporate teams from Jefferson City for Lake of the Ozarks retreats, conferences, and team building events. Professional, discrete service you can trust.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Closest Major City = Easy Access</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  At just 60 miles, Jefferson City is the closest major city to Lake of the Ozarks. That means quick weekend trips, easy day excursions, and lower shuttle costs. Many Jeff City residents keep Lake houses and use us for regular transport.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Jefferson City Routes</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• Capitol Building ↔ Lake of the Ozarks venues</li>
                  <li>• Jefferson City hotels ↔ Tan-Tar-A Resort (corporate events)</li>
                  <li>• Jeff City ↔ Margaritaville Lake Resort</li>
                  <li>• Jefferson City ↔ Osage Beach (shopping, dining, nightlife)</li>
                  <li>• Downtown Jeff City ↔ Lake vacation properties</li>
                </ul>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Same-Day Trips Easy</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Only 1 hour away means same-day Lake trips are easy. Boat rentals, waterfront dining, shopping at Osage Beach Premium Outlets, concerts at Lake venues—drive down for the day, we'll pick you up that evening.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Jefferson City Trips */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Trips from Jefferson City
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/corporate-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Corporate & Government Retreats</h3>
                    <p className="text-sm opacity-80">Team building at Tan-Tar-A, Lodge of Four Seasons</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Lake Weddings</h3>
                    <p className="text-sm opacity-80">Guest shuttles to waterfront venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Family Reunions</h3>
                    <p className="text-sm opacity-80">Lake house weekends, boat parties</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/concert-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-white transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Concerts & Events</h3>
                    <p className="text-sm opacity-80">Lake venues, Shootout, Bikefest</p>
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
              Jefferson City to Lake Ozarks Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far is Jefferson City from Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Jefferson City is approximately 60 miles (1 hour) from Lake of the Ozarks—the closest major city to the Lake. Lake Ride Pros provides direct shuttle service, making it easy for Jefferson City residents to enjoy quick weekend getaways.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation for state government groups?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We regularly transport state government groups, legislative staff, and Capitol employees for retreats, team building events, and conferences at Lake of the Ozarks venues. We offer professional, discrete service for government and corporate groups.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does shuttle service from Jefferson City to Lake Ozarks cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Shuttle rates from Jefferson City to Lake of the Ozarks start at $120/hour with a typical 2-3 hour round trip minimum (since it's only 60 miles). Group rates available. Contact us for a custom quote based on your pickup location and Lake destination.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you do round trips from Jefferson City in one day?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! At only 1 hour away, same-day round trips are very common. Popular for Lake day trips, boat rentals, dining, shopping, and events. We'll drop you off in the morning and pick you up that evening.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you pick up from Jefferson City hotels?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide pickups from all Jefferson City hotels, downtown locations, the Capitol area, and residential areas. Just provide your address when booking.
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
                "Our state agency holds quarterly team retreats at Tan-Tar-A Resort. Lake Ride Pros handles all our transportation from Jefferson City—pickup from the Capitol, drop-off at the resort, and return trips. Reliable, professional service that makes our events run smoothly."
              </p>
              <p className="font-bold text-lrp-black dark:text-white">
                Patricia M.
              </p>
              <p className="text-sm text-gray-600 dark:text-lrp-gray">
                State Agency Event Coordinator
              </p>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Corporate Transportation", href: "/corporate-transportation", description: "Executive service for government and corporate groups" },
          { title: "Group Event Transportation", href: "/group-event-transportation", description: "Large group shuttle service for any event" },
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Luxury wedding shuttles for Lake venues" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Jefferson City to Lake Ozarks Shuttle?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Just 60 miles—the closest major city to the Lake
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shuttle
              </Link>
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

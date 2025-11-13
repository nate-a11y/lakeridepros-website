import type { Metadata } from 'next'
import { MapPin, Heart, Briefcase, Users, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Tan-Tar-A Resort Transportation | Wedding & Event Shuttles',
  description: 'Professional transportation to/from Tan-Tar-A Resort at Lake of the Ozarks. Wedding shuttles, corporate events, conference transportation. On-time, reliable service.',
  keywords: ['Tan-Tar-A transportation', 'Tan-Tar-A wedding shuttle', 'Tan-Tar-A Resort transportation', 'Osage Beach Tan-Tar-A', 'conference shuttle Tan-Tar-A'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/tan-tar-a-transportation',
  },
  openGraph: {
    title: 'Tan-Tar-A Resort Transportation | Lake Ride Pros',
    description: 'Wedding shuttles, corporate events, conference transportation to Tan-Tar-A Resort',
    url: 'https://www.lakeridepros.com/tan-tar-a-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Tan-Tar-A Resort Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Venue Transportation',
  areaServed: {
    '@type': 'Place',
    name: 'Tan-Tar-A Resort',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '494 Tan-Tar-A Dr',
      addressLocality: 'Osage Beach',
      addressRegion: 'MO',
      postalCode: '65065',
      addressCountry: 'US'
    }
  },
  description: 'Professional transportation service for Tan-Tar-A Resort weddings, conferences, corporate events, and group gatherings',
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
        text: 'Yes! Tan-Tar-A Resort is one of our most serviced venues. We provide wedding shuttles, conference transportation, and guest shuttles between Tan-Tar-A and area hotels, airports, and attractions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does Tan-Tar-A wedding shuttle service cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wedding shuttle rates for Tan-Tar-A Resort start at $120/hour and vary based on guest count, duration, and route. Most couples book 4-6 hour packages. Contact us for a customized Tan-Tar-A wedding transportation quote.'
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
      name: 'Venues',
      item: 'https://www.lakeridepros.com/services'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Tan-Tar-A Transportation',
      item: 'https://www.lakeridepros.com/tan-tar-a-transportation'
    }
  ]
}

export default function TanTarATransportationPage() {
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
              Tan-Tar-A Resort Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              The Lake's most trusted transportation provider for Tan-Tar-A weddings, conferences, and events. We know every entrance, parking area, and loading zone by heart.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Tan-Tar-A Shuttle
            </a>
          </div>
        </section>

        {/* Services at Tan-Tar-A */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services at Tan-Tar-A
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Heart className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Wedding Shuttles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Guest transportation between Tan-Tar-A and nearby hotels. Continuous shuttle loops throughout your reception. We've done hundreds of Tan-Tar-A weddings—yours will be flawless.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Briefcase className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Conference Transportation
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Airport transfers for conference attendees. Shuttles between Tan-Tar-A and off-site venues. Corporate retreat transportation. Professional service for your business events.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Group Events
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Family reunions, golf outings, birthday parties. Any group event at Tan-Tar-A. We handle all the logistics so you can enjoy the Lake.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us for Tan-Tar-A */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why We're Tan-Tar-A's Go-To Transportation Provider
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">We Know the Property Inside Out</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Which entrance for weddings vs. conferences? Where to load/unload for Windjammer or State Room events? Which parking lots fill up first? We know it all. No GPS guessing, no wrong turns, no delays.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Trusted by Tan-Tar-A Event Coordinators</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We work directly with Tan-Tar-A's event staff. They know us, they trust us, and they recommend us to their clients. Seamless coordination means your event runs perfectly.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Routes We Run</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• Tan-Tar-A ↔ Margaritaville Lake Resort (wedding overflow)</li>
                  <li>• Tan-Tar-A ↔ Osage Beach hotels (conference attendees)</li>
                  <li>• Tan-Tar-A ↔ Kansas City Airport (MCI) - 2.5 hours</li>
                  <li>• Tan-Tar-A ↔ St. Louis Airport (STL) - 2 hours</li>
                  <li>• Tan-Tar-A ↔ Bagnell Dam Strip (nightlife shuttles)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Tan-Tar-A Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Tan-Tar-A Resort?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Tan-Tar-A Resort is one of our most serviced venues. We provide wedding shuttles, conference transportation, and guest shuttles between Tan-Tar-A and area hotels, airports, and attractions throughout Lake of the Ozarks.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Tan-Tar-A wedding shuttle service cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Wedding shuttle rates for Tan-Tar-A Resort start at $120/hour and vary based on guest count, duration, and route. Most couples book 4-6 hour packages for continuous shuttle loops. Contact us for a customized quote for your Tan-Tar-A wedding.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick up guests at Tan-Tar-A?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We coordinate directly with Tan-Tar-A event staff for optimal pickup/drop-off locations. For weddings, we typically use the Windjammer or State Room entrances. For conferences, we use the main entrance or designated conference center loading zones.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you shuttle guests between Tan-Tar-A and nearby hotels?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Common routes include Tan-Tar-A to Margaritaville Lake Resort, Hampton Inn Osage Beach, Holiday Inn Express, and other Lake area hotels. We can run continuous loops or scheduled departures based on your event needs.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide airport transportation for Tan-Tar-A conferences?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide executive shuttle service from Kansas City (MCI), St. Louis (STL), and Springfield (SGF) airports to Tan-Tar-A Resort. Perfect for corporate conferences, trade shows, and business retreats. Group rates available.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Tan-Tar-A Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We got married at Tan-Tar-A and Lake Ride Pros handled all our guest shuttles. They knew exactly where to go, coordinated with our wedding planner, and made sure every guest got between the hotel and venue safely. Not a single hiccup. Highly recommend for any Tan-Tar-A wedding!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Rachel & Tom
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Married at Tan-Tar-A Resort
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Our company holds an annual conference at Tan-Tar-A with 100+ attendees. Lake Ride Pros coordinates all airport pickups, hotel shuttles, and off-site event transportation. They're professional, reliable, and know the property better than anyone. Wouldn't use anyone else."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Mark S.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Corporate Event Manager
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Luxury wedding shuttles for all Lake of the Ozarks venues" },
          { title: "Corporate Transportation", href: "/corporate-transportation", description: "Executive service for conferences and business events" },
          { title: "Airport Shuttle", href: "/airport-shuttle", description: "Airport transfers from MCI, STL, and SGF to the Lake" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Tan-Tar-A Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Wedding shuttles, conference transportation, group events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shuttle
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

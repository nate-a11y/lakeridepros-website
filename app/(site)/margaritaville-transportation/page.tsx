import type { Metadata } from 'next'
import { MapPin, Heart, Briefcase, Users, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Margaritaville Lake Resort Transportation | Wedding & Event Shuttles',
  description: 'Professional transportation to/from Margaritaville Lake Resort at Lake of the Ozarks. Wedding shuttles, corporate events, group transportation. Always on time, always reliable.',
  keywords: ['Margaritaville transportation', 'Margaritaville wedding shuttle', 'Margaritaville Lake Resort transportation', 'Osage Beach Margaritaville', 'resort shuttle Margaritaville'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/margaritaville-transportation',
  },
  openGraph: {
    title: 'Margaritaville Lake Resort Transportation | Lake Ride Pros',
    description: 'Wedding shuttles, corporate events, group transportation to Margaritaville Lake Resort',
    url: 'https://www.lakeridepros.com/margaritaville-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Margaritaville Lake Resort Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Venue Transportation',
  areaServed: {
    '@type': 'Place',
    name: 'Margaritaville Lake Resort',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '494 Tan-Tar-A Dr',
      addressLocality: 'Osage Beach',
      addressRegion: 'MO',
      postalCode: '65065',
      addressCountry: 'US'
    }
  },
  description: 'Professional transportation service for Margaritaville Lake Resort weddings, corporate events, conferences, and group gatherings at Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Margaritaville Lake Resort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Margaritaville Lake Resort is one of our premier serviced venues. We provide wedding shuttles, conference transportation, and guest shuttles between Margaritaville and area hotels, airports, and attractions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does Margaritaville wedding shuttle service cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wedding shuttle rates for Margaritaville Lake Resort start at $120/hour and vary based on guest count, duration, and specific routes. Most wedding packages run 4-6 hours. Contact us for a customized Margaritaville wedding transportation quote.'
      }
    }
  ]
}

export default function MargaritavilleTransportationPage() {
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

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Margaritaville Lake Resort Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              The Lake's premier transportation provider for Margaritaville weddings, corporate events, and resort guests. Paradise delivered on wheels.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Margaritaville Shuttle
            </a>
          </div>
        </section>

        {/* Services at Margaritaville */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services at Margaritaville
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Heart className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Wedding Shuttles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Guest transportation between Margaritaville and nearby hotels. Continuous shuttle service throughout your celebration. Professional service that complements your destination wedding vibe.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Briefcase className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Corporate Events
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Conference shuttles, team building transportation, corporate retreat logistics. Airport transfers for out-of-town attendees. Executive service for your business events.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Resort Guests
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Day trips to area attractions, dinner reservations downtown, bar hopping on the strip. Let us handle the driving while you enjoy the Lake lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us for Margaritaville */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Margaritaville Guests Choose Lake Ride Pros
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">We Know the Property Like Locals</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Main entrance vs. event entrance? Where the valet station is? Best drop-off for the LandShark Bar & Grill? We know every inch of Margaritaville. Your guests get smooth, seamless service from arrival to departure.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Trusted by Margaritaville Event Staff</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We work hand-in-hand with Margaritaville's event coordinators and concierge team. They know us, they trust us, and they recommend us to their guests. That relationship means zero confusion, zero delays, zero stress for you.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Margaritaville Routes</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• Margaritaville ↔ Area hotels (wedding guest overflow)</li>
                  <li>• Margaritaville ↔ Bagnell Dam Strip (nightlife shuttles)</li>
                  <li>• Margaritaville ↔ Kansas City Airport (MCI) - 2.5 hours</li>
                  <li>• Margaritaville ↔ St. Louis Airport (STL) - 2 hours</li>
                  <li>• Margaritaville ↔ Tan-Tar-A (dual-venue events)</li>
                  <li>• Margaritaville ↔ Local attractions (wineries, boat rentals, golf courses)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Margaritaville Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Margaritaville Lake Resort?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Margaritaville Lake Resort is one of our premier serviced venues. We provide wedding shuttles, conference transportation, and guest shuttles between Margaritaville and area hotels, airports, and attractions throughout Lake of the Ozarks.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Margaritaville wedding shuttle service cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Wedding shuttle rates for Margaritaville Lake Resort start at $120/hour and vary based on guest count, duration, and specific routes. Most wedding packages run 4-6 hours for continuous shuttle loops. Contact us for a customized quote for your Margaritaville wedding.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick up guests at Margaritaville?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We coordinate directly with Margaritaville event staff and concierge for optimal pickup/drop-off locations. For weddings and events, we typically use designated event entrances. For resort guests, we coordinate main entrance or valet area pickups based on your needs.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you shuttle guests between Margaritaville and other hotels?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Common routes include Margaritaville to Hampton Inn Osage Beach, Holiday Inn Express, Tan-Tar-A Resort, and other Lake area hotels. We can run continuous shuttle loops or scheduled departures based on your event schedule and guest needs.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide airport transportation for Margaritaville guests?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide luxury shuttle service from Kansas City (MCI), St. Louis (STL), and Springfield (SGF) airports directly to Margaritaville Lake Resort. Perfect for destination weddings, corporate conferences, and family reunions. Group rates available.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Margaritaville Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We had our destination wedding at Margaritaville and Lake Ride Pros was incredible. They shuttled 75 guests between the resort and area hotels all weekend—rehearsal dinner, ceremony, reception, and next-day brunch. Every pickup was on time, drivers were professional and friendly. Can't recommend them enough!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jessica & Mike
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Married at Margaritaville Lake Resort
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Our sales team holds quarterly retreats at Margaritaville. Lake Ride Pros handles all our logistics—airport pickups from Kansas City and St. Louis, shuttles to off-site dinners, and late-night transportation. They're always on time, always professional. The Margaritaville staff even recommended them to us!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  David K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Regional Sales Director
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Luxury wedding shuttles for all Lake of the Ozarks venues" },
          { title: "Airport Shuttle", href: "/airport-shuttle", description: "Airport transfers from MCI, STL, and SGF to the Lake" },
          { title: "Corporate Transportation", href: "/corporate-transportation", description: "Executive service for conferences and business events" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Margaritaville Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Wedding shuttles, corporate events, resort guest transportation
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

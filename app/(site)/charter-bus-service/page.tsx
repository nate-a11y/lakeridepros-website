import type { Metadata } from 'next'
import { Bus, Users, Shield, Calendar, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Charter Bus Service Lake of the Ozarks | Large Group Transportation',
  description: 'Professional charter bus rental at Lake of the Ozarks. Large group transportation for corporate events, weddings, tours, and special events. Starting at $150/hour.',
  keywords: ['charter bus Lake Ozarks', 'group transportation Missouri', 'large group shuttle', 'Lake Ozarks bus rental', 'corporate charter bus'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/charter-bus-service',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Charter Bus Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Charter Bus Rental',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional charter bus service for large groups including corporate events, weddings, tours, and special occasions',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '150',
      unitText: 'HOUR',
    },
  },
}

export default function CharterBusServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <Bus className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Charter Bus Service Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional charter bus rental for large groups. Corporate events, weddings, tours, and special occasions at Lake of the Ozarks.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $150/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Charter Bus
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros Charter Service
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Any Group Size
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Accommodate groups from 20 to 100+ passengers. Luxury coaches with comfortable seating, climate control, and amenities.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Fleet
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Modern, well-maintained charter buses with experienced drivers. DOT certified, fully insured, and safety-focused.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Calendar className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Day trips, multi-day tours, or one-way transfers. Custom itineraries built around your event schedule and needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Charter Bus Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Corporate Events</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Team building, conferences, retreats, and company outings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Wedding Shuttles</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Guest transportation between hotels, venues, and receptions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Group Tours</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Sightseeing tours, winery tours, and Lake Ozarks attractions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Airport Transfers</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Large group transportation to/from KC, STL, Springfield airports
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Charter Bus Routes
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Lake Ozarks area hotels to event venues</li>
                  <li>• Kansas City / St. Louis to Lake of the Ozarks</li>
                  <li>• Multi-venue wedding day transportation</li>
                  <li>• Corporate retreat shuttle services</li>
                  <li>• Custom sightseeing and attraction tours</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Request Quote</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Share your event details, dates, and passenger count
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Custom Planning</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We create a detailed itinerary and transportation plan
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Confirm & Book</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Review the plan, finalize details, and secure your bus
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Seamless Service</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Professional drivers execute your transportation plan perfectly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Charter Bus FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How many passengers can your charter buses accommodate?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our charter bus fleet ranges from minibuses (20-30 passengers) to full-size motor coaches (40-56 passengers). For groups larger than 56, we can coordinate multiple buses to keep your group together.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What amenities are included in your charter buses?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our buses feature comfortable reclining seats, climate control, WiFi, power outlets, restrooms (on larger coaches), PA systems, and ample luggage storage. Specific amenities vary by bus size and type.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should we book a charter bus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For peak season (summer weekends, wedding season), book 4-8 weeks in advance. For corporate events and off-season travel, 2-4 weeks notice is usually sufficient. Last-minute bookings may be available - call us at (573) 206-9499.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you charge by the hour or by the mile?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Charter bus pricing depends on several factors including duration, distance, bus size, and season. We offer both hourly rates and flat-rate packages. Contact us with your event details for an accurate custom quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we make multiple stops during our charter?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Charter buses are perfect for multi-stop itineraries. We can accommodate brewery tours, winery visits, restaurant stops, attraction visits, and any custom route you need. Just share your itinerary when booking.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are your charter bus drivers licensed and insured?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely. All our drivers hold commercial driver's licenses (CDL), undergo regular DOT inspections, pass comprehensive background checks, and maintain excellent safety records. Our buses are fully insured and DOT compliant.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Groups Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Lake Ride Pros provided charter bus service for our company retreat with 85 employees. The logistics were complex with multiple pickup points and a full-day itinerary. They handled everything flawlessly - timing was perfect, drivers were professional, and the buses were immaculate. Highly recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Patricia L.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Corporate Event Planner
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We chartered a bus for our destination wedding at Lake of the Ozarks to shuttle 50 guests between the hotel and venue. Lake Ride Pros was phenomenal! Communication was excellent, the bus was beautiful, and our guests loved not having to drive. Made our wedding day so much easier!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Emily & James
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Wedding at Lake Ozarks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Charter Bus?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Professional group transportation for any event or occasion
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $150/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Get a Quote
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

import type { Metadata } from 'next'
import { Plane, Clock, Shield, Users, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Airport Shuttle Service Lake of the Ozarks | KC, STL, Springfield',
  description: 'Professional airport shuttle service to/from Kansas City, St. Louis, and Springfield airports. Reliable transportation to Lake of the Ozarks. Starting at $120/hour.',
  keywords: ['airport shuttle Lake Ozarks', 'Kansas City airport transportation', 'STL airport shuttle', 'Springfield airport transfer', 'Lake Ozarks airport service'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/airport-shuttle',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Airport Shuttle Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Airport Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional airport shuttle service connecting Lake of the Ozarks to Kansas City, St. Louis, and Springfield airports',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '120',
      unitText: 'HOUR',
    },
  },
}

export default function AirportShuttlePage() {
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
            <Plane className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Airport Shuttle Service Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional airport transportation to/from Kansas City, St. Louis, and Springfield airports. On-time, reliable service.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $120/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Airport Shuttle
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Airport Service
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Always On Time
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Flight tracking and early departures ensure you never miss your flight. Guaranteed on-time pickup and drop-off.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Drivers
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Licensed, insured, and experienced drivers who know the best routes and provide door-to-door service.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Luggage Assistance
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We handle your luggage with care. Spacious vehicles with ample storage for all your bags and equipment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Airport Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Kansas City Airport (MCI)</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Direct service to/from Kansas City International Airport
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">St. Louis Airport (STL)</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Comfortable rides to/from Lambert-St. Louis International
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Springfield Airport (SGF)</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Quick transfers to Springfield-Branson National Airport
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Group Airport Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Shuttle service for groups, families, and corporate travelers
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Pickup Locations
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Osage Beach hotels and resorts</li>
                  <li>• Lake Ozarks vacation rentals</li>
                  <li>• Margaritaville Lake Resort</li>
                  <li>• Camdenton area accommodations</li>
                  <li>• Private residences throughout the Lake area</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Ride</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Provide your flight details and pickup location
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Track Your Flight</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We monitor your flight status for any delays or changes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Comfortable Ride</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy a relaxing, professional ride to your destination
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Arrival</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Arrive on time, stress-free, ready for your trip
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Airport Shuttle FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book airport shuttle service?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We recommend booking at least 24-48 hours in advance, especially during peak travel seasons. For last-minute bookings, call us directly at (573) 206-9499 and we'll do our best to accommodate you.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you track flights for delays?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We monitor all flights in real-time. If your flight is delayed, we automatically adjust the pickup time. If it arrives early, we'll be there waiting for you.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What are the rates for airport shuttle service?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Rates start at $120/hour and vary based on distance, vehicle type, and group size. We offer flat-rate pricing for specific routes. Contact us for an exact quote for your trip.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much luggage can I bring?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our vehicles have ample luggage space. Standard sedans fit 2-3 large suitcases, while larger vehicles accommodate 6+ bags plus carry-ons. Let us know if you have oversized items or equipment.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate early morning or late night flights?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We provide 24/7 airport shuttle service to accommodate all flight times. Whether your flight departs at 5 AM or arrives at midnight, we'll be there.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide meet and greet service at the airport?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! For arriving passengers, our driver will meet you at baggage claim with a name sign, help with luggage, and escort you to the vehicle. Just provide your flight information when booking.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Travelers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Used Lake Ride Pros for our airport shuttle to Kansas City and back for our Lake Ozarks vacation. Driver was waiting when we arrived, helped with all our luggage, and gave us great recommendations for the week. Return trip was just as smooth. Highly recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Michael R.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Family Vacation
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "My flight from St. Louis was delayed by 2 hours, but Lake Ride Pros tracked it and adjusted pickup time automatically. Driver was professional, vehicle was immaculate, and the ride was comfortable. This is how airport service should be done!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jennifer K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Business Trip
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Airport Shuttle?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Professional airport transportation to KC, STL, and Springfield
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $120/hour
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

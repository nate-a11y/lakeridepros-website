import type { Metadata } from 'next'
import { Car, Clock, MapPin, Shield, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Taxi Service Lake Ozarks | Cab Service & Ride Options',
  description: 'Professional taxi service at Lake of the Ozarks. Point-to-point rides, on-demand cab service, and quick pickup options. Licensed drivers, competitive rates. Starting at $65/hour.',
  keywords: ['taxi service Lake Ozarks', 'cab service', 'ride service', 'point-to-point transportation', 'quick pickup', 'Lake Ozarks taxi', 'local transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/taxi-service',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Taxi Service Lake Ozarks',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Taxi Service',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional taxi and point-to-point transportation service with on-demand rides, licensed drivers, and competitive rates',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '65',
      unitText: 'HOUR',
    },
  },
}

export default function TaxiServicePage() {
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
            <Car className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Professional Taxi Service Lake Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Reliable point-to-point transportation, on-demand cab service, and quick pickup options. Licensed drivers, competitive rates, professional service.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $65/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Ride Now
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Quick Pickup Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  On-demand rides available whenever you need us. Book through our app or call for immediate pickup. Fast response times throughout Lake Ozarks.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <MapPin className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Point-to-Point Routes
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Direct transportation between any two points. Airport transfers, hotel pickups, local destinations. Efficient routing to get you there fast.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Licensed & Professional
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  All drivers are licensed, insured, and background-checked. Professional service with clean vehicles. Your safety is our priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Taxi & Ride Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Airport Transfers</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Reliable rides to and from regional airports. Punctual pickups with flight tracking available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Local Taxi Rides</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Get around Lake Ozarks with professional drivers who know all the local routes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Hotel & Resort Pickups</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Convenient transportation from your accommodation to attractions and restaurants.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Scheduled Hourly Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Book taxis for hourly service including waiting time and multiple stops.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Long-Distance Rides</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Travel to nearby towns and destinations with transparent, upfront pricing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Same-Day Bookings</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Need a ride today? We offer flexible same-day booking for immediate transportation needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Our Taxi Service Advantages
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Affordable alternative to traditional cabs</li>
                  <li>• Professional, courteous drivers</li>
                  <li>• Clean, well-maintained vehicles</li>
                  <li>• Transparent pricing with no hidden fees</li>
                  <li>• Easy booking and fast response times</li>
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
                  Use our app, website, or call to request your taxi with pickup and destination
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Quick Confirmation</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Get instant confirmation with driver details and estimated pickup time
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Professional Pickup</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Your driver arrives on time to pick you up at your location
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Arrive Safely</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reach your destination safely with professional service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Taxi Service FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What are your standard taxi rates?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our taxi service starts at $65/hour. This includes professional driver service, well-maintained vehicles, and transparent pricing. Rates may vary based on distance and time of day. Contact us for a quote on your specific route.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How quickly can a taxi be available?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For immediate rides, we typically dispatch a taxi within 5-15 minutes depending on current demand and your location. Our on-demand service makes booking fast and convenient. Call or use our app for fastest service.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer airport shuttle service?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide reliable airport transfers to and from regional airports including Springfield-Branson National Airport and St. Louis Lambert International. We track flights to ensure timely pickups.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are your drivers licensed and insured?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely. All our drivers are licensed, professionally trained, background-checked, and fully insured. We maintain high safety standards and professional service at all times.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can I book a taxi in advance?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! You can schedule rides in advance for upcoming trips. We recommend booking at least 24 hours ahead for pre-planned transportation. Same-day bookings are also available subject to driver availability.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What payment methods do you accept?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We accept all major credit cards, debit cards, cash, and mobile payment options. Payment is flexible and can be made through our booking system or directly with your driver.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Customers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "I used Lake Ride Pros for my airport transfer and was impressed with the professional service. The driver arrived on time, kept the car immaculate, and got me to my destination safely. Highly recommend this taxi service!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Michael D.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Airport Transfer
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Great cab service alternative! Easy to book, friendly drivers, and very reasonable rates. Used Lake Ride Pros for several rides around Lake Ozarks and each experience was excellent. Will definitely book again!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Sarah M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Local Transportation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need a Reliable Taxi Service?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Professional drivers, clean vehicles, transparent pricing
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $65/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Taxi Now
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

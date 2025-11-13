import type { Metadata } from 'next'
import { Sparkles, Shield, PartyPopper, Clock, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'New Years Eve Transportation Lake of the Ozarks | NYE Safe Rides',
  description: 'Safe New Years Eve transportation at Lake of the Ozarks. Ring in the new year worry-free with professional NYE shuttle service. Book early! Starting at $200/hour.',
  keywords: ['New Years Eve Lake Ozarks', 'NYE transportation Missouri', 'New Years party bus', 'Lake Ozarks NYE rides', 'safe New Years transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/new-years-eve-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'New Years Eve Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'New Years Eve Transportation Service',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional and safe New Years Eve transportation service ensuring worry-free celebration and safe rides home',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '200',
      unitText: 'HOUR',
    },
  },
}

export default function NewYearsEveTransportationPage() {
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
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              New Years Eve Transportation Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Ring in the new year safely! Professional NYE transportation so you can celebrate without worrying about the ride home.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $200/hour</p>
              <p className="text-white/90 text-sm mt-2">Book early - NYE fills up fast!</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book NYE Transportation
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for New Years Eve
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Safety First
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  NYE is the busiest night for DUIs. Professional drivers ensure everyone celebrates safely and gets home without incident.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <PartyPopper className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Party Without Limits
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No designated driver needed! Everyone can toast midnight and enjoy the celebration worry-free with guaranteed rides.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Late Night Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We run all night long on NYE. Whether you leave at 1 AM or 3 AM, we'll be ready to get your group home safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              New Years Eve Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Party Bar Crawls</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Hit multiple NYE parties and venues safely
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Event Shuttles</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Transportation to NYE galas, dinners, and celebrations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Party Bus Rentals</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Celebrate on the bus with LED lights and music
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Safe Rides Home</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Guaranteed transportation after midnight countdown
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks NYE Destinations
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Margaritaville Lake Resort NYE parties</li>
                  <li>• Bagnell Dam Strip bars and nightlife</li>
                  <li>• Private NYE house parties and gatherings</li>
                  <li>• Restaurant NYE dinner packages</li>
                  <li>• Resort NYE galas and celebrations</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Early</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  NYE fills up fast! Reserve your transportation now
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Plan Your Night</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Share your NYE itinerary and party locations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Celebrate Safely</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Party hard, toast midnight, make memories
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Everyone gets home safely to start the new year right
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              New Years Eve Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should we book NYE transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Book NOW! New Years Eve is our busiest night of the year. Most vehicles are reserved 2-3 months in advance. We typically sell out 4-6 weeks before NYE. The earlier you book, the better your vehicle selection.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's the minimum rental time for New Years Eve?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  NYE minimum is typically 6 hours due to high demand. Most groups book 6-8 hours to cover dinner, parties, midnight countdown, and after-party celebrations. Pricing reflects premium holiday rates.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Will our driver wait during the midnight countdown?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Your driver stays with your group for the entire rental period. They'll be ready whenever you're done celebrating - whether that's 12:30 AM or 3:00 AM.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring champagne to toast on the bus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Passengers 21+ can bring champagne and beverages (no glass bottles for safety). We provide ice, coolers, and cups. Toast the new year on the ride! We provide complimentary champagne flutes for midnight.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What if we want to change our NYE plans during the night?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  NYE plans often change! Just communicate with your driver. Want to skip a venue or add another stop? No problem. We're flexible and adjust to your group's vibe and energy throughout the night.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's your cancellation policy for New Years Eve?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Due to high demand, NYE reservations require a deposit and have stricter cancellation terms. Cancellations 60+ days out receive full refund. Within 60 days, deposits are non-refundable but may be applied to future bookings. Contact us for specific policy details.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What NYE Celebrators Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best NYE decision ever! Lake Ride Pros took our group of 16 to three different parties. The party bus was incredible - music, lights, and we could toast champagne between stops. Everyone had a blast and we all got home safe. Already booked for next year!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Tyler & Friends
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  New Years Eve 2024
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We've used Lake Ride Pros for NYE at Lake Ozarks three years running. They're always professional, the drivers are fun, and knowing we have safe transportation lets us actually enjoy the celebration. Book early though - they sell out every year for good reason!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jennifer M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Annual NYE Group
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book New Years Eve Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Ring in the new year safely with professional NYE service
            </p>
            <p className="text-white text-2xl font-bold mb-2">
              Starting at $200/hour
            </p>
            <p className="text-white/90 text-sm mb-8">
              Book early - NYE sells out fast!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book NYE Service Now
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

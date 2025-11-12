import type { Metadata } from 'next'
import { PartyPopper, Shield, Music, Users, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bachelor & Bachelorette Party Bus Lake of the Ozarks',
  description: 'Epic bachelor and bachelorette party transportation at Lake of the Ozarks. Party buses with LED lighting, sound systems, and professional drivers. Starting at $150/hour.',
  keywords: ['bachelor party bus Lake Ozarks', 'bachelorette party transportation', 'party bus rental Missouri', 'Lake Ozarks nightlife transport', 'group party transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/bachelor-party-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Bachelor & Bachelorette Party Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Party Bus Rental',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Luxury party bus and transportation service for bachelor and bachelorette parties with LED lighting and premium sound systems',
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

export default function BachelorPartyTransportationPage() {
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
            <PartyPopper className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Bachelor & Bachelorette Party Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Epic party transportation at Lake of the Ozarks. LED-lit party buses, professional drivers, and unforgettable nights out.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $150/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Party Bus
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Your Party
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Safe Party Transportation
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Party hard, ride safe. Professional drivers ensure everyone gets home safely after the celebration.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Music className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  LED Lighting & Sound
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Party starts on the bus! Premium sound systems, LED lighting, and luxury interiors set the mood.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Drivers
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Experienced drivers who know the best nightlife spots and keep the party vibes going all night.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Party Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Nightlife Tours</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Hit the best bars and clubs at Lake of the Ozarks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Bar Crawls</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Custom bar crawl routes along the Bagnell Dam Strip
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Party Bus Rentals</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      LED-lit buses with premium sound for mobile parties
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Group Transportation</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Safe rides for bachelor/bachelorette party groups of any size
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Party Destinations
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Bagnell Dam Strip (bars and nightlife)</li>
                  <li>• Margaritaville Lake Resort</li>
                  <li>• Captain Ron's Bar & Grill</li>
                  <li>• Party Cove (daytime boat parties)</li>
                  <li>• Custom routes based on your group's vibe</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Plan Your Route</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Tell us your party vibe and we'll create the perfect itinerary
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Bus</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Choose your party bus and secure your date
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Party All Night</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy the nightlife while we handle the driving
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Everyone gets home safely after the celebration
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Bachelor/Bachelorette Party FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's the minimum rental time for party buses?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our minimum rental is typically 4 hours for bachelor/bachelorette parties. Most groups book 5-8 hours to fully enjoy the Lake Ozarks nightlife without feeling rushed.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring our own drinks on the party bus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Passengers 21+ can bring alcoholic beverages on board (no glass bottles). Our buses have coolers and cup holders. We provide complimentary water and ice.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What entertainment features do your party buses have?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our party buses feature premium sound systems, LED color-changing lighting, comfortable leather seating, climate control, and Bluetooth connectivity for your playlist. Some buses also have dance poles and bar areas.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How many people can fit on your party buses?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We have party buses ranging from 20-30 passengers, perfect for most bachelor/bachelorette groups. For larger parties, we can coordinate multiple vehicles to keep everyone together.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you help plan the bar crawl route?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Our drivers know the Lake Ozarks nightlife scene inside and out. We can recommend the best bars, clubs, and entertainment venues based on your group's preferences and party vibe.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's your cancellation policy?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We understand plans can change. Cancellations made 30+ days in advance receive a full refund. Cancellations within 30 days may receive partial refunds or credit toward future bookings. Contact us for specific details.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Party Groups Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best bachelor party ever! Lake Ride Pros took us to all the hotspots on the Bagnell Dam Strip. The party bus was incredible with amazing lighting and sound. Our driver was professional and knew exactly where to take us. 10/10 would book again!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jake T.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Bachelor Party Weekend
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We booked Lake Ride Pros for my sister's bachelorette party and it was absolutely perfect! The bus was beautiful, the driver was so fun and accommodating, and we felt completely safe the entire night. Made our Lake Ozarks trip unforgettable!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Rachel S.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Bachelorette Party
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Epic Party?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              LED party buses with professional drivers for unforgettable nights
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $150/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Party Bus
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

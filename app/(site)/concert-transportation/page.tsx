import type { Metadata } from 'next'
import { Music, Clock, Users, PartyPopper, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Concert Transportation Lake of the Ozarks | Event Venue Shuttle Service',
  description: 'Concert and event transportation at Lake of the Ozarks. Skip parking hassles, enjoy the show, ride safely. Professional service to all venues. Starting at $110/hour.',
  keywords: ['concert transportation Lake Ozarks', 'event venue shuttle', 'Lake Ozarks Amphitheater', 'music venue transportation Missouri', 'concert shuttle service'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/concert-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Concert & Event Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Concert Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional concert and event venue transportation service with safe rides to and from entertainment venues',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '110',
      unitText: 'HOUR',
    },
  },
}

export default function ConcertTransportationPage() {
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
            <Music className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Concert & Event Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Skip the parking hassles and traffic. Enjoy the show, we'll handle the driving. Safe rides to all Lake Ozarks venues.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $110/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Concert Transportation
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Concerts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  No Parking Hassles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Skip the parking lot chaos. We drop you at the entrance and pick you up when the show ends. Easy and stress-free.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <PartyPopper className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Party Safely
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Enjoy drinks at the concert without worrying about driving. Professional drivers ensure everyone gets home safely.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Group-Friendly
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bring the whole crew! Keep your concert group together with spacious vehicles and comfortable seating.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Concert Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Amphitheater Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Transportation to outdoor concerts and amphitheater events
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Music Festival Shuttles</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Multi-day festival transportation for groups
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Venue Bar Crawls</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Pre-concert or post-show transportation to entertainment districts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Special Event Transport</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Festivals, sporting events, and entertainment venues
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Entertainment Venues
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Lake Ozarks Amphitheater</li>
                  <li>• Margaritaville Lake Resort entertainment venues</li>
                  <li>• Backwater Jack's and lakeside music venues</li>
                  <li>• Bagnell Dam Strip bars and nightclubs</li>
                  <li>• Seasonal festivals and outdoor concerts</li>
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
                  Reserve transportation when you buy concert tickets
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Pre-Show Pickup</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We pick you up in time to catch the opening act
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Enjoy the Show</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Zero parking stress, just pure concert enjoyment
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Beat the parking lot exit and get home quickly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Concert Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How early should we book for popular concerts?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Book as soon as you get your concert tickets! Popular shows at Lake Ozarks venues fill up quickly. We recommend booking at least 1-2 weeks in advance for major acts.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick us up after the concert?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We coordinate a specific pickup location before the show and monitor the concert timing. Most venues have designated pickup areas. We'll be there waiting when you're ready to leave.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we make pre-concert dinner stops?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Many groups include dinner or drinks before the show. Just let us know your itinerary when booking, and we'll plan the timing to get you to the venue on time.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does concert transportation cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Rates start at $110/hour with a typical minimum of 4-5 hours for concert service. Pricing varies based on group size, distance, and vehicle type. Contact us for an exact quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What if the concert runs late or we want to stay longer?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  No problem! We're flexible with timing. If the show runs late or you want to hang out after, just text or call your driver. Extended time is billed at the hourly rate.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring tailgate supplies or coolers?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Our vehicles have ample space for coolers, chairs, and tailgate gear. For passengers 21+, you can enjoy beverages during the ride (no glass bottles). We provide ice and coolers.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Concert-Goers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Used Lake Ride Pros for a concert at the amphitheater and it was perfect! No fighting for parking, no designated driver needed. Our group of 12 had an awesome time, and the driver was waiting right where he said he'd be after the show. Stress-free night out!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Tom B.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Summer Concert Group
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We book Lake Ride Pros for every major concert at Lake of the Ozarks now. The party bus gets us hyped on the way there, we don't worry about parking or drinking, and we always get home safely. Best decision for concert nights. Worth every penny!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jessica & Friends
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Regular Concert Group
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Concert Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Skip the parking, enjoy the show, ride safely
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $110/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Ride
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

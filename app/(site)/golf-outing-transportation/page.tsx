import type { Metadata } from 'next'
import { MapPin, Users, Trophy, Clock, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Golf Outing Transportation Lake of the Ozarks | Golf Course Shuttle',
  description: 'Professional golf outing transportation at Lake of the Ozarks. Corporate tournaments, group outings, and golf course shuttles. Starting at $95/hour.',
  keywords: ['golf outing transportation Lake Ozarks', 'golf course shuttle Missouri', 'corporate golf tournament transport', 'Lake Ozarks golf courses', 'golf group transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/golf-outing-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Golf Outing Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Golf Course Shuttle Service',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional golf outing and golf course shuttle transportation for corporate tournaments and group golf events',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '95',
      unitText: 'HOUR',
    },
  },
}

export default function GolfOutingTransportationPage() {
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
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Golf Outing Transportation Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional shuttle service for golf tournaments, corporate outings, and group golf events. Keep your foursome together.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $95/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Golf Transportation
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Golf Outings
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Keep Groups Together
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No caravan confusion. Everyone arrives together, ready to tee off. Perfect for corporate tournaments and buddy trips.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Trophy className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Focus on Your Game
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No driving stress before your round. Arrive relaxed and ready. Celebrate after the 19th hole without worrying about the ride home.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Punctual Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Never miss your tee time. We know Lake Ozarks golf courses and plan routes for on-time arrival every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Golf Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Corporate Tournaments</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Group shuttle service for business golf tournaments and client events
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Multi-Course Tours</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Play multiple Lake Ozarks courses with seamless transportation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Buddy Golf Trips</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Keep your golf group together for weekend golf getaways
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Post-Round Transport</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Celebrate at the 19th hole, we'll get everyone home safely
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Golf Courses
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Old Kinderhook Golf Course</li>
                  <li>• The Cove Golf Course at Lodge of Four Seasons</li>
                  <li>• Sycamore Creek Golf Club</li>
                  <li>• Tan-Tar-A Resort Golf Courses (Oaks & Hidden Lakes)</li>
                  <li>• Porto Cima (private course transportation for members)</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Shuttle</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve when you book your tee time for guaranteed service
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Group Pickup</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We pick up your golf group with time to check in and warm up
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Enjoy Your Round</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Focus on your game while we wait or handle other pickups
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Post-Round Transport</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Return to accommodations or continue to the 19th hole
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Golf Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate golf clubs and equipment?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Our vehicles have ample storage for golf bags, push carts, and personal items. We handle your clubs with care and ensure everything arrives safely at the course.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's the best vehicle for a golf foursome?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For foursomes, we recommend our SUVs or luxury vans which comfortably seat 4-6 passengers plus all golf equipment. For larger tournaments with multiple groups, we can coordinate larger vehicles or multiple vehicles.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer corporate tournament packages?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We specialize in corporate golf tournaments. We can shuttle multiple groups throughout the day, coordinate timing with tournament directors, and provide transportation to post-tournament dinners. Contact us for custom corporate packages.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we make stops before or after the round?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Of course! Many groups stop for breakfast before early tee times or visit the 19th hole after their round. We'll work with your schedule and ensure you never miss your tee time.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What if our round runs longer than expected?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We build buffer time into golf outings and track course pace. If your round runs long, no worries - we're flexible and charge by the hour. Your driver will be ready when you finish.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you help plan a multi-day golf trip itinerary?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We know all the Lake Ozarks golf courses and can help coordinate a multi-day golf tour. We'll recommend courses, handle all transportation logistics, and ensure smooth transitions between locations.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Golfers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Lake Ride Pros handled transportation for our annual company golf tournament at Old Kinderhook. They coordinated pickups for 60+ employees from multiple hotels, got everyone there on time, and shuttled us to the banquet after. Professional service that made our event seamless."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Mark D.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Corporate Tournament Organizer
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best decision for our buddy golf trip! Lake Ride Pros took us to three different courses over the weekend. No one had to be the designated driver, we all arrived relaxed, and they even recommended a great spot for dinner after. Made our golf weekend perfect!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Brad & Golf Crew
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Weekend Golf Group
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Golf Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Keep your group together, never miss a tee time
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $95/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Golf Shuttle
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

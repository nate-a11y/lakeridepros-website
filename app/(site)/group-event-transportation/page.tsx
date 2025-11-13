import type { Metadata } from 'next'
import { Users, Calendar, Heart, TrendingUp, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Group Event Transportation Lake of the Ozarks | Party & Event Shuttles',
  description: 'Professional group event transportation at Lake of the Ozarks. Weddings, reunions, parties, and celebrations. Reliable shuttle service for any occasion. Starting at $110/hour.',
  keywords: ['group transportation Lake Ozarks', 'event shuttle service Missouri', 'wedding transportation Lake Ozarks', 'reunion shuttle', 'party transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/group-event-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Group Event Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Group Event Shuttle Service',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional group transportation for weddings, reunions, parties, and special events with reliable shuttle service',
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

export default function GroupEventTransportationPage() {
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
            <Users className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Group Event Transportation Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional transportation for weddings, reunions, parties, and celebrations. Keep your group together, stress-free.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $110/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Event Transportation
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Group Events
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Calendar className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Seamless Coordination
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We handle logistics so you can enjoy your event. Multiple pickups, timed arrivals, and coordinated departures made easy.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Heart className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Stress-Free Experience
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No parking worries, no caravan chaos, no designated driver debates. Just smooth transportation for everyone.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <TrendingUp className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flexible Fleet
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  From intimate gatherings to large celebrations, we have vehicles for groups of 4 to 100+. Perfect fit every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Group Event Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Wedding Transportation</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Guest shuttles between hotels, ceremony, and reception venues
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Family Reunions</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Multi-day reunion transportation for activities and dinners
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Birthday Celebrations</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Party transportation for milestone birthdays and celebrations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Group Getaways</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Weekend trips, girls weekends, guys trips, and friend groups
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Group Event Venues at Lake Ozarks
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Margaritaville Lake Resort (weddings & events)</li>
                  <li>• Camden on the Lake (lakefront celebrations)</li>
                  <li>• Lodge of Four Seasons (conferences & reunions)</li>
                  <li>• Private lakefront homes and venues</li>
                  <li>• Restaurants and entertainment venues</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Share Event Details</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Tell us about your event, group size, and schedule
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Custom Planning</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We create a transportation plan tailored to your event
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Day of Service</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Professional drivers execute the plan flawlessly
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Enjoy Your Event</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Focus on celebrating while we handle transportation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Group Event Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should we book for a wedding or large event?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For weddings and major events during peak season (May-October), book 2-3 months in advance. For smaller groups or off-season events, 3-4 weeks notice is usually sufficient. We can often accommodate last-minute bookings - just call us!
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you handle multiple pickup locations?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in coordinating multiple pickup points. For weddings, we commonly shuttle guests from 2-3 hotels to the venue. We'll create an efficient route and communicate timing to all locations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What happens if our event runs longer than planned?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  No problem! We build some buffer time into event schedules. If the party runs longer, just communicate with the driver. Extended time is billed at the hourly rate. We want you to enjoy your event without watching the clock.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer continuous shuttle service during events?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! For weddings and large events, we can provide continuous shuttle loops throughout the event. Guests can come and go on their own schedule while the shuttle runs back and forth between locations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate elderly guests or those with mobility issues?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We have vehicles with low steps and assist handles. Our drivers are trained to help passengers who need extra assistance. Let us know your needs when booking so we can select the appropriate vehicle.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you work with wedding planners and event coordinators?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We love working with event professionals! We'll coordinate directly with your planner, provide detailed timing schedules, and communicate throughout the event to ensure seamless transportation logistics.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Event Hosts Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Lake Ride Pros made our Lake Ozarks wedding perfect! They shuttled 80 guests from three hotels to our venue and back. The drivers were punctual, professional, and so helpful. Our guests loved not worrying about parking or directions. One less thing to stress about on our big day!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Melissa & Ryan
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Wedding at Camden on the Lake
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We used Lake Ride Pros for our family reunion with 45 people. They transported us to different activities and restaurants all weekend. The coordination was seamless, the drivers were friendly and flexible, and it kept our whole family together. Made the reunion so much more enjoyable!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  The Martinez Family
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Family Reunion Weekend
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Group Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Professional event shuttle service for celebrations and gatherings
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $110/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Event Shuttle
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

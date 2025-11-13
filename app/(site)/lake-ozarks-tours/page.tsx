import type { Metadata } from 'next'
import { MapPin, Camera, Compass, Sun, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lake of the Ozarks Tours | Sightseeing & Scenic Transportation',
  description: 'Guided Lake of the Ozarks tours and sightseeing transportation. Explore attractions, scenic routes, and hidden gems with professional guides. Starting at $95/hour.',
  keywords: ['Lake of the Ozarks tours', 'Lake Ozarks sightseeing', 'scenic tours Missouri', 'Lake Ozarks attractions', 'guided tours Lake Ozarks'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/lake-ozarks-tours',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Lake of the Ozarks Tours',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Sightseeing & Tour Service',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Guided tours and sightseeing transportation showcasing Lake of the Ozarks attractions, scenic routes, and local highlights',
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

export default function LakeOzarksToursPage() {
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
            <Compass className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Lake of the Ozarks Tours & Sightseeing
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Discover the beauty of Lake of the Ozarks with guided tours, scenic drives, and insider knowledge from local experts.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $95/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Tour
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Tours
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <MapPin className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Local Expertise
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Our drivers are Lake Ozarks natives who share fascinating history, insider tips, and hidden gems you won't find in guidebooks.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Camera className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Photo Opportunities
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Stop at scenic overlooks, historic sites, and Instagram-worthy spots. We know all the best photo locations around the lake.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Sun className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Comfortable & Relaxing
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Sit back and enjoy the scenery in climate-controlled comfort. No navigation stress, no parking hassles, just pure enjoyment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Lake Ozarks Tour Options
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Scenic Lake Tour</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Drive along lakefront roads with stunning water views and overlooks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Historical Tours</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Learn about Bagnell Dam, lake formation, and local history
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Attraction Hopping</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Visit multiple Lake Ozarks attractions with convenient transportation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Custom Itineraries</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Create your own tour based on your interests and schedule
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Attractions & Stops
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Bagnell Dam (historic 1931 hydroelectric dam)</li>
                  <li>• Ha Ha Tonka State Park (castle ruins & scenic trails)</li>
                  <li>• Bridal Cave (guided cave tours)</li>
                  <li>• Lake Ozarks scenic overlooks and photo spots</li>
                  <li>• Osage Beach shopping and entertainment district</li>
                  <li>• Historic lakefront communities and landmarks</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Choose Your Tour</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Select a tour package or create a custom itinerary
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Date</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve your tour time and confirm your group size
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Explore & Learn</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy commentary, stories, and insights from local experts
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Create Memories</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Leave with photos, knowledge, and unforgettable experiences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Lake Ozarks Tours FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How long do typical Lake Ozarks tours last?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Standard tours run 2-4 hours, covering major highlights and scenic spots. Half-day tours (4-6 hours) include more stops and attractions. Full-day custom tours can explore the entire Lake area. We'll match the tour length to your interests and schedule.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are the tours guided or just transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our tours include knowledgeable commentary from drivers who are Lake Ozarks locals. They share history, point out landmarks, recommend restaurants, and answer questions. It's transportation plus a local guide rolled into one experience.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we customize a tour to our interests?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Whether you're interested in history, nature, shopping, dining, or specific attractions, we'll create a custom itinerary. Just share your interests and we'll design the perfect Lake Ozarks tour for your group.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do tour prices include admission to attractions?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Tour pricing covers transportation and guide service. Admission fees to attractions like Bridal Cave, Ha Ha Tonka State Park, or entertainment venues are separate. We'll provide a full cost breakdown when planning your custom tour.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Is the tour route the same every time?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We have signature routes that hit the highlights, but we adapt based on weather, traffic, your interests, and time of day. Drivers also adjust to show you the best photo ops and avoid crowds at popular spots.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are tours available year-round?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Lake of the Ozarks is beautiful in every season. Summer offers water views and beach stops, fall brings stunning foliage, winter provides a peaceful quiet beauty, and spring showcases blooming landscapes. Each season offers unique tour experiences.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Tour Guests Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "What a fantastic way to see Lake of the Ozarks! Our driver took us to Ha Ha Tonka Castle ruins, scenic overlooks, and hidden spots we never would have found on our own. His stories about the lake's history were fascinating. Got amazing photos and learned so much. Highly recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Karen & Steve
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  First-Time Visitors
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We've been coming to Lake Ozarks for years but never did a tour. Lake Ride Pros showed us places we didn't know existed! The commentary was informative and entertaining. Even my teenagers enjoyed it. Great way to experience the lake from a new perspective."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  The Johnson Family
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Annual Lake Visitors
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Lake of the Ozarks?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Guided tours with local experts and comfortable transportation
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $95/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Tour
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

import type { Metadata } from 'next'
import { Beer, Users, MapPin, Shield, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brewery Tour Transportation Lake of the Ozarks | Craft Beer Shuttle',
  description: 'Professional brewery tour transportation at Lake of the Ozarks. Safe rides to craft breweries, wineries, and distilleries. Enjoy tastings worry-free. Starting at $100/hour.',
  keywords: ['brewery tour Lake Ozarks', 'craft beer shuttle Missouri', 'winery transportation Lake Ozarks', 'brewery crawl Lake Ozarks', 'distillery tour transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/brewery-tour-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Brewery Tour Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Brewery & Winery Tour Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional transportation for brewery tours, winery visits, and craft beverage tastings with safe rides throughout the experience',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '100',
      unitText: 'HOUR',
    },
  },
}

export default function BreweryTourTransportationPage() {
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
            <Beer className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Brewery Tour Transportation Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Explore Lake Ozarks craft breweries, wineries, and distilleries safely. Enjoy tastings without designated driver worries.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $100/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Brewery Tour
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Brewery Tours
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Drink Responsibly
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No designated driver needed! Everyone in your group can enjoy tastings and samples safely with professional drivers.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <MapPin className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Local Expertise
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Our drivers know the best breweries, hidden gem wineries, and optimal routes. Get insider recommendations and timing tips.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Perfect for Groups
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Whether it's a couples' getaway or large group outing, we have vehicles to keep everyone together for the fun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Brewery & Winery Tour Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Craft Brewery Tours</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Visit Lake Ozarks craft breweries and tap rooms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Winery Excursions</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Tour Missouri wineries with transportation and tastings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Distillery Visits</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Experience craft distilleries and spirits tastings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Custom Bar Crawls</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Multi-stop craft beverage tours tailored to your group
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Craft Beverage Stops
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Public House Brewing Company</li>
                  <li>• Lake of the Ozarks area wineries</li>
                  <li>• Local craft beer tap rooms</li>
                  <li>• Missouri distilleries and spirit makers</li>
                  <li>• Custom routes based on your taste preferences</li>
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
                  Choose your stops or let us recommend the best breweries
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Tour</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve your vehicle and confirm your brewery tour itinerary
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Enjoy Tastings</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Sample craft beers, wines, and spirits worry-free
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Professional driver gets everyone home safely
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Brewery Tour FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How many breweries or wineries can we visit in one tour?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Most brewery tours visit 3-4 stops over 4-6 hours. This allows time for tastings, tours, and enjoying the atmosphere without rushing. We can customize based on your pace and preferences.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you help plan the brewery tour route?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Our drivers know the Lake Ozarks craft beverage scene. We can recommend breweries based on your beer style preferences, suggest optimal routes, and advise on timing and reservations if needed.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring our own food or snacks on the tour?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We encourage bringing snacks and water for between stops. Many breweries also have food trucks or allow outside food. We provide coolers and can make restaurant stops if desired.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's the ideal group size for a brewery tour?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Brewery tours work great for groups of 4-20. Smaller groups can use our SUVs or vans, while larger groups enjoy our party buses which add to the fun with music and mood lighting.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we purchase bottles or growlers to take home?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Most breweries and wineries sell bottles, cans, and growlers. Our vehicles have secure storage for your purchases. We'll make sure everything gets home safely with you.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What happens if we want to stay longer at a particular stop?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We build flexibility into brewery tours. If your group is loving a particular brewery or winery, just let the driver know. We bill by the hour, so extending your time or adjusting the itinerary is no problem.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Craft Beer Lovers Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best brewery tour experience! Lake Ride Pros took our group of 10 to four amazing breweries around Lake of the Ozarks. The driver knew all the best spots, gave us great recommendations, and kept the vibe fun all day. No one had to miss out on tastings by being the DD. Perfect day!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Chris M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Craft Beer Enthusiast
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We booked Lake Ride Pros for a winery tour for my birthday. They helped us plan the perfect route, the party bus was awesome with great music, and we discovered some amazing Missouri wines. The driver was so accommodating when we wanted to extend our time at one winery. Will definitely book again!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Amanda K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Birthday Celebration
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Brewery Tour?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Safe, fun transportation to Lake Ozarks craft beverages
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $100/hour
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

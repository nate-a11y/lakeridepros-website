import type { Metadata } from 'next'
import { Wine, Shield, MapPin, Users, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wine Tour Transportation Lake of the Ozarks | Luxury Shuttle',
  description: 'Professional wine tour shuttle service at Lake of the Ozarks. Safe designated driver for winery tours, tasting rooms, and custom wine trail routes. Starting at $100/hour.',
  keywords: ['wine tour shuttle Lake Ozarks', 'winery transportation Missouri', 'Lake Ozarks wine tours', 'designated driver service', 'wine tasting transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/wine-tour-shuttle',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wine Tour Shuttle Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Wine Tour Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Luxury wine tour shuttle service with designated drivers for Lake of the Ozarks wineries and tasting rooms',
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

export default function WineTourShuttlePage() {
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
            <Wine className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Wine Tour Transportation at Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Sip, savor, and explore safely. Professional wine tour shuttle service with designated drivers for your tasting adventure.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $100/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Wine Tour
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Wine Tours
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Safe Designated Driver
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Enjoy your wine tasting worry-free. Our professional drivers ensure you get home safely after your tour.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <MapPin className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flexible Routes
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Create your perfect wine trail. Visit as many or as few wineries as you'd like on your custom route.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Local Expertise
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Our drivers know the best wineries, hidden gems, and perfect timing to make your tour unforgettable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Wine Tour Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Winery Shuttles</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Door-to-door transportation to Lake Ozarks wineries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Tasting Room Transport</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Safe rides between multiple tasting rooms and breweries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Custom Wine Trail Routes</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Personalized tours based on your wine preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Designated Driver Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Professional drivers for your entire wine tasting day
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Wineries & Tasting Rooms
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Seven Springs Winery & Vineyard</li>
                  <li>• Public House Brewing Company</li>
                  <li>• Local vineyards and craft breweries</li>
                  <li>• Seasonal tasting events</li>
                  <li>• Custom stops based on your preferences</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Choose Your Route</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Select wineries or let us create the perfect wine trail for you
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book Your Tour</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve your date and choose your vehicle size
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Sip & Savor</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy wine tasting while we handle all the driving
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Safe Return</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We get you home safely at the end of your tour
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Wine Tour FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How many wineries can we visit in one tour?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Most groups comfortably visit 3-4 wineries in a 4-6 hour tour. We recommend spending about 45-60 minutes at each location to fully enjoy the tasting experience. We can customize based on your preferences.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's included in the hourly rate?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our hourly rate includes professional driver, luxury vehicle, fuel, insurance, and complimentary water. Tasting fees at wineries are paid separately by guests. Minimum booking is typically 4 hours.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you recommend wineries for our group?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Our drivers are local experts who can recommend wineries based on your wine preferences, group size, and interests. We know which venues have the best tastings, food options, and atmosphere.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What size groups do you accommodate?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We have vehicles for groups of all sizes! Sprinter vans fit up to 14 guests (perfect for intimate wine tours), and larger buses accommodate groups of 20-56 for bigger celebrations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring wine purchases on the shuttle?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We have secure storage space for wine purchases. Many guests buy cases throughout the day, and we safely transport them back with you.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer wine tours year-round?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! While spring and fall are most popular for wine tours, we operate year-round. Winter wine tours offer a cozy, intimate experience, and summer tours can include beautiful vineyard views.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Wine Tour Guests Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Best wine tour experience ever! Our driver knew all the best spots and gave us great recommendations. We visited 4 wineries and never had to worry about driving. The sprinter van was super comfortable and luxurious. Worth every penny!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Amanda K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Wine Tour with Friends
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Lake Ride Pros made our anniversary wine tour absolutely perfect. Professional service, punctual, and our driver was so knowledgeable about the local wine scene. We bought several bottles and they kept them safe and cool all day. Highly recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Robert & Lisa M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Anniversary Wine Tour
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Wine Tour?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Luxury wine tour shuttle service with designated drivers
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $100/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Wine Tour
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

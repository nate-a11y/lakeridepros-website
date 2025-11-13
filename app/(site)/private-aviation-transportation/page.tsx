import type { Metadata } from 'next'
import { Plane, Shield, Clock, Award, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Private Aviation Ground Transportation Lake Ozarks | FBO Shuttle',
  description: 'Executive ground transportation for private jet travelers. Lee C Fine Airport, Grand Glaize FBO service. Professional drivers, luxury vehicles, discreet service.',
  keywords: ['private aviation Lake Ozarks', 'FBO ground transportation', 'private jet shuttle', 'Lee C Fine Airport', 'Grand Glaize Airport', 'executive aviation transport'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/private-aviation-transportation',
  },
  openGraph: {
    title: 'Private Aviation Ground Transportation | Lake Ride Pros',
    description: 'Executive ground transportation for private jet travelers at Lake of the Ozarks',
    url: 'https://www.lakeridepros.com/private-aviation-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Aviation Ground Transportation | Lake Ride Pros',
    description: 'Executive transportation for private jet travelers',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Private Aviation Ground Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Private Aviation Transportation',
  areaServed: {
    '@type': 'City',
    name: 'Lake of the Ozarks',
    containedIn: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  description: 'Executive ground transportation service for private aviation clients, FBO pickups, and luxury vehicle service at Lake of the Ozarks regional airports',
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

export default function PrivateAviationTransportationPage() {
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
              Private Aviation Ground Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Executive ground transportation for private jet travelers. Lee C Fine Airport, Grand Glaize FBO, regional aviation. Professional, discreet, always on time.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Premium Service: $200/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Executive Service
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Private Aviation Clients Choose Lake Ride Pros
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Discreet & Professional
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We understand privacy. Our drivers are professionally trained, background-checked, and experienced with high-net-worth clients and corporate executives.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  FBO Coordination
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We coordinate directly with Lee C Fine, Grand Glaize, and regional FBOs for seamless arrivals and departures. Your vehicle is waiting planeside when you land.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Award className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Luxury Fleet
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Immaculate executive SUVs, luxury sedans, and sprinter vans. Climate control, privacy screens, charging ports, and premium amenities for the discerning traveler.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Aviation Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">FBO Pickups & Drop-offs</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Direct coordination with Lee C Fine, Grand Glaize, and regional FBOs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Flight Crew Transportation</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Pilot and crew shuttle service between FBO, hotel, and dining
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Executive Transfers</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Lake homes, resorts, golf courses, marinas—door-to-door service
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Multi-Day Availability</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Weekend, week-long, or seasonal ground transportation packages
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Airports & FBOs We Service
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Lee C Fine Memorial Airport (KAIZ) - Osage Beach</li>
                  <li>• Grand Glaize-Osage Beach Airport (K15) - Osage Beach</li>
                  <li>• Columbia Regional Airport (COU) - 1 hour</li>
                  <li>• Springfield-Branson Airport (SGF) - 1.5 hours</li>
                  <li>• Kansas City (MCI) & St. Louis (STL) - Extended service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              The Lake Ride Pros Difference
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">We Know the Lake</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Not a national service—we're based at Lake of the Ozarks. Our drivers know every private residence, marina, resort, and back road. No GPS guessing, no missed turnoffs.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Planeside Greeting</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Your driver meets you at the aircraft with a name sign. Luggage assistance, climate-controlled vehicle waiting, and immediate departure to your destination.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Concierge-Level Service</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Need dinner reservations? Golf tee times? Marina coordination? We handle it. Think of us as your ground team—transportation plus local expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Private Aviation Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you coordinate directly with FBOs?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes. Provide your tail number, arrival time, and FBO, and we'll coordinate planeside pickup with the line service team. We're familiar with Lee C Fine and Grand Glaize operations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What types of vehicles are available?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For private aviation clients, we provide executive Suburbans, luxury sedans, and sprinter vans (up to 14 passengers). All vehicles are less than 3 years old, impeccably maintained, and equipped with premium amenities.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you provide multi-day or weekend packages?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely. Many clients book us for their entire Lake stay—airport arrival, local transportation throughout the weekend, and departure. We offer hourly, daily, and weekly packages with priority availability.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For guaranteed availability, book 48-72 hours ahead. For peak season weekends (Memorial Day through Labor Day), 1-2 weeks is ideal. Last-minute bookings often available—call (573) 206-9499.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide receipts for corporate billing?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes. All clients receive detailed invoices with trip information, dates, times, and itemized charges. Perfect for corporate expense reporting or client billing.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are your drivers background-checked and insured?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  All Lake Ride Pros drivers undergo extensive background checks, drug screening, and professional training. We maintain full commercial liability insurance exceeding industry standards. Confidentiality and discretion are paramount.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Aviation Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We fly into Lee C Fine several times per season. Lake Ride Pros coordinates perfectly with the FBO—vehicle is always waiting planeside, driver knows exactly where we're going. Professional, discreet, reliable. Exactly what we need."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Robert K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Private Aircraft Owner
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Used Lake Ride Pros for executive retreat transportation—picked up clients from Grand Glaize, shuttled between resort and golf course, handled all logistics flawlessly. Impressed our board members and made my job easy. Highly recommend."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Amanda T.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Corporate Event Planner
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Corporate Transportation", href: "/corporate-transportation", description: "Executive car service for business meetings" },
          { title: "Airport Shuttle", href: "/airport-shuttle", description: "Commercial airport transfers (MCI, STL, SGF)" },
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Luxury wedding guest transportation" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Executive Aviation Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-2">
              FBO coordination, planeside service, luxury vehicles
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Premium Service: $200/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Service
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

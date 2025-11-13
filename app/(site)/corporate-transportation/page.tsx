import type { Metadata } from 'next'
import { Briefcase, Clock, Shield, Award, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Corporate Transportation Lake of the Ozarks | Executive Business Travel',
  description: 'Professional corporate and executive transportation services at Lake of the Ozarks. Business meetings, conferences, and client entertainment. Starting at $150/hour.',
  keywords: ['corporate transportation Lake Ozarks', 'executive car service Missouri', 'business travel Lake Ozarks', 'corporate shuttle service', 'executive transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/corporate-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corporate & Executive Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Corporate Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional corporate and executive transportation services for business meetings, conferences, and client entertainment',
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

export default function CorporateTransportationPage() {
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
            <Briefcase className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Corporate & Executive Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Professional business transportation at Lake of the Ozarks. Impress clients, arrive on time, conduct business in comfort.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $150/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Corporate Service
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Corporate Travel
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Punctual & Reliable
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Guaranteed on-time service for meetings, conferences, and client entertainment. Your schedule is our priority.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Service
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Experienced chauffeurs in business attire. Discreet, courteous, and trained in corporate etiquette.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Award className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Executive Vehicles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Luxury sedans and SUVs with WiFi, charging ports, and privacy for confidential calls and work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Corporate Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Airport Transfers</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Executive car service to/from KC, STL, and Springfield airports
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Business Meetings</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Professional transportation to meetings and conferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Client Entertainment</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Impress clients with luxury transportation for dinners and events
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Corporate Events</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Group transportation for team building and corporate retreats
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Corporate Destinations
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Margaritaville Lake Resort (conferences & meetings)</li>
                  <li>• Lodge of Four Seasons (corporate events)</li>
                  <li>• Camden on the Lake (client entertainment)</li>
                  <li>• Lake Ozarks golf courses (business golf outings)</li>
                  <li>• Tan-Tar-A Resort (corporate retreats)</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Schedule Service</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Book online or call for recurring corporate accounts
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Confirm Details</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Receive confirmation with driver and vehicle information
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Professional Service</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy punctual, discreet executive transportation
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Expense Reports</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Receive detailed invoices for easy expense reporting
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Corporate Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer corporate accounts for regular service?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We offer corporate accounts with monthly billing, dedicated account managers, and priority booking for companies with regular transportation needs. Contact us to set up your corporate account.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What types of vehicles do you have for executive service?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our executive fleet includes luxury sedans (Lincoln Town Cars, Cadillac), premium SUVs (Suburban, Escalade), and executive vans for small groups. All vehicles are impeccably maintained and equipped with WiFi and charging ports.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can I make last-minute changes to my reservation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We understand business schedules change. We accommodate schedule changes whenever possible with advance notice. Call us directly at (573) 206-9499 for urgent changes.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide receipts for expense reports?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! All corporate clients receive detailed invoices with trip information, dates, times, and itemized charges. Perfect for expense reporting and accounting departments.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are your drivers trained in corporate etiquette?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely. All our chauffeurs are professionally trained, background-checked, and experienced in serving corporate clients. They understand discretion, confidentiality, and professional conduct.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can I work during the ride?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Our executive vehicles offer a quiet, professional environment perfect for working, taking calls, or preparing for meetings. WiFi available in all vehicles.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Business Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We use Lake Ride Pros for all our corporate events at Lake of the Ozarks. Their professionalism is unmatched - always on time, immaculate vehicles, and courteous drivers. They make a great impression on our clients every time."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  David P.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  VP Operations, Tech Company
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "As an executive who travels to Lake Ozarks frequently for business, Lake Ride Pros is my go-to service. WiFi lets me work en route, drivers are professional and discreet, and billing is seamless. Highly recommend for corporate travel."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Sarah M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Regional Director
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Corporate Travel?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Professional executive transportation for business success
            </p>
            <p className="text-white text-2xl font-bold mb-8">
              Starting at $150/hour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Corporate Service
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

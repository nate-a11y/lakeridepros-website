import type { Metadata } from 'next'
import { DollarSign, Phone, CheckCircle, Info, Clock, Users, MapPin } from 'lucide-react'
import Link from 'next/link'
import { PhoneLink } from '@/components/PhoneLink'

export const metadata: Metadata = {
  title: 'Pricing & Rates | Lake of the Ozarks Transportation | Lake Ride Pros',
  description: 'Transparent pricing for Lake of the Ozarks transportation. Airport shuttle rates, wedding packages, hourly rentals, party buses. No hidden fees. Get an instant quote!',
  keywords: [
    'Lake of the Ozarks transportation cost',
    'Lake Ozarks shuttle pricing',
    'airport shuttle rates Lake Ozarks',
    'wedding transportation cost',
    'party bus rental rates',
    'Lake Ride Pros pricing',
    'transportation rates Missouri',
    'Lake Ozarks limo pricing'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/pricing',
  },
  openGraph: {
    title: 'Pricing & Rates | Lake of the Ozarks Transportation',
    description: 'Transparent pricing for Lake of the Ozarks transportation. View our rates for airport shuttles, weddings, and events.',
    url: 'https://www.lakeridepros.com/pricing',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Lake of the Ozarks transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Transportation rates at Lake of the Ozarks vary by service type. Hourly rentals: Executive Sprinter $175/hr (tiered), Party Bus $130/hr (tiered), Mini Coach $275/hr flat. Airport shuttles and wedding packages are custom quoted based on distance, vehicle type, and guest count. All prices subject to 3% credit card processing fee. Contact us at (573) 206-9499 for exact quote.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are there any hidden fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No hidden fees at Lake Ride Pros. Our quotes include base transportation, fuel, estimated tolls (if applicable), insurance, and professional driver. The only additional charges may be gratuity (optional) or wait time beyond the agreed window. All potential costs are disclosed upfront.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you offer discounts for round-trip or multi-day bookings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We offer discounted rates for round-trip airport shuttles (typically 10-15% savings compared to two one-way trips), multi-day event packages, and large group bookings. Contact us for volume pricing and custom packages.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is included in your pricing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All Lake Ride Pros pricing includes: professional licensed driver, fuel, commercial insurance, vehicle maintenance, tolls on major routes, flight tracking (for airport service), and 24/7 dispatch support. Optional add-ons include decorations, special requests, and extended wait times.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I get an exact quote?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Call us at (573) 206-9499 or use our online booking form. Provide your pickup/dropoff locations, date, time, passenger count, and service type. We\'ll provide an instant quote with no obligation to book.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is "Stop the Clock" and how does it work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '"Stop the Clock" is our exclusive feature for hourly reservations that lets you pause the meter when you don\'t need the vehicle. After 2 hours into your reservation, you can pause for up to 4 hours ($200 flat fee, then $50/hour for additional time). Perfect for dinners, events, or downtime where you don\'t want to pay for idle vehicle time. Must be pre-planned at booking.'
      }
    }
  ]
}

export default function PricingPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-lrp-green to-lrp-green/80 py-16">
          <div className="container mx-auto px-4 text-center">
            <DollarSign className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="font-boardson text-4xl md:text-5xl font-bold text-white mb-4">
              Transparent Pricing for Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto">
              No hidden fees. No surprises. Just honest, upfront pricing for premium transportation services.
            </p>
          </div>
        </section>

        {/* Pricing Guarantee */}
        <section className="py-12 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-dark-bg-primary p-8 rounded-lg border-2 border-lrp-green">
              <h2 className="text-2xl font-bold text-lrp-black dark:text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-lrp-green" />
                Our Pricing Promise
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <CheckCircle className="w-6 h-6 text-lrp-green mx-auto mb-2" />
                  <p className="font-semibold text-lrp-black dark:text-white">No Hidden Fees</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">What we quote is what you pay</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-lrp-green mx-auto mb-2" />
                  <p className="font-semibold text-lrp-black dark:text-white">Price Match Guarantee</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">We'll match any local competitor</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-lrp-green mx-auto mb-2" />
                  <p className="font-semibold text-lrp-black dark:text-white">Free Quotes</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">No obligation, instant estimates</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stop the Clock Feature */}
        <section className="py-16 bg-gradient-to-br from-lrp-green to-lrp-green/80">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Clock className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Introducing "Stop the Clock" ⏱️
              </h2>
              <p className="text-white/90 text-xl mb-8">
                Our exclusive feature for hourly reservations — enjoy your event without paying for idle time
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-white/20">
                  <h3 className="text-xl font-bold text-white mb-3">How It Works</h3>
                  <ul className="space-y-3 text-left text-white/90">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>Available after 2 hours into your reservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>Pause the clock for up to 4 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>Must be pre-planned at booking time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                      <span>Service resumes when you're ready</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-white/20">
                  <h3 className="text-xl font-bold text-white mb-3">Pricing</h3>
                  <div className="space-y-4 text-left">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">$200</div>
                      <p className="text-white/90 text-sm">First up to 4 hours paused</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">$50<span className="text-lg">/hour</span></div>
                      <p className="text-white/90 text-sm">Each additional hour beyond 4</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Perfect For</h3>
                <div className="grid md:grid-cols-3 gap-4 text-white/90">
                  <div>
                    <p className="font-semibold text-white mb-1">Private Dinners</p>
                    <p className="text-sm">Enjoy dinner without paying for idle vehicle time</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Wedding Events</p>
                    <p className="text-sm">Pause during ceremony or cocktail hour</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Corporate Functions</p>
                    <p className="text-sm">Attend meetings while saving on hourly rates</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-white/90 text-sm">
                  <strong className="text-white">Example:</strong> Book a 6-hour reservation. Use the vehicle for 3 hours, "Stop the Clock" during a 2-hour private dinner ($200), then resume service for your return trip. You only pay for 4 hours of active service + $200 pause fee, instead of the full 6 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hourly Rental Rates */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-4">
              Hourly Rental Rates
            </h2>
            <p className="text-center text-gray-600 dark:text-lrp-gray mb-8 max-w-2xl mx-auto">
              Perfect for bar hopping, nightlife, local events, and flexible transportation needs
            </p>
            <p className="text-center text-sm text-gray-600 dark:text-lrp-gray mb-12 max-w-2xl mx-auto">
              <strong>Add "Stop the Clock"</strong> to any hourly reservation and pause your meter when you don't need the vehicle
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg">
                <Users className="w-10 h-10 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-2">Executive Sprinter</h3>
                <p className="text-gray-600 dark:text-lrp-gray text-sm mb-4">Up to 13 passengers</p>
                <div className="text-3xl font-bold text-lrp-green-dark dark:text-lrp-green mb-2">$175<span className="text-lg text-gray-600 dark:text-lrp-gray">/hour</span></div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">First 3-4 hrs: $175/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">After: $155/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">Premium executive seating</span>
                  </li>
                </ul>
              </div>

              <div className="bg-lrp-green p-8 rounded-lg text-white relative">
                <div className="absolute top-4 right-4 bg-white text-lrp-green text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <Users className="w-10 h-10 text-white mb-4" />
                <h3 className="text-xl font-bold mb-2">Party Bus</h3>
                <p className="text-white/90 text-sm mb-4">Up to 14 passengers</p>
                <div className="text-3xl font-bold mb-2">$130<span className="text-lg text-white/80">/hour</span></div>
                <p className="text-sm text-white/80 mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">First 3-4 hrs: $130/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">After: $110/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">LED lights & premium sound</span>
                  </li>
                </ul>
              </div>

              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg">
                <Users className="w-10 h-10 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-2">Mini Coach</h3>
                <p className="text-gray-600 dark:text-lrp-gray text-sm mb-4">Up to 37 passengers</p>
                <div className="text-3xl font-bold text-lrp-green-dark dark:text-lrp-green mb-2">$275<span className="text-lg text-gray-600 dark:text-lrp-gray">/hour</span></div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-4">2-hour minimum</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">Flat rate all hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">Large group capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray">Luggage space included</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-lrp-gray mt-8">
              <strong>Note:</strong> Weekend rates (Fri-Sun) have 4-hour minimums for Sprinter & Party Bus. Weekday minimums are 3 hours. All prices subject to 3% credit card processing fee.
            </p>
          </div>
        </section>

        {/* Airport Shuttle Rates */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-4">
              Airport Shuttle Pricing
            </h2>
            <p className="text-center text-gray-600 dark:text-lrp-gray mb-12 max-w-2xl mx-auto">
              Call for exact quotes — pricing varies by vehicle type, distance, and final destination
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg border-2 border-lrp-green">
                <MapPin className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Lee C Fine (AIZ)</h3>
                <div className="text-2xl font-bold text-lrp-green-dark dark:text-lrp-green mb-1">Call for Quote</div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-3">At Lake of the Ozarks</p>
                <p className="text-xs text-gray-600 dark:text-lrp-gray">Private aviation & FBO service</p>
              </div>

              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg border-2 border-lrp-green">
                <MapPin className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Kansas City (MCI)</h3>
                <div className="text-2xl font-bold text-lrp-green-dark dark:text-lrp-green mb-1">Call for Quote</div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-3">2.5-3 hours</p>
                <p className="text-xs text-gray-600 dark:text-lrp-gray">Flight tracking included</p>
              </div>

              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg border-2 border-lrp-green">
                <MapPin className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">St. Louis (STL)</h3>
                <div className="text-2xl font-bold text-lrp-green-dark dark:text-lrp-green mb-1">Call for Quote</div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-3">2-2.5 hours</p>
                <p className="text-xs text-gray-600 dark:text-lrp-gray">Delay adjustment included</p>
              </div>

              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg border-2 border-lrp-green">
                <MapPin className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Springfield (SGF)</h3>
                <div className="text-2xl font-bold text-lrp-green-dark dark:text-lrp-green mb-1">Call for Quote</div>
                <p className="text-sm text-gray-600 dark:text-lrp-gray mb-3">1.5-2 hours</p>
                <p className="text-xs text-gray-600 dark:text-lrp-gray">Round-trip discounts available</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-lrp-gray mt-8">
              Airport shuttle pricing based on distance, vehicle type, and passenger count. Rates vary by destination address. Call (573) 206-9499 for instant quote.
            </p>
          </div>
        </section>

        {/* Wedding Packages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-4">
              Wedding Transportation
            </h2>
            <p className="text-center text-gray-600 dark:text-lrp-gray mb-12 max-w-2xl mx-auto">
              Custom packages based on hourly rates, guest count, and venue logistics
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg">
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-4">Intimate Weddings</h3>
                <div className="text-3xl font-bold text-lrp-green-dark dark:text-lrp-green mb-4">Custom Quote</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Up to 14 guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Sprinter or Party Bus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">4-hour minimum (weekends)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Hotel-to-venue shuttles</span>
                  </li>
                </ul>
                <Link href="/book" className="block w-full text-center bg-lrp-green hover:bg-lrp-green/90 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  Get Quote
                </Link>
              </div>

              <div className="bg-lrp-green p-8 rounded-lg text-white relative border-4 border-lrp-green-light">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lrp-green-light text-lrp-green text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
                  MOST COMMON
                </div>
                <h3 className="text-xl font-bold mb-4">Standard Weddings</h3>
                <div className="text-3xl font-bold mb-4">Custom Quote</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">15-40 guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">2-3 vehicles coordinated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">Multiple venue shuttles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">Airport transfers available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90 text-sm">"Stop the Clock" option</span>
                  </li>
                </ul>
                <Link href="/book" className="block w-full text-center bg-white text-lrp-green hover:bg-lrp-gray px-6 py-3 rounded-lg font-semibold transition-all">
                  Get Quote
                </Link>
              </div>

              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg">
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-4">Large Weddings</h3>
                <div className="text-3xl font-bold text-lrp-green-dark dark:text-lrp-green mb-4">Custom Quote</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">50+ guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Multi-vehicle fleet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Continuous shuttle loops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Dedicated day-of coordinator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-lrp-gray text-sm">Full weekend packages</span>
                  </li>
                </ul>
                <PhoneLink className="block w-full text-center bg-lrp-green hover:bg-lrp-green/90 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  Call/Text for Quote
                </PhoneLink>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-lrp-gray mt-8">
              Wedding pricing based on hourly rates, vehicle type, guest count, and timeline. All packages include professional driver, fuel, insurance, and coordination. Call (573) 206-9499 for custom quote.
            </p>
          </div>
        </section>

        {/* Pricing Factors */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Affects Your Price?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <Info className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-3">Distance & Duration</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Longer distances and rental times naturally increase costs. Airport shuttles are priced by route, while local events are hourly. We optimize routes to keep your costs down.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <Users className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-3">Vehicle Type</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Larger vehicles cost more due to fuel, licensing, and maintenance. But per-person, they're often the best value. A 14-passenger limo bus is $150/hour ($10.71/person).
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <Clock className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-3">Peak vs. Off-Peak</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Summer weekends (May-September) and major events (Shootout, Bikefest) have higher demand. Book early for peak season. Off-season and weekday rates may be lower.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <MapPin className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-3">Special Requests</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Custom decorations, specific vehicle requests, or last-minute bookings may incur additional fees. We'll always disclose these upfront when you request a quote.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-4">
              What's Included in All Pricing
            </h2>
            <p className="text-center text-gray-600 dark:text-lrp-gray mb-12">
              Unlike rideshare services, here's what you get with every Lake Ride Pros booking
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">Professional Licensed Driver</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">DOT-compliant, background-checked, uniformed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">Fuel & Tolls</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">All fuel costs and major route tolls included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">Commercial Insurance</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">Full liability coverage for your protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">Flight Tracking (Airport Service)</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">Real-time monitoring, delay adjustment included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">24/7 Dispatch Support</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">Always available before, during, and after service</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-lrp-gray dark:bg-dark-bg-secondary rounded-lg">
                <CheckCircle className="w-5 h-5 text-lrp-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black dark:text-white">Clean, Maintained Vehicles</p>
                  <p className="text-sm text-gray-600 dark:text-lrp-gray">Inspected daily, professionally detailed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Pricing FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Lake of the Ozarks transportation cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Transportation rates at Lake of the Ozarks vary by service type. Airport shuttles from MCI start at $220, STL at $250. Hourly rentals for Sprinter vans start at $120/hour, limo buses at $150/hour. Wedding packages start at $600. Contact us at (573) 206-9499 for a custom quote.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are there any hidden fees?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  No hidden fees at Lake Ride Pros. Our quotes include base transportation, fuel, estimated tolls (if applicable), insurance, and professional driver. The only additional charges may be gratuity (optional) or wait time beyond the agreed window. All potential costs are disclosed upfront.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer discounts for round-trip or multi-day bookings?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We offer discounted rates for round-trip airport shuttles (typically 10-15% savings compared to two one-way trips), multi-day event packages, and large group bookings. Contact us for volume pricing and custom packages.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What is included in your pricing?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  All Lake Ride Pros pricing includes: professional licensed driver, fuel, commercial insurance, vehicle maintenance, tolls on major routes, flight tracking (for airport service), and 24/7 dispatch support. Optional add-ons include decorations, special requests, and extended wait times.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How do I get an exact quote?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Call us at (573) 206-9499 or use our online booking form. Provide your pickup/dropoff locations, date, time, passenger count, and service type. We'll provide an instant quote with no obligation to book.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg border-2 border-lrp-green">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-lrp-green" />
                  What is "Stop the Clock" and how does it work?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  "Stop the Clock" is our exclusive feature for hourly reservations that lets you pause the meter when you don't need the vehicle. After 2 hours into your reservation, you can pause for up to 4 hours for a flat fee of $200 (then $50/hour for additional time beyond 4 hours). This is perfect for private dinners, wedding ceremonies, corporate meetings, or any event where you don't want to pay for idle vehicle time. The pause must be pre-planned at booking time so we can staff and schedule accordingly. For example: Book a 6-hour reservation, use the vehicle for 3 hours, pause during a 2-hour dinner ($200), then resume service for your return trip — you only pay for 4 hours of active service + the $200 pause fee instead of the full 6 hours.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you price match competitors?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We offer a price match guarantee for legitimate local competitors providing the same service (vehicle type, coverage, licensing). Show us a written quote and we'll match or beat it while maintaining our premium service standards.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Is gratuity included or extra?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Gratuity is not included in our quoted rates and is optional. However, if you're satisfied with your driver's service, standard gratuity is 15-20% of the fare. You can add gratuity when booking or provide it directly to your driver.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What forms of payment do you accept?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We accept all major credit cards (Visa, MasterCard, Amex, Discover), debit cards, Venmo, Zelle, and cash. Payment can be made when booking online or by calling (573) 206-9499. Corporate accounts and invoicing available for business clients.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Your Free Quote?
            </h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              No obligation. Instant pricing. Book online or call us directly for a custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Get Instant Quote
              </Link>
              <PhoneLink
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                (573) 206-9499
              </PhoneLink>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

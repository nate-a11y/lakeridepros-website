import CorePage from '@/components/core-editorial/CorePage'
import CoreHero from '@/components/core-editorial/CoreHero'
import type { Metadata } from 'next'
import { Phone, CheckCircle, Info, Clock, Users, MapPin } from 'lucide-react'
import Link from 'next/link'
import { PhoneLink } from '@/components/PhoneLink'

export const metadata: Metadata = {
  title: 'Lake of the Ozarks Transportation Pricing | Lake Ride Pros',
  description: 'See transparent Lake of the Ozarks transportation rates for airport transfers, weddings, hourly service and party buses. Request your custom quote.',
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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Pricing' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Rates | Lake Ride Pros',
    description: 'Transparent pricing for Lake of the Ozarks transportation.',
    images: ['/og-image.jpg'],
  },
}

const transportationCostAnswer = 'Point-to-point sedan/SUV pricing starts with a flat package covering the first 5 miles: Flex $15, Elite $20, and LRP Black $25. The next 45 miles cost $2.25/$2.50/$2.90 per mile respectively; miles beyond 50 cost $1.85/$2.15/$2.60 per mile. No booking fee applies to Flex, Elite, or Black. Larger-vehicle base minimums are $80 for Limo Bus or Rescue Squad, $175 for Luxury Sprinter, $250 for Pink Patrol, and $400 for Luxury Shuttle, plus the applicable booking fee. These are minimum transportation charges, not flat fares for every route. Hourly rates are Flex $80/hr, Elite $100/hr, and Black $140/hr (1-hour minimum); Limo Bus and Rescue Squad start at $130/hr, Sprinter at $175/hr, Pink Patrol at $225/hr weekdays or $250/hr weekends, and Shuttle at $275/hr. See the hourly cards for larger-vehicle tiers and minimums. Vehicle positioning, extra stops, and other applicable charges are included in your final quote. Click Book Now on the Lake Ride Pros website to get an exact quote.'
const exactQuoteAnswer = 'Click Book Now on the Lake Ride Pros website to get a quote. Enter your pickup and dropoff locations, date, time, passenger count, and service type. You can review your quote with no obligation to book.'
const bookingFeeAnswer = 'Flex, Elite, and LRP Black have no booking fee. Limo Bus, Rescue Squad, and Luxury Sprinter have a $10 booking fee; Pink Patrol and Luxury Shuttle have a $20 booking fee. These fees are separate from the listed transportation rates and base minimums, and are included in your quote before you book.'
const transferPricingAnswer = 'For Flex, Elite, and Black, the first 5 miles are a flat package charge, not an extra fee on top of mileage. Only the miles after the first 5 are charged at the next tier, through total mile 50; the lower per-mile rate applies only to miles beyond 50. For example, a 10-mile Elite transfer has a $32.50 transportation charge: $20 for the first 5 miles plus 5 miles at $2.50. Larger-vehicle base minimums are a floor for the transportation charge, not a surcharge added to every mile. Vehicle positioning (travel to and from your trip), additional stops, and other applicable charges may increase the final quote.'
const fuelSurchargeAnswer = 'A fuel surcharge applies to all reservations. It is currently 5% and may change based on current fuel prices. The applicable surcharge is disclosed in your quote before you book.'
const pricingFeesAnswer = 'No hidden fees at Lake Ride Pros. Your quote includes transportation, a professional driver, insurance, estimated tolls (if applicable), and any applicable booking fee. A fuel surcharge applies to all reservations; it is currently 5% and may change with fuel prices. Credit card payments incur a 3% processing fee. Gratuity is not included in the listed rates, and extra wait time or requested add-ons may cost more. All applicable fees are disclosed before you book.'
const insiderSavingsAnswer = 'Join the Lake Ride Pros Insiders Program for member discounts on eligible rides and exclusive rewards. Savings depend on your membership tier and program terms.'
const creditCardFeeAnswer = 'Yes. Credit card payments incur a 3% processing fee, disclosed before you book. The listed transportation rates do not include this fee.'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Lake of the Ozarks transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: transportationCostAnswer
      }
    },
    {
      '@type': 'Question',
      name: 'How is point-to-point pricing calculated?',
      acceptedAnswer: { '@type': 'Answer', text: transferPricingAnswer }
    },
    {
      '@type': 'Question',
      name: 'Which vehicles have a booking fee?',
      acceptedAnswer: { '@type': 'Answer', text: bookingFeeAnswer }
    },
    {
      '@type': 'Question',
      name: 'Are there any hidden fees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: pricingFeesAnswer
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a fuel surcharge?',
      acceptedAnswer: { '@type': 'Answer', text: fuelSurchargeAnswer }
    },
    {
      '@type': 'Question',
      name: 'Is there a credit card processing fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: creditCardFeeAnswer
      }
    },
    {
      '@type': 'Question',
      name: 'How can I get discounted rates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: insiderSavingsAnswer
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
        text: 'All Lake Ride Pros pricing includes: professional licensed driver, commercial insurance, vehicle maintenance, flight tracking (for airport service), and 24/7 dispatch support. A fuel surcharge applies to all reservations (currently 5%, variable with fuel prices); applicable tolls and booking fees are disclosed in your quote. Optional add-ons include decorations, special requests, and extended wait times.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I get an exact quote?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: exactQuoteAnswer
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
    <CorePage>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <CoreHero image="suv">
            <h1 className="font-boardson text-4xl md:text-5xl font-bold text-white mb-4">
              Transparent Pricing for Lake of the Ozarks Transportation
            </h1>
            <p className="text-white text-xl max-w-3xl mx-auto">
              No hidden fees. No surprises. Just honest, upfront pricing for premium transportation services.
            </p>
          </CoreHero>

        {/* Pricing Guarantee */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white py-8 border-t border-lrp-green">
              <h2 className="text-2xl font-bold text-lrp-black mb-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[#2f730e]" />
                Our Pricing Promise
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <CheckCircle className="w-6 h-6 text-[#2f730e] mb-2" />
                  <p className="font-semibold text-lrp-black">No Hidden Fees</p>
                  <p className="text-sm text-gray-600">All charges disclosed before you book</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-[#2f730e] mb-2" />
                  <p className="font-semibold text-lrp-black">Licensed & Insured</p>
                  <p className="text-sm text-gray-600">Full commercial coverage</p>
                </div>
                <div>
                  <CheckCircle className="w-6 h-6 text-[#2f730e] mb-2" />
                  <p className="font-semibold text-lrp-black">Free Quotes</p>
                  <p className="text-sm text-gray-600">No obligation, instant estimates</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stop the Clock Feature - Compact Accordion */}
        <section id="stop-the-clock" className="py-8 bg-lrp-black scroll-mt-20">
          <div className="container mx-auto px-4">
            <details className="max-w-3xl mx-auto bg-white/10 border border-white/20 group">
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-4">
                  <Clock className="w-10 h-10 text-white flex-shrink-0" />
                  <div className="text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      "Stop the Clock" — Save on Hourly Rentals
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      Pause the meter during your event. <span className="font-semibold text-white">$200</span> for up to 4 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80 flex-shrink-0">
                  <span className="text-sm hidden sm:inline">Learn more</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>

              <div className="px-6 pb-6 pt-2 border-t border-white/20">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/10 p-4">
                    <h3 className="font-bold text-white mb-2">How It Works</h3>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                        <span>Available after 2 hours into your reservation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                        <span>Pause for up to 4 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                        <span>Must be pre-planned at booking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 p-4">
                    <h3 className="font-bold text-white mb-2">Pricing</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-2xl font-bold text-white">$200</span>
                        <span className="text-white/80 text-sm ml-2">first 4 hours paused</span>
                      </div>
                      <div>
                        <span className="text-xl font-bold text-white">$50</span>
                        <span className="text-white/80 text-sm ml-1">/hr after 4 hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-4 mb-4">
                  <h3 className="font-bold text-white mb-2">Perfect For</h3>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm text-white/90">
                    <div><span className="font-semibold text-white">Private Dinners</span> — don't pay for idle time</div>
                    <div><span className="font-semibold text-white">Weddings</span> — pause during ceremony</div>
                    <div><span className="font-semibold text-white">Corporate</span> — attend meetings, save money</div>
                  </div>
                </div>

                <p className="text-white/70 text-xs">
                  <strong className="text-white/90">Example:</strong> Book 6 hours, use 3, pause for a 2-hour dinner ($200), then finish your trip. Pay for 4 active hours + $200 instead of 6 hours.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* Point to Point Rates - Per Mile */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-4">
              Point to Point Rates
            </h2>
            <p className="text-left text-gray-600 mb-12 max-w-2xl mx-auto">
              First-five-mile packages, then per-mile pricing for sedans and SUVs. Point-to-point minimums for larger vehicles.
            </p>

            {/* Per-Mile Tiers */}
            <h3 className="text-xl font-bold text-lrp-black text-left mb-6">Sedans & SUVs (First 5 Miles + Mileage)</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {/* Flex */}
              <div className="bg-white py-6 border-t border-black/25">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-[#2f730e]" />
                  <span className="bg-lrp-black text-white text-xs font-bold px-2 py-0.5">FLEX</span>
                </div>
                <h4 className="font-bold text-lg text-lrp-black mb-1">Flex</h4>
                <p className="text-sm text-gray-600 mb-4">1-4 passengers</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">First 5 miles</span>
                    <span className="font-bold text-[#2f730e]">$15 flat</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Miles 6–50</span>
                    <span className="font-bold text-[#2f730e]">$2.25/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">After 50 miles</span>
                    <span className="font-bold text-[#2f730e]">$1.85/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Booking fee</span>
                    <span className="font-bold text-[#2f730e]">None</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xl font-bold text-[#2f730e]">$15 <span className="text-sm font-normal text-gray-600">minimum</span></div>
                </div>
              </div>

              {/* Elite */}
              <div className="bg-white py-6 border-t border-black/25">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-[#2f730e]" />
                  <span className="bg-lrp-black text-white text-xs font-bold px-2 py-0.5">ELITE</span>
                </div>
                <h4 className="font-bold text-lg text-lrp-black mb-1">Elite</h4>
                <p className="text-sm text-gray-600 mb-4">1-7 passengers</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">First 5 miles</span>
                    <span className="font-bold text-[#2f730e]">$20 flat</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Miles 6–50</span>
                    <span className="font-bold text-[#2f730e]">$2.50/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">After 50 miles</span>
                    <span className="font-bold text-[#2f730e]">$2.15/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Booking fee</span>
                    <span className="font-bold text-[#2f730e]">None</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xl font-bold text-[#2f730e]">$20 <span className="text-sm font-normal text-gray-600">minimum</span></div>
                </div>
              </div>

              {/* LRP Black */}
              <div className="bg-lrp-black p-6 border-2 border-black/25 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-primary-light" />
                  <span className="bg-black text-primary-light border border-black/25 text-xs font-bold px-2 py-0.5">LRP BLACK</span>
                </div>
                <h4 className="font-bold text-lg mb-1">LRP Black</h4>
                <p className="text-sm text-white/70 mb-4">1-6 passengers (Suburban)</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">First 5 miles</span>
                    <span className="font-bold text-primary-light">$25 flat</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Miles 6–50</span>
                    <span className="font-bold text-primary-light">$2.90/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">After 50 miles</span>
                    <span className="font-bold text-primary-light">$2.60/mi</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Booking fee</span>
                    <span className="font-bold text-primary-light">None</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="text-xl font-bold text-primary-light">$25 <span className="text-sm font-normal text-white/70">minimum</span></div>
                  <p className="text-xs text-white/70 mt-2">Select beverages included. 24hr advance booking required.</p>
                </div>
              </div>
            </div>

            {/* Insider Savings Callout */}
            <div className="max-w-4xl mx-auto mb-12 p-6 bg-lrp-black text-white">
              <h3 className="text-xl font-bold mb-4 text-left">Looking for Discounted Rates?</h3>
              <p className="text-white/90 mb-4">
                Join the Lake Ride Pros Insiders Program for member discounts on eligible rides and exclusive rewards. Savings depend on your membership tier and program terms.
              </p>
              <Link
                href="/insider-membership-benefits"
                className="inline-flex items-center justify-center bg-white px-6 py-3 font-semibold text-lrp-black hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Sign Up for the Insiders Program
              </Link>
            </div>

            {/* Larger Vehicle Point-to-Point Minimums */}
            <h3 className="text-xl font-bold text-lrp-black text-left mb-6">Larger Vehicles (Point-to-Point Minimums)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Limo Bus */}
              <div className="bg-white py-6 border-t border-lrp-green">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h4 className="font-bold text-lg text-lrp-black mb-1">Limo Bus</h4>
                <p className="text-sm text-gray-600 mb-3">1-14 passengers</p>
                <div className="text-2xl font-bold text-[#2f730e] mb-1">$80 <span className="text-sm font-normal text-gray-600">base minimum</span></div>
                <p className="text-xs text-gray-600">$10 booking fee · from $90 before other charges</p>
              </div>

              {/* Rescue Squad */}
              <div className="bg-white py-6 border-t border-lrp-green">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h4 className="font-bold text-lg text-lrp-black mb-1">Rescue Squad</h4>
                <p className="text-sm text-gray-600 mb-3">1-14 passengers</p>
                <div className="text-2xl font-bold text-[#2f730e] mb-1">$80 <span className="text-sm font-normal text-gray-600">base minimum</span></div>
                <p className="text-xs text-gray-600">$10 booking fee · from $90 before other charges</p>
              </div>

              {/* Luxury Sprinter */}
              <div className="bg-white py-6 border-t border-lrp-green">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h4 className="font-bold text-lg text-lrp-black mb-1">Luxury Sprinter</h4>
                <p className="text-sm text-gray-600 mb-3">1-13 passengers</p>
                <div className="text-2xl font-bold text-[#2f730e] mb-1">$175 <span className="text-sm font-normal text-gray-600">base minimum</span></div>
                <p className="text-xs text-gray-600">$10 booking fee · from $185 before other charges</p>
              </div>

              {/* Pink Patrol */}
              <div className="bg-white py-6 border-t border-black/25">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h4 className="font-bold text-lg text-lrp-black mb-1">Pink Patrol</h4>
                <p className="text-sm text-gray-600 mb-3">1-23 passengers</p>
                <div className="text-2xl font-bold text-[#2f730e] mb-1">$250 <span className="text-sm font-normal text-gray-600">base minimum</span></div>
                <p className="text-xs text-gray-600">$20 booking fee · from $270 before other charges</p>
              </div>

              {/* Luxury Shuttle */}
              <div className="bg-white py-6 border-t border-lrp-green">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h4 className="font-bold text-lg text-lrp-black mb-1">Luxury Shuttle</h4>
                <p className="text-sm text-gray-600 mb-3">1-37 passengers</p>
                <div className="text-2xl font-bold text-[#2f730e] mb-1">$400 <span className="text-sm font-normal text-gray-600">base minimum</span></div>
                <p className="text-xs text-gray-600">$20 booking fee · from $420 before other charges</p>
              </div>
            </div>

            <p className="text-left text-sm text-gray-600 mt-8">
              Base minimums are not flat trip fares. Distance, vehicle positioning, and other applicable charges may increase your quote. Transportation includes a professional driver and insurance. All reservations have a fuel surcharge, currently 5%, which may change with fuel prices. <Link href="/book" className="text-[#2f730e] hover:underline">Book Now</Link> for exact pricing.
            </p>
          </div>
        </section>

        {/* Hourly Rental Rates */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-4">
              Hourly Rental Rates
            </h2>
            <p className="text-left text-gray-600 mb-8 max-w-2xl mx-auto">
              Perfect for bar hopping, nightlife, local events, and flexible transportation needs
            </p>
            <p className="text-left text-sm text-gray-600 mb-12 max-w-2xl mx-auto">
              <strong>Add "Stop the Clock"</strong> to any hourly reservation and pause your meter when you don't need the vehicle
            </p>

            {/* Sedans & SUVs - Flat Hourly */}
            <h3 className="text-xl font-bold text-lrp-black text-left mb-6">Sedans & SUVs (Hourly Rates)</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {/* Flex */}
              <div className="bg-white py-6 border-t border-black/25">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-[#2f730e]" />
                  <span className="bg-lrp-black text-white text-xs font-bold px-2 py-0.5">FLEX</span>
                </div>
                <h4 className="text-xl font-bold text-lrp-black mb-2">Flex</h4>
                <p className="text-gray-600 text-sm mb-4">1-4 passengers</p>
                <div className="text-3xl font-bold text-[#2f730e] mb-2">$80<span className="text-lg text-gray-600">/hour</span></div>
                <p className="text-sm text-gray-600 mb-4">1-hour minimum</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Same hourly rate for every hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sedans & small SUVs</span>
                  </li>
                </ul>
              </div>

              {/* Elite */}
              <div className="bg-white py-6 border-t border-black/25">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-[#2f730e]" />
                  <span className="bg-lrp-black text-white text-xs font-bold px-2 py-0.5">ELITE</span>
                </div>
                <h4 className="text-xl font-bold text-lrp-black mb-2">Elite</h4>
                <p className="text-gray-600 text-sm mb-4">1-7 passengers</p>
                <div className="text-3xl font-bold text-[#2f730e] mb-2">$100<span className="text-lg text-gray-600">/hour</span></div>
                <p className="text-sm text-gray-600 mb-4">1-hour minimum</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Same hourly rate for every hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Larger SUVs</span>
                  </li>
                </ul>
              </div>

              {/* LRP Black */}
              <div className="bg-lrp-black p-6 text-white border-2 border-black/25">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6 text-primary-light" />
                  <span className="bg-black text-primary-light border border-black/25 text-xs font-bold px-2 py-0.5">LRP BLACK</span>
                </div>
                <h4 className="text-xl font-bold mb-2">LRP Black</h4>
                <p className="text-white/70 text-sm mb-4">1-6 passengers (Suburban)</p>
                <div className="text-3xl font-bold text-primary-light mb-2">$140<span className="text-lg text-white/70">/hour</span></div>
                <p className="text-sm text-white/70 mb-4">1-hour minimum</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary-light mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Beverages included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary-light mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">24hr advance required</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Larger Vehicles - Tiered Hourly */}
            <h3 className="text-xl font-bold text-lrp-black text-left mb-6">Larger Vehicles (Hourly Rates & Minimums)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Limo Bus */}
              <div className="bg-lrp-black p-8 text-white relative">
                <div className="absolute top-4 right-4 bg-white text-[#2f730e] text-xs font-bold px-3 py-1">
                  MOST POPULAR
                </div>
                <Users className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold mb-2">Limo Bus</h4>
                <p className="text-white text-sm mb-4">1-14 passengers</p>
                <div className="text-3xl font-bold mb-2">$130<span className="text-lg text-white">/hour</span></div>
                <p className="text-sm text-white mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white">First 3 hrs: $130/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white">After 3 hrs: $110/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white">LED lights & premium sound</span>
                  </li>
                </ul>
              </div>

              {/* Rescue Squad */}
              <div className="bg-white py-8">
                <Users className="w-10 h-10 text-[#2f730e] mb-4" />
                <h4 className="text-xl font-bold text-lrp-black mb-2">Rescue Squad</h4>
                <p className="text-gray-600 text-sm mb-4">1-14 passengers</p>
                <div className="text-3xl font-bold text-[#2f730e] mb-2">$130<span className="text-lg text-gray-600">/hour</span></div>
                <p className="text-sm text-gray-600 mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">First 3 hrs: $130/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">After 3 hrs: $110/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Unique party vehicle</span>
                  </li>
                </ul>
              </div>

              {/* Luxury Sprinter */}
              <div className="bg-white py-8">
                <Users className="w-10 h-10 text-[#2f730e] mb-4" />
                <h4 className="text-xl font-bold text-lrp-black mb-2">Luxury Sprinter</h4>
                <p className="text-gray-600 text-sm mb-4">1-13 passengers</p>
                <div className="text-3xl font-bold text-[#2f730e] mb-2">$175<span className="text-lg text-gray-600">/hour</span></div>
                <p className="text-sm text-gray-600 mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">First 3 hrs: $175/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">After 3 hrs: $155/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Premium executive seating</span>
                  </li>
                </ul>
              </div>

              {/* Pink Patrol */}
              <div className="bg-lrp-black p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white text-[#2f730e] text-xs font-bold px-3 py-1">
                  NEW
                </div>
                <Users className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold mb-2">Pink Patrol</h4>
                <p className="text-white text-sm mb-4">1-23 passengers</p>
                <div className="text-3xl font-bold mb-2">$225<span className="text-lg text-white">/hour</span></div>
                <p className="text-sm text-white mb-4">3-hour minimum (4 hours weekends)</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Weekdays: first 3 hrs $225/hr; then $200/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Weekends: first 4 hrs $250/hr; then $225/hr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">23-passenger party bus</span>
                  </li>
                </ul>
              </div>

              {/* Luxury Shuttle */}
              <div className="bg-white py-8">
                <Users className="w-10 h-10 text-[#2f730e] mb-4" />
                <h4 className="text-xl font-bold text-lrp-black mb-2">Luxury Shuttle</h4>
                <p className="text-gray-600 text-sm mb-4">1-37 passengers</p>
                <div className="text-3xl font-bold text-[#2f730e] mb-2">$275<span className="text-lg text-gray-600">/hour</span></div>
                <p className="text-sm text-gray-600 mb-4">2-hour minimum</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Same hourly rate for every hour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Large group capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Luggage space included</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-left text-sm text-gray-600 mt-8">
              <strong>Note:</strong> Weekend rates (Fri-Sun) have 4-hour minimums for Limo Bus, Rescue Squad, Sprinter, and Pink Patrol. Weekday minimums are 3 hours. The tier changes after 3 hours for Limo Bus, Rescue Squad, and Sprinter even when the weekend minimum is 4 hours. Shuttle has a 2-hour minimum every day. Booking fees: $10 for Bus, Rescue, and Sprinter; $20 for Pink Patrol and Shuttle. Flex, Elite, and Black have no booking fee. All reservations have a fuel surcharge, currently 5%, which may change with fuel prices. Credit card payments incur a 3% processing fee, disclosed before you book.
            </p>
          </div>
        </section>

        {/* Airport Shuttle Rates */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-4">
              Airport Shuttle Pricing
            </h2>
            <p className="text-left text-gray-600 mb-12 max-w-2xl mx-auto">
              Click Book Now to get a quote online — pricing varies by vehicle type, distance, and final destination
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white py-6 border-t border-lrp-green">
                <MapPin className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-2">Lee C Fine (AIZ)</h3>
                <Link href="/book" className="text-2xl font-bold text-[#2f730e] mb-1 hover:underline block">Book Now</Link>
                <p className="text-sm text-gray-600 mb-3">At Lake of the Ozarks</p>
                <p className="text-xs text-gray-600">Private aviation & FBO service</p>
              </div>

              <div className="bg-white py-6 border-t border-lrp-green">
                <MapPin className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-2">Kansas City (MCI)</h3>
                <Link href="/book" className="text-2xl font-bold text-[#2f730e] mb-1 hover:underline block">Book Now</Link>
                <p className="text-sm text-gray-600 mb-3">2.5-3 hours</p>
                <p className="text-xs text-gray-600">Flight tracking included</p>
              </div>

              <div className="bg-white py-6 border-t border-lrp-green">
                <MapPin className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-2">St. Louis (STL)</h3>
                <Link href="/book" className="text-2xl font-bold text-[#2f730e] mb-1 hover:underline block">Book Now</Link>
                <p className="text-sm text-gray-600 mb-3">2-2.5 hours</p>
                <p className="text-xs text-gray-600">Delay adjustment included</p>
              </div>

              <div className="bg-white py-6 border-t border-lrp-green">
                <MapPin className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-2">Springfield (SGF)</h3>
                <Link href="/book" className="text-2xl font-bold text-[#2f730e] mb-1 hover:underline block">Book Now</Link>
                <p className="text-sm text-gray-600 mb-3">1.5-2 hours</p>
                <p className="text-xs text-gray-600">Round-trip discounts available</p>
              </div>
            </div>
            <p className="text-left text-sm text-gray-600 mt-8">
              Airport shuttle pricing based on distance, vehicle type, and passenger count. Rates vary by destination address. Click Book Now to get a quote through the Lake Ride Pros website.
            </p>
          </div>
        </section>

        {/* Wedding Packages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-4">
              Wedding Transportation
            </h2>
            <p className="text-left text-gray-600 mb-12 max-w-2xl mx-auto">
              Custom packages based on hourly rates, guest count, and venue logistics
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white py-8">
                <h3 className="text-xl font-bold text-lrp-black mb-4">Intimate Weddings</h3>
                <Link href="/book" className="text-3xl font-bold text-[#2f730e] mb-4 hover:underline block">Custom Quote</Link>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Up to 14 guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Sprinter or Party Bus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">4-hour minimum (weekends)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Hotel-to-venue shuttles</span>
                  </li>
                </ul>
                <Link href="/book" className="block w-full text-left bg-[#2f730e] hover:bg-[#24580b] text-white px-6 py-3 font-semibold transition-all">
                  Book Now
                </Link>
              </div>

              <div className="bg-lrp-black p-8 text-white relative border-t-4 border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lrp-green-light text-lrp-black text-xs font-bold px-4 py-2 whitespace-nowrap">
                  MOST COMMON
                </div>
                <h3 className="text-xl font-bold mb-4">Standard Weddings</h3>
                <Link href="/book" className="text-3xl font-bold mb-4 hover:underline block">Custom Quote</Link>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">15-40 guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">2-3 vehicles coordinated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">Multiple venue shuttles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">Airport transfers available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-white text-sm">"Stop the Clock" option</span>
                  </li>
                </ul>
                <Link href="/book" className="block w-full text-left bg-white text-[#2f730e] hover:bg-white px-6 py-3 font-semibold transition-all">
                  Book Now
                </Link>
              </div>

              <div className="bg-white py-8">
                <h3 className="text-xl font-bold text-lrp-black mb-4">Large Weddings</h3>
                <Link href="/book" className="text-3xl font-bold text-[#2f730e] mb-4 hover:underline block">Custom Quote</Link>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">50+ guests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Multi-vehicle fleet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Continuous shuttle loops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Dedicated day-of coordinator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Full weekend packages</span>
                  </li>
                </ul>
                <Link href="/book" className="block w-full text-left bg-[#2f730e] hover:bg-[#24580b] text-white px-6 py-3 font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-green">
                  Book Now
                </Link>
              </div>
            </div>
            <p className="text-left text-sm text-gray-600 mt-8">
              Wedding pricing based on hourly rates, vehicle type, guest count, and timeline. All packages include a professional driver, insurance, and coordination. A fuel surcharge applies to all reservations (currently 5%, subject to fuel prices). Additional discounted services available through our trusted referral partners. Click Book Now to request your custom quote through the Lake Ride Pros website.
            </p>
          </div>
        </section>

        {/* Pricing Factors */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-12">
              What Affects Your Price?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white py-6">
                <Info className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-3">Distance & Duration</h3>
                <p className="text-gray-700 text-sm">
                  Longer distances and rental times naturally increase costs. Airport shuttles are priced by route, while local events are hourly. We optimize routes to keep your costs down.
                </p>
              </div>
              <div className="bg-white py-6">
                <Users className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-3">Vehicle Type</h3>
                <p className="text-gray-700 text-sm">
                  Larger vehicles cost more due to fuel, licensing, and maintenance. But per-person, they're often the best value. A 14-passenger limo bus is $130/hour ($9.29/person).
                </p>
              </div>
              <div className="bg-white py-6">
                <Clock className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-3">Peak vs. Off-Peak</h3>
                <p className="text-gray-700 text-sm">
                  Summer weekends (May-September) and major events (Shootout, Bikefest) have higher demand. Book early for peak season. Off-season and weekday rates may be lower.
                </p>
              </div>
              <div className="bg-white py-6">
                <MapPin className="w-8 h-8 text-[#2f730e] mb-3" />
                <h3 className="font-bold text-lg text-lrp-black mb-3">Special Requests</h3>
                <p className="text-gray-700 text-sm">
                  Custom decorations, specific vehicle requests, or last-minute bookings may incur additional fees. We'll always disclose these upfront when you request a quote.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-4">
              What's Included in All Pricing
            </h2>
            <p className="text-left text-gray-600 mb-12">
              Unlike rideshare services, here's what you get with every Lake Ride Pros booking
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">Professional Licensed Driver</p>
                  <p className="text-sm text-gray-600">DOT-compliant, background-checked, uniformed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">Fuel & Tolls</p>
                  <p className="text-sm text-gray-600">Fuel surcharge currently 5% (variable); applicable tolls disclosed in your quote</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">Commercial Insurance</p>
                  <p className="text-sm text-gray-600">Full liability coverage for your protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">Flight Tracking (Airport Service)</p>
                  <p className="text-sm text-gray-600">Real-time monitoring, delay adjustment included</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">24/7 Dispatch Support</p>
                  <p className="text-sm text-gray-600">Always available before, during, and after service</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white">
                <CheckCircle className="w-5 h-5 text-[#2f730e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lrp-black">Clean, Maintained Vehicles</p>
                  <p className="text-sm text-gray-600">Inspected daily, professionally detailed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black text-left mb-12">
              Pricing FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  How much does Lake of the Ozarks transportation cost?
                </summary>
                <p className="text-gray-700 mt-4">
                  {transportationCostAnswer}
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  How is point-to-point pricing calculated?
                </summary>
                <p className="text-gray-700 mt-4">{transferPricingAnswer}</p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Which vehicles have a booking fee?
                </summary>
                <p className="text-gray-700 mt-4">{bookingFeeAnswer}</p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Are there any hidden fees?
                </summary>
                <p className="text-gray-700 mt-4">
                  {pricingFeesAnswer}
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Is there a fuel surcharge?
                </summary>
                <p className="text-gray-700 mt-4">{fuelSurchargeAnswer}</p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Is there a credit card processing fee?
                </summary>
                <p className="text-gray-700 mt-4">
                  {creditCardFeeAnswer}
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  How can I get discounted rates?
                </summary>
                <p className="text-gray-700 mt-4">
                  {insiderSavingsAnswer}
                  {' '}<Link href="/insider-membership-benefits" className="text-[#2f730e] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-green">Sign up for the Insiders Program</Link>.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Do you offer discounts for round-trip or multi-day bookings?
                </summary>
                <p className="text-gray-700 mt-4">
                  Yes! We offer discounted rates for round-trip airport shuttles (typically 10-15% savings compared to two one-way trips), multi-day event packages, and large group bookings. Contact us for volume pricing and custom packages.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  What is included in your pricing?
                </summary>
                <p className="text-gray-700 mt-4">
                  All Lake Ride Pros pricing includes: professional licensed driver, commercial insurance, vehicle maintenance, flight tracking (for airport service), and 24/7 dispatch support. A fuel surcharge applies to all reservations (currently 5%, variable with fuel prices); applicable tolls and booking fees are disclosed in your quote. Optional add-ons include decorations, special requests, and extended wait times.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  How do I get an exact quote?
                </summary>
                <p className="text-gray-700 mt-4">
                  {exactQuoteAnswer}
                </p>
                <Link href="/book" className="mt-4 inline-flex bg-[#2f730e] px-6 py-3 font-semibold text-white hover:bg-[#24580b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrp-green">
                  Book Now
                </Link>
              </details>

              <details className="bg-white py-6 border-t border-lrp-green">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#2f730e]" />
                  What is "Stop the Clock" and how does it work?
                </summary>
                <p className="text-gray-700 mt-4">
                  "Stop the Clock" is our exclusive feature for hourly reservations that lets you pause the meter when you don't need the vehicle. After 2 hours into your reservation, you can pause for up to 4 hours for a flat fee of $200 (then $50/hour for additional time beyond 4 hours). This is perfect for private dinners, wedding ceremonies, corporate meetings, or any event where you don't want to pay for idle vehicle time. The pause must be pre-planned at booking time so we can staff and schedule accordingly. For example: Book a 6-hour reservation, use the vehicle for 3 hours, pause during a 2-hour dinner ($200), then resume service for your return trip — you only pay for 4 hours of active service + the $200 pause fee instead of the full 6 hours.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Do you price match competitors?
                </summary>
                <p className="text-gray-700 mt-4">
                  Nope! We've found that price matching often means service matching, and we're not willing to go there. Our vehicles are newer, our drivers are more experienced, and our dispatch actually answers the phone. Some things are worth paying for—like not ending up stranded at the airport because someone saved $20.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  Is gratuity included or extra?
                </summary>
                <p className="text-gray-700 mt-4">
                  Gratuity is not included in our quoted rates but is appreciated for great service. Standard gratuity is 20-25% of the fare, with 20% as the minimum selection when booking online. You can also select a custom amount or tip your driver directly in cash.
                </p>
              </details>

              <details className="bg-white py-6">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black">
                  What forms of payment do you accept?
                </summary>
                <p className="text-gray-700 mt-4">
                  We accept all major credit cards (Visa, MasterCard, Amex, Discover), debit cards, Venmo, Zelle, and cash. Payment can be made when booking online or by calling (573) 206-9499. Credit card payments incur a 3% processing fee. Corporate accounts and invoicing available for business clients.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Your Free Quote?
            </h2>
            <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
              Click Book Now to get a quote through the Lake Ride Pros website. Review your pricing with no obligation to book.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-[#2f730e] hover:bg-white px-10 py-4 font-bold text-lg transition-all"
              >
                Book Now
              </Link>
              <PhoneLink
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-light px-10 py-4 font-bold text-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                (573) 206-9499
              </PhoneLink>
            </div>
          </div>
        </section>
      </div>
    </CorePage>
  )
}

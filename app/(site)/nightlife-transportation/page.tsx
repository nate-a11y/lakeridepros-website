import type { Metadata } from 'next'
import { PartyPopper, Shield, Users, Clock, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lake Ozarks Party Bus & Nightlife Transportation | Safe Rides',
  description: 'The Lake\'s #1 party bus rental. Bagnell Dam Strip bar hopping, bachelor/bachelorette parties, nightlife shuttles. Professional drivers, luxury buses, safe rides home.',
  keywords: ['Lake Ozarks party bus', 'Bagnell Dam Strip transportation', 'bar hopping Lake Ozarks', 'bachelor party bus', 'bachelorette party Lake Ozarks', 'safe ride home', 'nightlife transportation'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/nightlife-transportation',
  },
  openGraph: {
    title: 'Lake Ozarks Party Bus & Nightlife Transportation',
    description: 'Professional party bus and nightlife transportation. Bagnell Dam Strip bar hopping, safe rides home.',
    url: 'https://www.lakeridepros.com/nightlife-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake Ozarks Party Bus & Nightlife Transportation',
    description: 'Safe, fun nightlife transportation at Lake of the Ozarks',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Nightlife & Party Bus Transportation',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Party Bus Rental',
  areaServed: {
    '@type': 'City',
    name: 'Lake of the Ozarks',
    containedIn: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  description: 'Premium party bus and nightlife transportation for Bagnell Dam Strip bar hopping, bachelor/bachelorette parties, and group nights out',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      price: '120',
      unitText: 'HOUR',
    },
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a party bus cost at Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Party bus rentals at Lake of the Ozarks start at $120/hour for vehicles holding 14-30 passengers. Rates include professional driver, fuel, and insurance. Most groups book 4-6 hour packages for bar hopping on the Bagnell Dam Strip.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the safest way to bar hop on Bagnell Dam Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Book a Lake Ride Pros party bus or shuttle for Bagnell Dam Strip bar hopping. Our professional drivers know every venue, keep your group together, and ensure everyone gets home safely. Nobody needs to be the designated driver.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate bachelor and bachelorette parties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Bachelor and bachelorette parties are one of our specialties. Our party buses hold 14-30 people, feature premium sound systems and LED lighting, and include coolers for your beverages. We handle all the driving so everyone can celebrate.'
      }
    }
  ]
}

export default function NightlifeTransportationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <PartyPopper className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Party Bus & Nightlife Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Bagnell Dam Strip. Backwater Jack's. Dog Days. Shady Gators. We know every bar, every venue, every back alley. Your group stays together. Everyone gets home safe. Zero DUIs.
            </p>
            <div className="mb-8">
              <p className="text-white text-2xl font-bold">Starting at $120/hour</p>
            </div>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Safe Ride Home
            </a>
          </div>
        </section>

        {/* Why You Need This */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Every Lake Ozarks Night Out Needs a Party Bus
            </h2>
            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Nobody Draws the Short Straw</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No designated driver. No "I'll only have two drinks." Everyone parties. Our professional drivers handle navigation, parking, and getting your crew home safe.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">The Group STAYS Together</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Ever lost half your group between bars? Waited 30 minutes for an Uber with no AC? Not happening. Our party bus holds 14-30 people. Door-to-door service. Nobody gets left behind.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">DUI? Not on Our Watch.</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Missouri DUI fines start at $500. Legal fees? $5,000+. A party bus costs $120/hour. Do the math. Plus, you keep your license, your job, and your dignity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What You Get
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Professional Drivers</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Licensed, insured, background-checked. They know every bar, every route, every shortcut.
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">14-30 Passengers</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Spacious party buses with premium seating, LED lighting, sound systems, and coolers.
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Flexible Hours</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  4-hour, 6-hour, or all-night packages. Start when you want, end when you're done.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Most Popular Bar Hopping Routes
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">The Bagnell Dam Strip Classic</h3>
                <p className="text-gray-700 dark:text-lrp-gray mb-3">Backwater Jack's → Shady Gators → Dog Days → Paradise Tropical Restaurant</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for bachelor/bachelorette parties. 4-hour package recommended.</p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">The Lakefront Crawl</h3>
                <p className="text-gray-700 dark:text-lrp-gray mb-3">Jolly Rogers → Franky & Louie's → Redhead Lakeside Grill → JB Hooks</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dinner + drinks tour. 5-hour package popular for corporate outings.</p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">The Full Send</h3>
                <p className="text-gray-700 dark:text-lrp-gray mb-3">Custom route, all night, multiple stops. You choose the bars.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">6-8 hour package for groups that go hard. Most popular Friday/Saturday nights.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Party Bus FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does a party bus cost at Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Party bus rentals start at $120/hour for vehicles holding 14-30 passengers. Rates include professional driver, fuel, and insurance. Most groups book 4-6 hour packages for bar hopping on the Bagnell Dam Strip.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate bachelor and bachelorette parties?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Bachelor and bachelorette parties are one of our specialties. Our party buses hold 14-30 people, feature premium sound systems and LED lighting, and include coolers for your beverages. We handle all the driving so everyone can celebrate.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Are alcoholic beverages allowed on the party bus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Passengers 21+ can bring alcoholic beverages onboard our party buses. We provide coolers and ice. Please drink responsibly and follow all Missouri open container laws.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you service the Bagnell Dam Strip?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! The Bagnell Dam Strip is our most popular nightlife destination. We know every bar, parking situation, and the best routes to keep your party moving smoothly between venues.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  For weekend nights (Friday-Saturday) during peak season (May-September), book 2-4 weeks ahead. For weeknight or off-season parties, we can often accommodate last-minute bookings. Call us at (573) 206-9499 for availability.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What happens if someone gets too drunk?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our drivers are trained to handle all situations professionally. If someone becomes ill or overly intoxicated, we'll get them home safely. We prioritize everyone's safety and comfort throughout the night.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Party Groups Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Booked Lake Ride Pros for my bachelor party - best decision ever! Hit every bar on the Strip, nobody had to drive, and everyone made it home in one piece. Driver was cool as hell and knew all the best spots. 10/10 would party again."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Mike T.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Bachelor Party
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We do an annual girls trip to the Lake and always book Lake Ride Pros for our bar hopping night. No fighting over who's the DD, no expensive Ubers, just pure fun. The party bus has great vibes and our driver waits for us at every stop. Worth every penny!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jessica R.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Girls Weekend
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Night Out?
            </h2>
            <p className="text-white/90 text-xl mb-2">
              Party bus rentals starting at $120/hour
            </p>
            <p className="text-white/90 text-lg mb-8">
              Safe, fun, stress-free nightlife transportation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Party Bus
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

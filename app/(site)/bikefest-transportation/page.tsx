import type { Metadata } from 'next'
import { Bike, Users, Shield, Clock, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Lake Ozarks Bikefest Transportation | Safe Rides for Bikers',
  description: 'Professional transportation for Lake of the Ozarks Bikefest. Safe rides after rallies, bar crawls, and events. Keep your bike parked, ride with us. Book now!',
  keywords: ['Lake Ozarks Bikefest transportation', 'Bikefest shuttle', 'Lake Ozarks motorcycle rally transportation', 'Bikefest safe ride', 'biker shuttle Lake Ozarks'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/bikefest-transportation',
  },
  openGraph: {
    title: 'Lake Ozarks Bikefest Transportation | Lake Ride Pros',
    description: 'Safe rides for Bikefest weekend. Bar crawls, events, and rallies.',
    url: 'https://www.lakeridepros.com/bikefest-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Lake of the Ozarks Bikefest Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Event Transportation',
  areaServed: {
    '@type': 'Place',
    name: 'Lake of the Ozarks',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Osage Beach',
      addressRegion: 'MO',
      addressCountry: 'US'
    }
  },
  description: 'Professional transportation service for Lake of the Ozarks Bikefest motorcycle rally, including safe ride services, bar crawl shuttles, and event transportation',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation for Lake Ozarks Bikefest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide dedicated Bikefest transportation including hotel shuttles, bar crawl transportation, rally event shuttles, and safe rides. Park your bike and ride with us—no worries about DUIs or getting separated from your group.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does Bikefest transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bikefest transportation rates start at $120/hour for group shuttles. Pricing varies based on group size, duration, and specific routes. Most biker groups book half-day or full-day packages. Contact us for a customized Bikefest transportation quote.'
      }
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.lakeridepros.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Events',
      item: 'https://www.lakeridepros.com/services'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Bikefest Transportation',
      item: 'https://www.lakeridepros.com/bikefest-transportation'
    }
  ]
}

export default function BikefestTransportationPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <Bike className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Lake Ozarks Bikefest Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Ride hard. Party harder. Let us drive you home. Safe transportation for bikers who want to enjoy Bikefest without the risk.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Bikefest Shuttle
            </a>
          </div>
        </section>

        {/* Why Bikers Need Our Service */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Park Your Bike. Ride With Us. Stay Safe.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  No DUI. No Risk.
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Missouri doesn't play around with motorcycle DUIs. Lose your license, pay thousands in fines, maybe lose your bike. A shuttle for the weekend is $500-$1,000. A DUI costs $10,000+. Easy math.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Keep the Crew Together
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bikefest means riding with your crew. Don't lose half the group because someone had too many and can't ride. We keep everyone together and get everyone home safe.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Party Longer
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  When you're not worrying about riding your bike after drinking, you can actually enjoy Bikefest. Stay out later, hit more bars, enjoy the live music. We'll get you home when you're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bikefest Transportation Services */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              How We Make Bikefest Safer (and More Fun)
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Hotel to Rally Points</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We shuttle your crew from hotels to main rally points, bike shows, and event venues. Leave your bikes parked safely at the hotel. We'll get you where you need to go.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Bar Crawls & Nightlife</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bikefest means packed bars on Bagnell Dam Strip. We run continuous shuttles between bars, live music venues, and restaurants. Hit every spot on the Strip without riding drunk.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Late Night Safe Rides</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bikefest parties run late. We run late too. 2am pickup from a bar? No problem. We're here to make sure every biker gets home safe, no matter what time.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Full Weekend Packages</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Book us for the entire Bikefest weekend. Friday arrival shuttles, all-day Saturday transportation, Sunday departure. Your crew's personal transportation for the whole rally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bikefest Weekend Timeline */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Typical Bikefest Weekend Transportation
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Friday Night</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Check-in shuttles. Dinner transportation. Strip bar crawls. Late-night safe rides back to hotels.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Saturday (Main Rally Day)</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Morning shuttle to bike shows and events. Afternoon bar hopping and live music venue transportation. Evening shuttles to restaurants and nightlife. Late-night safe rides.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Sunday (Closing Day)</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Final rally event shuttles. Brunch transportation. Departure day safe rides. Whatever you need to wrap up Bikefest weekend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Bikefest Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation for Lake Ozarks Bikefest?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide dedicated Bikefest transportation including hotel shuttles, bar crawl transportation, rally event shuttles, and safe rides home. Park your bike at the hotel and ride with us—no worries about DUIs, getting separated from your crew, or navigation.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Bikefest transportation cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Bikefest transportation rates start at $120/hour for group shuttles. Most biker groups book half-day (4-6 hours) or full-day (8-12 hours) packages. Weekend packages for Friday-Sunday run $1,500-$3,000 depending on group size and schedule. Contact us for a customized quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Should I book Bikefest transportation early?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Bikefest weekend is one of our busiest times. We book up 2-3 weeks in advance. If you're riding up for Bikefest, book your transportation when you book your hotel room. Don't wait—we sell out.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you handle large biker groups?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We have shuttle buses that hold 14-24 passengers, perfect for riding crews. Got 30+ bikers? We'll deploy multiple vehicles. We've handled biker groups of 50+ for Bikefest weekend.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you run late-night shuttles during Bikefest?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Bikefest parties run late and so do we. 1am, 2am, 3am—whenever you're ready to call it a night, we'll be there to get you back to your hotel safely.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Bikefest Riders Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We ride up from Kansas City every year for Bikefest with our crew. Last year we finally got smart and hired Lake Ride Pros for the whole weekend. Left all 8 bikes parked at the hotel and they shuttled us everywhere—rally events, bars, restaurants. Zero stress, zero risk. Doing it again this year."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Mike D.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Annual Bikefest Attendee
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Bikefest means DUI checkpoints everywhere. I saw 5 bikers get pulled over Friday night alone. We booked Lake Ride Pros for Saturday and it was the best decision. Hit every bar on the Strip, caught all the live music, didn't worry once about riding drunk. Worth every penny."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jen S.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  First-Time Bikefest Visitor
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Nightlife Transportation", href: "/nightlife-transportation", description: "Bar hopping and party transportation for Bagnell Dam Strip" },
          { title: "Group Event Transportation", href: "/group-event-transportation", description: "Large group shuttle service for any event" },
          { title: "Concert Transportation", href: "/concert-transportation", description: "Safe rides to and from concerts and live music events" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Book Your Bikefest Transportation Now
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Don't risk a DUI. Don't lose your crew. Ride safe with Lake Ride Pros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Bikefest Shuttle
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

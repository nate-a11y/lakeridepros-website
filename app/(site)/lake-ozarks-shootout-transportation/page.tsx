import type { Metadata } from 'next'
import { Zap, Users, Shield, Clock, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Lake Ozarks Shootout Transportation | Safe Rides to the Races',
  description: 'Professional transportation for Lake of the Ozarks Shootout. Avoid traffic, skip parking hassles, enjoy the races stress-free. Group shuttles & safe rides. Book now!',
  keywords: ['Lake Ozarks Shootout transportation', 'Shootout shuttle service', 'Lake Ozarks boat races transportation', 'Shootout safe ride', 'Shootout parking shuttle'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/lake-ozarks-shootout-transportation',
  },
  openGraph: {
    title: 'Lake Ozarks Shootout Transportation | Lake Ride Pros',
    description: 'Skip the traffic and parking chaos. Professional Shootout transportation.',
    url: 'https://www.lakeridepros.com/lake-ozarks-shootout-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Lake of the Ozarks Shootout Transportation Service',
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
  description: 'Professional transportation service for Lake of the Ozarks Shootout boat races, including group shuttles, hotel transportation, and safe ride services',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation for Lake Ozarks Shootout?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide dedicated Shootout transportation including hotel shuttles, viewing spot transportation, restaurant shuttles, and safe rides home. Skip the parking chaos and traffic jams—let us handle the driving.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does Shootout transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shootout transportation rates start at $120/hour for group shuttles. Pricing varies based on group size, duration, and specific routes. Most groups book half-day or full-day packages. Contact us for a customized Shootout transportation quote.'
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
      name: 'Shootout Transportation',
      item: 'https://www.lakeridepros.com/lake-ozarks-shootout-transportation'
    }
  ]
}

export default function ShootoutTransportationPage() {
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
            <Zap className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Lake Ozarks Shootout Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Don't fight the traffic. Don't hunt for parking. Don't drive after celebrating. Let us handle the logistics while you enjoy the fastest boats in America.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Shootout Shuttle
            </a>
          </div>
        </section>

        {/* Why You Need a Shootout Shuttle */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Shootout Weekend = Traffic Chaos. We Fix That.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Skip the DUI Risk
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Shootout weekend means packed bars, boat parties, and celebrations. DUI checkpoints are everywhere. A $120/hour shuttle beats a $5,000+ DUI any day. Plus, you keep your license and your dignity.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Clock className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Avoid Parking Nightmares
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Parking during Shootout is a disaster. $50 lots that fill up by 9am. Miles of walking. Getting blocked in until midnight. We drop you at the door and pick you up when you're ready.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Keep Your Group Together
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Got 10 friends coming in for Shootout? Stop coordinating 4 different cars and 4 different parking spots. One vehicle, one driver, everyone together. Way more fun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shootout Transportation Services */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              How We Make Shootout Weekend Easy
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Hotel to Viewing Spots</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We shuttle your group from hotels to prime viewing locations along Captain's Cove, Bagnell Dam, and other Shootout hot spots. Drop you off, pick you up when the races wrap. No parking stress, no walking miles in the heat.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Bar Hopping & Restaurant Shuttles</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Shootout weekend means packed bars and restaurants. We run continuous shuttles between Bagnell Dam Strip, Margaritaville, and other nightlife spots. Party hard, ride safe.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Full-Day Packages</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Book us for the entire day (or weekend). Morning pickup for the races, afternoon transportation to lunch and bars, evening shuttles to dinner and nightlife. Your personal driver for Shootout weekend.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Airport Transfers</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Flying in for Shootout from Kansas City or St. Louis? We'll pick your group up from MCI or STL airports and get you to the Lake. Return trip after the weekend too.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shootout Weekend Timeline */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Typical Shootout Weekend Transportation
            </h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Friday Night</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Arrival shuttles from airport. Dinner transportation. Bar hopping on the Strip. Safe rides back to hotels.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Saturday (Race Day)</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Morning pickup from hotels to viewing locations. Afternoon shuttles to lunch spots. Evening transportation to boat parties and nightlife. Late-night safe rides home.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Sunday (Recovery/Departure)</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Brunch transportation. Airport departure shuttles. Whatever you need to get home safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Shootout Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation for Lake Ozarks Shootout?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide dedicated Shootout transportation including hotel shuttles, viewing spot transportation, restaurant and bar shuttles, and safe rides home. Skip the parking chaos and traffic jams—let us handle the driving while you enjoy the races and celebrations.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Shootout transportation cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Shootout transportation rates start at $120/hour for group shuttles. Pricing varies based on group size, duration, and specific routes. Most groups book half-day (4-6 hours) or full-day (8-12 hours) packages. Contact us for a customized Shootout weekend quote.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Should I book Shootout transportation early?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  YES! Shootout weekend is our busiest time of the year. We book up weeks in advance. If you're planning to attend the races, book your transportation as soon as you book your hotel. Don't wait until the week before—you might not get a vehicle.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you take us to specific viewing locations?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We know all the best viewing spots—Captain's Cove, Bagnell Dam, Redhead Lakeside Grill, and more. Tell us where you want to watch the races and we'll get you there. We can also give recommendations if you're not familiar with the course.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you run shuttles late at night during Shootout?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Shootout weekend is 24/7 for us. We run late-night shuttles from bars, restaurants, and boat parties back to hotels. If your group is out until 2am celebrating, we'll be there to get you home safely.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Shootout Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We bring a group of 12 guys to Shootout every year and always book Lake Ride Pros. They picked us up from the airport Friday, shuttled us around all weekend—races, bars, restaurants—and got us back to the airport Sunday. Made the whole weekend stress-free. Best decision we ever made."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jake M.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Annual Shootout Attendee
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Shootout parking is absolutely insane. Lake Ride Pros dropped us right at Captain's Cove for the races and picked us up when we were ready to leave. No walking miles, no getting stuck in traffic. Then they shuttled us to dinner and bars that night. 10/10 would recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Amanda K.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  First-Time Shootout Visitor
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Nightlife Transportation", href: "/nightlife-transportation", description: "Bar hopping and party bus rentals for Bagnell Dam Strip" },
          { title: "Bachelor Party Transportation", href: "/bachelor-party-transportation", description: "Party bus and shuttle service for bachelor parties" },
          { title: "Group Event Transportation", href: "/group-event-transportation", description: "Large group shuttle service for any event" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Wait—Shootout Weekends Book Fast
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Skip the parking nightmares and DUI risk. Book your shuttle now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shootout Shuttle
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

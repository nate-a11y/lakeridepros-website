import type { Metadata } from 'next'
import { MapPin, Heart, Briefcase, Users, CheckCircle, Star, Phone } from 'lucide-react'
import RelatedServices from '@/components/RelatedServices'

export const metadata: Metadata = {
  title: 'Old Kinderhook Transportation | Wedding & Golf Event Shuttles',
  description: 'Professional transportation to/from Old Kinderhook Golf Course & Resort at Lake of the Ozarks. Weddings, golf outings, corporate events. Reliable, on-time service.',
  keywords: ['Old Kinderhook transportation', 'Old Kinderhook wedding shuttle', 'Old Kinderhook golf outing', 'Camdenton Old Kinderhook', 'resort shuttle Old Kinderhook'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/old-kinderhook-transportation',
  },
  openGraph: {
    title: 'Old Kinderhook Transportation | Lake Ride Pros',
    description: 'Wedding shuttles, golf outings, corporate events at Old Kinderhook Resort',
    url: 'https://www.lakeridepros.com/old-kinderhook-transportation',
    siteName: 'Lake Ride Pros',
    locale: 'en_US',
    type: 'website',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Old Kinderhook Golf Course & Resort Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Venue Transportation',
  areaServed: {
    '@type': 'Place',
    name: 'Old Kinderhook Golf Course & Resort',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1 Kinderhook Dr',
      addressLocality: 'Camdenton',
      addressRegion: 'MO',
      postalCode: '65020',
      addressCountry: 'US'
    }
  },
  description: 'Professional transportation service for Old Kinderhook weddings, golf outings, corporate events, and conference transportation at Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Old Kinderhook Resort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Old Kinderhook is a premier venue we serve regularly. We provide wedding shuttles, golf outing transportation, conference shuttles, and guest transportation between Old Kinderhook and area hotels, airports, and attractions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does Old Kinderhook wedding shuttle service cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wedding shuttle rates for Old Kinderhook start at $120/hour and vary based on guest count, duration, and routes. Most wedding packages run 4-6 hours. Contact us for a customized quote for your Old Kinderhook wedding.'
      }
    }
  ]
}

export default function OldKinderhookTransportationPage() {
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
        {/* Hero Section */}
        <section className="bg-lrp-green py-20">
          <div className="container mx-auto px-4 text-center">
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Old Kinderhook Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              The Lake's trusted transportation provider for Old Kinderhook weddings, golf outings, and corporate events. From the clubhouse to the course, we've got you covered.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Old Kinderhook Shuttle
            </a>
          </div>
        </section>

        {/* Services at Old Kinderhook */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Transportation Services at Old Kinderhook
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Heart className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Wedding Shuttles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Guest shuttles between Old Kinderhook and area hotels. Bridal party transportation. Continuous service throughout your celebration. Your golf course wedding, perfectly executed.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Briefcase className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Golf Outings
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Corporate golf tournaments, charity scrambles, buddy trips. Shuttle your group from hotels to the clubhouse. Post-round transportation to dinner and nightlife. Golf trip logistics, handled.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Corporate Events
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Conference transportation, executive retreats, team building events. Airport transfers for attendees. Professional service for your business events at one of the Lake's premier venues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us for Old Kinderhook */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Old Kinderhook Events Trust Lake Ride Pros
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">We Know the Property Cold</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Clubhouse entrance? Wedding pavilion? Conference center? We know every access road, parking lot, and drop-off zone at Old Kinderhook. Your guests get smooth, on-time transportation every single time.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Preferred by Old Kinderhook Event Staff</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We work directly with Old Kinderhook's event coordinators and golf staff. They recommend us to their clients because we know the property, we're always professional, and we deliver flawless service.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Old Kinderhook Routes</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• Old Kinderhook ↔ Camdenton hotels (guest overflow)</li>
                  <li>• Old Kinderhook ↔ Osage Beach hotels (conference attendees)</li>
                  <li>• Old Kinderhook ↔ Kansas City Airport (MCI) - 2.5 hours</li>
                  <li>• Old Kinderhook ↔ St. Louis Airport (STL) - 2 hours</li>
                  <li>• Old Kinderhook ↔ Lake area restaurants (post-golf dinners)</li>
                  <li>• Old Kinderhook ↔ Bagnell Dam Strip (nightlife after tournaments)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Old Kinderhook Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation to Old Kinderhook Resort?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Old Kinderhook Golf Course & Resort is a premier venue we serve regularly. We provide wedding shuttles, golf outing transportation, conference shuttles, and guest transportation between Old Kinderhook and area hotels, airports, and Lake attractions.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Old Kinderhook wedding shuttle service cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Wedding shuttle rates for Old Kinderhook start at $120/hour and vary based on guest count, duration, and routes. Most wedding packages run 4-6 hours for continuous shuttle loops. Contact us for a customized quote for your Old Kinderhook wedding.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you transport golf groups to Old Kinderhook?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in golf outing transportation to Old Kinderhook. Pick up your group from hotels, shuttle to the clubhouse for tee times, transport to post-round dinners, and provide safe rides home after celebrations. Perfect for corporate tournaments and buddy trips.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Where do you pick up guests at Old Kinderhook?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We coordinate directly with Old Kinderhook event staff for optimal pickup/drop-off locations. For weddings, we typically use the wedding pavilion or clubhouse entrance. For golf outings, we use the main clubhouse entrance. For conferences, we coordinate with event coordinators based on your specific needs.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide airport transportation for Old Kinderhook events?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide executive shuttle service from Kansas City (MCI), St. Louis (STL), and Springfield (SGF) airports directly to Old Kinderhook. Perfect for destination weddings, corporate golf tournaments, and conference attendees. Group rates available.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Old Kinderhook Clients Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We had our golf course wedding at Old Kinderhook and Lake Ride Pros made everything easy. They shuttled our 60 guests from hotels to the venue, ran continuous loops during the reception, and got everyone home safely. Drivers were professional and friendly. Highly recommend for any Old Kinderhook event!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Sarah & Brad
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Married at Old Kinderhook
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Our company holds an annual golf tournament at Old Kinderhook with 50+ participants. Lake Ride Pros handles all transportation—hotel pickups, clubhouse shuttles, and post-tournament dinner transportation. They're reliable, professional, and make our event logistics seamless. Been using them for 3 years running."
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Robert T.
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Corporate Event Coordinator
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Wedding Transportation", href: "/wedding-transportation", description: "Luxury wedding shuttles for all Lake of the Ozarks venues" },
          { title: "Golf Outing Transportation", href: "/golf-outing-transportation", description: "Group transportation for golf tournaments and outings" },
          { title: "Corporate Transportation", href: "/corporate-transportation", description: "Executive service for conferences and business events" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Old Kinderhook Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Weddings, golf outings, corporate events—we've got you covered
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shuttle
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

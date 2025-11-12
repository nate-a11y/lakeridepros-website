import type { Metadata } from 'next'
import { Heart, Shield, Users, Calendar, CheckCircle, Star, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Transportation Lake of the Ozarks | Luxury Shuttle Service',
  description: 'Professional wedding transportation at Lake of the Ozarks. Reliable shuttle service for bridal parties, guests, and wedding events. Custom packages for any group size.',
  keywords: ['wedding transportation Lake Ozarks', 'wedding shuttle service', 'bridal party transportation', 'Lake of the Ozarks wedding transport', 'luxury wedding shuttle'],
  alternates: {
    canonical: 'https://www.lakeridepros.com/wedding-transportation',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wedding Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '(573) 206-9499',
  },
  serviceType: 'Wedding Transportation',
  areaServed: 'Lake of the Ozarks, Missouri',
  description: 'Professional luxury wedding transportation and shuttle service for bridal parties and wedding guests',
}

export default function WeddingTransportationPage() {
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
            <Heart className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Wedding Transportation at Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Luxury shuttle service for your perfect day. Stress-free transportation for bridal parties, guests, and wedding events.
            </p>
            <a
              href="/book"
              className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Get Custom Quote
            </a>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Choose Lake Ride Pros for Your Wedding
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Shield className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  100% Reliability
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Your wedding day is too important to risk. We guarantee on-time arrivals and professional service you can count on.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Users className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Any Group Size
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  From intimate ceremonies to grand celebrations, our fleet handles groups from 2 to 200+ guests with ease.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <Calendar className="w-12 h-12 text-lrp-green mb-4" />
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Stress-Free Coordination
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We handle all the logistics so you can focus on your special day. Multiple pickups, venue changes, no problem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Wedding Transportation Services
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Bridal Party Transport</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Luxury transportation for the wedding party between venues
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Guest Shuttle Service</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Continuous shuttle service between hotels and ceremony/reception
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">Rehearsal Dinner Transport</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Professional service for pre-wedding events and rehearsals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-lrp-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lrp-black dark:text-white mb-1">After-Party Transportation</h3>
                    <p className="text-gray-700 dark:text-lrp-gray text-sm">
                      Safe rides for guests after the celebration ends
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-lrp-green/10 dark:bg-lrp-green/20 border-2 border-lrp-green rounded-lg p-6">
                <h3 className="font-bold text-lrp-black dark:text-white mb-3 text-lg">
                  Popular Lake Ozarks Wedding Venues We Service
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-lrp-gray">
                  <li>• Tan-Tar-A Resort</li>
                  <li>• Old Kinderhook Golf Course</li>
                  <li>• Lodge of Four Seasons</li>
                  <li>• Margaritaville Lake Resort</li>
                  <li>• And all Lake of the Ozarks venues</li>
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
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Contact Us</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Share your wedding date, guest count, and transportation needs
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Custom Quote</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Receive a personalized package tailored to your wedding
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Book & Relax</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Reserve your date and let us handle all the details
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lrp-green text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lrp-black dark:text-white mb-2">Perfect Day</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Enjoy flawless transportation on your special day
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Wedding Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far in advance should I book wedding transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We recommend booking 6-12 months in advance, especially for peak wedding season (May-October). However, we can often accommodate last-minute bookings based on availability.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What's included in wedding transportation packages?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Our packages include professional drivers, fuel, insurance, vehicle cleaning, and coordination with your wedding planner. We also provide complimentary water and can accommodate special requests.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you handle multiple pickup and drop-off locations?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! We specialize in complex wedding logistics. Whether you need shuttles between multiple hotels, venues, or event locations, we'll create a custom schedule that works perfectly.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What size vehicles do you offer for weddings?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We offer vehicles for every wedding size: luxury sprinter vans (14 passengers), limo buses (20-30 passengers), shuttle buses (30-56 passengers), and charter buses (50+ passengers).
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation for multi-day wedding events?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Many couples book us for the entire wedding weekend including welcome parties, rehearsal dinners, ceremony, reception, and farewell brunches. We offer special rates for multi-day events.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What happens if the wedding schedule changes?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We understand weddings rarely run exactly on schedule! Our drivers stay in communication with your coordinator and can adjust pickup times as needed. We build flexibility into every wedding package.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              What Couples Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "Lake Ride Pros made our wedding transportation absolutely seamless! They shuttled 80 guests between our hotel and Old Kinderhook without a single issue. Our coordinator said they were the most professional transportation company she's worked with. Highly recommend!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Sarah & Michael
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Married at Old Kinderhook Golf Course
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-8 rounded-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-lrp-gray mb-4 italic">
                  "We booked Lake Ride Pros for our entire wedding weekend and it was worth every penny. From rehearsal dinner to farewell brunch, they were punctual, friendly, and made our guests feel like VIPs. One less thing to stress about!"
                </p>
                <p className="font-bold text-lrp-black dark:text-white">
                  Jennifer & David
                </p>
                <p className="text-sm text-gray-600 dark:text-lrp-gray">
                  Married at Tan-Tar-A Resort
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Wedding Transportation?
            </h2>
            <p className="text-white/90 text-lg mb-2">
              Custom packages available for weddings of any size
            </p>
            <p className="text-white/90 text-xl font-semibold mb-8">
              Contact us for a personalized quote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-block bg-white text-lrp-green hover:bg-lrp-gray px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Get Custom Quote
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

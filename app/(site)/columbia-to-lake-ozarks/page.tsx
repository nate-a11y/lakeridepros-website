import type { Metadata } from 'next'
import { MapPin, GraduationCap, Users, Clock, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/payload-local'

export const metadata: Metadata = {
  title: 'Columbia MO to Lake of the Ozarks Transportation | Shuttle Service',
  description: 'Direct shuttle service from Columbia, Missouri to Lake of the Ozarks. Airport transfers, weekend getaways, group trips. Serving Mizzou students, families, and groups.',
  keywords: [
    'Columbia to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Columbia',
    'MU to Lake Ozarks',
    'Columbia Missouri Lake shuttle',
    'Mizzou Lake of the Ozarks transportation',
    'Columbia MO to Osage Beach',
    'COU airport to Lake Ozarks',
    'Mizzou graduation transportation',
    'Greek formal Lake Ozarks',
    'Columbia Regional Airport Lake shuttle'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/columbia-to-lake-ozarks',
  },
  openGraph: {
    title: 'Columbia MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Columbia to Lake of the Ozarks. Perfect for weekend getaways and group trips.',
    url: 'https://www.lakeridepros.com/columbia-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Columbia to Lake Ozarks Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Columbia MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Columbia to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Columbia to Lake of the Ozarks Transportation Service',
  provider: {
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    telephone: '+1-573-206-9499',
    url: 'https://www.lakeridepros.com',
  },
  serviceType: 'Shuttle Transportation',
  areaServed: [
    {
      '@type': 'City',
      name: 'Columbia',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Columbia',
        addressRegion: 'MO',
        addressCountry: 'US'
      }
    },
    {
      '@type': 'City',
      name: 'Lake of the Ozarks',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lake of the Ozarks',
        addressRegion: 'MO',
        addressCountry: 'US'
      }
    }
  ],
  description: 'Direct shuttle transportation service from Columbia, Missouri to Lake of the Ozarks, serving University of Missouri students, families, and groups',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Columbia MO from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Columbia, Missouri is approximately 90 miles (1.5 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend getaways easy for Columbia residents and Mizzou students.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you pick up from University of Missouri campus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide pickups from University of Missouri campus locations, student housing, and anywhere in Columbia. Perfect for Mizzou students planning Lake weekend trips.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Columbia to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shuttle rates from Columbia to Lake of the Ozarks start at $120/hour with a typical 3-hour round trip minimum. Group rates available for larger parties. Contact us for a custom quote based on your specific pickup location and Lake destination.'
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
      name: 'Cities',
      item: 'https://www.lakeridepros.com/services'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Columbia to Lake Ozarks',
      item: 'https://www.lakeridepros.com/columbia-to-lake-ozarks'
    }
  ]
}

export default async function ColumbiaToLakeOzarksPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

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
            <MapPin className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Columbia to Lake of the Ozarks Transportation
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Direct shuttle service from Columbia, MO to the Lake. Perfect for Mizzou students, weekend getaways, and group trips. Just 90 minutes away.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Columbia Shuttle
            </Link>
          </div>
        </section>

        {/* Route Info */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
                Columbia to Lake Ozarks: Easy Weekend Getaways
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <MapPin className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">90 Miles</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Columbia to Osage Beach</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Clock className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">1.5 Hours</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">Direct drive time</p>
                </div>
                <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                  <Users className="w-12 h-12 text-lrp-green mx-auto mb-4" />
                  <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-2">Groups Welcome</h3>
                  <p className="text-gray-700 dark:text-lrp-gray">2-56 passengers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Columbia Residents Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Columbia Residents Choose Lake Ride Pros
            </h2>
            <div className="space-y-6">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">
                  <GraduationCap className="inline w-6 h-6 mr-2 text-lrp-green" />
                  Mizzou Student Friendly
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  We pick up directly from MU campus, student housing, and Columbia apartments. Popular for spring break trips, birthday weekends, Greek formals, and sorority/fraternity events. Group rates make it affordable to split costs. Also serving Parents Weekend, Move-In Day, and Mizzou Graduation transportation.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Columbia Regional Airport (COU)</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Flying into Columbia Regional Airport? We provide direct transfers from COU to Lake of the Ozarks destinations. Popular for destination wedding guests and corporate travelers connecting to Lake events.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">No Designated Driver Needed</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Weekend at the Lake means boat parties, bar hopping, and fun. Let us handle the 90-mile drive both ways while your group enjoys the ride. Return pickup whenever you're ready.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Common Columbia Routes</h3>
                <ul className="text-gray-700 dark:text-lrp-gray space-y-2 mt-3">
                  <li>• Downtown Columbia ↔ Bagnell Dam Strip (nightlife)</li>
                  <li>• University of Missouri ↔ Tan-Tar-A Resort</li>
                  <li>• Columbia ↔ Margaritaville Lake Resort</li>
                  <li>• Columbia ↔ Lake vacation rentals</li>
                  <li>• Columbia ↔ Lake Ozarks boat parties/events</li>
                  <li>• COU Airport ↔ Lake of the Ozarks venues</li>
                  <li>• Greek houses ↔ Lake formal event venues</li>
                </ul>
                <p className="text-gray-700 dark:text-lrp-gray mt-3 text-sm">
                  <strong>Route:</strong> I-70 W to US-63 S to US-54 W • ~90 miles • 1.5 hours
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="font-bold text-xl text-lrp-black dark:text-white mb-3">Perfect for Groups</h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Bachelor/bachelorette parties, family reunions, friend groups, sorority/fraternity trips. Our sprinter vans (14 passengers) and buses (up to 56) keep everyone together for the whole weekend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Columbia Trips */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Lake Trips from Columbia
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/bachelor-party-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bachelor/Bachelorette Weekends</h3>
                    <p className="text-sm opacity-80">Party bus, bar hopping, boat rentals</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/wedding-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Destination Weddings</h3>
                    <p className="text-sm opacity-80">Guest shuttles to Lake venues</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Family Reunions</h3>
                    <p className="text-sm opacity-80">Multi-day Lake house rentals</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/party-bus-nightlife" className="group block bg-white dark:bg-dark-bg-primary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Weekend Party Trips</h3>
                    <p className="text-sm opacity-80">Bagnell Dam Strip bar crawls</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Columbia to Lake Ozarks Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How far is Columbia MO from Lake of the Ozarks?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Columbia, Missouri is approximately 90 miles (1.5 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend getaways easy for Columbia residents and Mizzou students.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you pick up from University of Missouri campus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We provide pickups from University of Missouri campus locations, student housing, and anywhere in Columbia. Perfect for Mizzou students planning Lake weekend trips.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does shuttle service from Columbia to Lake Ozarks cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Shuttle rates from Columbia to Lake of the Ozarks start at $120/hour with a typical 3-hour round trip minimum. Group rates available for larger parties. Contact us for a custom quote based on your specific pickup location and Lake destination.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you do round trips from Columbia in one day?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! Many Columbia groups book same-day round trips for Lake events, concerts, or day trips. We'll drop you off, you enjoy the Lake, and we pick you up at your scheduled time.
                </p>
              </details>

              <details className="bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you offer multi-day service for Columbia groups?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Popular for weekend Lake house rentals. We drop you off Friday, you enjoy the Lake all weekend, and we pick you up Sunday. We can also provide transportation during your stay if needed.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Columbia Clients Say"
          subtitle="Real experiences from customers traveling from Columbia to Lake of the Ozarks"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Bachelor Party Transportation", href: "/services/bachelor-party-transportation", description: "Party bus and shuttle service for Lake weekends" },
          { title: "Group Event Transportation", href: "/services/group-event-transportation", description: "Large group shuttle service for family trips" },
          { title: "Nightlife Transportation", href: "/services/party-bus-nightlife", description: "Bar hopping and party transportation at the Lake" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Columbia to Lake Ozarks Shuttle?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Direct service from Columbia to the Lake—perfect for weekend getaways
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Shuttle
              </Link>
              <PhoneLink className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all">
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

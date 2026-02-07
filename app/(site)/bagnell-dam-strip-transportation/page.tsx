import type { Metadata } from 'next'
import { MapPin, Phone, CheckCircle, ArrowRight, PartyPopper, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import RelatedServices from '@/components/RelatedServices'
import { PhoneLink } from '@/components/PhoneLink'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Bagnell Dam Strip Transportation | Bar Hopping Party Bus | Lake Ride Pros',
  description: 'Safe, reliable transportation for Bagnell Dam Strip bar hopping and nightlife at Lake of the Ozarks. Party buses, shuttles, designated driver service. Book now!',
  keywords: [
    'Bagnell Dam Strip transportation',
    'Bagnell Dam bar hopping',
    'Lake Ozarks nightlife transportation',
    'party bus Bagnell Dam',
    'Osage Beach nightlife shuttle',
    'designated driver Lake Ozarks',
    'bar crawl transportation',
    'Bagnell Dam Strip party bus'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
  },
  openGraph: {
    title: 'Bagnell Dam Strip Transportation | Lake Ride Pros',
    description: 'Professional party bus and shuttle service for Bagnell Dam Strip bar hopping. Safe nightlife transportation at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Bagnell Dam Strip Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagnell Dam Strip Transportation | Lake Ride Pros',
    description: 'Professional party bus and shuttle service for Bagnell Dam Strip bar hopping.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Bagnell Dam Strip Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
  url: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lake of the Ozarks',
    addressRegion: 'MO',
    addressCountry: 'US'
  },
  areaServed: {
    '@type': 'City',
    name: 'Osage Beach',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri'
    }
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1028,
    longitude: -92.6332
  },
  priceRange: '$$',
  description: 'Professional nightlife and bar hopping transportation service for Bagnell Dam Strip at Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Bagnell Dam Strip transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bagnell Dam Strip party bus and shuttle service starts at $120/hour for Sprinter vans (up to 14 passengers) and $150/hour for limo buses. Most bar hopping groups book 4-6 hour packages. Contact us at (573) 206-9499 for custom pricing and group discounts.'
      }
    },
    {
      '@type': 'Question',
      name: 'What bars and venues do you service on the Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We service all Bagnell Dam Strip bars and nightlife venues including Dog Days, Backwater Jack\'s, Shady Gators, Tucker\'s Shuckers, Casey\'s Pizza, Redhead Lakeside Grill, and more. Our drivers know every stop along the Strip and can create custom bar crawl routes.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate bachelor and bachelorette parties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Bachelor and bachelorette parties are our specialty. Our party buses feature premium sound systems, LED lighting, cooler space, and comfortable seating. Perfect for Bagnell Dam Strip bar hopping and Lake Ozarks nightlife celebrations.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there a minimum rental time for Strip transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we have a 3-hour minimum for Bagnell Dam Strip nightlife transportation. Most groups book 4-6 hours to fully enjoy the Strip without rushing. Hourly extensions available if your group wants to keep the party going.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from hotels to the Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We pick up from any Lake of the Ozarks hotel, resort, or vacation rental and shuttle your group to the Bagnell Dam Strip. We provide transportation throughout your evening and return you safely to your accommodation. Popular pickup locations include Margaritaville, Tan-Tar-A, and all Osage Beach hotels.'
      }
    },
    {
      '@type': 'Question',
      name: 'What time does Bagnell Dam Strip nightlife start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bagnell Dam Strip nightlife typically picks up around 8-9 PM and goes until 1:30 AM (Missouri last call). We recommend starting your transportation between 7-9 PM depending on whether you want dinner or just drinks. Our drivers can advise on the best timing for your group.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can we bring coolers on the party bus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All our party buses and limo buses allow coolers with beverages (for passengers 21+). Must comply with Missouri open container laws - no glass bottles, and drinking only allowed while vehicle is in motion or parked. Driver will advise on specific rules.'
      }
    }
  ]
}

export default async function BagnellDamStripTransportationPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-lrp-green to-lrp-green/80 py-20">
          <div className="container mx-auto px-4 text-center">
            <PartyPopper className="w-16 h-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Bagnell Dam Strip Transportation & Party Buses
            </h1>
            <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              The ultimate bar hopping and nightlife transportation on the Bagnell Dam Strip. Safe, fun, and unforgettable Lake Ozarks nights.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Book Your Party Bus
            </Link>
          </div>
        </section>

        {/* Why Book Strip Transportation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why You Need Bagnell Dam Strip Transportation
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Safety First
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Don't risk drinking and driving. Our professional drivers ensure everyone gets home safely after a night on the Strip.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Keep the Party Together
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  No splitting up the group across multiple Ubers. Everyone rides together in one party bus or shuttle.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  No Parking Hassles
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Skip the nightmare of Strip parking. We drop you at the door and pick you up when you're ready to move.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Strip Destinations */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Popular Bagnell Dam Strip Bars & Venues
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Dog Days Bar & Grill</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Iconic lakefront spot with live music and views
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Backwater Jack's</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Waterfront dining and late-night drinks
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Shady Gators</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Live entertainment and Bagnell Dam atmosphere
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Tucker's Shuckers</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Raw bar, drinks, and lakefront party vibes
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Redhead Lakeside Grill</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Dinner and late-night drinks on the water
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-lrp-green mb-3" />
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Your Custom Route</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  We'll create a personalized bar crawl for your group
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Strip Transportation Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Bagnell Dam Strip Transportation Options
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <Link href="/services/party-bus-nightlife" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bar Hopping Party Bus</h3>
                    <p className="text-sm opacity-80">LED lights, sound system, cooler space</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/bachelor-party-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Bachelor/Bachelorette Parties</h3>
                    <p className="text-sm opacity-80">Premium party buses for celebrations</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/special-events-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Birthday Celebrations</h3>
                    <p className="text-sm opacity-80">Make your birthday unforgettable on the Strip</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services/group-event-transportation" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Large Group Nightlife</h3>
                    <p className="text-sm opacity-80">Multiple vehicles for groups of 20+</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Hotel to Strip Shuttles</h3>
                    <p className="text-sm opacity-80">Round-trip from any Lake Ozarks hotel</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
              <Link href="/services" className="group block bg-lrp-gray dark:bg-dark-bg-secondary p-6 rounded-lg hover:bg-lrp-green hover:text-lrp-black transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Designated Driver Service</h3>
                    <p className="text-sm opacity-80">Safe rides home after a night out</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Vehicle Features */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Party Bus Features for Strip Transportation
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Premium Sound</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Bluetooth speakers, aux input
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">LED Lighting</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Party atmosphere on wheels
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Cooler Space</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  BYOB for 21+ passengers
                </p>
              </div>
              <div className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-lrp-black dark:text-white mb-2">Comfortable Seating</h3>
                <p className="text-gray-700 dark:text-lrp-gray text-sm">
                  Plush seating for 14+ guests
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Lake Ride Pros */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Why Lake Ride Pros for Bagnell Dam Strip
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  We Know the Strip
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Locals who know every bar, parking spot, and the best times to hit each venue on the Bagnell Dam Strip.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Professional Drivers
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Patient, experienced drivers who keep the party fun and safe. We've handled thousands of Strip nights.
                </p>
              </div>
              <div className="bg-lrp-gray dark:bg-dark-bg-secondary p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-lrp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-lrp-green" />
                </div>
                <h3 className="text-xl font-bold text-lrp-black dark:text-white mb-3">
                  Flexible Hours
                </h3>
                <p className="text-gray-700 dark:text-lrp-gray">
                  Want to extend your night? Call your driver for hourly extensions. We're flexible with your celebration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-lrp-gray dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white text-center mb-12">
              Bagnell Dam Strip Transportation FAQs
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  How much does Bagnell Dam Strip transportation cost?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Bagnell Dam Strip party bus and shuttle service starts at $120/hour for Sprinter vans (up to 14 passengers) and $150/hour for limo buses. Most bar hopping groups book 4-6 hour packages. Contact us at (573) 206-9499 for custom pricing and group discounts.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What bars and venues do you service on the Strip?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  We service all Bagnell Dam Strip bars and nightlife venues including Dog Days, Backwater Jack's, Shady Gators, Tucker's Shuckers, Casey's Pizza, Redhead Lakeside Grill, and more. Our drivers know every stop along the Strip and can create custom bar crawl routes.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can you accommodate bachelor and bachelorette parties?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Absolutely! Bachelor and bachelorette parties are our specialty. Our party buses feature premium sound systems, LED lighting, cooler space, and comfortable seating. Perfect for Bagnell Dam Strip bar hopping and Lake Ozarks nightlife celebrations.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Is there a minimum rental time for Strip transportation?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes, we have a 3-hour minimum for Bagnell Dam Strip nightlife transportation. Most groups book 4-6 hours to fully enjoy the Strip without rushing. Hourly extensions available if your group wants to keep the party going.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Do you provide transportation from hotels to the Strip?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! We pick up from any Lake of the Ozarks hotel, resort, or vacation rental and shuttle your group to the Bagnell Dam Strip. We provide transportation throughout your evening and return you safely to your accommodation. Popular pickup locations include Margaritaville, Tan-Tar-A, and all Osage Beach hotels.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  What time does Bagnell Dam Strip nightlife start?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Bagnell Dam Strip nightlife typically picks up around 8-9 PM and goes until 1:30 AM (Missouri last call). We recommend starting your transportation between 7-9 PM depending on whether you want dinner or just drinks. Our drivers can advise on the best timing for your group.
                </p>
              </details>

              <details className="bg-white dark:bg-dark-bg-primary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-lrp-black dark:text-white">
                  Can we bring coolers on the party bus?
                </summary>
                <p className="text-gray-700 dark:text-lrp-gray mt-4">
                  Yes! All our party buses and limo buses allow coolers with beverages (for passengers 21+). Must comply with Missouri open container laws - no glass bottles, and drinking only allowed while vehicle is in motion or parked. Driver will advise on specific rules.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsCarousel
          testimonials={testimonials}
          title="What Our Bagnell Dam Strip Clients Say"
          subtitle="Real experiences from customers who partied safely with us on the Strip"
          includeSchema={false}
        />

        {/* Related Services */}
        <RelatedServices services={[
          { title: "Nightlife Transportation", href: "/services/party-bus-nightlife", description: "Professional party bus service for Lake Ozarks nightlife" },
          { title: "Bachelor/Bachelorette Parties", href: "/services/bachelor-party-transportation", description: "Celebration transportation throughout Lake of the Ozarks" },
          { title: "Osage Beach Transportation", href: "/transportation-osage-beach", description: "Full-service transportation throughout Osage Beach and the Lake" }
        ]} />

        {/* CTA Section */}
        <section className="py-16 bg-lrp-green">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Bagnell Dam Strip Transportation?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Safe, fun party bus and shuttle service for Lake Ozarks nightlife
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-block bg-white text-lrp-green-dark hover:bg-lrp-gray hover:text-lrp-green px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Party Bus
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

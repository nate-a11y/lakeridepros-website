import LocationHero from '@/components/location/LocationHero'
import LocationSection from '@/components/location/LocationSection'
import LocationEditorialList from '@/components/location/LocationEditorialList'
import LocationFAQs from '@/components/location/LocationFAQs'
import LocationCTA from '@/components/location/LocationCTA'
import RelatedLocationLinks from '@/components/location/RelatedLocationLinks'
import { locationPhotography } from '@/components/location/locationPhotography'
import type { Metadata } from 'next'
import LocationTestimonials from '@/components/location/LocationTestimonials'
import { getRandomTestimonialsLocal as getRandomTestimonials } from '@/lib/api/sanity'

export const metadata: Metadata = {
  title: 'Kansas City to Lake Ozarks Shuttle | Lake Ride Pros',
  description:
    'Private shuttle service from Kansas City and MCI Airport to Lake of the Ozarks, with professional drivers and door-to-door transportation.',
  keywords: [
    'Kansas City to Lake of the Ozarks',
    'MCI airport to Lake Ozarks shuttle',
    'Kansas City airport shuttle',
    'MCI to Osage Beach transportation',
    'Kansas City International to Lake of the Ozarks',
    'MCI to Camdenton shuttle',
    'private shuttle KC to Lake Ozarks',
    'group transportation Kansas City to Lake',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
  },
  openGraph: {
    title: 'Kansas City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description:
      'Professional shuttle service from Kansas City International Airport (MCI) to Lake of the Ozarks. Luxury vehicles, experienced drivers, flight tracking.',
    url: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Kansas City to Lake Ozarks Transportation' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kansas City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Professional shuttle service from Kansas City (MCI) to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Kansas City to Lake of the Ozarks Shuttle',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
  url: 'https://www.lakeridepros.com/kansas-city-to-lake-ozarks',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lake of the Ozarks',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Kansas City',
      containedInPlace: {
        '@type': 'State',
        name: 'Missouri',
      },
    },
    {
      '@type': 'City',
      name: 'Lake of the Ozarks',
      containedInPlace: {
        '@type': 'State',
        name: 'Missouri',
      },
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.2979,
    longitude: -94.7139,
  },
  priceRange: '$$-$$$',
  description:
    'Professional luxury shuttle service from Kansas City International Airport to Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a shuttle from Kansas City to Lake of the Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCI Airport transportation pricing depends on the vehicle, exact pickup and destination, timing, passenger count, luggage, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is the drive from Kansas City to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The drive from Kansas City International Airport (MCI) to Lake of the Ozarks is approximately 2 to 2.5 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you track flights from MCI Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all incoming flights from Kansas City International Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate large groups from Kansas City?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in group transportation from Kansas City to Lake of the Ozarks. Our current fleet includes a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. We can coordinate multiple vehicles for larger groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where do you pick up at MCI Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We pick up at the new MCI Airport terminal. Your driver will meet you at the designated rideshare/ground transportation area with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide round-trip service from Kansas City to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Round-trip shuttle service from MCI to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, bachelor/bachelorette parties, and lake vacations. Book both legs together and save.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Kansas City or St. Louis closer to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kansas City (MCI Airport) is slightly closer to Lake of the Ozarks at approximately 2-2.5 hours, compared to 2.5-3 hours from St. Louis (STL Airport). Both airports offer convenient access to the Lake, and we provide professional shuttle service from both locations.',
      },
    },
  ],
}

export default async function KansasCityToLakeOzarksPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => [])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-white text-lrp-black">
        {/* Hero Section */}
        <LocationHero
          title={'Kansas City to Lake of the Ozarks Transportation'}
          introduction={
            <>
              <p>
                Professional shuttle service from MCI Airport to Lake of the Ozarks. Flight tracking, luxury
                vehicles, door-to-door service.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Your MCI Shuttle'}
          bookingLocation="kansas-city-to-lake-ozarks-hero"
          bookingHref="/book"
        />

        {/* Key Benefits */}
        <LocationSection
          id="local-section-1"
          title={'Why Choose Our Kansas City to Lake Ozarks Shuttle'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Shortest Route',
                description: (
                  <>
                    <p>
                      MCI is the closest major airport to Lake of the Ozarks. Only 2-2.5 hours to your
                      lakefront destination.
                    </p>
                  </>
                ),
              },
              {
                title: 'Perfect for Groups',
                description: (
                  <>
                    <p>
                      Bachelor/bachelorette parties, golf trips, family reunions - we handle groups of any
                      size from MCI.
                    </p>
                  </>
                ),
              },
              {
                title: 'Licensed & Insured',
                description: (
                  <>
                    <p>
                      DOT-compliant drivers with full commercial insurance. Your safety is guaranteed on every
                      MCI shuttle.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Lake Destinations */}
        <LocationSection
          id="local-section-2"
          title={'Popular Lake Destinations from Kansas City'}
          tone="gray"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Tan-Tar-A Resort',
                description: (
                  <>
                    <p>Golf packages, corporate retreats, weddings from KC</p>
                  </>
                ),
              },
              {
                title: 'Margaritaville Lake Resort',
                description: (
                  <>
                    <p>Direct shuttle from MCI to Margaritaville</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach',
                description: (
                  <>
                    <p>Hotels, condos, Bagnell Dam Strip nightlife</p>
                  </>
                ),
              },
              {
                title: 'Camdenton',
                description: (
                  <>
                    <p>Lake homes, Ha Ha Tonka State Park access</p>
                  </>
                ),
              },
              {
                title: 'Lake Ozark',
                description: (
                  <>
                    <p>Downtown dining, shopping, waterfront resorts</p>
                  </>
                ),
              },
              {
                title: 'Private Vacation Rentals',
                description: (
                  <>
                    <p>Door-to-door service to any Lake address from MCI</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services Available */}
        <LocationSection
          id="local-section-3"
          title={'Kansas City to Lake Ozarks Transportation Services'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Airport Shuttle',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>MCI Airport to Lake of the Ozarks direct</p>
                  </>
                ),
              },
              {
                title: 'Bachelor/Bachelorette Parties',
                href: '/services/bachelor-party-transportation',
                description: (
                  <>
                    <p>KC party groups to Lake Ozarks nightlife</p>
                  </>
                ),
              },
              {
                title: 'Wedding Guest Shuttles',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>MCI Airport for destination weddings</p>
                  </>
                ),
              },
              {
                title: 'Corporate Transportation',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>KC executives to Lake Ozarks conferences</p>
                  </>
                ),
              },
              {
                title: 'Large Group Transport',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Multi-vehicle coordination for 50+ passengers</p>
                  </>
                ),
              },
              {
                title: 'Round-Trip Service',
                href: '/services',
                description: (
                  <>
                    <p>Discounted rates for round-trip MCI shuttles</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Lake Ride Pros */}
        <LocationSection id="local-section-4" title={'Why Lake Ride Pros for MCI to Lake Ozarks'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'We Know the Route',
                description: (
                  <>
                    <p>
                      Hundreds of MCI to Lake Ozarks trips completed. We know every shortcut, rest stop, and
                      the fastest routes.
                    </p>
                  </>
                ),
              },
              {
                title: 'No Cancellations, Ever',
                description: (
                  <>
                    <p>
                      Unlike Uber/Lyft who regularly cancel KC to Lake trips, we've never cancelled on a
                      customer. Guaranteed.
                    </p>
                  </>
                ),
              },
              {
                title: '24/7 MCI Service',
                description: (
                  <>
                    <p>
                      Early morning flights, red-eyes, late arrivals - we run MCI shuttles around the clock,
                      every day.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Kansas City to Lake Ozarks Shuttle FAQs'}
          tone="white"
          items={[
            {
              question: 'How much does a shuttle from Kansas City to Lake of the Ozarks cost?',
              answer:
                'MCI Airport transportation pricing depends on the vehicle, exact pickup and destination, timing, passenger count, luggage, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote.',
            },
            {
              question: 'How long is the drive from Kansas City to Lake of the Ozarks?',
              answer:
                'The drive from Kansas City International Airport (MCI) to Lake of the Ozarks is approximately 2 to 2.5 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.',
            },
            {
              question: 'Do you track flights from MCI Airport?',
              answer:
                'Yes! We track all incoming flights from Kansas City International Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.',
            },
            {
              question: 'Can you accommodate large groups from Kansas City?',
              answer:
                'Absolutely! We specialize in group transportation from Kansas City to Lake of the Ozarks. Our current fleet includes a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. We can coordinate multiple vehicles for larger groups.',
            },
            {
              question: 'Where do you pick up at MCI Airport?',
              answer:
                'We pick up at the new MCI Airport terminal. Your driver will meet you at the designated rideshare/ground transportation area with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.',
            },
            {
              question: 'Do you provide round-trip service from Kansas City to Lake of the Ozarks?',
              answer:
                'Yes! Round-trip shuttle service from MCI to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, bachelor/bachelorette parties, and lake vacations. Book both legs together and save.',
            },
            {
              question: 'Is Kansas City or St. Louis closer to Lake of the Ozarks?',
              answer:
                'Kansas City (MCI Airport) is slightly closer to Lake of the Ozarks at approximately 2-2.5 hours, compared to 2.5-3 hours from St. Louis (STL Airport). Both airports offer convenient access to the Lake, and we provide professional shuttle service from both locations.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Kansas City Clients Say"
          subtitle="Real experiences from customers traveling from Kansas City to Lake of the Ozarks"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'St. Louis to Lake Ozarks',
              href: '/st-louis-to-lake-ozarks',
              description: 'Professional shuttle from STL Airport to Lake of the Ozarks',
            },
            {
              title: 'Airport Shuttle Service',
              href: '/services/airport-transfers',
              description: 'All major Missouri airports to Lake destinations',
            },
            {
              title: 'Bachelor/Bachelorette Parties',
              href: '/services/bachelor-party-transportation',
              description: 'Party bus and shuttle service for Lake Ozarks celebrations',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your MCI to Lake Ozarks Shuttle?'}
          description={
            <>
              <p>Professional shuttle service from Kansas City International Airport to Lake of the Ozarks</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="kansas-city-to-lake-ozarks-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

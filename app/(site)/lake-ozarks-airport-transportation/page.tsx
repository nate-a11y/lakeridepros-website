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
  title: 'Lake of the Ozarks Airport Shuttle | Lake Ride Pros',
  description:
    'Professional airport shuttle service to/from Lake of the Ozarks. Grand Glaize Airport (KOZS), MCI, STL, SGF. Private aviation, commercial flights. Book now!',
  keywords: [
    'Lake of the Ozarks airport transportation',
    'Grand Glaize Airport shuttle',
    'KOZS airport transportation',
    'Lake Ozarks airport transfer',
    'MCI to Lake of the Ozarks',
    'STL to Lake Ozarks shuttle',
    'private aviation Lake Ozarks',
    'FBO transportation Lake of the Ozarks',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
  },
  openGraph: {
    title: 'Lake of the Ozarks Airport Transportation | Lake Ride Pros',
    description:
      'Professional airport shuttle and private aviation transportation at Lake of the Ozarks. Grand Glaize Airport (KOZS), MCI, STL, SGF.',
    url: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ozarks Airport Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lake of the Ozarks Airport Transportation | Lake Ride Pros',
    description: 'Professional airport shuttle and private aviation transportation at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Lake of the Ozarks Airport Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
  url: 'https://www.lakeridepros.com/lake-ozarks-airport-transportation',
  telephone: '+1-573-206-9499',
  email: 'contactus@lakeridepros.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lake of the Ozarks',
    addressRegion: 'MO',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'City',
    name: 'Lake of the Ozarks',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.0963,
    longitude: -92.5495,
  },
  priceRange: '$$-$$$',
  description:
    'Professional airport transportation service for Lake of the Ozarks including Grand Glaize Airport and major Missouri airports',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the closest airport to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lee C. Fine Memorial Airport (KOZS), also known as Grand Glaize Airport, is located right at Lake of the Ozarks in Osage Beach. It serves private aircraft and charter flights. For commercial flights, Kansas City International (MCI) is 2-2.5 hours away, and St. Louis Lambert (STL) is 2.5-3 hours away.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Grand Glaize Airport (KOZS)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide prompt pickup service from Grand Glaize Airport (Lee C. Fine Memorial Airport - KOZS) in Osage Beach. Perfect for private aircraft arrivals. We can meet you planeside or at the FBO and transport you anywhere around Lake of the Ozarks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does airport transportation cost at Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Airport-transfer pricing depends on the airport, exact pickup and destination, vehicle, passenger count, luggage, timing, and whether you need one-way or round-trip service. Check our current pricing page and request an exact quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate private aviation and charter flights?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in private aviation transportation at Lake of the Ozarks. We coordinate with FBOs at Grand Glaize Airport (KOZS) and monitor flight arrival times. Our luxury vehicles are perfect for executive and VIP clients arriving by private jet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you track commercial flights from MCI and STL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all commercial flights from Kansas City (MCI), St. Louis (STL), Springfield (SGF), and Columbia (COU) in real-time. If your flight is delayed, we automatically adjust pickup times at no extra charge. Your driver will be waiting when you land.',
      },
    },
    {
      '@type': 'Question',
      name: 'What airports do you service for Lake of the Ozarks transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide transportation to/from Grand Glaize Airport (KOZS) at Lake of the Ozarks, Kansas City International (MCI), St. Louis Lambert (STL), Springfield-Branson (SGF), and Columbia Regional (COU). We service both private aviation and commercial flights at all locations.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book airport transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We recommend booking 24-48 hours in advance for commercial airport shuttles (MCI, STL, SGF). For private aviation and Grand Glaize Airport pickups, same-day service is often available. Call (573) 206-9499 for last-minute bookings - we accommodate whenever possible.',
      },
    },
  ],
}

export default async function LakeOzarksAirportTransportationPage() {
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
          title={'Lake of the Ozarks Airport Transportation'}
          introduction={
            <>
              <p>
                Professional shuttle service from Grand Glaize Airport (KOZS), MCI, STL, and all major
                airports to Lake destinations. Private aviation specialists.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Airport Transportation'}
          bookingLocation="lake-ozarks-airport-transportation-hero"
          bookingHref="/book"
        />

        {/* Airport Coverage */}
        <LocationSection id="local-section-1" title={'Airports We Service'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Grand Glaize (KOZS)',
                description: (
                  <>
                    <p>Lee C. Fine Memorial Airport</p>
                    <p>At Lake of the Ozarks</p>
                  </>
                ),
              },
              {
                title: 'Kansas City (MCI)',
                description: (
                  <>
                    <p>Kansas City International</p>
                    <p>2-2.5 hours</p>
                  </>
                ),
              },
              {
                title: 'St. Louis (STL)',
                description: (
                  <>
                    <p>Lambert International</p>
                    <p>2.5-3 hours</p>
                  </>
                ),
              },
              {
                title: 'Springfield (SGF)',
                description: (
                  <>
                    <p>Springfield-Branson Airport</p>
                    <p>1.5-2 hours</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Key Benefits */}
        <LocationSection id="local-section-2" title={'Why Choose Our Airport Transportation'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Flight Tracking',
                description: (
                  <>
                    <p>
                      We monitor all flights in real-time and adjust for delays automatically. No extra
                      charges for late arrivals.
                    </p>
                  </>
                ),
              },
              {
                title: 'Private Aviation Ready',
                description: (
                  <>
                    <p>
                      FBO coordination at Grand Glaize Airport. Luxury vehicles perfect for executive and VIP
                      clients.
                    </p>
                  </>
                ),
              },
              {
                title: 'Door-to-Door Service',
                description: (
                  <>
                    <p>
                      From any airport directly to your Lake destination. Hotels, resorts, vacation rentals,
                      private homes.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Routes */}
        <LocationSection id="local-section-3" title={'Popular Airport Routes'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'MCI to Lake of the Ozarks',
                href: '/kansas-city-to-lake-ozarks',
                description: (
                  <>
                    <p>Kansas City International to Lake destinations</p>
                  </>
                ),
              },
              {
                title: 'STL to Lake of the Ozarks',
                href: '/st-louis-to-lake-ozarks',
                description: (
                  <>
                    <p>St. Louis Lambert to Lake destinations</p>
                  </>
                ),
              },
              {
                title: 'SGF to Lake of the Ozarks',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>Springfield-Branson to Lake destinations</p>
                  </>
                ),
              },
              {
                title: 'Grand Glaize Airport (KOZS)',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>Private aviation transfers at the Lake</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Lake Destinations from Airport */}
        <LocationSection id="local-section-4" title={'Lake Destinations We Serve from Airports'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Osage Beach',
                description: (
                  <>
                    <p>Hotels, resorts, Margaritaville, Tan-Tar-A</p>
                  </>
                ),
              },
              {
                title: 'Camdenton',
                description: (
                  <>
                    <p>Lake homes, vacation rentals, Old Kinderhook</p>
                  </>
                ),
              },
              {
                title: 'Lake Ozark',
                description: (
                  <>
                    <p>Downtown, Lodge of Four Seasons, waterfront</p>
                  </>
                ),
              },
              {
                title: 'Private Lake Homes',
                description: (
                  <>
                    <p>Anywhere around the Lake - door-to-door service</p>
                  </>
                ),
              },
              {
                title: 'Wedding Venues',
                description: (
                  <>
                    <p>All major Lake Ozarks wedding locations</p>
                  </>
                ),
              },
              {
                title: 'Golf Resorts',
                description: (
                  <>
                    <p>Tan-Tar-A, Old Kinderhook, Osage National</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Transportation Services */}
        <LocationSection id="local-section-5" title={'Airport Transportation Services'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Commercial Flight Shuttles',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>MCI, STL, SGF, COU to Lake Ozarks</p>
                  </>
                ),
              },
              {
                title: 'Private Aviation',
                href: '/services/private-aviation-transfers',
                description: (
                  <>
                    <p>FBO coordination, executive service</p>
                  </>
                ),
              },
              {
                title: 'Wedding Guest Airport Shuttles',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Multi-passenger coordination from airports</p>
                  </>
                ),
              },
              {
                title: 'Corporate Airport Transfers',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Executive transportation for business travelers</p>
                  </>
                ),
              },
              {
                title: 'Large Group Airport Service',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Coordinate 50+ passengers from airports</p>
                  </>
                ),
              },
              {
                title: 'Round-Trip Airport Shuttles',
                href: '/services',
                description: (
                  <>
                    <p>Discounted rates for round-trip service</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Airport Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'What is the closest airport to Lake of the Ozarks?',
              answer:
                'Lee C. Fine Memorial Airport (KOZS), also known as Grand Glaize Airport, is located right at Lake of the Ozarks in Osage Beach. It serves private aircraft and charter flights. For commercial flights, Kansas City International (MCI) is 2-2.5 hours away, and St. Louis Lambert (STL) is 2.5-3 hours away.',
            },
            {
              question: 'Do you provide transportation from Grand Glaize Airport (KOZS)?',
              answer:
                'Yes! We provide prompt pickup service from Grand Glaize Airport (Lee C. Fine Memorial Airport - KOZS) in Osage Beach. Perfect for private aircraft arrivals. We can meet you planeside or at the FBO and transport you anywhere around Lake of the Ozarks.',
            },
            {
              question: 'How much does airport transportation cost at Lake of the Ozarks?',
              answer:
                'Airport-transfer pricing depends on the airport, exact pickup and destination, vehicle, passenger count, luggage, timing, and whether you need one-way or round-trip service. Check our current pricing page and request an exact quote.',
            },
            {
              question: 'Can you accommodate private aviation and charter flights?',
              answer:
                'Absolutely! We specialize in private aviation transportation at Lake of the Ozarks. We coordinate with FBOs at Grand Glaize Airport (KOZS) and monitor flight arrival times. Our luxury vehicles are perfect for executive and VIP clients arriving by private jet.',
            },
            {
              question: 'Do you track commercial flights from MCI and STL?',
              answer:
                'Yes! We track all commercial flights from Kansas City (MCI), St. Louis (STL), Springfield (SGF), and Columbia (COU) in real-time. If your flight is delayed, we automatically adjust pickup times at no extra charge. Your driver will be waiting when you land.',
            },
            {
              question: 'What airports do you service for Lake of the Ozarks transportation?',
              answer:
                'We provide transportation to/from Grand Glaize Airport (KOZS) at Lake of the Ozarks, Kansas City International (MCI), St. Louis Lambert (STL), Springfield-Branson (SGF), and Columbia Regional (COU). We service both private aviation and commercial flights at all locations.',
            },
            {
              question: 'How far in advance should I book airport transportation?',
              answer:
                'We recommend booking 24-48 hours in advance for commercial airport shuttles (MCI, STL, SGF). For private aviation and Grand Glaize Airport pickups, same-day service is often available. Call (573) 206-9499 for last-minute bookings - we accommodate whenever possible.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Airport Clients Say"
          subtitle="Real experiences from customers using our airport transportation service"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Kansas City to Lake Ozarks',
              href: '/kansas-city-to-lake-ozarks',
              description: 'Dedicated shuttle service from MCI Airport',
            },
            {
              title: 'St. Louis to Lake Ozarks',
              href: '/st-louis-to-lake-ozarks',
              description: 'Professional shuttle from STL Airport',
            },
            {
              title: 'Private Aviation Transportation',
              href: '/services/private-aviation-transfers',
              description: 'Executive FBO coordination and luxury transfers',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Airport Transportation?'}
          description={
            <>
              <p>Professional shuttle service from all major airports to Lake of the Ozarks</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="lake-ozarks-airport-transportation-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

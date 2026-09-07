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
  title: 'St. Louis to Lake Ozarks Shuttle | Lake Ride Pros',
  description:
    'Private shuttle service from St. Louis and STL Airport to Lake of the Ozarks, with professional drivers and door-to-door transportation.',
  keywords: [
    'St Louis to Lake of the Ozarks',
    'STL airport to Lake Ozarks shuttle',
    'St Louis airport shuttle',
    'STL to Osage Beach transportation',
    'Lambert Airport to Lake of the Ozarks',
    'St Louis to Camdenton shuttle',
    'private shuttle STL to Lake Ozarks',
    'group transportation St Louis to Lake',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
  },
  openGraph: {
    title: 'St Louis to Lake of the Ozarks Transportation | Lake Ride Pros',
    description:
      'Professional shuttle service from St. Louis Lambert Airport (STL) to Lake of the Ozarks. Luxury vehicles, experienced drivers, flight tracking.',
    url: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'St Louis to Lake Ozarks Transportation' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'St Louis to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Professional shuttle service from St. Louis (STL) to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - St Louis to Lake of the Ozarks Shuttle',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
  url: 'https://www.lakeridepros.com/st-louis-to-lake-ozarks',
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
      name: 'St. Louis',
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
    latitude: 38.7486,
    longitude: -90.37,
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury shuttle service from St. Louis Lambert Airport to Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a shuttle from St. Louis to Lake of the Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'STL Airport transportation pricing depends on the vehicle, exact pickup and destination, timing, passenger count, luggage, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long is the drive from St. Louis to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The drive from St. Louis Lambert Airport (STL) to Lake of the Ozarks is approximately 2.5 to 3 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you track flights from STL Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We track all incoming flights from St. Louis Lambert Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate large groups from St. Louis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in group transportation from St. Louis to Lake of the Ozarks. Our current fleet includes a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. We can coordinate multiple vehicles for larger groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where do you pick up at STL Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We pick up at both Terminal 1 and Terminal 2 at St. Louis Lambert International Airport. Your driver will meet you at baggage claim with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide round-trip service from St. Louis to Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Round-trip shuttle service from STL to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, weddings, and lake vacations. Book both legs together and save.',
      },
    },
    {
      '@type': 'Question',
      name: 'What vehicles do you use for St. Louis to Lake Ozarks shuttles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use luxury Mercedes Sprinter vans, comfortable limo buses, and spacious shuttle buses for STL to Lake of the Ozarks routes. All vehicles feature premium seating, climate control, ample luggage space, and are meticulously maintained for safety and comfort.',
      },
    },
  ],
}

export default async function StLouisToLakeOzarksPage() {
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
          title={'St. Louis to Lake of the Ozarks Transportation'}
          introduction={
            <>
              <p>
                Professional shuttle service from STL Airport to Lake of the Ozarks. Flight tracking, luxury
                vehicles, door-to-door service.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Your STL Shuttle'}
          bookingLocation="st-louis-to-lake-ozarks-hero"
          bookingHref="/book"
        />

        {/* Key Benefits */}
        <LocationSection
          id="local-section-1"
          title={'Why Choose Our St. Louis to Lake Ozarks Shuttle'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Flight Tracking',
                description: (
                  <>
                    <p>
                      We monitor your STL flight in real-time and adjust pickup for delays automatically at no
                      extra charge.
                    </p>
                  </>
                ),
              },
              {
                title: 'Group Friendly',
                description: (
                  <>
                    <p>
                      Comfortable vehicles for 2-37 passengers. Perfect for families, wedding parties, and
                      corporate groups.
                    </p>
                  </>
                ),
              },
              {
                title: 'Professional Drivers',
                description: (
                  <>
                    <p>
                      Licensed, DOT-compliant drivers who know the STL to Lake Ozarks route like the back of
                      their hand.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Lake Destinations */}
        <LocationSection id="local-section-2" title={'Popular Lake Destinations from St. Louis'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Tan-Tar-A Resort',
                description: (
                  <>
                    <p>Weddings, conferences, golf getaways from STL</p>
                  </>
                ),
              },
              {
                title: 'Margaritaville Lake Resort',
                description: (
                  <>
                    <p>Direct shuttle from STL Airport to Margaritaville</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach',
                description: (
                  <>
                    <p>Hotels, vacation rentals, Bagnell Dam Strip</p>
                  </>
                ),
              },
              {
                title: 'Camdenton',
                description: (
                  <>
                    <p>Lake homes, vacation properties, event venues</p>
                  </>
                ),
              },
              {
                title: 'Lake Ozark',
                description: (
                  <>
                    <p>Downtown Lake Ozark, waterfront resorts</p>
                  </>
                ),
              },
              {
                title: 'Private Lake Homes',
                description: (
                  <>
                    <p>Door-to-door service to any Lake address</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services Available */}
        <LocationSection
          id="local-section-3"
          title={'St. Louis to Lake Ozarks Transportation Services'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Airport Shuttle',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>STL Airport to Lake of the Ozarks direct</p>
                  </>
                ),
              },
              {
                title: 'Wedding Guest Shuttles',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>STL Airport for destination weddings at the Lake</p>
                  </>
                ),
              },
              {
                title: 'Corporate Transportation',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Executive shuttles for Lake Ozarks conferences</p>
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
                    <p>Discounted rates for round-trip STL shuttles</p>
                  </>
                ),
              },
              {
                title: 'Private Aviation',
                href: '/services/private-aviation-transfers',
                description: (
                  <>
                    <p>FBO pickup at STL, private jet coordination</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Lake Ride Pros */}
        <LocationSection id="local-section-4" title={'Why Lake Ride Pros for STL to Lake Ozarks'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'We Know Both Ends',
                description: (
                  <>
                    <p>
                      Familiar with STL Airport terminals and every Lake destination. No GPS guessing, just
                      local expertise.
                    </p>
                  </>
                ),
              },
              {
                title: "We Don't Cancel",
                description: (
                  <>
                    <p>
                      Unlike rideshare services, your shuttle is guaranteed. We've never cancelled on a
                      customer - ever.
                    </p>
                  </>
                ),
              },
              {
                title: '24/7 Availability',
                description: (
                  <>
                    <p>
                      Early morning flights, late arrivals - we run shuttles from STL to Lake Ozarks around
                      the clock.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'St. Louis to Lake Ozarks Shuttle FAQs'}
          tone="white"
          items={[
            {
              question: 'How much does a shuttle from St. Louis to Lake of the Ozarks cost?',
              answer:
                'STL Airport transportation pricing depends on the vehicle, exact pickup and destination, timing, passenger count, luggage, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote.',
            },
            {
              question: 'How long is the drive from St. Louis to Lake of the Ozarks?',
              answer:
                'The drive from St. Louis Lambert Airport (STL) to Lake of the Ozarks is approximately 2.5 to 3 hours depending on your final destination (Osage Beach, Camdenton, or Lake Ozark). Our professional drivers take the most efficient routes and monitor traffic in real-time.',
            },
            {
              question: 'Do you track flights from STL Airport?',
              answer:
                'Yes! We track all incoming flights from St. Louis Lambert Airport in real-time. If your flight is delayed, we automatically adjust your pickup time at no extra charge. We monitor arrivals and will be waiting when you land.',
            },
            {
              question: 'Can you accommodate large groups from St. Louis?',
              answer:
                'Absolutely! We specialize in group transportation from St. Louis to Lake of the Ozarks. Our current fleet includes a 13-passenger Executive Sprinter, 14-passenger limo-style vehicles, a 23-passenger Pink Patrol bus, and a 37-passenger Executive Shuttle. We can coordinate multiple vehicles for larger groups.',
            },
            {
              question: 'Where do you pick up at STL Airport?',
              answer:
                'We pick up at both Terminal 1 and Terminal 2 at St. Louis Lambert International Airport. Your driver will meet you at baggage claim with a Lake Ride Pros sign. We provide detailed pickup instructions upon booking confirmation.',
            },
            {
              question: 'Do you provide round-trip service from St. Louis to Lake of the Ozarks?',
              answer:
                'Yes! Round-trip shuttle service from STL to Lake of the Ozarks is available at discounted rates compared to booking two one-way trips. Perfect for weekend getaways, weddings, and lake vacations. Book both legs together and save.',
            },
            {
              question: 'What vehicles do you use for St. Louis to Lake Ozarks shuttles?',
              answer:
                'We use luxury Mercedes Sprinter vans, comfortable limo buses, and spacious shuttle buses for STL to Lake of the Ozarks routes. All vehicles feature premium seating, climate control, ample luggage space, and are meticulously maintained for safety and comfort.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our St. Louis Clients Say"
          subtitle="Real experiences from customers traveling from St. Louis to Lake of the Ozarks"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Kansas City to Lake Ozarks',
              href: '/kansas-city-to-lake-ozarks',
              description: 'Professional shuttle from MCI Airport to Lake of the Ozarks',
            },
            {
              title: 'Airport Shuttle Service',
              href: '/services/airport-transfers',
              description: 'All major Missouri airports to Lake destinations',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Guest shuttles for destination weddings at the Lake',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your STL to Lake Ozarks Shuttle?'}
          description={
            <>
              <p>Professional shuttle service from St. Louis Lambert Airport to Lake of the Ozarks</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="st-louis-to-lake-ozarks-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

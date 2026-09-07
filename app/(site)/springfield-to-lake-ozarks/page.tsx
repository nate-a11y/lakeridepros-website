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
  title: 'Springfield to Lake Ozarks Shuttle | Lake Ride Pros',
  description:
    'Private shuttle service from Springfield to Lake of the Ozarks for groups, families and SGF airport connections. Door-to-door service available.',
  keywords: [
    'Springfield to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Springfield',
    'Springfield MO to Lake Ozarks',
    'SGF airport to Lake Ozarks',
    'Missouri State to Lake Ozarks',
    'Springfield to Osage Beach',
    'Bass Pro to Lake Ozarks transportation',
    'Springfield corporate retreat Lake Ozarks',
    'Branson alternative Lake transportation',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/springfield-to-lake-ozarks',
  },
  openGraph: {
    title: 'Springfield MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description:
      'Direct shuttle service from Springfield to Lake of the Ozarks. SGF airport connections available.',
    url: 'https://www.lakeridepros.com/springfield-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Springfield to Lake Ozarks Transportation' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Springfield MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Springfield to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Springfield to Lake of the Ozarks Transportation Service',
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
      name: 'Springfield',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Springfield',
        addressRegion: 'MO',
        addressCountry: 'US',
      },
    },
    {
      '@type': 'City',
      name: 'Lake of the Ozarks',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lake of the Ozarks',
        addressRegion: 'MO',
        addressCountry: 'US',
      },
    },
  ],
  description:
    'Direct shuttle transportation service from Springfield, Missouri to Lake of the Ozarks, including SGF airport connections',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Springfield MO from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Springfield, Missouri is approximately 115 miles (2 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend trips easy for Springfield residents and Missouri State students.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Springfield airport (SGF) to Lake Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Springfield-Branson National Airport (SGF) to Lake of the Ozarks is a popular route. We provide direct airport transfers for travelers flying into Springfield who are heading to the Lake for weddings, vacations, or events.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Springfield to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricing from Springfield to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.lakeridepros.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Cities',
      item: 'https://www.lakeridepros.com/services',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Springfield to Lake Ozarks',
      item: 'https://www.lakeridepros.com/springfield-to-lake-ozarks',
    },
  ],
}

export default async function SpringfieldToLakeOzarksPage() {
  // Fetch random 5-star testimonials
  const testimonials = await getRandomTestimonials(3, false, 5).catch(() => [])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white text-lrp-black">
        {/* Hero Section */}
        <LocationHero
          title={'Springfield to Lake of the Ozarks Transportation'}
          introduction={
            <>
              <p>
                Direct shuttle service from Springfield, MO to the Lake. SGF airport transfers, group trips,
                weekend getaways. Just 2 hours to paradise.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Your Springfield Shuttle'}
          bookingLocation="springfield-to-lake-ozarks-hero"
          bookingHref="/book"
        />

        {/* Route Info */}
        <LocationSection id="local-section-1" title={'Springfield to Lake Ozarks: Easy Access'} tone="white">
          <LocationEditorialList
            layout="facts"
            items={[
              {
                title: '115 Miles',
                description: (
                  <>
                    <p>Springfield to Osage Beach</p>
                  </>
                ),
              },
              {
                title: '2 Hours',
                description: (
                  <>
                    <p>Direct drive time</p>
                  </>
                ),
              },
              {
                title: 'SGF Airport',
                description: (
                  <>
                    <p>Direct transfers available</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Springfield Residents Choose Us */}
        <LocationSection id="local-section-2" title={'Why Springfield Chooses Lake Ride Pros'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'SGF Airport to Lake Ozarks',
                description: (
                  <>
                    <p>
                      Flying into Springfield-Branson National Airport (SGF) for a Lake wedding or vacation?
                      We provide direct airport transfers to all Lake of the Ozarks destinations. Popular for
                      destination weddings and fly-in guests.
                    </p>
                  </>
                ),
              },
              {
                title: 'Missouri State Student Groups',
                description: (
                  <>
                    <p>
                      Missouri State University students love Lake weekends. We pick up from campus, student
                      housing, and anywhere in Springfield. Perfect for spring break trips, birthday weekends,
                      and Greek events.
                    </p>
                  </>
                ),
              },
              {
                title: 'Bass Pro & Corporate Groups',
                description: (
                  <>
                    <p>
                      Springfield is home to Bass Pro Shops headquarters. We transport corporate groups,
                      executives, and teams from Bass Pro and other Springfield companies for Lake of the
                      Ozarks retreats, team building events, and client entertainment. The Lake is a natural
                      fit for outdoor-focused corporate culture.
                    </p>
                  </>
                ),
              },
              {
                title: 'Common Springfield Routes',
                description: (
                  <>
                    <ul>
                      <li>• SGF Airport ↔ Lake of the Ozarks venues (weddings, events)</li>
                      <li>• Springfield ↔ Tan-Tar-A Resort</li>
                      <li>• Springfield ↔ Margaritaville Lake Resort</li>
                      <li>• Missouri State campus ↔ Bagnell Dam Strip (nightlife)</li>
                      <li>• Springfield ↔ Lake vacation rentals</li>
                      <li>• Bass Pro HQ ↔ Lake corporate retreats</li>
                    </ul>
                    <p>
                      <strong>Route:</strong> US-65 N to US-54 E • ~115 miles • 2 hours
                    </p>
                    <p>
                      <strong>Not Branson:</strong> Lake of the Ozarks offers a different vibe than
                      Branson—more water activities, nightlife, and lakefront entertainment. We make it easy
                      to experience the Lake from Springfield.
                    </p>
                  </>
                ),
              },
              {
                title: 'Weekend Getaway Specialist',
                description: (
                  <>
                    <p>
                      At 2 hours, Springfield to Lake Ozarks is perfect for weekend trips. We drop you off
                      Friday evening, you enjoy the Lake all weekend, and we pick you up Sunday afternoon.
                      Popular for family reunions and friend group getaways.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Springfield Trips */}
        <LocationSection id="local-section-3" title={'Popular Lake Trips from Springfield'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'SGF Airport Transfers',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>Direct from Springfield airport to Lake venues</p>
                  </>
                ),
              },
              {
                title: 'Destination Weddings',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Fly-in guest transportation</p>
                  </>
                ),
              },
              {
                title: 'Bachelor/Bachelorette Parties',
                href: '/services/bachelor-party-transportation',
                description: (
                  <>
                    <p>Party bus and Lake weekend shuttles</p>
                  </>
                ),
              },
              {
                title: 'Family Reunions',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Large group Lake getaways</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Springfield to Lake Ozarks Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'How far is Springfield MO from Lake of the Ozarks?',
              answer:
                'Springfield, Missouri is approximately 115 miles (2 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend trips easy for Springfield residents and Missouri State students.',
            },
            {
              question: 'Do you provide transportation from Springfield airport (SGF) to Lake Ozarks?',
              answer:
                'Yes! Springfield-Branson National Airport (SGF) to Lake of the Ozarks is a popular route. We provide direct airport transfers for travelers flying into Springfield who are heading to the Lake for weddings, vacations, or events.',
            },
            {
              question: 'How much does shuttle service from Springfield to Lake Ozarks cost?',
              answer:
                'Pricing from Springfield to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
            },
            {
              question: 'Do you pick up from Missouri State University?',
              answer:
                'Yes! We provide pickups from Missouri State campus, student housing, and anywhere in Springfield. Popular for student group Lake trips, spring break weekends, and Greek life events.',
            },
            {
              question: 'Can you do multi-day service for Springfield groups?',
              answer:
                'Absolutely! Popular for weekend Lake getaways. We drop you off Friday, you enjoy the Lake all weekend, and we pick you up Sunday. We can also provide transportation during your stay if needed.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Springfield Clients Say"
          subtitle="Real experiences from customers traveling from Springfield to Lake of the Ozarks"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Airport Shuttle',
              href: '/services/airport-transfers',
              description: 'Direct airport transfers from SGF, MCI, and STL',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Guest shuttles for destination Lake weddings',
            },
            {
              title: 'Group Event Transportation',
              href: '/services/group-event-transportation',
              description: 'Large group shuttle service for weekend trips',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Springfield to Lake Ozarks Shuttle?'}
          description={
            <>
              <p>SGF airport transfers and direct Springfield service—2 hours to the Lake</p>
            </>
          }
          bookingLabel={'Book Your Shuttle'}
          bookingLocation="springfield-to-lake-ozarks-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

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
  title: 'Transportation in Osage Beach MO | Lake Ride Pros',
  description:
    'Premier transportation service in Osage Beach, Missouri. Serving Tan-Tar-A, Margaritaville, Bagnell Dam Strip. Weddings, events, airport shuttle, nightlife.',
  keywords: [
    'Osage Beach transportation',
    'Osage Beach shuttle service',
    'Osage Beach taxi',
    'Tan-Tar-A transportation',
    'Margaritaville shuttle Osage Beach',
    'Bagnell Dam Strip transportation',
    'Osage Beach wedding transportation',
    'Osage Beach airport shuttle',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-osage-beach',
  },
  openGraph: {
    title: 'Transportation in Osage Beach MO | Lake Ride Pros',
    description:
      'Professional transportation throughout Osage Beach. Serving Tan-Tar-A, Margaritaville, Bagnell Dam Strip & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-osage-beach',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Osage Beach Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Osage Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Osage Beach.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Osage Beach Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-osage-beach',
  url: 'https://www.lakeridepros.com/transportation-osage-beach',
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
    name: 'Osage Beach',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1028,
    longitude: -92.6332,
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Osage Beach, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Tan-Tar-A Resort?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide transportation to and from Tan-Tar-A Resort for weddings, conferences, and events. We handle shuttles between Tan-Tar-A and nearby hotels, airports, and attractions throughout Osage Beach.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you shuttle guests along the Bagnell Dam Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Absolutely! We specialize in Bagnell Dam Strip transportation. Whether you're bar hopping or visiting multiple restaurants, we provide safe, reliable shuttle service throughout the Strip in Osage Beach.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Osage Beach transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book Osage Beach transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For peak season (May-September) and major events, we recommend booking 2-4 weeks in advance. For off-season and last-minute needs in Osage Beach, call us at (573) 206-9499 - we often have availability with 24-48 hour notice.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you service Margaritaville Lake Resort in Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Margaritaville Lake Resort is one of our most frequent pickup and drop-off locations in Osage Beach. We provide wedding transportation, guest shuttles, airport transfers, and event transportation for Margaritaville guests and event attendees.',
      },
    },
  ],
}

export default async function OsageBeachTransportationPage() {
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
          title={'Professional Transportation in Osage Beach, Missouri'}
          introduction={
            <>
              <p>
                From Tan-Tar-A to the Bagnell Dam Strip, we know every venue, hotel, and hotspot in Osage
                Beach. Luxury transportation you can count on.
              </p>
            </>
          }
          image={locationPhotography.shuttle}
          bookingLabel={'Book Your Osage Beach Ride'}
          bookingLocation="transportation-osage-beach-hero"
          bookingHref="/book"
        />

        {/* Popular Destinations */}
        <LocationSection
          id="local-section-1"
          title={'Popular Osage Beach Destinations We Serve'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Tan-Tar-A Resort',
                description: (
                  <>
                    <p>Weddings, conferences, events, and guest shuttles</p>
                  </>
                ),
              },
              {
                title: 'Margaritaville Lake Resort',
                description: (
                  <>
                    <p>Wedding venue transportation, party shuttles, corporate events</p>
                  </>
                ),
              },
              {
                title: 'Bagnell Dam Strip',
                description: (
                  <>
                    <p>Nightlife transport, bar hopping, restaurant shuttles</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach Premium Outlets',
                description: (
                  <>
                    <p>Shopping shuttles for groups and families</p>
                  </>
                ),
              },
              {
                title: 'Osage National Golf Club',
                description: (
                  <>
                    <p>Golf outing transportation and tournament shuttles</p>
                  </>
                ),
              },
              {
                title: 'Waterfront Bars & Restaurants',
                description: (
                  <>
                    <p>Dog Days, Backwater Jack's, Shady Gators, and more</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services in Osage Beach */}
        <LocationSection id="local-section-2" title={'Transportation Services in Osage Beach'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Wedding Transportation',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Tan-Tar-A, Margaritaville, waterfront venues</p>
                  </>
                ),
              },
              {
                title: 'Airport Shuttle',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>KC, STL, Springfield to Osage Beach</p>
                  </>
                ),
              },
              {
                title: 'Nightlife & Bar Hopping',
                href: '/services/party-bus-nightlife',
                description: (
                  <>
                    <p>Bagnell Dam Strip, lakefront bars, party bus</p>
                  </>
                ),
              },
              {
                title: 'Corporate Transportation',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Tan-Tar-A conferences, team retreats, client entertainment</p>
                  </>
                ),
              },
              {
                title: 'Event Shuttles',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Concerts, festivals, group events in Osage Beach</p>
                  </>
                ),
              },
              {
                title: 'Hotel Transfers',
                href: '/services',
                description: (
                  <>
                    <p>Between Osage Beach accommodations and venues</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Us */}
        <LocationSection id="local-section-3" title={'Why Choose Lake Ride Pros in Osage Beach'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Based in Lake of the Ozarks',
                description: (
                  <>
                    <p>
                      We're locals, not a national chain. Our drivers know every road, venue, and shortcut in
                      Osage Beach.
                    </p>
                  </>
                ),
              },
              {
                title: 'Know Every Venue',
                description: (
                  <>
                    <p>
                      Tan-Tar-A, Margaritaville, the Strip - we've transported thousands to every Osage Beach
                      location.
                    </p>
                  </>
                ),
              },
              {
                title: '24/7 Availability',
                description: (
                  <>
                    <p>
                      Serving Osage Beach around the clock, year-round. Day trips, late nights, early mornings
                      - we're ready.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Osage Beach Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'Do you provide transportation to Tan-Tar-A Resort?',
              answer:
                'Yes! We provide transportation to and from Tan-Tar-A Resort for weddings, conferences, and events. We handle shuttles between Tan-Tar-A and nearby hotels, airports, and attractions throughout Osage Beach.',
            },
            {
              question: 'Can you shuttle guests along the Bagnell Dam Strip?',
              answer:
                "Absolutely! We specialize in Bagnell Dam Strip transportation. Whether you're bar hopping or visiting multiple restaurants, we provide safe, reliable shuttle service throughout the Strip in Osage Beach.",
            },
            {
              question: 'How much does transportation cost in Osage Beach?',
              answer:
                'Osage Beach transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
            },
            {
              question: 'How far in advance should I book Osage Beach transportation?',
              answer:
                'For peak season (May-September) and major events, we recommend booking 2-4 weeks in advance. For off-season and last-minute needs in Osage Beach, call us at (573) 206-9499 - we often have availability with 24-48 hour notice.',
            },
            {
              question: 'Do you service Margaritaville Lake Resort in Osage Beach?',
              answer:
                'Yes! Margaritaville Lake Resort is one of our most frequent pickup and drop-off locations in Osage Beach. We provide wedding transportation, guest shuttles, airport transfers, and event transportation for Margaritaville guests and event attendees.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Osage Beach Clients Say"
          subtitle="Real experiences from customers we've served in Osage Beach"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Tan-Tar-A Transportation',
              href: '/services/tan-tar-a-transportation',
              description: 'Dedicated shuttle service for Tan-Tar-A Resort events',
            },
            {
              title: 'Margaritaville Transportation',
              href: '/services/margaritaville-transportation',
              description: 'Resort guest and event transportation for Margaritaville',
            },
            {
              title: 'Nightlife Transportation',
              href: '/services/party-bus-nightlife',
              description: 'Bagnell Dam Strip bar hopping and party bus rentals',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Osage Beach Transportation?'}
          description={
            <>
              <p>Professional, reliable service throughout Osage Beach</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="transportation-osage-beach-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

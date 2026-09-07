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
  title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
  description:
    'Private transportation in Sunrise Beach, Missouri, serving condos, resorts and vacation rentals for weddings, nightlife and airport transfers.',
  keywords: [
    'Sunrise Beach transportation',
    'Sunrise Beach shuttle service',
    'Sunrise Beach Missouri taxi',
    'Sunrise Beach to Bagnell Dam',
    'Sunrise Beach wedding transportation',
    'Lake Ozarks west side transportation',
    'Sunrise Beach condo shuttle',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-sunrise-beach',
  },
  openGraph: {
    title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
    description:
      'Professional transportation throughout Sunrise Beach. Serving condos, resorts, and vacation rentals on the west side of Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/transportation-sunrise-beach',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Sunrise Beach Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Sunrise Beach MO | Lake Ride Pros',
    description: 'Professional transportation throughout Sunrise Beach.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Sunrise Beach Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-sunrise-beach',
  url: 'https://www.lakeridepros.com/transportation-sunrise-beach',
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
    name: 'Sunrise Beach',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1667,
    longitude: -92.7833,
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Sunrise Beach, Missouri along MO-5 and MO-7',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Sunrise Beach to Bagnell Dam Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Sunrise Beach to Bagnell Dam Strip is one of our most popular routes—just 15-20 minutes. We provide nightlife shuttles, bar hopping transportation, and safe rides home for Sunrise Beach condo guests and vacation renters.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas of Sunrise Beach do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We serve all of Sunrise Beach including Mile Markers 20-40, condos along MO-5 and MO-7, vacation rentals, and the 65079 ZIP code area. We also cover nearby Gravois Mills and the west side of Lake of the Ozarks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sunrise Beach transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide wedding transportation in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We provide wedding transportation for Sunrise Beach venues, guest shuttles between vacation rentals and ceremony/reception locations, and airport transfers for destination wedding guests.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there Uber or Lyft in Sunrise Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rideshare availability in Sunrise Beach and the Lake of the Ozarks area is very limited, especially on weekends and late nights. Lake Ride Pros provides reliable, professional transportation with guaranteed availability when you book in advance.',
      },
    },
  ],
}

export default async function SunriseBeachTransportationPage() {
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
          title={'Professional Transportation in Sunrise Beach, Missouri'}
          introduction={
            <>
              <p>
                Serving the west side of Lake of the Ozarks. From condos along Mile Markers 20-40 to Bagnell
                Dam Strip nightlife—reliable transportation when rideshare isn't available.
              </p>
            </>
          }
          image={locationPhotography.suv}
          bookingLabel={'Book Your Sunrise Beach Ride'}
          bookingLocation="transportation-sunrise-beach-hero"
          bookingHref="/book"
          facts={[
            { label: 'to Bagnell Dam Strip', value: '15 min' },
            { label: 'Full coverage area', value: 'MM 20-40' },
            { label: 'ZIP code served', value: '65079' },
            { label: 'Highway access', value: 'MO-5 & MO-7' },
          ]}
        />

        {/* Quick Stats */}

        {/* Popular Destinations */}
        <LocationSection
          id="local-section-1"
          title={'Popular Sunrise Beach Destinations We Serve'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Sunrise Beach Condos',
                description: (
                  <>
                    <p>Vacation rentals, condo complexes, and lakefront properties</p>
                  </>
                ),
              },
              {
                title: 'Bagnell Dam Strip',
                description: (
                  <>
                    <p>Nightlife transportation, bar hopping, safe rides home</p>
                  </>
                ),
              },
              {
                title: 'Waterfront Restaurants',
                description: (
                  <>
                    <p>Dinner shuttles to lakefront dining throughout the area</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach',
                description: (
                  <>
                    <p>Shopping, Premium Outlets, restaurants, entertainment</p>
                  </>
                ),
              },
              {
                title: 'Camdenton',
                description: (
                  <>
                    <p>Camden County seat, shopping, dining, services</p>
                  </>
                ),
              },
              {
                title: 'Wedding Venues',
                description: (
                  <>
                    <p>Guest transportation to Lake area wedding locations</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services in Sunrise Beach */}
        <LocationSection id="local-section-2" title={'Transportation Services in Sunrise Beach'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Nightlife Transportation',
                href: '/bagnell-dam-strip-transportation',
                description: (
                  <>
                    <p>Sunrise Beach to Bagnell Dam Strip (15 min)</p>
                  </>
                ),
              },
              {
                title: 'Wedding Transportation',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Guest shuttles, venue transportation</p>
                  </>
                ),
              },
              {
                title: 'Airport Shuttle',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>KC, STL, Springfield to Sunrise Beach</p>
                  </>
                ),
              },
              {
                title: 'Group Event Shuttles',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Family reunions, corporate retreats, parties</p>
                  </>
                ),
              },
              {
                title: 'Bachelor/Bachelorette Parties',
                href: '/services/bachelor-party-transportation',
                description: (
                  <>
                    <p>Party bus, bar crawls, boat party shuttles</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach Transfers',
                href: '/transportation-osage-beach',
                description: (
                  <>
                    <p>Shopping, dining, entertainment</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Us */}
        <LocationSection
          id="local-section-3"
          title={'Why Choose Lake Ride Pros in Sunrise Beach'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'We Know the West Side',
                description: (
                  <>
                    <p>
                      Sunrise Beach, Gravois Mills, Laurie—we know every road, condo complex, and shortcut on
                      the west side of the Lake.
                    </p>
                  </>
                ),
              },
              {
                title: 'Guaranteed Availability',
                description: (
                  <>
                    <p>
                      Unlike rideshare apps with limited Lake coverage, we guarantee your ride when you book
                      in advance. No surge pricing surprises.
                    </p>
                  </>
                ),
              },
              {
                title: 'Late Night Service',
                description: (
                  <>
                    <p>
                      Bagnell Dam Strip bars close at 1:30 AM. We provide safe, reliable rides back to Sunrise
                      Beach condos and rentals.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Sunrise Beach Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'Do you provide transportation from Sunrise Beach to Bagnell Dam Strip?',
              answer:
                'Yes! Sunrise Beach to Bagnell Dam Strip is one of our most popular routes—just 15-20 minutes. We provide nightlife shuttles, bar hopping transportation, and safe rides home for Sunrise Beach condo guests and vacation renters.',
            },
            {
              question: 'What areas of Sunrise Beach do you serve?',
              answer:
                'We serve all of Sunrise Beach including Mile Markers 20-40, condos along MO-5 and MO-7, vacation rentals, and the 65079 ZIP code area. We also cover nearby Gravois Mills and the west side of Lake of the Ozarks.',
            },
            {
              question: 'How much does transportation cost in Sunrise Beach?',
              answer:
                'Sunrise Beach transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
            },
            {
              question: 'Do you provide wedding transportation in Sunrise Beach?',
              answer:
                'Absolutely! We provide wedding transportation for Sunrise Beach venues, guest shuttles between vacation rentals and ceremony/reception locations, and airport transfers for destination wedding guests.',
            },
            {
              question: 'Is there Uber or Lyft in Sunrise Beach?',
              answer:
                'Rideshare availability in Sunrise Beach and Lake of the Ozarks is very limited, especially on weekends and late nights. Lake Ride Pros provides reliable, professional transportation with guaranteed availability when you book in advance.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Sunrise Beach Clients Say"
          subtitle="Real experiences from customers we've served in Sunrise Beach"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Bagnell Dam Strip Transportation',
              href: '/bagnell-dam-strip-transportation',
              description: 'Bar hopping and nightlife shuttles',
            },
            {
              title: 'Osage Beach Transportation',
              href: '/transportation-osage-beach',
              description: 'Shopping, dining, and entertainment',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Guest shuttles for Lake weddings',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Sunrise Beach Transportation?'}
          description={
            <>
              <p>Professional, reliable service throughout Sunrise Beach and the west side</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="transportation-sunrise-beach-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

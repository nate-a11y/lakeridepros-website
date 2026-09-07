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
  title: 'Transportation in Camdenton MO | Lake Ride Pros',
  description:
    'Professional transportation service in Camdenton, Missouri. Serving Old Kinderhook, local wineries, downtown, and all venues. Weddings, wine tours, events.',
  keywords: [
    'Camdenton transportation',
    'Camdenton shuttle service',
    'Old Kinderhook transportation',
    'Camdenton wedding transportation',
    'Camdenton wine tour',
    'Camdenton Missouri taxi',
    'Camdenton airport shuttle',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-camdenton',
  },
  openGraph: {
    title: 'Transportation in Camdenton MO | Lake Ride Pros',
    description:
      'Premium transportation in Camdenton. Serving Old Kinderhook, wineries, downtown & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-camdenton',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Camdenton Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Camdenton MO | Lake Ride Pros',
    description: 'Premium transportation in Camdenton.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Camdenton Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-camdenton',
  url: 'https://www.lakeridepros.com/transportation-camdenton',
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
    name: 'Camdenton',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.0097,
    longitude: -92.7451,
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Camdenton, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Old Kinderhook Golf Course?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Old Kinderhook is one of our most popular wedding and golf outing destinations in Camdenton. We provide shuttles for weddings, corporate golf tournaments, and special events at Old Kinderhook throughout the year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer wine tour transportation in Camdenton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Camdenton and surrounding areas have excellent wineries. We provide custom wine tour transportation visiting multiple vineyards with a designated driver. Perfect for bachelorette parties, birthdays, and group outings.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Camdenton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Camdenton transportation pricing depends on the vehicle, group size, route, timing, and service duration. Wine tours and wedding plans are quoted for their specific itinerary. Check our current pricing page and request a personalized quote.',
      },
    },
  ],
}

export default async function CamdentonTransportationPage() {
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
          title={'Professional Transportation in Camdenton, Missouri'}
          introduction={
            <>
              <p>
                Serving Old Kinderhook, downtown Camdenton, local wineries, and all venues. Luxury
                transportation with small-town reliability.
              </p>
            </>
          }
          image={locationPhotography.shuttle}
          bookingLabel={'Book Your Camdenton Ride'}
          bookingLocation="transportation-camdenton-hero"
          bookingHref="/book"
        />

        {/* Popular Destinations */}
        <LocationSection id="local-section-1" title={'Popular Camdenton Destinations We Serve'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Old Kinderhook Golf Course',
                description: (
                  <>
                    <p>Premier wedding venue and golf tournament transportation</p>
                  </>
                ),
              },
              {
                title: 'Local Wineries',
                description: (
                  <>
                    <p>Wine tour shuttles to nearby vineyards and tasting rooms</p>
                  </>
                ),
              },
              {
                title: 'Downtown Camdenton',
                description: (
                  <>
                    <p>Restaurants, shops, and local business transportation</p>
                  </>
                ),
              },
              {
                title: 'Wedding Venues',
                description: (
                  <>
                    <p>Old Kinderhook and private estate wedding shuttles</p>
                  </>
                ),
              },
              {
                title: 'Vacation Rentals',
                description: (
                  <>
                    <p>Residential pickups throughout the Camdenton area</p>
                  </>
                ),
              },
              {
                title: 'Local Events',
                description: (
                  <>
                    <p>Community festivals, concerts, and special events</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services in Camdenton */}
        <LocationSection id="local-section-2" title={'Transportation Services in Camdenton'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Wedding Transportation',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Old Kinderhook and private venues</p>
                  </>
                ),
              },
              {
                title: 'Wine Tour Shuttles',
                href: '/services/wine-tour-shuttle',
                description: (
                  <>
                    <p>Visit multiple wineries safely</p>
                  </>
                ),
              },
              {
                title: 'Airport Transfers',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>KC, STL, Springfield to/from Camdenton</p>
                  </>
                ),
              },
              {
                title: 'Golf Outings',
                href: '/services/golf-outing-transportation',
                description: (
                  <>
                    <p>Old Kinderhook tournament shuttles</p>
                  </>
                ),
              },
              {
                title: 'Corporate Events',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Business meetings and team events</p>
                  </>
                ),
              },
              {
                title: 'Local Shuttles',
                href: '/services',
                description: (
                  <>
                    <p>Around town and residential pickups</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Us */}
        <LocationSection id="local-section-3" title={'Why Choose Lake Ride Pros in Camdenton'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Local Knowledge',
                description: (
                  <>
                    <p>
                      We know Camdenton's back roads, shortcuts, and every venue from Old Kinderhook to
                      downtown.
                    </p>
                  </>
                ),
              },
              {
                title: 'Wine Tour Specialists',
                description: (
                  <>
                    <p>
                      Custom wine tour routes with designated drivers. Sip safely while exploring local
                      wineries.
                    </p>
                  </>
                ),
              },
              {
                title: 'Personal Service',
                description: (
                  <>
                    <p>
                      Small-town service with luxury vehicles. We treat Camdenton customers like neighbors,
                      because you are.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Camdenton Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'Do you provide transportation to Old Kinderhook Golf Course?',
              answer:
                'Yes! Old Kinderhook is one of our most popular wedding and golf outing destinations in Camdenton. We provide shuttles for weddings, corporate golf tournaments, and special events at Old Kinderhook throughout the year.',
            },
            {
              question: 'Do you offer wine tour transportation in Camdenton?',
              answer:
                'Absolutely! Camdenton and surrounding areas have excellent wineries. We provide custom wine tour transportation visiting multiple vineyards with a designated driver. Perfect for bachelorette parties, birthdays, and group outings.',
            },
            {
              question: 'How much does transportation cost in Camdenton?',
              answer:
                'Camdenton transportation pricing depends on the vehicle, group size, route, timing, and service duration. Wine tours and wedding plans are quoted for their specific itinerary. Check our current pricing page and request a personalized quote.',
            },
            {
              question: 'Can you pick up from residential areas in Camdenton?',
              answer:
                'Yes! We service all residential areas in Camdenton including vacation rentals, private homes, and neighborhoods throughout the area. Just provide your address when booking.',
            },
            {
              question: 'Do you transport to other Lake Ozarks areas from Camdenton?',
              answer:
                'Absolutely! We frequently transport between Camdenton and Osage Beach, Lake Ozark, and other Lake of the Ozarks destinations. Perfect for multi-venue events or exploring different areas.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Camdenton Clients Say"
          subtitle="Real experiences from customers we've served in Camdenton"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Golf Outing Transportation',
              href: '/services/golf-outing-transportation',
              description: 'Golf course wedding and tournament transportation',
            },
            {
              title: 'Wine Tour Shuttle',
              href: '/services/wine-tour-shuttle',
              description: 'Designated driver for Lake Ozarks winery tours',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Full-service wedding shuttles for all Lake venues',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Camdenton Transportation?'}
          description={
            <>
              <p>Professional service throughout Camdenton and surrounding areas</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="transportation-camdenton-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

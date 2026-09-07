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
  title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
  description:
    'Professional transportation service in Lake Ozark, Missouri. Serving Lodge of Four Seasons, waterfront properties, events. Weddings, corporate, airport shuttle.',
  keywords: [
    'Lake Ozark transportation',
    'Lake Ozark shuttle service',
    'Lodge of Four Seasons transportation',
    'Lake Ozark wedding transportation',
    'Lake Ozark Missouri taxi',
    'Lake Ozark airport shuttle',
    'waterfront property transportation',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-lake-ozark',
  },
  openGraph: {
    title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
    description:
      'Premium transportation in Lake Ozark. Serving Lodge of Four Seasons, waterfront properties & all major venues.',
    url: 'https://www.lakeridepros.com/transportation-lake-ozark',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ozark Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Lake Ozark MO | Lake Ride Pros',
    description: 'Premium transportation in Lake Ozark.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Lake Ozark Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-lake-ozark',
  url: 'https://www.lakeridepros.com/transportation-lake-ozark',
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
    name: 'Lake Ozark',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1967,
    longitude: -92.6351,
  },
  priceRange: '$$-$$$',
  description: 'Professional luxury transportation service in Lake Ozark, Missouri',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you provide transportation to Lodge of Four Seasons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Lodge of Four Seasons is a premier destination we service frequently in Lake Ozark. We provide wedding transportation, corporate event shuttles, conference transportation, and guest transfers to and from the Lodge of Four Seasons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you pick up from waterfront properties in Lake Ozark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We specialize in pickups from lakefront homes, vacation rentals, and private waterfront properties throughout Lake Ozark. Our drivers are familiar with all residential areas and can navigate to your exact location.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Lake Ozark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lake Ozark transportation pricing depends on the vehicle, group size, route, timing, and service duration. Wedding and corporate plans are quoted for their specific itinerary. Check our current pricing page and request a personalized quote.',
      },
    },
  ],
}

export default async function LakeOzarkTransportationPage() {
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
          title={'Professional Transportation in Lake Ozark, Missouri'}
          introduction={
            <>
              <p>
                Serving Lodge of Four Seasons, waterfront properties, and all Lake Ozark venues. Luxury
                transportation with local expertise.
              </p>
            </>
          }
          image={locationPhotography.suv}
          bookingLabel={'Book Your Lake Ozark Ride'}
          bookingLocation="transportation-lake-ozark-hero"
          bookingHref="/book"
        />

        {/* Popular Destinations */}
        <LocationSection id="local-section-1" title={'Popular Lake Ozark Destinations We Serve'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Lodge of Four Seasons',
                description: (
                  <>
                    <p>Premier resort wedding and corporate event transportation</p>
                  </>
                ),
              },
              {
                title: 'Waterfront Properties',
                description: (
                  <>
                    <p>Lakefront homes, estates, and vacation rental pickups</p>
                  </>
                ),
              },
              {
                title: 'Wedding Venues',
                description: (
                  <>
                    <p>Lodge of Four Seasons and private estate weddings</p>
                  </>
                ),
              },
              {
                title: 'Downtown Lake Ozark',
                description: (
                  <>
                    <p>Restaurants, shops, and local attractions</p>
                  </>
                ),
              },
              {
                title: 'Lake Ozark Marina',
                description: (
                  <>
                    <p>Boat access transportation and marina pickups</p>
                  </>
                ),
              },
              {
                title: 'Event Venues',
                description: (
                  <>
                    <p>Corporate retreats, conferences, and special events</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services in Lake Ozark */}
        <LocationSection id="local-section-2" title={'Transportation Services in Lake Ozark'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Wedding Transportation',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Lodge of Four Seasons and estate weddings</p>
                  </>
                ),
              },
              {
                title: 'Corporate Events',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Lodge conferences and team retreats</p>
                  </>
                ),
              },
              {
                title: 'Airport Transfers',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>KC, STL, Springfield to/from Lake Ozark</p>
                  </>
                ),
              },
              {
                title: 'Group Events',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Family reunions, celebrations, gatherings</p>
                  </>
                ),
              },
              {
                title: 'Waterfront Pickups',
                href: '/services',
                description: (
                  <>
                    <p>Lakefront homes and vacation rentals</p>
                  </>
                ),
              },
              {
                title: 'Local Shuttles',
                href: '/services',
                description: (
                  <>
                    <p>Around town and between venues</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Us */}
        <LocationSection id="local-section-3" title={'Why Choose Lake Ride Pros in Lake Ozark'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Navigate Every Road',
                description: (
                  <>
                    <p>
                      From lakefront estates to downtown, we know every street and access point in Lake Ozark.
                    </p>
                  </>
                ),
              },
              {
                title: 'Waterfront Property Experts',
                description: (
                  <>
                    <p>Experienced with lakefront access, narrow roads, and private property navigation.</p>
                  </>
                ),
              },
              {
                title: 'Premium Service',
                description: (
                  <>
                    <p>
                      Luxury vehicles and professional drivers that match Lake Ozark's upscale atmosphere.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Lake Ozark Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'Do you provide transportation to Lodge of Four Seasons?',
              answer:
                'Yes! Lodge of Four Seasons is a premier destination we service frequently in Lake Ozark. We provide wedding transportation, corporate event shuttles, conference transportation, and guest transfers to and from the Lodge of Four Seasons.',
            },
            {
              question: 'Can you pick up from waterfront properties in Lake Ozark?',
              answer:
                'Absolutely! We specialize in pickups from lakefront homes, vacation rentals, and private waterfront properties throughout Lake Ozark. Our drivers are familiar with all residential areas and can navigate to your exact location.',
            },
            {
              question: 'How much does transportation cost in Lake Ozark?',
              answer:
                'Lake Ozark transportation pricing depends on the vehicle, group size, route, timing, and service duration. Wedding and corporate plans are quoted for their specific itinerary. Check our current pricing page and request a personalized quote.',
            },
            {
              question: 'Can you navigate to hard-to-find lakefront addresses?',
              answer:
                "Yes! Our drivers are experienced with Lake Ozark's winding lakefront roads, private drives, and difficult-to-access properties. Just provide your address and any special instructions when booking.",
            },
            {
              question: 'Do you transport between Lake Ozark and other Lake areas?',
              answer:
                'Absolutely! We frequently transport between Lake Ozark, Osage Beach, Camdenton, and all Lake of the Ozarks destinations. Perfect for exploring different areas or multi-venue events.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Lake Ozark Clients Say"
          subtitle="Real experiences from customers we've served in Lake Ozark"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Corporate Transportation',
              href: '/services/corporate-executive-travel',
              description: 'Executive transportation for Lodge of Four Seasons events',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Luxury wedding shuttles for waterfront venues',
            },
            {
              title: 'Airport Shuttle',
              href: '/services/airport-transfers',
              description: 'Direct transfers from MCI, STL, and SGF airports',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Lake Ozark Transportation?'}
          description={
            <>
              <p>Professional service throughout Lake Ozark and waterfront properties</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="transportation-lake-ozark-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

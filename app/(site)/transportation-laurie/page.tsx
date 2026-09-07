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
  title: 'Transportation in Laurie MO | Lake Ride Pros',
  description:
    'Private transportation in Laurie, Missouri, serving the west side of Lake of the Ozarks for weddings, nightlife and airport transfers.',
  keywords: [
    'Laurie Missouri transportation',
    'Laurie Lake Ozarks shuttle',
    'Laurie to Osage Beach transportation',
    'West side Lake Ozarks shuttle',
    'Hurricane Deck transportation',
    'Laurie wedding transportation',
    '5A Lake Ozarks transportation',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/transportation-laurie',
  },
  openGraph: {
    title: 'Transportation in Laurie MO | Lake Ride Pros',
    description:
      'Professional transportation throughout Laurie and the west side of Lake of the Ozarks. Serving Hurricane Deck and the 5A area.',
    url: 'https://www.lakeridepros.com/transportation-laurie',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Laurie Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation in Laurie MO | Lake Ride Pros',
    description: 'Professional transportation throughout Laurie.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Laurie Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/transportation-laurie',
  url: 'https://www.lakeridepros.com/transportation-laurie',
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
    name: 'Laurie',
    containedInPlace: {
      '@type': 'State',
      name: 'Missouri',
    },
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.1933,
    longitude: -92.8247,
  },
  priceRange: '$$-$$$',
  description:
    'Professional luxury transportation service in Laurie, Missouri on the west side of Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Laurie from Osage Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Laurie is approximately 25 minutes from Osage Beach via MO-5 and MO-135. Lake Ride Pros provides direct transportation between Laurie and all major Lake of the Ozarks destinations including Osage Beach, Bagnell Dam Strip, and Lake Ozark.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from Hurricane Deck?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We serve Hurricane Deck, Laurie, Gravois Mills, and the entire west side of Lake of the Ozarks. Our drivers know all the back roads and fastest routes throughout the 5A area.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does transportation cost in Laurie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Laurie transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide wedding transportation for Laurie area venues?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We provide wedding transportation for west side venues, guest shuttles from Laurie accommodations, and airport transfers for destination wedding guests visiting the Lake.',
      },
    },
  ],
}

export default async function LaurieTransportationPage() {
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
          title={'Professional Transportation in Laurie, Missouri'}
          introduction={
            <>
              <p>
                Serving the west side of Lake of the Ozarks. From Laurie and Hurricane Deck to Osage Beach,
                Bagnell Dam Strip, and beyond—reliable luxury transportation.
              </p>
            </>
          }
          image={locationPhotography.suv}
          bookingLabel={'Book Your Laurie Ride'}
          bookingLocation="transportation-laurie-hero"
          bookingHref="/book"
          facts={[
            { label: 'to Osage Beach', value: '25 min' },
            { label: 'Full west side coverage', value: '5A Area' },
            { label: 'ZIP code served', value: '65038' },
            { label: 'Highway access', value: 'MO-5 & MO-135' },
          ]}
        />

        {/* Quick Stats */}

        {/* Popular Destinations */}
        <LocationSection
          id="local-section-1"
          title={'Serving the West Side of Lake of the Ozarks'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Laurie',
                description: (
                  <>
                    <p>Downtown Laurie, residences, vacation rentals</p>
                  </>
                ),
              },
              {
                title: 'Hurricane Deck',
                description: (
                  <>
                    <p>Lakefront homes, condos, vacation properties</p>
                  </>
                ),
              },
              {
                title: 'Gravois Mills',
                description: (
                  <>
                    <p>Lake access, rentals, residential areas</p>
                  </>
                ),
              },
              {
                title: 'Osage Beach',
                description: (
                  <>
                    <p>Shopping, dining, Tan-Tar-A, Margaritaville</p>
                  </>
                ),
              },
              {
                title: 'Bagnell Dam Strip',
                description: (
                  <>
                    <p>Nightlife, bars, restaurants, entertainment</p>
                  </>
                ),
              },
              {
                title: 'Camdenton',
                description: (
                  <>
                    <p>County seat, shopping, services, Old Kinderhook</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Services */}
        <LocationSection id="local-section-2" title={'Transportation Services in Laurie'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Wedding Transportation',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>West side venues, guest shuttles</p>
                  </>
                ),
              },
              {
                title: 'Nightlife Transportation',
                href: '/bagnell-dam-strip-transportation',
                description: (
                  <>
                    <p>Laurie to Bagnell Dam Strip</p>
                  </>
                ),
              },
              {
                title: 'Airport Shuttle',
                href: '/services/airport-transfers',
                description: (
                  <>
                    <p>KC, STL, Springfield to Laurie</p>
                  </>
                ),
              },
              {
                title: 'Group Events',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Family reunions, corporate retreats</p>
                  </>
                ),
              },
              {
                title: 'Camdenton Transfers',
                href: '/transportation-camdenton',
                description: (
                  <>
                    <p>Shopping, dining, Old Kinderhook</p>
                  </>
                ),
              },
              {
                title: 'Sunrise Beach Transfers',
                href: '/transportation-sunrise-beach',
                description: (
                  <>
                    <p>West side connections</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Us */}
        <LocationSection id="local-section-3" title={'Why Choose Lake Ride Pros in Laurie'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'West Side Experts',
                description: (
                  <>
                    <p>
                      We know Laurie, Hurricane Deck, and Gravois Mills. Every back road, every shortcut,
                      every address.
                    </p>
                  </>
                ),
              },
              {
                title: 'Reliable Service',
                description: (
                  <>
                    <p>
                      No rideshare surprises. Book in advance and your ride is guaranteed—even to remote west
                      side locations.
                    </p>
                  </>
                ),
              },
              {
                title: '24/7 Availability',
                description: (
                  <>
                    <p>
                      Early morning airport runs, late night bar pickups, anytime you need us—we're ready.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Laurie Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'How far is Laurie from Osage Beach?',
              answer:
                'Laurie is approximately 25 minutes from Osage Beach via MO-5 and MO-135. Lake Ride Pros provides direct transportation between Laurie and all major Lake of the Ozarks destinations.',
            },
            {
              question: 'Do you provide transportation from Hurricane Deck?',
              answer:
                'Yes! We serve Hurricane Deck, Laurie, Gravois Mills, and the entire west side of Lake of the Ozarks. Our drivers know all the roads throughout the 5A area.',
            },
            {
              question: 'How much does transportation cost in Laurie?',
              answer:
                'Laurie transportation pricing depends on the vehicle, group size, route, timing, and service duration. Check our current pricing page and request a custom quote for your exact transportation plan.',
            },
            {
              question: 'Do you provide wedding transportation for Laurie area venues?',
              answer:
                'Absolutely! We provide wedding transportation for west side venues, guest shuttles from Laurie accommodations, and airport transfers for destination wedding guests.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Laurie Clients Say"
          subtitle="Real experiences from customers we've served in Laurie"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Camdenton Transportation',
              href: '/transportation-camdenton',
              description: 'Old Kinderhook, wine tours, county seat',
            },
            {
              title: 'Sunrise Beach Transportation',
              href: '/transportation-sunrise-beach',
              description: 'West side connections',
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
          title={'Ready to Book Your Laurie Transportation?'}
          description={
            <>
              <p>Professional, reliable service throughout the west side of Lake of the Ozarks</p>
            </>
          }
          bookingLabel={'Book Now'}
          bookingLocation="transportation-laurie-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

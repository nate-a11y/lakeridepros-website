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
  title: 'Columbia to Lake of the Ozarks Shuttle | Lake Ride Pros',
  description:
    'Private shuttle service from Columbia, Missouri to Lake of the Ozarks for airport transfers, Mizzou trips, weekend getaways and groups.',
  keywords: [
    'Columbia to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Columbia',
    'MU to Lake Ozarks',
    'Columbia Missouri Lake shuttle',
    'Mizzou Lake of the Ozarks transportation',
    'Columbia MO to Osage Beach',
    'COU airport to Lake Ozarks',
    'Mizzou graduation transportation',
    'Greek formal Lake Ozarks',
    'Columbia Regional Airport Lake shuttle',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/columbia-to-lake-ozarks',
  },
  openGraph: {
    title: 'Columbia MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description:
      'Direct shuttle service from Columbia to Lake of the Ozarks. Perfect for weekend getaways and group trips.',
    url: 'https://www.lakeridepros.com/columbia-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Columbia to Lake Ozarks Transportation' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Columbia MO to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: 'Direct shuttle service from Columbia to Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Columbia to Lake of the Ozarks Transportation Service',
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
      name: 'Columbia',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Columbia',
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
    'Direct shuttle transportation service from Columbia, Missouri to Lake of the Ozarks, serving University of Missouri students, families, and groups',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Columbia MO from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Columbia, Missouri is approximately 90 miles (1.5 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend getaways easy for Columbia residents and Mizzou students.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you pick up from University of Missouri campus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide pickups from University of Missouri campus locations, student housing, and anywhere in Columbia. Perfect for Mizzou students planning Lake weekend trips.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Columbia to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricing from Columbia to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
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
      name: 'Columbia to Lake Ozarks',
      item: 'https://www.lakeridepros.com/columbia-to-lake-ozarks',
    },
  ],
}

export default async function ColumbiaToLakeOzarksPage() {
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
          title={'Columbia to Lake of the Ozarks Transportation'}
          introduction={
            <>
              <p>
                Direct shuttle service from Columbia, MO to the Lake. Perfect for Mizzou students, weekend
                getaways, and group trips. Just 90 minutes away.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Your Columbia Shuttle'}
          bookingLocation="columbia-to-lake-ozarks-hero"
          bookingHref="/book"
        />

        {/* Route Info */}
        <LocationSection
          id="local-section-1"
          title={'Columbia to Lake Ozarks: Easy Weekend Getaways'}
          tone="white"
        >
          <LocationEditorialList
            layout="facts"
            items={[
              {
                title: '90 Miles',
                description: (
                  <>
                    <p>Columbia to Osage Beach</p>
                  </>
                ),
              },
              {
                title: '1.5 Hours',
                description: (
                  <>
                    <p>Direct drive time</p>
                  </>
                ),
              },
              {
                title: 'Groups Welcome',
                description: (
                  <>
                    <p>2-56 passengers</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Columbia Residents Choose Us */}
        <LocationSection
          id="local-section-2"
          title={'Why Columbia Residents Choose Lake Ride Pros'}
          tone="gray"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Mizzou Student Friendly',
                description: (
                  <>
                    <p>
                      We pick up directly from MU campus, student housing, and Columbia apartments. Popular
                      for spring break trips, birthday weekends, Greek formals, and sorority/fraternity
                      events. Group rates make it affordable to split costs. Also serving Parents Weekend,
                      Move-In Day, and Mizzou Graduation transportation.
                    </p>
                  </>
                ),
              },
              {
                title: 'Columbia Regional Airport (COU)',
                description: (
                  <>
                    <p>
                      Flying into Columbia Regional Airport? We provide direct transfers from COU to Lake of
                      the Ozarks destinations. Popular for destination wedding guests and corporate travelers
                      connecting to Lake events.
                    </p>
                  </>
                ),
              },
              {
                title: 'No Designated Driver Needed',
                description: (
                  <>
                    <p>
                      Weekend at the Lake means boat parties, bar hopping, and fun. Let us handle the 90-mile
                      drive both ways while your group enjoys the ride. Return pickup whenever you're ready.
                    </p>
                  </>
                ),
              },
              {
                title: 'Common Columbia Routes',
                description: (
                  <>
                    <ul>
                      <li>• Downtown Columbia ↔ Bagnell Dam Strip (nightlife)</li>
                      <li>• University of Missouri ↔ Tan-Tar-A Resort</li>
                      <li>• Columbia ↔ Margaritaville Lake Resort</li>
                      <li>• Columbia ↔ Lake vacation rentals</li>
                      <li>• Columbia ↔ Lake Ozarks boat parties/events</li>
                      <li>• COU Airport ↔ Lake of the Ozarks venues</li>
                      <li>• Greek houses ↔ Lake formal event venues</li>
                    </ul>
                    <p>
                      <strong>Route:</strong> I-70 W to US-63 S to US-54 W • ~90 miles • 1.5 hours
                    </p>
                  </>
                ),
              },
              {
                title: 'Perfect for Groups',
                description: (
                  <>
                    <p>
                      Bachelor/bachelorette parties, family reunions, friend groups, and sorority or
                      fraternity trips. Our current group fleet ranges from a 13-passenger Executive Sprinter
                      to a 37-passenger Executive Shuttle, and we can coordinate multiple vehicles for larger
                      groups.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Columbia Trips */}
        <LocationSection id="local-section-3" title={'Popular Lake Trips from Columbia'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Bachelor/Bachelorette Weekends',
                href: '/services/bachelor-party-transportation',
                description: (
                  <>
                    <p>Party bus, bar hopping, boat rentals</p>
                  </>
                ),
              },
              {
                title: 'Destination Weddings',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Guest shuttles to Lake venues</p>
                  </>
                ),
              },
              {
                title: 'Family Reunions',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Multi-day Lake house rentals</p>
                  </>
                ),
              },
              {
                title: 'Weekend Party Trips',
                href: '/services/party-bus-nightlife',
                description: (
                  <>
                    <p>Bagnell Dam Strip bar crawls</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Columbia to Lake Ozarks Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'How far is Columbia MO from Lake of the Ozarks?',
              answer:
                'Columbia, Missouri is approximately 90 miles (1.5 hours) from Lake of the Ozarks. Lake Ride Pros provides direct shuttle service along this route, making weekend getaways easy for Columbia residents and Mizzou students.',
            },
            {
              question: 'Do you pick up from University of Missouri campus?',
              answer:
                'Yes! We provide pickups from University of Missouri campus locations, student housing, and anywhere in Columbia. Perfect for Mizzou students planning Lake weekend trips.',
            },
            {
              question: 'How much does shuttle service from Columbia to Lake Ozarks cost?',
              answer:
                'Pricing from Columbia to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
            },
            {
              question: 'Can you do round trips from Columbia in one day?',
              answer:
                "Yes! Many Columbia groups book same-day round trips for Lake events, concerts, or day trips. We'll drop you off, you enjoy the Lake, and we pick you up at your scheduled time.",
            },
            {
              question: 'Do you offer multi-day service for Columbia groups?',
              answer:
                'Absolutely! Popular for weekend Lake house rentals. We drop you off Friday, you enjoy the Lake all weekend, and we pick you up Sunday. We can also provide transportation during your stay if needed.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Columbia Clients Say"
          subtitle="Real experiences from customers traveling from Columbia to Lake of the Ozarks"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Bachelor Party Transportation',
              href: '/services/bachelor-party-transportation',
              description: 'Party bus and shuttle service for Lake weekends',
            },
            {
              title: 'Group Event Transportation',
              href: '/services/group-event-transportation',
              description: 'Large group shuttle service for family trips',
            },
            {
              title: 'Nightlife Transportation',
              href: '/services/party-bus-nightlife',
              description: 'Bar hopping and party transportation at the Lake',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Columbia to Lake Ozarks Shuttle?'}
          description={
            <>
              <p>Direct service from Columbia to the Lake—perfect for weekend getaways</p>
            </>
          }
          bookingLabel={'Book Your Shuttle'}
          bookingLocation="columbia-to-lake-ozarks-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

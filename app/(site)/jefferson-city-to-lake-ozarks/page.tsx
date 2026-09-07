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
  title: 'Jefferson City to Lake Ozarks Shuttle | Lake Ride Pros',
  description:
    'Private shuttle service from Jefferson City to Lake of the Ozarks for corporate groups, families, airport connections and weekend trips.',
  keywords: [
    'Jefferson City to Lake Ozarks shuttle',
    'Lake of the Ozarks transportation from Jefferson City',
    'Jeff City to Lake Ozarks',
    'Jefferson City Missouri Lake shuttle',
    'Capitol to Lake Ozarks',
    'Jefferson City to Osage Beach',
    'Missouri state government Lake transportation',
    'Lincoln University Lake Ozarks',
    'JLN airport Lake shuttle',
    'Legislative session Lake transportation',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks',
  },
  openGraph: {
    title: 'Jefferson City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: "Direct shuttle service from Missouri's capital to Lake of the Ozarks. Just 1 hour away!",
    url: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks',
    siteName: 'Lake Ride Pros',
    images: [
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Jefferson City to Lake Ozarks Transportation' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jefferson City to Lake of the Ozarks Transportation | Lake Ride Pros',
    description: "Direct shuttle service from Missouri's capital to Lake of the Ozarks.",
    images: ['/og-image.jpg'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Jefferson City to Lake of the Ozarks Transportation Service',
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
      name: 'Jefferson City',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jefferson City',
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
    'Direct shuttle transportation service from Jefferson City, Missouri to Lake of the Ozarks, serving state employees, corporate groups, and families',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is Jefferson City from Lake of the Ozarks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jefferson City is approximately 60 miles (1 hour) from Lake of the Ozarks—the closest major city to the Lake. Lake Ride Pros provides direct shuttle service, making it easy for Jefferson City residents to enjoy quick weekend getaways.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation for state government groups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We regularly transport state government groups, legislative staff, and Capitol employees for retreats, team building events, and conferences at Lake of the Ozarks venues. We offer professional, discrete service for government and corporate groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does shuttle service from Jefferson City to Lake Ozarks cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricing from Jefferson City to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
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
      name: 'Jefferson City to Lake Ozarks',
      item: 'https://www.lakeridepros.com/jefferson-city-to-lake-ozarks',
    },
  ],
}

export default async function JeffersonCityToLakeOzarksPage() {
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
          title={'Jefferson City to Lake of the Ozarks Transportation'}
          introduction={
            <>
              <p>
                Direct shuttle service from Missouri's capital to the Lake. Just 60 miles (1 hour)—the closest
                major city. Perfect for corporate groups, families, and quick getaways.
              </p>
            </>
          }
          image={locationPhotography.sprinter}
          bookingLabel={'Book Your Jefferson City Shuttle'}
          bookingLocation="jefferson-city-to-lake-ozarks-hero"
          bookingHref="/book"
        />

        {/* Route Info */}
        <LocationSection id="local-section-1" title={'Closest Major City to Lake of the Ozarks'} tone="white">
          <LocationEditorialList
            layout="facts"
            items={[
              {
                title: '60 Miles',
                description: (
                  <>
                    <p>Jeff City to Osage Beach</p>
                  </>
                ),
              },
              {
                title: '1 Hour',
                description: (
                  <>
                    <p>Direct drive time</p>
                  </>
                ),
              },
              {
                title: 'All Group Sizes',
                description: (
                  <>
                    <p>2-56 passengers</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Jefferson City Residents Choose Us */}
        <LocationSection id="local-section-2" title={'Why Jefferson City Chooses Lake Ride Pros'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Serving State & Corporate Groups',
                description: (
                  <>
                    <p>
                      We regularly transport Missouri state government groups, legislative staff during
                      session, lobbyists, and corporate teams from Jefferson City for Lake of the Ozarks
                      retreats, conferences, and team building events. Professional, discrete service you can
                      trust.
                    </p>
                  </>
                ),
              },
              {
                title: 'Lincoln University & JLN Airport',
                description: (
                  <>
                    <p>
                      Serving Lincoln University students and staff for Lake getaways. Also providing
                      transfers from Jefferson City Memorial Airport (JLN) for private aviation guests heading
                      to Lake of the Ozarks events and properties.
                    </p>
                  </>
                ),
              },
              {
                title: 'Closest Major City = Easy Access',
                description: (
                  <>
                    <p>
                      At just 60 miles, Jefferson City is the closest major city to Lake of the Ozarks. That
                      means quick weekend trips, easy day excursions, and lower shuttle costs. Many Jeff City
                      residents keep Lake houses and use us for regular transport.
                    </p>
                  </>
                ),
              },
              {
                title: 'Common Jefferson City Routes',
                description: (
                  <>
                    <ul>
                      <li>• Capitol Building ↔ Lake of the Ozarks venues</li>
                      <li>• Jefferson City hotels ↔ Tan-Tar-A Resort (corporate events)</li>
                      <li>• Jeff City ↔ Margaritaville Lake Resort</li>
                      <li>• Jefferson City ↔ Osage Beach (shopping, dining, nightlife)</li>
                      <li>• Downtown Jeff City ↔ Lake vacation properties</li>
                      <li>• Lincoln University ↔ Lake weekend getaways</li>
                      <li>• JLN Airport ↔ Lake of the Ozarks (private aviation)</li>
                    </ul>
                    <p>
                      <strong>Route:</strong> US-54 W direct • ~60 miles • 1 hour
                    </p>
                  </>
                ),
              },
              {
                title: 'Same-Day Trips Easy',
                description: (
                  <>
                    <p>
                      Only 1 hour away means same-day Lake trips are easy. Boat rentals, waterfront dining,
                      shopping at Osage Beach Premium Outlets, concerts at Lake venues—drive down for the day,
                      we'll pick you up that evening.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Jefferson City Trips */}
        <LocationSection id="local-section-3" title={'Popular Lake Trips from Jefferson City'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Corporate & Government Retreats',
                href: '/services/corporate-executive-travel',
                description: (
                  <>
                    <p>Team building at Tan-Tar-A, Lodge of Four Seasons</p>
                  </>
                ),
              },
              {
                title: 'Lake Weddings',
                href: '/services/wedding-transportation',
                description: (
                  <>
                    <p>Guest shuttles to waterfront venues</p>
                  </>
                ),
              },
              {
                title: 'Family Reunions',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Lake house weekends, boat parties</p>
                  </>
                ),
              },
              {
                title: 'Concerts & Events',
                href: '/services/concert-transportation',
                description: (
                  <>
                    <p>Lake venues, Shootout, Bikefest</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Jefferson City to Lake Ozarks Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'How far is Jefferson City from Lake of the Ozarks?',
              answer:
                'Jefferson City is approximately 60 miles (1 hour) from Lake of the Ozarks—the closest major city to the Lake. Lake Ride Pros provides direct shuttle service, making it easy for Jefferson City residents to enjoy quick weekend getaways.',
            },
            {
              question: 'Do you provide transportation for state government groups?',
              answer:
                'Yes! We regularly transport state government groups, legislative staff, and Capitol employees for retreats, team building events, and conferences at Lake of the Ozarks venues. We offer professional, discrete service for government and corporate groups.',
            },
            {
              question: 'How much does shuttle service from Jefferson City to Lake Ozarks cost?',
              answer:
                'Pricing from Jefferson City to Lake of the Ozarks depends on the vehicle, pickup location, destination, timing, and whether you need one-way or round-trip service. Check our current pricing page and request a custom quote for the exact trip.',
            },
            {
              question: 'Can you do round trips from Jefferson City in one day?',
              answer:
                "Absolutely! At only 1 hour away, same-day round trips are very common. Popular for Lake day trips, boat rentals, dining, shopping, and events. We'll drop you off in the morning and pick you up that evening.",
            },
            {
              question: 'Do you pick up from Jefferson City hotels?',
              answer:
                'Yes! We provide pickups from all Jefferson City hotels, downtown locations, the Capitol area, and residential areas. Just provide your address when booking.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Jefferson City Clients Say"
          subtitle="Real experiences from customers traveling from Jefferson City to Lake of the Ozarks"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Corporate Transportation',
              href: '/services/corporate-executive-travel',
              description: 'Executive service for government and corporate groups',
            },
            {
              title: 'Group Event Transportation',
              href: '/services/group-event-transportation',
              description: 'Large group shuttle service for any event',
            },
            {
              title: 'Wedding Transportation',
              href: '/services/wedding-transportation',
              description: 'Luxury wedding shuttles for Lake venues',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Your Jefferson City to Lake Ozarks Shuttle?'}
          description={
            <>
              <p>Just 60 miles—the closest major city to the Lake</p>
            </>
          }
          bookingLabel={'Book Your Shuttle'}
          bookingLocation="jefferson-city-to-lake-ozarks-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

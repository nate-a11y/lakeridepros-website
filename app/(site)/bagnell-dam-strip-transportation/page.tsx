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
  title: 'Bagnell Dam Strip Transportation | Lake Ride Pros',
  description:
    'Safe, reliable transportation for Bagnell Dam Strip bar hopping and nightlife at Lake of the Ozarks. Party buses, shuttles, designated driver service. Book now!',
  keywords: [
    'Bagnell Dam Strip transportation',
    'Bagnell Dam bar hopping',
    'Lake Ozarks nightlife transportation',
    'party bus Bagnell Dam',
    'Osage Beach nightlife shuttle',
    'designated driver Lake Ozarks',
    'bar crawl transportation',
    'Bagnell Dam Strip party bus',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
  },
  openGraph: {
    title: 'Bagnell Dam Strip Transportation | Lake Ride Pros',
    description:
      'Professional party bus and shuttle service for Bagnell Dam Strip bar hopping. Safe nightlife transportation at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Bagnell Dam Strip Transportation' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagnell Dam Strip Transportation | Lake Ride Pros',
    description: 'Professional party bus and shuttle service for Bagnell Dam Strip bar hopping.',
    images: ['/og-image.jpg'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Lake Ride Pros - Bagnell Dam Strip Transportation',
  image: 'https://www.lakeridepros.com/og-image.jpg',
  '@id': 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
  url: 'https://www.lakeridepros.com/bagnell-dam-strip-transportation',
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
  priceRange: '$$',
  description:
    'Professional nightlife and bar hopping transportation service for Bagnell Dam Strip at Lake of the Ozarks',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does Bagnell Dam Strip transportation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bagnell Dam Strip transportation pricing depends on the vehicle, group size, timing, and service duration. Many bar-hopping groups reserve a multi-hour itinerary. Check our current pricing page and request a custom quote for your group.',
      },
    },
    {
      '@type': 'Question',
      name: 'What bars and venues do you service on the Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We service all Bagnell Dam Strip bars and nightlife venues including Dog Days, Backwater Jack's, Shady Gators, Tucker's Shuckers, Casey's Pizza, Redhead Lakeside Grill, and more. Our drivers know every stop along the Strip and can create custom bar crawl routes.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can you accommodate bachelor and bachelorette parties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! Bachelor and bachelorette parties are our specialty. Our party buses feature premium sound systems, LED lighting, cooler space, and comfortable seating. Perfect for Bagnell Dam Strip bar hopping and Lake Ozarks nightlife celebrations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a minimum rental time for Strip transportation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we have a 3-hour minimum for Bagnell Dam Strip nightlife transportation. Most groups book 4-6 hours to fully enjoy the Strip without rushing. Hourly extensions available if your group wants to keep the party going.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide transportation from hotels to the Strip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We pick up from any Lake of the Ozarks hotel, resort, or vacation rental and shuttle your group to the Bagnell Dam Strip. We provide transportation throughout your evening and return you safely to your accommodation. Popular pickup locations include Margaritaville, Tan-Tar-A, and all Osage Beach hotels.',
      },
    },
    {
      '@type': 'Question',
      name: 'What time does Bagnell Dam Strip nightlife start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bagnell Dam Strip nightlife typically picks up around 8-9 PM and goes until 1:30 AM (Missouri last call). We recommend starting your transportation between 7-9 PM depending on whether you want dinner or just drinks. Our drivers can advise on the best timing for your group.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can we bring coolers on the party bus?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All our party buses and limo buses allow coolers with beverages (for passengers 21+). Must comply with Missouri open container laws - no glass bottles, and drinking only allowed while vehicle is in motion or parked. Driver will advise on specific rules.',
      },
    },
  ],
}

export default async function BagnellDamStripTransportationPage() {
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
          title={'Bagnell Dam Strip Transportation & Party Buses'}
          introduction={
            <>
              <p>
                The ultimate bar hopping and nightlife transportation on the Bagnell Dam Strip. Safe, fun, and
                unforgettable Lake Ozarks nights.
              </p>
            </>
          }
          image={locationPhotography.pinkPatrol}
          bookingLabel={'Book Your Party Bus'}
          bookingLocation="bagnell-dam-strip-transportation-hero"
          bookingHref="/book"
        />

        {/* Why Book Strip Transportation */}
        <LocationSection
          id="local-section-1"
          title={'Why You Need Bagnell Dam Strip Transportation'}
          tone="white"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Safety First',
                description: (
                  <>
                    <p>
                      Don't risk drinking and driving. Our professional drivers ensure everyone gets home
                      safely after a night on the Strip.
                    </p>
                  </>
                ),
              },
              {
                title: 'Keep the Party Together',
                description: (
                  <>
                    <p>
                      No splitting up the group across multiple Ubers. Everyone rides together in one party
                      bus or shuttle.
                    </p>
                  </>
                ),
              },
              {
                title: 'No Parking Hassles',
                description: (
                  <>
                    <p>
                      Skip the nightmare of Strip parking. We drop you at the door and pick you up when you're
                      ready to move.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Popular Strip Destinations */}
        <LocationSection id="local-section-2" title={'Popular Bagnell Dam Strip Bars & Venues'} tone="gray">
          <LocationEditorialList
            items={[
              {
                title: 'Dog Days Bar & Grill',
                description: (
                  <>
                    <p>Iconic lakefront spot with live music and views</p>
                  </>
                ),
              },
              {
                title: "Backwater Jack's",
                description: (
                  <>
                    <p>Waterfront dining and late-night drinks</p>
                  </>
                ),
              },
              {
                title: 'Shady Gators',
                description: (
                  <>
                    <p>Live entertainment and Bagnell Dam atmosphere</p>
                  </>
                ),
              },
              {
                title: "Tucker's Shuckers",
                description: (
                  <>
                    <p>Raw bar, drinks, and lakefront party vibes</p>
                  </>
                ),
              },
              {
                title: 'Redhead Lakeside Grill',
                description: (
                  <>
                    <p>Dinner and late-night drinks on the water</p>
                  </>
                ),
              },
              {
                title: 'Your Custom Route',
                description: (
                  <>
                    <p>We'll create a personalized bar crawl for your group</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Our Strip Transportation Services */}
        <LocationSection id="local-section-3" title={'Bagnell Dam Strip Transportation Options'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'Bar Hopping Party Bus',
                href: '/services/party-bus-nightlife',
                description: (
                  <>
                    <p>LED lights, sound system, cooler space</p>
                  </>
                ),
              },
              {
                title: 'Bachelor/Bachelorette Parties',
                href: '/services/bachelor-party-transportation',
                description: (
                  <>
                    <p>Premium party buses for celebrations</p>
                  </>
                ),
              },
              {
                title: 'Birthday Celebrations',
                href: '/services/special-events-transportation',
                description: (
                  <>
                    <p>Make your birthday unforgettable on the Strip</p>
                  </>
                ),
              },
              {
                title: 'Large Group Nightlife',
                href: '/services/group-event-transportation',
                description: (
                  <>
                    <p>Multiple vehicles for groups of 20+</p>
                  </>
                ),
              },
              {
                title: 'Hotel to Strip Shuttles',
                href: '/services',
                description: (
                  <>
                    <p>Round-trip from any Lake Ozarks hotel</p>
                  </>
                ),
              },
              {
                title: 'Designated Driver Service',
                href: '/services',
                description: (
                  <>
                    <p>Safe rides home after a night out</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Vehicle Features */}
        <LocationSection
          id="local-section-4"
          title={'Party Bus Features for Strip Transportation'}
          tone="gray"
        >
          <LocationEditorialList
            items={[
              {
                title: 'Premium Sound',
                description: (
                  <>
                    <p>Bluetooth speakers, aux input</p>
                  </>
                ),
              },
              {
                title: 'LED Lighting',
                description: (
                  <>
                    <p>Party atmosphere on wheels</p>
                  </>
                ),
              },
              {
                title: 'Cooler Space',
                description: (
                  <>
                    <p>BYOB for 21+ passengers</p>
                  </>
                ),
              },
              {
                title: 'Comfortable Seating',
                description: (
                  <>
                    <p>Plush seating for 14+ guests</p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* Why Choose Lake Ride Pros */}
        <LocationSection id="local-section-5" title={'Why Lake Ride Pros for Bagnell Dam Strip'} tone="white">
          <LocationEditorialList
            items={[
              {
                title: 'We Know the Strip',
                description: (
                  <>
                    <p>
                      Locals who know every bar, parking spot, and the best times to hit each venue on the
                      Bagnell Dam Strip.
                    </p>
                  </>
                ),
              },
              {
                title: 'Professional Drivers',
                description: (
                  <>
                    <p>
                      Patient, experienced drivers who keep the party fun and safe. We've handled thousands of
                      Strip nights.
                    </p>
                  </>
                ),
              },
              {
                title: 'Flexible Hours',
                description: (
                  <>
                    <p>
                      Want to extend your night? Call your driver for hourly extensions. We're flexible with
                      your celebration.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </LocationSection>

        {/* FAQ Section */}
        <LocationFAQs
          title={'Bagnell Dam Strip Transportation FAQs'}
          tone="gray"
          items={[
            {
              question: 'How much does Bagnell Dam Strip transportation cost?',
              answer:
                'Bagnell Dam Strip transportation pricing depends on the vehicle, group size, timing, and service duration. Many bar-hopping groups reserve a multi-hour itinerary. Check our current pricing page and request a custom quote for your group.',
            },
            {
              question: 'What bars and venues do you service on the Strip?',
              answer:
                "We service all Bagnell Dam Strip bars and nightlife venues including Dog Days, Backwater Jack's, Shady Gators, Tucker's Shuckers, Casey's Pizza, Redhead Lakeside Grill, and more. Our drivers know every stop along the Strip and can create custom bar crawl routes.",
            },
            {
              question: 'Can you accommodate bachelor and bachelorette parties?',
              answer:
                'Absolutely! Bachelor and bachelorette parties are our specialty. Our party buses feature premium sound systems, LED lighting, cooler space, and comfortable seating. Perfect for Bagnell Dam Strip bar hopping and Lake Ozarks nightlife celebrations.',
            },
            {
              question: 'Is there a minimum rental time for Strip transportation?',
              answer:
                'Yes, we have a 3-hour minimum for Bagnell Dam Strip nightlife transportation. Most groups book 4-6 hours to fully enjoy the Strip without rushing. Hourly extensions available if your group wants to keep the party going.',
            },
            {
              question: 'Do you provide transportation from hotels to the Strip?',
              answer:
                'Yes! We pick up from any Lake of the Ozarks hotel, resort, or vacation rental and shuttle your group to the Bagnell Dam Strip. We provide transportation throughout your evening and return you safely to your accommodation. Popular pickup locations include Margaritaville, Tan-Tar-A, and all Osage Beach hotels.',
            },
            {
              question: 'What time does Bagnell Dam Strip nightlife start?',
              answer:
                'Bagnell Dam Strip nightlife typically picks up around 8-9 PM and goes until 1:30 AM (Missouri last call). We recommend starting your transportation between 7-9 PM depending on whether you want dinner or just drinks. Our drivers can advise on the best timing for your group.',
            },
            {
              question: 'Can we bring coolers on the party bus?',
              answer:
                'Yes! All our party buses and limo buses allow coolers with beverages (for passengers 21+). Must comply with Missouri open container laws - no glass bottles, and drinking only allowed while vehicle is in motion or parked. Driver will advise on specific rules.',
            },
          ]}
        />

        {/* Testimonials */}
        <LocationTestimonials
          testimonials={testimonials}
          title="What Our Bagnell Dam Strip Clients Say"
          subtitle="Real experiences from customers who partied safely with us on the Strip"
        />

        {/* Related Services */}
        <RelatedLocationLinks
          title="You May Also Need"
          items={[
            {
              title: 'Nightlife Transportation',
              href: '/services/party-bus-nightlife',
              description: 'Professional party bus service for Lake Ozarks nightlife',
            },
            {
              title: 'Bachelor/Bachelorette Parties',
              href: '/services/bachelor-party-transportation',
              description: 'Celebration transportation throughout Lake of the Ozarks',
            },
            {
              title: 'Osage Beach Transportation',
              href: '/transportation-osage-beach',
              description: 'Full-service transportation throughout Osage Beach and the Lake',
            },
          ]}
        />

        {/* CTA Section */}
        <LocationCTA
          title={'Ready to Book Bagnell Dam Strip Transportation?'}
          description={
            <>
              <p>Safe, fun party bus and shuttle service for Lake Ozarks nightlife</p>
            </>
          }
          bookingLabel={'Book Your Party Bus'}
          bookingLocation="bagnell-dam-strip-transportation-close"
          bookingHref="/book"
          phoneLabel="(573) 206-9499"
        />
      </div>
    </>
  )
}

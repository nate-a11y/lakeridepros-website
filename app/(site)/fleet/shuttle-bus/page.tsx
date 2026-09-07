import type { Metadata } from 'next'
import Link from 'next/link'
import FleetCategoryGallery from '@/components/fleet-editorial/FleetCategoryGallery'
import styles from '@/components/fleet-editorial/FleetEditorial.module.css'

export const metadata: Metadata = {
  title: '37-Passenger Shuttle Bus | Lake Ride Pros',
  description: 'Book a 37-passenger shuttle bus for Lake of the Ozarks weddings, corporate events and large groups, with comfortable seating and a PA system.',
  keywords: ['shuttle bus Lake Ozarks', 'wedding shuttle', 'large group transportation', 'corporate shuttle Missouri', '37 passenger bus'],
  openGraph: {
    title: 'Shuttle Bus Service - Lake Ride Pros',
    description: '37-passenger shuttle bus for weddings, corporate events, and large groups.',
    url: 'https://www.lakeridepros.com/fleet/shuttle-bus',
    siteName: 'Lake Ride Pros',
    images: [{ url: 'https://www.lakeridepros.com/shuttle-bus-og.jpg', width: 1200, height: 630, alt: 'Shuttle Bus' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet/shuttle-bus',
  },
}

export default function ShuttleBusPage() {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Shuttle Bus Service",
    "description": "37-passenger shuttle bus for weddings, corporate events, and large groups at Lake of the Ozarks",
    "image": "https://www.lakeridepros.com/shuttle-bus-og.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Lake Ride Pros"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "175",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "175.00",
        "priceCurrency": "USD",
        "unitText": "per hour"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "18"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.lakeridepros.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Fleet",
        "item": "https://www.lakeridepros.com/fleet"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Shuttle Bus"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className={styles.page}>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className={`${styles.wrap} ${styles.breadcrumb}`}>
          <ol className="flex gap-2 text-sm">
            <li><Link href="/" className="text-[#2f730e] hover:underline">Home</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li><Link href="/fleet" className="text-[#2f730e] hover:underline">Fleet</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li className={styles.text}>Shuttle Bus</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <h1 >
              Shuttle Bus Service at Lake of the Ozarks
            </h1>
            <p >
              37-Passenger Shuttle Bus for Weddings, Events & Corporate Transportation
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className={`${styles.wrap} ${styles.content}`}>
          <div className={styles.specGrid}>
            <FleetCategoryGallery category="shuttle-bus" />

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-lrp-black mb-6">
                Features & Specifications
              </h2>

              <div className={styles.specs}>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Capacity:</strong> Up to 37 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Comfortable Seating:</strong> Cushioned seats for long trips</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>PA System:</strong> Built-in PA for announcements and coordination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Luggage Storage:</strong> Ample storage for bags and equipment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>ADA Accessible:</strong> Wheelchair lift for accessibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Climate Control:</strong> Premium HVAC for comfort</span>
                  </li>
                </ul>
              </div>

              <div className={styles.price}>
                <p className="text-2xl font-bold text-lrp-black mb-2">
                  Starting at $175/hour
                </p>
                <p className={`${styles.text} text-sm`}>
                  Minimum booking may apply. Contact us for exact pricing.
                </p>
              </div>

              <Link
                href="/book"
                className={`${styles.primary} w-full`}
              >
                Check Availability
              </Link>
            </div>
          </div>

          {/* Perfect For Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Perfect for Lake Ozarks Events
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Weddings</h3>
                <p className={styles.text}>
                  Transport guests between venue and hotels seamlessly. Perfect for shuttle service between ceremony
                  and reception locations, ensuring all your guests arrive on time and together.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Corporate Events</h3>
                <p className={styles.text}>
                  Ideal for corporate retreats, team building events, and conferences. Reliable transportation
                  for your entire team with professional service that reflects well on your organization.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Large Groups & Conferences</h3>
                <p className={styles.text}>
                  Whether it's a family reunion, church group, or conference, our shuttle bus handles large groups
                  efficiently. Coordinate transportation for dozens of people with ease.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Why Choose Our Shuttle Bus?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Professional Drivers</h3>
                  <p className={styles.text}>
                    Licensed, insured, and experienced drivers who know Lake of the Ozarks intimately.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Impeccably Maintained</h3>
                  <p className={styles.text}>
                    Regularly serviced and professionally detailed before every trip.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Flexible Scheduling</h3>
                  <p className={styles.text}>
                    Available 24/7 with flexible hourly rates and custom packages.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Safety First</h3>
                  <p className={styles.text}>
                    Fully insured with commercial liability coverage. Your safety is our priority.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Shuttle Bus Rental FAQs
            </h2>

            <div className="space-y-4">
              <details className={styles.faq}>
                <summary >
                  What's the minimum rental time for the shuttle bus?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Most bookings have a 3-hour minimum, though this can vary based on the date and event type. Contact us for specific details.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  Is the shuttle bus ADA accessible?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Yes, our shuttle bus is equipped with a wheelchair lift and designated accessible seating to accommodate all passengers.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  How far in advance should I book?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  For peak season (May-September) and weekends, book 2-4 weeks in advance. We often accommodate last-minute bookings during off-peak times.
                </p>
              </details>
            </div>
          </section>

          {/* Related Vehicles */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Other Transportation Options
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/fleet/limo-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Limo Bus</h3>
                <p className={styles.text}>Perfect for parties and celebrations with premium amenities</p>
              </Link>

              <Link href="/fleet/sprinter-van" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Sprinter Van</h3>
                <p className={styles.text}>Perfect for smaller groups and intimate wine tours</p>
              </Link>

              <Link href="/fleet/suburbans" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Suburbans</h3>
                <p className={styles.text}>Ideal for small groups and airport transfers</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Shuttle Bus?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your shuttle bus today for reliable group transportation at Lake Ozarks.
            </p>
            <Link
              href="/book"
              className={styles.primary}
            >
              Check Availability
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}

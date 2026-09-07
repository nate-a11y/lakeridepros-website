import type { Metadata } from 'next'
import Link from 'next/link'
import FleetCategoryGallery from '@/components/fleet-editorial/FleetCategoryGallery'
import styles from '@/components/fleet-editorial/FleetEditorial.module.css'

export const metadata: Metadata = {
  title: 'Luxury SUV Transportation | Lake Ride Pros',
  description: 'Book a luxury Suburban SUV for Lake of the Ozarks airport transfers and small groups, with leather seating, luggage space and professional drivers.',
  keywords: ['SUV service Lake Ozarks', 'luxury suburban', 'daily transportation', 'executive travel Missouri', 'airport transfer SUV'],
  openGraph: {
    title: 'Luxury SUV Service - Lake Ride Pros',
    description: 'Luxury Suburban SUV service for small groups and airport transfers at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/fleet/suburbans',
    siteName: 'Lake Ride Pros',
    images: [{ url: 'https://www.lakeridepros.com/suburbans-og.jpg', width: 1200, height: 630, alt: 'Luxury Suburban SUV' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet/suburbans',
  },
}

export default function SuburbansPage() {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Luxury Suburban SUV Service",
    "description": "Luxury Suburban SUV service for small groups and airport transfers at Lake of the Ozarks",
    "brand": {
      "@type": "Brand",
      "name": "Lake Ride Pros"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "75",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "75.00",
        "priceCurrency": "USD",
        "unitText": "per hour"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "32"
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
        "name": "Suburbans"
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
            <li className={styles.text}>Suburbans</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <h1 >
              Luxury Suburban SUV Service at Lake of the Ozarks
            </h1>
            <p >
              7-Passenger Executive Transportation with Premium Comfort
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className={`${styles.wrap} ${styles.content}`}>
          <div className={styles.specGrid}>
            <FleetCategoryGallery category="suburbans" />

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-lrp-black mb-6">
                Features & Specifications
              </h2>

              <div className={styles.specs}>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Capacity:</strong> Up to 7 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Leather Seating:</strong> Premium leather interior throughout</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Spacious Interior:</strong> Comfortable legroom and headspace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Luggage Capacity:</strong> Ample cargo space for bags and equipment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Professional Drivers:</strong> Licensed and experienced chauffeurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Climate Control:</strong> Dual-zone temperature control</span>
                  </li>
                </ul>
              </div>

              <div className={styles.price}>
                <p className="text-2xl font-bold text-lrp-black mb-2">
                  Starting at $75/hour
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
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Airport Transfers</h3>
                <p className={styles.text}>
                  Reliable transportation to and from Springfield-Branson Airport or Columbia Regional Airport.
                  Start your Lake Ozarks vacation in comfort and style.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Small Groups & Daily Transportation</h3>
                <p className={styles.text}>
                  Perfect size for families and small groups exploring Lake of the Ozarks. Comfortable daily
                  transportation for restaurant visits, shopping, and sightseeing.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Executive Travel & Family Trips</h3>
                <p className={styles.text}>
                  Ideal for business travelers and family getaways. Professional service with the comfort
                  and privacy needed for important meetings or quality family time.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Why Choose Our Suburban SUVs?
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
              Suburban SUV Rental FAQs
            </h2>

            <div className="space-y-4">
              <details className={styles.faq}>
                <summary >
                  What's the minimum rental time for the Suburban?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Most bookings have a 2-hour minimum, though this can vary based on the date and service type. Airport transfers may have different minimums. Contact us for specific details.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  How much luggage can the Suburban hold?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Our Suburbans can comfortably accommodate 7 passengers with their luggage. For larger groups, we can coordinate multiple vehicles for your party.
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
              <Link href="/fleet/sprinter-van" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Sprinter Van</h3>
                <p className={styles.text}>Perfect for groups up to 12 passengers with premium amenities</p>
              </Link>

              <Link href="/fleet/limo-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Limo Bus</h3>
                <p className={styles.text}>Perfect for parties and celebrations with premium amenities</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Shuttle Bus</h3>
                <p className={styles.text}>Up to 37 passengers for large events and weddings</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Luxury Suburban?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your executive SUV today for comfortable Lake Ozarks transportation.
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

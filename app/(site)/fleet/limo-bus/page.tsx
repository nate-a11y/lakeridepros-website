import type { Metadata } from 'next'
import Link from 'next/link'
import FleetCategoryGallery from '@/components/fleet-editorial/FleetCategoryGallery'
import styles from '@/components/fleet-editorial/FleetEditorial.module.css'

export const metadata: Metadata = {
  title: 'Luxury Limo Bus Rental - Lake of the Ozarks | Lake Ride Pros',
  description: 'Book a 14-passenger limo bus for Lake of the Ozarks weddings, bachelor parties and wine tours, with premium sound, LED lighting and professional drivers.',
  keywords: ['limo bus Lake Ozarks', 'party bus rental', 'luxury limo bus Missouri', 'bachelor party bus', 'wedding limo bus Osage Beach'],
  openGraph: {
    title: 'Luxury Limo Bus - Lake Ride Pros',
    description: '14-passenger luxury limo bus with premium sound system, LED lighting, and leather seating.',
    url: 'https://www.lakeridepros.com/fleet/limo-bus',
    siteName: 'Lake Ride Pros',
    images: [{ url: 'https://www.lakeridepros.com/limo-bus-og.jpg', width: 1200, height: 630, alt: 'Luxury Limo Bus' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet/limo-bus',
  },
}

export default function LimoBusPage() {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Luxury Limo Bus Rental",
    "description": "14-passenger luxury limo bus for weddings, parties, and events at Lake of the Ozarks",
    "image": "https://www.lakeridepros.com/limo-bus-og.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Lake Ride Pros"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "150",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "150.00",
        "priceCurrency": "USD",
        "unitText": "per hour"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "25"
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
        "name": "Limo Bus"
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
            <li className={styles.text}>Limo Bus</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <h1 >
              Luxury Limo Bus Rental at Lake of the Ozarks
            </h1>
            <p >
              14-Passenger Premium Party Bus with LED Lighting & Sound System
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className={`${styles.wrap} ${styles.content}`}>
          <div className={styles.specGrid}>
            <FleetCategoryGallery category="limo-bus" />

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-lrp-black mb-6">
                Features & Specifications
              </h2>

              <div className={styles.specs}>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Capacity:</strong> Up to 14 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Sound System:</strong> Premium audio with Bluetooth connectivity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Lighting:</strong> Custom LED lighting with color control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Seating:</strong> Luxury leather wrap-around seating</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Climate Control:</strong> Premium HVAC system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Bar Area:</strong> Built-in cooler (BYOB)</span>
                  </li>
                </ul>
              </div>

              <div className={styles.price}>
                <p className="text-2xl font-bold text-lrp-black mb-2">
                  Starting at $150/hour
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
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Bachelor & Bachelorette Parties</h3>
                <p className={styles.text}>
                  Celebrate your last night of freedom in style! Our limo bus is the perfect party on wheels
                  for hitting Lake Ozarks nightlife hotspots including Bagnell Dam Strip, Margaritaville, and Captain Ron's.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Wine Tours</h3>
                <p className={styles.text}>
                  Visit Lake of the Ozarks wineries without worrying about driving. Perfect for groups wanting
                  to enjoy tastings at Seven Springs Winery, Public House Brewing, and other local favorites.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Concert Transportation</h3>
                <p className={styles.text}>
                  Arrive at concerts and events in style. Great for groups attending shows at Ozarks Amphitheater
                  or other Lake area venues. Skip parking hassles and enjoy the ride!
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Why Choose Our Limo Bus?
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
              Limo Bus Rental FAQs
            </h2>

            <div className="space-y-4">
              <details className={styles.faq}>
                <summary >
                  What's the minimum rental time for the limo bus?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Most bookings have a 3-hour minimum, though this can vary based on the date and event type. Contact us for specific details.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  Can we bring alcohol on the limo bus?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Yes, passengers 21+ may bring their own beverages. We provide coolers and cups. Please drink responsibly.
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
                <p className={styles.text}>Perfect for smaller groups and intimate wine tours</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Shuttle Bus</h3>
                <p className={styles.text}>Up to 37 passengers for large events and weddings</p>
              </Link>

              <Link href="/fleet/rescue-squad" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Rescue Squad</h3>
                <p className={styles.text}>Unique specialty vehicle for unforgettable parties</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Limo Bus?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your luxury party bus today for an unforgettable Lake Ozarks experience.
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

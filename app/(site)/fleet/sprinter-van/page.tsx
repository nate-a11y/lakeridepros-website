import type { Metadata } from 'next'
import Link from 'next/link'
import FleetCategoryGallery from '@/components/fleet-editorial/FleetCategoryGallery'
import styles from '@/components/fleet-editorial/FleetEditorial.module.css'

export const metadata: Metadata = {
  title: 'Sprinter Van Service at Lake Ozarks | Lake Ride Pros',
  description: 'Book a luxury sprinter van for Lake of the Ozarks airport transfers, wine tours and small groups, with leather seating and professional drivers.',
  keywords: ['sprinter van Lake Ozarks', 'luxury van rental', 'wine tour van', 'airport transfer van Missouri', 'small group transportation'],
  openGraph: {
    title: 'Luxury Sprinter Van - Lake Ride Pros',
    description: 'Luxury sprinter van service with leather seating, privacy glass, and climate control.',
    url: 'https://www.lakeridepros.com/fleet/sprinter-van',
    siteName: 'Lake Ride Pros',
    images: [{ url: 'https://www.lakeridepros.com/sprinter-van-og.jpg', width: 1200, height: 630, alt: 'Luxury Sprinter Van' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet/sprinter-van',
  },
}

export default function SprinterVanPage() {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Luxury Sprinter Van Rental",
    "description": "Luxury sprinter van for small groups, wine tours, and intimate events at Lake of the Ozarks",
    "image": "https://www.lakeridepros.com/sprinter-van-og.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Lake Ride Pros"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "100",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "100.00",
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
        "name": "Sprinter Van"
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
            <li className={styles.text}>Sprinter Van</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <h1 >
              Luxury Sprinter Van Service - Lake of the Ozarks
            </h1>
            <p >
              Premium Transportation for Small Groups & Wine Tours
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className={`${styles.wrap} ${styles.content}`}>
          <div className={styles.specGrid}>
            <FleetCategoryGallery category="sprinter-van" />

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-lrp-black mb-6">
                Features & Specifications
              </h2>

              <div className={styles.specs}>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Capacity:</strong> 6-8 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Seating:</strong> Luxury leather captain's chairs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Privacy:</strong> Tinted privacy glass</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Luggage:</strong> Ample storage space</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Climate Control:</strong> Individual zone controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Entertainment:</strong> Premium sound system</span>
                  </li>
                </ul>
              </div>

              <div className={styles.price}>
                <p className="text-2xl font-bold text-lrp-black mb-2">
                  Starting at $100/hour
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
              Perfect for Lake Ozarks Activities
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Wine Tours</h3>
                <p className={styles.text}>
                  Ideal for intimate wine tours around Lake of the Ozarks. Visit Seven Springs Winery, Bridal Cave & Thunder Mountain Park, and local vineyards in comfort and style.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Small Weddings</h3>
                <p className={styles.text}>
                  Perfect for small wedding parties needing elegant transportation between ceremony, photos, and reception. Arrive in style at your Lake Ozarks venue.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Airport Transfers</h3>
                <p className={styles.text}>
                  Comfortable airport transportation to/from Columbia, Jefferson City, or Kansas City. Spacious luggage capacity and professional service.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Why Choose Our Sprinter Van?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Intimate Experience</h3>
                  <p className={styles.text}>
                    Perfect size for small groups who want privacy and personal attention.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Luxury Comfort</h3>
                  <p className={styles.text}>
                    Premium leather seating and climate control for maximum comfort.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Professional Service</h3>
                  <p className={styles.text}>
                    Experienced drivers providing courteous, reliable service.
                  </p>
                </div>
              </div>

              <div className={styles.reason}>
                <div className={styles.reasonNumber}>
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-lrp-black mb-2">Cost-Effective</h3>
                  <p className={styles.text}>
                    Affordable luxury for smaller groups who don't need a full-size bus.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Sprinter Van FAQs
            </h2>

            <div className="space-y-4">
              <details className={styles.faq}>
                <summary >
                  How many passengers can the sprinter van accommodate?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Our luxury sprinter van comfortably seats 6-8 passengers, depending on luggage requirements.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  Is the sprinter van good for wine tours?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Absolutely! The sprinter van is ideal for wine tours with small groups. Enjoy intimate touring of Lake Ozarks wineries with luxury transportation.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  Do you provide airport transfer service?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Yes! We provide airport transfers to/from Columbia Regional, Jefferson City Memorial, and Kansas City International airports.
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
                <p className={styles.text}>14-passenger party bus with LED lighting and premium sound</p>
              </Link>

              <Link href="/fleet/suburbans" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Luxury Suburbans</h3>
                <p className={styles.text}>Perfect for daily transportation and small groups</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Shuttle Bus</h3>
                <p className={styles.text}>Large capacity for weddings and corporate events</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Sprinter Van?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your luxury sprinter van today for wine tours, weddings, or airport transfers.
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

import type { Metadata } from 'next'
import Link from 'next/link'
import FleetCategoryGallery from '@/components/fleet-editorial/FleetCategoryGallery'
import styles from '@/components/fleet-editorial/FleetEditorial.module.css'

export const metadata: Metadata = {
  title: 'Rescue Squad Party Bus | Lake Ride Pros',
  description: 'Book the Rescue Squad, a converted specialty vehicle with party lighting for memorable celebrations and events at Lake of the Ozarks.',
  keywords: ['specialty vehicle Lake Ozarks', 'unique party bus', 'rescue squad truck', 'novelty transportation Missouri', 'themed party bus'],
  openGraph: {
    title: 'Rescue Squad Specialty Vehicle - Lake Ride Pros',
    description: 'Unique rescue squad specialty vehicle for memorable parties and one-of-a-kind events.',
    url: 'https://www.lakeridepros.com/fleet/rescue-squad',
    siteName: 'Lake Ride Pros',
    images: [{ url: 'https://www.lakeridepros.com/rescue-squad-og.jpg', width: 1200, height: 630, alt: 'Rescue Squad Vehicle' }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet/rescue-squad',
  },
}

export default function RescueSquadPage() {
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Rescue Squad Specialty Vehicle",
    "description": "Unique rescue squad specialty vehicle for memorable parties and events at Lake of the Ozarks",
    "image": "https://www.lakeridepros.com/rescue-squad-og.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Lake Ride Pros"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "price": "125",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "125.00",
        "priceCurrency": "USD",
        "unitText": "per hour"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "12"
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
        "name": "Rescue Squad"
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
            <li className={styles.text}>Rescue Squad</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <h1 >
              Rescue Squad Specialty Vehicle at Lake of the Ozarks
            </h1>
            <p >
              12-Passenger Unique Party Experience - A One-of-a-Kind Adventure
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className={`${styles.wrap} ${styles.content}`}>
          <div className={styles.specGrid}>
            <FleetCategoryGallery category="rescue-squad" />

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-lrp-black mb-6">
                Features & Specifications
              </h2>

              <div className={styles.specs}>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Capacity:</strong> Up to 12 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Converted Rescue Vehicle:</strong> Authentic specialty conversion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Party Lights:</strong> Custom LED lighting system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Unique Experience:</strong> One-of-a-kind vehicle you won't find elsewhere</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Sound System:</strong> Premium audio for your party</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2f730e] text-xl">✓</span>
                    <span className={styles.text}><strong>Photo-Worthy Exterior:</strong> Perfect for memorable photos</span>
                  </li>
                </ul>
              </div>

              <div className={styles.price}>
                <p className="text-2xl font-bold text-lrp-black mb-2">
                  Starting at $125/hour
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
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Unique Parties</h3>
                <p className={styles.text}>
                  Make your celebration unforgettable with this one-of-a-kind specialty vehicle. Perfect for those
                  looking to add an element of surprise and fun to their Lake Ozarks party.
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Photo Opportunities</h3>
                <p className={styles.text}>
                  This eye-catching vehicle creates incredible photo opportunities. Your guests will love posing
                  with this unique rescue squad conversion - perfect for social media moments!
                </p>
              </div>

              <div className={styles.editorialItem}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-3">Memorable Events & Birthday Celebrations</h3>
                <p className={styles.text}>
                  Stand out from the crowd with themed events and milestone birthdays. This specialty vehicle
                  ensures your celebration will be remembered for years to come.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className={styles.section}>
            <h2 className="text-3xl font-bold text-lrp-black mb-8">
              Why Choose Our Rescue Squad Vehicle?
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
              Rescue Squad Vehicle FAQs
            </h2>

            <div className="space-y-4">
              <details className={styles.faq}>
                <summary >
                  What's the minimum rental time for the rescue squad vehicle?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Most bookings have a 3-hour minimum, though this can vary based on the date and event type. Contact us for specific details.
                </p>
              </details>

              <details className={styles.faq}>
                <summary >
                  Is this vehicle available for all types of events?
                </summary>
                <p className={`${styles.text} mt-4`}>
                  Yes! The rescue squad vehicle is perfect for birthday parties, themed events, photo shoots, and any occasion where you want to make a memorable impression.
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

              <Link href="/fleet/shuttle-bus" className={styles.related}>
                <h3 className="text-xl font-bold text-[#2f730e] mb-2">Shuttle Bus</h3>
                <p className={styles.text}>Up to 37 passengers for large events and weddings</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Rescue Squad Adventure?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve this unique specialty vehicle today for an unforgettable Lake Ozarks experience.
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

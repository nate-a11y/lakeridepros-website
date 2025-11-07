import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Luxury Sprinter Van Service - Lake of the Ozarks | Lake Ride Pros',
  description: 'Luxury sprinter van for small groups, wine tours, and airport transfers at Lake of the Ozarks. Leather seating, privacy glass, professional drivers. Book your van today!',
  keywords: ['sprinter van Lake Ozarks', 'luxury van rental', 'wine tour van', 'airport transfer van Missouri', 'small group transportation'],
  openGraph: {
    title: 'Luxury Sprinter Van - Lake Ride Pros',
    description: 'Luxury sprinter van service with leather seating, privacy glass, and climate control.',
    images: ['/sprinter-van-og.jpg'],
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

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-4">
          <ol className="flex gap-2 text-sm">
            <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li><Link href="/fleet" className="text-primary hover:underline">Fleet</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li className="text-neutral-700 dark:text-neutral-300">Sprinter Van</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Luxury Sprinter Van Service - Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-center mt-4 text-lg">
              Premium Transportation for Small Groups & Wine Tours
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-lrp-text-secondary dark:text-lrp-text-muted">Sprinter Van Main Image</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Interior</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Seating</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Luggage</p>
                </div>
              </div>
            </div>

            {/* Specs & Booking */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
                Features & Specifications
              </h2>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg p-6 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Capacity:</strong> 6-8 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Seating:</strong> Luxury leather captain's chairs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Privacy:</strong> Tinted privacy glass</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Luggage:</strong> Ample storage space</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Climate Control:</strong> Individual zone controls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Entertainment:</strong> Premium sound system</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Starting at $100/hour
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Minimum booking may apply. Contact us for exact pricing.
                </p>
              </div>

              <Link
                href="/book"
                className="block w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-bold text-lg transition-all text-center"
              >
                Check Availability
              </Link>
            </div>
          </div>

          {/* Perfect For Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Perfect for Lake Ozarks Activities
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Wine Tours</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Ideal for intimate wine tours around Lake of the Ozarks. Visit Seven Springs Winery, Bridal Cave & Thunder Mountain Park, and local vineyards in comfort and style.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Small Weddings</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Perfect for small wedding parties needing elegant transportation between ceremony, photos, and reception. Arrive in style at your Lake Ozarks venue.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Airport Transfers</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Comfortable airport transportation to/from Columbia, Jefferson City, or Kansas City. Spacious luggage capacity and professional service.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Why Choose Our Sprinter Van?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Intimate Experience</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Perfect size for small groups who want privacy and personal attention.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Luxury Comfort</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Premium leather seating and climate control for maximum comfort.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Professional Service</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Experienced drivers providing courteous, reliable service.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Cost-Effective</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Affordable luxury for smaller groups who don't need a full-size bus.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Sprinter Van FAQs
            </h2>

            <div className="space-y-4">
              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  How many passengers can the sprinter van accommodate?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Our luxury sprinter van comfortably seats 6-8 passengers, depending on luggage requirements.
                </p>
              </details>

              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  Is the sprinter van good for wine tours?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Absolutely! The sprinter van is ideal for wine tours with small groups. Enjoy intimate touring of Lake Ozarks wineries with luxury transportation.
                </p>
              </details>

              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  Do you provide airport transfer service?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Yes! We provide airport transfers to/from Columbia Regional, Jefferson City Memorial, and Kansas City International airports.
                </p>
              </details>
            </div>
          </section>

          {/* Related Vehicles */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Other Transportation Options
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/fleet/limo-bus" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Luxury Limo Bus</h3>
                <p className="text-neutral-700 dark:text-neutral-300">14-passenger party bus with LED lighting and premium sound</p>
              </Link>

              <Link href="/fleet/suburbans" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Luxury Suburbans</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Perfect for daily transportation and small groups</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Shuttle Bus</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Large capacity for weddings and corporate events</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 bg-primary rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Sprinter Van?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your luxury sprinter van today for wine tours, weddings, or airport transfers.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-primary hover:bg-neutral-100 px-10 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Check Availability
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}

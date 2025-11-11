import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Luxury SUV Service - Suburban Transportation | Lake Ride Pros',
  description: 'Luxury Suburban SUV service for small groups and airport transfers at Lake of the Ozarks. Leather seating, spacious interior, professional drivers. Book your SUV today!',
  keywords: ['SUV service Lake Ozarks', 'luxury suburban', 'daily transportation', 'executive travel Missouri', 'airport transfer SUV'],
  openGraph: {
    title: 'Luxury SUV Service - Lake Ride Pros',
    description: 'Luxury Suburban SUV service for small groups and airport transfers at Lake of the Ozarks.',
    images: ['/suburbans-og.jpg'],
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

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-4">
          <ol className="flex gap-2 text-sm">
            <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li><Link href="/fleet" className="text-primary hover:underline">Fleet</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li className="text-neutral-700 dark:text-neutral-300">Suburbans</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Luxury Suburban SUV Service at Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-center mt-4 text-lg">
              7-Passenger Executive Transportation with Premium Comfort
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-lrp-text-secondary dark:text-lrp-text-muted">Suburban Main Image</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Interior</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Seating</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Exterior</p>
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
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Capacity:</strong> Up to 7 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Leather Seating:</strong> Premium leather interior throughout</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Spacious Interior:</strong> Comfortable legroom and headspace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Luggage Capacity:</strong> Ample cargo space for bags and equipment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Professional Drivers:</strong> Licensed and experienced chauffeurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Climate Control:</strong> Dual-zone temperature control</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Starting at $75/hour
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
              Perfect for Lake Ozarks Events
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Airport Transfers</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Reliable transportation to and from Springfield-Branson Airport or Columbia Regional Airport.
                  Start your Lake Ozarks vacation in comfort and style.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Small Groups & Daily Transportation</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Perfect size for families and small groups exploring Lake of the Ozarks. Comfortable daily
                  transportation for restaurant visits, shopping, and sightseeing.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Executive Travel & Family Trips</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Ideal for business travelers and family getaways. Professional service with the comfort
                  and privacy needed for important meetings or quality family time.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Why Choose Our Suburban SUVs?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Professional Drivers</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Licensed, insured, and experienced drivers who know Lake of the Ozarks intimately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Impeccably Maintained</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Regularly serviced and professionally detailed before every trip.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Flexible Scheduling</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Available 24/7 with flexible hourly rates and custom packages.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Safety First</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Fully insured with commercial liability coverage. Your safety is our priority.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Suburban SUV Rental FAQs
            </h2>

            <div className="space-y-4">
              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  What's the minimum rental time for the Suburban?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Most bookings have a 2-hour minimum, though this can vary based on the date and service type. Airport transfers may have different minimums. Contact us for specific details.
                </p>
              </details>

              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  How much luggage can the Suburban hold?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Our Suburbans can comfortably accommodate 7 passengers with their luggage. For larger groups, we can coordinate multiple vehicles for your party.
                </p>
              </details>

              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  How far in advance should I book?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  For peak season (May-September) and weekends, book 2-4 weeks in advance. We often accommodate last-minute bookings during off-peak times.
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
              <Link href="/fleet/sprinter-van" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Luxury Sprinter Van</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Perfect for groups up to 12 passengers with premium amenities</p>
              </Link>

              <Link href="/fleet/limo-bus" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Luxury Limo Bus</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Perfect for parties and celebrations with premium amenities</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Shuttle Bus</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Up to 37 passengers for large events and weddings</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 bg-primary rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Luxury Suburban?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your executive SUV today for comfortable Lake Ozarks transportation.
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

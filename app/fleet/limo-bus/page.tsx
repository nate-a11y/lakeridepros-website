import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Luxury Limo Bus Rental - Lake of the Ozarks | Lake Ride Pros',
  description: '14-passenger luxury limo bus for weddings, bachelor parties, wine tours at Lake of the Ozarks. Premium amenities, professional drivers, LED lighting. Book your party bus today!',
  keywords: ['limo bus Lake Ozarks', 'party bus rental', 'luxury limo bus Missouri', 'bachelor party bus', 'wedding limo bus Osage Beach'],
  openGraph: {
    title: 'Luxury Limo Bus - Lake Ride Pros',
    description: '14-passenger luxury limo bus with premium sound system, LED lighting, and leather seating.',
    images: ['/limo-bus-og.jpg'],
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

      <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-4">
          <ol className="flex gap-2 text-sm">
            <li><Link href="/" className="text-primary hover:underline">Home</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li><Link href="/fleet" className="text-primary hover:underline">Fleet</Link></li>
            <li className="text-lrp-text-secondary">/</li>
            <li className="text-neutral-700 dark:text-neutral-300">Limo Bus</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Luxury Limo Bus Rental at Lake of the Ozarks
            </h1>
            <p className="text-white/90 text-center mt-4 text-lg">
              14-Passenger Premium Party Bus with LED Lighting & Sound System
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-lrp-text-secondary dark:text-lrp-text-muted">Limo Bus Main Image</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Interior</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Seating</p>
                </div>
                <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg aspect-video flex items-center justify-center">
                  <p className="text-xs text-lrp-text-secondary dark:text-lrp-text-muted">Sound</p>
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
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Capacity:</strong> Up to 14 passengers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Sound System:</strong> Premium audio with Bluetooth connectivity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Lighting:</strong> Custom LED lighting with color control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Seating:</strong> Luxury leather wrap-around seating</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Climate Control:</strong> Premium HVAC system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span className="text-neutral-700 dark:text-neutral-300"><strong>Bar Area:</strong> Built-in cooler (BYOB)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 dark:bg-primary/20 border-2 border-primary rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Starting at $150/hour
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
                <h3 className="text-xl font-bold text-primary mb-3">Bachelor & Bachelorette Parties</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Celebrate your last night of freedom in style! Our limo bus is the perfect party on wheels
                  for hitting Lake Ozarks nightlife hotspots including Bagnell Dam Strip, Margaritaville, and Captain Ron's.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Wine Tours</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Visit Lake of the Ozarks wineries without worrying about driving. Perfect for groups wanting
                  to enjoy tastings at Seven Springs Winery, Public House Brewing, and other local favorites.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-3">Concert Transportation</h3>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Arrive at concerts and events in style. Great for groups attending shows at Ozarks Amphitheater
                  or other Lake area venues. Skip parking hassles and enjoy the ride!
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8">
              Why Choose Our Limo Bus?
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
              Limo Bus Rental FAQs
            </h2>

            <div className="space-y-4">
              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  What's the minimum rental time for the limo bus?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Most bookings have a 3-hour minimum, though this can vary based on the date and event type. Contact us for specific details.
                </p>
              </details>

              <details className="bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg">
                <summary className="font-bold text-lg cursor-pointer text-neutral-900 dark:text-white hover:text-primary transition-colors">
                  Can we bring alcohol on the limo bus?
                </summary>
                <p className="text-neutral-700 dark:text-neutral-300 mt-4">
                  Yes, passengers 21+ may bring their own beverages. We provide coolers and cups. Please drink responsibly.
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
                <p className="text-neutral-700 dark:text-neutral-300">Perfect for smaller groups and intimate wine tours</p>
              </Link>

              <Link href="/fleet/shuttle-bus" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Shuttle Bus</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Up to 37 passengers for large events and weddings</p>
              </Link>

              <Link href="/fleet/rescue-squad" className="block bg-neutral-100 dark:bg-dark-bg-secondary p-6 rounded-lg hover:border-2 hover:border-primary transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">Rescue Squad</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Unique specialty vehicle for unforgettable parties</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 bg-primary rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Book Your Limo Bus?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Reserve your luxury party bus today for an unforgettable Lake Ozarks experience.
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

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Fleet - Luxury Vehicles | Lake Ride Pros',
  description: 'View our fleet of luxury transportation vehicles at Lake of the Ozarks. Limo buses, sprinter vans, shuttle buses, and specialty vehicles. Professional, licensed, insured.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet',
  },
};

export default function FleetPage() {
  const vehicles = [
    {
      name: 'Luxury Limo Bus',
      slug: 'limo-bus',
      capacity: '14 passengers',
      description: 'Premium party bus with LED lighting, sound system, and luxury seating',
      price: 'Starting at $150/hr',
      bestFor: 'Bachelor parties, wine tours, nights out'
    },
    {
      name: 'Luxury Sprinter Van',
      slug: 'sprinter-van',
      capacity: '6-8 passengers',
      description: 'Intimate luxury transportation with leather seating and privacy glass',
      price: 'Starting at $100/hr',
      bestFor: 'Wine tours, small weddings, airport transfers'
    },
    {
      name: 'Shuttle Bus',
      slug: 'shuttle-bus',
      capacity: '37 passengers',
      description: 'Large capacity shuttle for weddings and corporate events',
      price: 'Starting at $175/hr',
      bestFor: 'Weddings, corporate events, large groups'
    },
    {
      name: 'Rescue Squad',
      slug: 'rescue-squad',
      capacity: '12 passengers',
      description: 'Unique specialty vehicle for unforgettable parties',
      price: 'Starting at $125/hr',
      bestFor: 'Unique parties, photo ops, memorable events'
    },
    {
      name: 'Luxury Suburbans',
      slug: 'suburbans',
      capacity: '7 passengers',
      description: 'Executive SUV transportation for daily needs',
      price: 'Starting at $75/hr',
      bestFor: 'Airport transfers, executive travel, daily transportation'
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Our Luxury Fleet
          </h1>
          <p className="text-white/90 text-center mt-4 text-lg">
            Professional vehicles for every occasion at Lake of the Ozarks
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12">
          {vehicles.map((vehicle) => (
            <article key={vehicle.slug} className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-lg">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="relative bg-neutral-200 dark:bg-neutral-700 aspect-video lg:aspect-auto lg:h-full flex items-center justify-center">
                  <p className="text-lrp-text-secondary dark:text-lrp-text-muted">{vehicle.name} Image</p>
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                    {vehicle.name}
                  </h2>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-primary text-white px-4 py-2 rounded-lg font-semibold">
                      {vehicle.capacity}
                    </span>
                    <span className="text-primary font-semibold">
                      {vehicle.price}
                    </span>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-4">
                    {vehicle.description}
                  </p>

                  <p className="text-neutral-600 dark:text-lrp-text-muted mb-6">
                    <strong>Best For:</strong> {vehicle.bestFor}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/fleet/${vehicle.slug}`}
                      className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      href="/book"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all text-center"
                    >
                      Check Availability
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not Sure Which Vehicle Is Right for You?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Contact us and we'll help you choose the perfect vehicle for your event.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary hover:bg-neutral-100 px-10 py-4 rounded-lg font-bold text-lg transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

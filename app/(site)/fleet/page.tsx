import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getVehicles, getMediaUrl } from '@/lib/api/sanity';
import type { Vehicle } from '@/types/sanity';
import { resolveSlug } from '@/types/sanity';

export const metadata: Metadata = {
  title: 'Our Fleet - Luxury Vehicles | Lake Ride Pros',
  description: 'View our fleet of luxury transportation vehicles at Lake of the Ozarks. Limo buses, sprinter vans, shuttle buses, and specialty vehicles. Professional, licensed, insured.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet',
  },
  openGraph: {
    title: 'Our Fleet | Lake Ride Pros',
    description: 'View our fleet of luxury transportation vehicles at Lake of the Ozarks. Limo buses, sprinter vans, shuttle buses, and more.',
    url: 'https://www.lakeridepros.com/fleet',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Fleet' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Fleet | Lake Ride Pros',
    description: 'View our fleet of luxury transportation vehicles at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
};

export const dynamic = 'force-dynamic';

// Pricing tier display configuration
const TIER_CONFIG: Record<string, { label: string; className: string }> = {
  flex: {
    label: 'Flex',
    className: 'bg-blue-600 text-white',
  },
  elite: {
    label: 'Elite',
    className: 'bg-purple-700 text-white',
  },
  'lrp-black': {
    label: 'LRP Black',
    className: 'bg-black text-amber-400 border border-amber-400',
  },
};

export default async function FleetPage() {
  // Fetch vehicles from Payload CMS
  const vehiclesData = await getVehicles().catch(() => ({ docs: [] as Vehicle[] }));
  const rawVehicles = vehiclesData.docs || [];

  // Shuffle vehicles that share the same order value for variety on each refresh
  const groupedByOrder: Record<number, typeof rawVehicles> = {};
  rawVehicles.forEach((vehicle) => {
    const order = vehicle.order ?? 0;
    if (!groupedByOrder[order]) groupedByOrder[order] = [];
    groupedByOrder[order].push(vehicle);
  });

  const vehicles = Object.keys(groupedByOrder)
    .sort((a, b) => Number(a) - Number(b))
    .flatMap((key) => groupedByOrder[Number(key)].sort(() => Math.random() - 0.5));

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-boardson text-4xl md:text-5xl font-bold text-white text-center">
            Our Luxury Fleet
          </h1>
          <p className="text-white/90 text-center mt-4 text-lg">
            Professional vehicles for every occasion at Lake of the Ozarks
          </p>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="container mx-auto px-4 py-16">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Our fleet information is being updated. Please check back soon or contact us for vehicle availability.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-6 bg-primary hover:bg-primary-dark text-lrp-black px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="grid gap-12">
            {vehicles.map((vehicle) => {
              // Get the featured image or first image from images array
              const imageUrl = vehicle.featuredImage
                ? getMediaUrl(vehicle.featuredImage)
                : vehicle.images?.[0]?.image
                ? getMediaUrl(vehicle.images[0].image)
                : null;

              const imageAlt = vehicle.featuredImage?.alt ||
                               vehicle.images?.[0]?.alt ||
                               `${vehicle.name} - Luxury transportation`;

              return (
                <article key={resolveSlug(vehicle.slug)} className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-lg">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Vehicle Image */}
                    <div className="relative bg-neutral-200 dark:bg-neutral-700 aspect-video lg:aspect-auto lg:h-full">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-lrp-text-secondary dark:text-lrp-text-muted">
                            {vehicle.name} Image
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-8">
                      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                        {vehicle.name}
                      </h2>

                      {/* Pricing Tier Badges */}
                      {vehicle.pricingTiers && vehicle.pricingTiers.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {vehicle.pricingTiers.map((tier: string) => {
                            const config = TIER_CONFIG[tier];
                            if (!config) return null;
                            return (
                              <span
                                key={tier}
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
                              >
                                {config.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span className="bg-primary text-lrp-black px-4 py-2 rounded-lg font-semibold">
                          {vehicle.capacity} passenger{vehicle.capacity !== 1 ? 's' : ''}
                        </span>
                        {vehicle.pricing?.pointToPointMinimum ? (
                          <span className="text-primary dark:text-primary-light font-semibold text-lg">
                            Starting at ${vehicle.pricing.pointToPointMinimum}
                          </span>
                        ) : vehicle.pricing?.hourlyRate ? (
                          <span className="text-primary dark:text-primary-light font-semibold">
                            ${vehicle.pricing.hourlyRate}/hr
                          </span>
                        ) : null}
                      </div>

                      <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-4">
                        {vehicle.description}
                      </p>

                      {/* Amenities/Features */}
                      {vehicle.amenities && vehicle.amenities.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                            Features & Amenities:
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {vehicle.amenities.slice(0, 6).map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                              >
                                <svg
                                  className="w-5 h-5 text-primary flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>{item.amenity}</span>
                              </li>
                            ))}
                          </ul>
                          {vehicle.amenities.length > 6 && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                              +{vehicle.amenities.length - 6} more features
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={`/fleet/${resolveSlug(vehicle.slug)}`}
                          className="bg-primary hover:bg-primary-dark text-lrp-black px-8 py-3 rounded-lg font-semibold transition-all text-center"
                          aria-label={`View details about ${vehicle.name}`}
                        >
                          View Details
                        </Link>
                        <Link
                          href="/book"
                          className="border-2 border-primary text-primary hover:bg-primary hover:text-lrp-black px-8 py-3 rounded-lg font-semibold transition-all text-center"
                        >
                          Check Availability
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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

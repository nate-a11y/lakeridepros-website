import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getVehicles, getMediaUrl } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Our Fleet - Luxury Vehicles | Lake Ride Pros',
  description: 'View our fleet of luxury transportation vehicles at Lake of the Ozarks. Limo buses, sprinter vans, shuttle buses, and specialty vehicles. Professional, licensed, insured.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/fleet',
  },
};

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  // Fetch vehicles from Payload CMS
  const vehiclesData = await getVehicles().catch(() => ({ docs: [] }));
  const vehicles = vehiclesData.docs || [];

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
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              Our fleet information is being updated. Please check back soon or contact us for vehicle availability.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-6 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="grid gap-12">
            {vehicles.map((vehicle) => {
              // Get the featured image or first image from images array
              const imageUrl = vehicle.featuredImage
                ? getMediaUrl(vehicle.featuredImage.url)
                : vehicle.images?.[0]?.image
                ? getMediaUrl(vehicle.images[0].image.url)
                : null;

              const imageAlt = vehicle.featuredImage?.alt ||
                               vehicle.images?.[0]?.alt ||
                               `${vehicle.name} - Luxury transportation`;

              return (
                <article key={vehicle.slug} className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-lg">
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
                      <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        {vehicle.name}
                      </h2>

                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span className="bg-primary text-white px-4 py-2 rounded-lg font-semibold">
                          {vehicle.capacity} passenger{vehicle.capacity !== 1 ? 's' : ''}
                        </span>
                        {vehicle.pricing?.hourlyRate && (
                          <span className="text-primary font-semibold">
                            Starting at ${vehicle.pricing.hourlyRate}/hr
                          </span>
                        )}
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

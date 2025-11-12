import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import VehicleCard from '@/components/VehicleCard';
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
        {vehicles.length > 0 ? (
          <div className="grid gap-12">
            {vehicles.map((vehicle) => (
              <article key={vehicle.id} className="bg-neutral-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-lg">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Vehicle Image */}
                  <div className="relative bg-neutral-200 dark:bg-neutral-700 aspect-video lg:aspect-auto lg:h-full">
                    {vehicle.image ? (
                      <Image
                        src={getMediaUrl(typeof vehicle.image === 'string' ? vehicle.image : vehicle.image.url)}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-lrp-text-secondary dark:text-lrp-text-muted">{vehicle.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                      {vehicle.name}
                    </h2>

                    <div className="flex items-center gap-4 mb-4">
                      {vehicle.capacity && (
                        <span className="bg-primary text-white px-4 py-2 rounded-lg font-semibold">
                          {vehicle.capacity} passengers
                        </span>
                      )}
                      {vehicle.hourlyRate && (
                        <span className="text-primary font-semibold">
                          Starting at ${vehicle.hourlyRate}/hr
                        </span>
                      )}
                    </div>

                    <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-4">
                      {vehicle.description}
                    </p>

                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="mb-6">
                        <p className="font-semibold text-neutral-900 dark:text-white mb-2">Features:</p>
                        <ul className="list-disc list-inside text-neutral-600 dark:text-lrp-text-muted space-y-1">
                          {vehicle.features.slice(0, 5).map((feature, index) => (
                            <li key={index}>{typeof feature === 'string' ? feature : feature.feature}</li>
                          ))}
                        </ul>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lrp-text-secondary dark:text-dark-text-secondary text-lg">
              No vehicles available at this time. Check back soon!
            </p>
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

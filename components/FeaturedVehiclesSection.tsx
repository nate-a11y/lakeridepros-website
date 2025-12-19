import Link from 'next/link';
import type { Vehicle } from '@/src/payload-types';
import VehicleCard from './VehicleCard';

interface FeaturedVehiclesSectionProps {
  vehicles: Vehicle[];
  title?: string;
  subtitle?: string;
  showEmptyState?: boolean;
}

export default function FeaturedVehiclesSection({
  vehicles,
  title = 'Featured Vehicles',
  subtitle = 'Our fleet of luxury vehicles ensures a comfortable and stylish experience',
  showEmptyState = true,
}: FeaturedVehiclesSectionProps) {
  // Don't render section if no vehicles and empty state is disabled
  if (vehicles.length === 0 && !showEmptyState) {
    return null;
  }

  return (
    <section
      aria-labelledby="featured-vehicles-heading"
      className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="featured-vehicles-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            {title}
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {vehicles.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
              aria-label="Featured vehicles"
            >
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} role="listitem">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/fleet"
                className="inline-block bg-primary-dark hover:bg-primary text-lrp-black font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
                aria-label="View our full fleet of vehicles"
              >
                View Full Fleet
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-200 dark:bg-dark-bg-tertiary mb-4">
              <svg
                className="w-8 h-8 text-neutral-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No Featured Vehicles Available
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Our featured vehicles are being updated. Browse our complete fleet to see all available options.
            </p>
            <Link
              href="/fleet"
              className="inline-block bg-primary-dark hover:bg-primary text-lrp-black font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
              aria-label="Browse our complete fleet"
            >
              Browse Full Fleet
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

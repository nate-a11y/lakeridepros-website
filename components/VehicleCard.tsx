import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/lib/types';
import { getMediaUrl } from '@/lib/api/payload';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageUrl = vehicle.featuredImage
    ? getMediaUrl(vehicle.featuredImage.url)
    : vehicle.images?.[0]?.image
    ? getMediaUrl(vehicle.images[0].image.url)
    : '/placeholder-vehicle.jpg';

  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={vehicle.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {vehicle.featured && (
          <div className="absolute top-4 right-4 bg-secondary dark:bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {vehicle.name}
          </h3>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{vehicle.type}</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2 mb-4">{vehicle.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Capacity: {vehicle.capacity}</span>
          </div>
          {vehicle.pricing?.hourlyRate && (
            <span className="text-secondary dark:text-primary font-semibold">
              ${vehicle.pricing.hourlyRate}/hr
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

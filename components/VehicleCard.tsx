'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = vehicle.featuredImage && typeof vehicle.featuredImage === 'object'
    ? getMediaUrl(vehicle.featuredImage.url)
    : vehicle.images?.[0]?.image && typeof vehicle.images[0].image === 'object'
    ? getMediaUrl(vehicle.images[0].image.url)
    : '/placeholder-vehicle.jpg';

  // Generate descriptive alt text
  const altText = `${vehicle.name} - ${vehicle.type} with capacity for ${vehicle.capacity} passengers`;

  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary"
      aria-label={`View details for ${vehicle.name}`}
    >
      <div style={{ position: 'relative', height: '16rem', width: '100%', overflow: 'hidden' }} className="bg-neutral-100 dark:bg-dark-bg-secondary">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
            <svg
              className="w-12 h-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Image unavailable</span>
          </div>
        )}
        {vehicle.featured && (
          <div
            className="absolute top-4 right-4 bg-secondary dark:bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md"
            aria-label="Featured vehicle"
          >
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {vehicle.name}
          </h3>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 capitalize bg-neutral-100 dark:bg-dark-bg-secondary px-2 py-1 rounded">
            {vehicle.type}
          </span>
        </div>
        {vehicle.description && (
          <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2 mb-4">
            {vehicle.description}
          </p>
        )}
        {/* Amenities preview */}
        {vehicle.amenities && vehicle.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {vehicle.amenities.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="text-xs bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-2 py-0.5 rounded"
              >
                {item.amenity}
              </span>
            ))}
            {vehicle.amenities.length > 3 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 px-1">
                +{vehicle.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

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
              aria-hidden="true"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span aria-label={`Capacity: ${vehicle.capacity} passengers`}>
              Capacity: {vehicle.capacity}
            </span>
          </div>
          <div className="text-right">
            {vehicle.pricing?.hourlyRate && (
              <span
                className="text-secondary dark:text-primary font-semibold"
                aria-label={`Hourly rate: ${vehicle.pricing.hourlyRate} dollars per hour`}
              >
                ${vehicle.pricing.hourlyRate}/hr
              </span>
            )}
            {vehicle.pricing?.pointToPointMinimum && (
              <span
                className={`text-secondary dark:text-primary font-semibold text-sm ${vehicle.pricing?.hourlyRate ? 'block mt-0.5' : ''}`}
                aria-label={`Starting from ${vehicle.pricing.pointToPointMinimum} dollars`}
              >
                From ${vehicle.pricing.pointToPointMinimum}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-dark-bg-secondary">
          <span className="text-primary dark:text-primary-light text-sm font-medium group-hover:underline inline-flex items-center">
            View Details
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

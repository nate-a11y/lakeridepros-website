import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BookingWidget from '@/components/BookingWidget';
import { getVehicleBySlug, getMediaUrl } from '@/lib/api/payload';

export const dynamic = 'force-dynamic';

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug).catch(() => null);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | Lake Ride Pros',
    };
  }

  return {
    title: `${vehicle.name} | Lake Ride Pros Fleet`,
    description: vehicle.description,
  };
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug).catch(() => null);

  if (!vehicle) {
    notFound();
  }

  const images = vehicle.images || [];
  const mainImage = vehicle.featuredImage || (images[0]?.image);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/fleet"
            className="inline-flex items-center text-white/90 hover:text-white mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>
          <h1 className="text-4xl font-bold">{vehicle.name}</h1>
          <p className="text-xl text-white/90 mt-2 capitalize">{vehicle.type}</p>
        </div>
      </section>

      {/* Vehicle Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {mainImage && (
                <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={getMediaUrl(mainImage.url)}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.slice(1, 4).map((imageWrapper, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={getMediaUrl(imageWrapper.image.url)}
                        alt={imageWrapper.alt || `${vehicle.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Vehicle Details
              </h2>
              <p className="text-neutral-700 mb-6">{vehicle.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <span className="font-semibold text-neutral-900 w-32">Capacity:</span>
                  <span className="text-neutral-700">{vehicle.capacity} passengers</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-neutral-900 w-32">Type:</span>
                  <span className="text-neutral-700 capitalize">{vehicle.type}</span>
                </div>
                {vehicle.specifications?.make && (
                  <div className="flex items-center">
                    <span className="font-semibold text-neutral-900 w-32">Make/Model:</span>
                    <span className="text-neutral-700">
                      {vehicle.specifications.make} {vehicle.specifications.model}
                    </span>
                  </div>
                )}
                {vehicle.specifications?.year && (
                  <div className="flex items-center">
                    <span className="font-semibold text-neutral-900 w-32">Year:</span>
                    <span className="text-neutral-700">{vehicle.specifications.year}</span>
                  </div>
                )}
              </div>

              {vehicle.amenities && vehicle.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Amenities
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.amenities.map((amenityObj, index) => (
                      <li key={index} className="flex items-center text-neutral-700">
                        <svg className="h-5 w-5 text-secondary mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {amenityObj.amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vehicle.pricing && (
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Pricing
                  </h3>
                  {vehicle.pricing.hourlyRate && (
                    <p className="text-2xl font-bold text-primary mb-2">
                      ${vehicle.pricing.hourlyRate}/hour
                    </p>
                  )}
                  {vehicle.pricing.dailyRate && (
                    <p className="text-lg text-neutral-700">
                      Daily Rate: ${vehicle.pricing.dailyRate}
                    </p>
                  )}
                  {vehicle.pricing.notes && (
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mt-3">
                      {vehicle.pricing.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Book This Vehicle
            </h2>
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary">
              Reserve {vehicle.name} for your next trip
            </p>
          </div>
          <BookingWidget />
        </div>
      </section>
    </>
  );
}

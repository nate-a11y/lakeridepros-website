import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import BookingWidget from '@/components/BookingWidget';
import TestimonialsSection from '@/components/TestimonialsSection';
import VehicleGallery from '@/components/VehicleGallery';
import { TierBadges } from '@/components/TierBadge';
import { getVehicleBySlug, getVehicleRelatedTestimonials } from '@/lib/api/payload';

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

  const imageUrl = vehicle.featuredImage?.url || vehicle.images?.[0]?.image?.url;

  return {
    title: `${vehicle.name} | Lake Ride Pros Fleet`,
    description: vehicle.description,
    alternates: {
      canonical: `https://www.lakeridepros.com/fleet/${slug}`,
    },
    openGraph: {
      title: `${vehicle.name} | Lake Ride Pros Fleet`,
      description: vehicle.description || `${vehicle.name} - Luxury transportation at Lake of the Ozarks`,
      url: `https://www.lakeridepros.com/fleet/${slug}`,
      siteName: 'Lake Ride Pros',
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: vehicle.name }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Fleet' }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.name} | Lake Ride Pros Fleet`,
      description: vehicle.description || `${vehicle.name} - Luxury transportation at Lake of the Ozarks`,
      images: imageUrl ? [imageUrl] : ['/og-image.jpg'],
    },
  };
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug).catch(() => null);

  if (!vehicle) {
    redirect('/fleet');
  }

  // Fetch vehicle-related testimonials (only 5-star reviews with vehicle keywords)
  const testimonials = await getVehicleRelatedTestimonials(3, 5).catch(() => []);

  const images = vehicle.images || [];

  // Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lakeridepros.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Fleet',
        item: 'https://www.lakeridepros.com/fleet',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: vehicle.name,
        item: `https://www.lakeridepros.com/fleet/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
          {/* Pricing Tier Badges */}
          <TierBadges tiers={vehicle.pricingTiers} className="mt-3" />
        </div>
      </section>

      {/* Vehicle Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Gallery */}
            <div>
              <VehicleGallery
                images={images}
                vehicleName={vehicle.name}
                featuredImage={vehicle.featuredImage}
              />
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
                <div className="bg-neutral-50 dark:bg-dark-bg-tertiary p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                    Pricing Options
                  </h3>

                  {/* Point-to-Point Pricing */}
                  {vehicle.pricing.pointToPointMinimum && (
                    <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Point-to-Point
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">
                          (Taxi-style)
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">
                        Starting at ${vehicle.pricing.pointToPointMinimum}
                      </p>
                    </div>
                  )}

                  {/* Hourly Rate Pricing */}
                  {vehicle.pricing.hourlyRate && (
                    <div className={`${vehicle.pricing.dailyRate ? 'mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700' : 'mb-4'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Hourly Charter
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">
                        ${vehicle.pricing.hourlyRate}/hour
                      </p>
                    </div>
                  )}

                  {/* Daily Rate Pricing */}
                  {vehicle.pricing.dailyRate && (
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          Full Day Rate
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-primary dark:text-primary-light">
                        ${vehicle.pricing.dailyRate}
                      </p>
                    </div>
                  )}

                  {/* Pricing Notes */}
                  {vehicle.pricing.notes && (
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      {vehicle.pricing.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          title="What Our Clients Say"
          subtitle={`Hear from customers who loved riding in our ${vehicle.name.toLowerCase()}`}
          showCount={3}
          includeSchema={false}
        />
      )}

      {/* Booking Section */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
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

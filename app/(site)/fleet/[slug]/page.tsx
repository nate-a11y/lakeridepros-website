import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import FleetBookingCTA from '@/components/FleetBookingCTA';
import FleetTestimonials from '@/components/fleet-editorial/FleetTestimonials';
import styles from '@/components/fleet-editorial/FleetEditorial.module.css';
import Gallery from '@/components/Gallery';
import type { GalleryImage } from '@/components/Gallery';
import { getVehicleBySlug, getVehicleRelatedTestimonials, getMediaUrl } from '@/lib/api/sanity';
import { metaDescription, metaTitle } from '@/lib/seo/metadata';

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
  const titleText = metaTitle(`${vehicle.name} Fleet`);
  const descriptionText = metaDescription(
    `${vehicle.name}: ${vehicle.description || ''}`,
    `${vehicle.name} luxury transportation at Lake of the Ozarks with professional drivers and premium service.`
  );

  return {
    title: titleText,
    description: descriptionText,
    alternates: {
      canonical: `https://www.lakeridepros.com/fleet/${slug}`,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
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
      title: titleText,
      description: descriptionText,
      images: imageUrl ? [imageUrl] : ['/og-image.jpg'],
    },
  };
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug).catch(() => null);

  if (!vehicle) {
    permanentRedirect('/fleet');
  }

  // Retired vehicles are intentionally absent from the public fleet and
  // sitemap. Redirect old detail URLs instead of leaving indexable orphans.
  if (vehicle.available !== true) {
    permanentRedirect('/fleet');
  }

  const isPinkPatrol = vehicle.slug === 'pink-patrol';
  const accentVariant = isPinkPatrol ? 'pink' : 'default';

  // Fetch vehicle-related testimonials (only 5-star reviews with vehicle keywords)
  const testimonials = await getVehicleRelatedTestimonials(3, 5).catch(() => []);

  // Build GalleryImage[] from featuredImage + images[], deduping by asset ID
  const galleryImages: GalleryImage[] = [];
  const seenAssetIds = new Set<string>();

  if (vehicle.featuredImage) {
    const featAsset = vehicle.featuredImage.asset as Record<string, unknown> | undefined;
    const featAssetId = (featAsset?._id || featAsset?._ref) as string | undefined;
    const url = getMediaUrl(vehicle.featuredImage);
    if (url) {
      galleryImages.push({ src: url, alt: `${vehicle.name} - Featured` });
      if (featAssetId) seenAssetIds.add(featAssetId);
    }
  }

  if (vehicle.images) {
    for (const img of vehicle.images) {
      const imgAsset = img.image?.asset as Record<string, unknown> | undefined;
      const imgAssetId = (imgAsset?._id || imgAsset?._ref) as string | undefined;
      if (imgAssetId && seenAssetIds.has(imgAssetId)) continue;
      const url = getMediaUrl(img.image);
      if (url) {
        galleryImages.push({ src: url, alt: img.alt || `${vehicle.name}` });
        if (imgAssetId) seenAssetIds.add(imgAssetId);
      }
    }
  }

  // Lead with cars / full exterior views; retain every featured asset in the gallery.
  if (['flex', 'elite', 'pink-patrol'].includes(slug) && vehicle.featuredImage && galleryImages.length > 1) {
    const featured = galleryImages.shift();
    if (featured) galleryImages.push(featured);
  }

  // Lead Flex with a current vehicle photo rather than its studio artwork.
  if (slug === 'flex') {
    const photographedVehicle = galleryImages.findIndex((image) => image.alt === 'LRP11');
    if (photographedVehicle > 0) {
      galleryImages.unshift(...galleryImages.splice(photographedVehicle, 1));
    }
  }

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
    <div className={styles.page}>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="bg-lrp-black py-8 text-white sm:py-12">
        <div className={styles.wrap}>
          <Link href="/fleet" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-primary-light focus-visible:!outline-white">Back to Fleet</Link>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="max-w-4xl text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] tracking-[-0.04em]">{vehicle.name}</h1>
              <p className="mt-4 text-lg capitalize">{vehicle.type}</p>
              {vehicle.pricingTiers && vehicle.pricingTiers.length > 0 && <div className="mt-3 flex flex-wrap gap-4 font-semibold text-primary-light">{vehicle.pricingTiers.map((tier) => {
                const label = { flex: 'Flex', elite: 'Elite', 'lrp-black': 'LRP Black' }[tier];
                return label ? <span key={tier}>{label}</span> : null;
              })}</div>}
            </div>
            <p className="shrink-0 font-boardson text-3xl text-primary-light">Up to {vehicle.capacity} passengers</p>
          </div>
        </div>
      </section>

      {/* Vehicle Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={styles.specGrid}>
            {/* Images Gallery */}
            <div className={styles.gallery}>
              <Gallery
                images={galleryImages}
                title={vehicle.name}
                mode="carousel"
                accentVariant={accentVariant}
              />
            </div>

            {/* Details */}
            <div>
              <h2 className="text-2xl font-bold text-lrp-black mb-4">
                Vehicle Details
              </h2>
              <p className="text-[#444] mb-6">{vehicle.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap items-baseline gap-y-1">
                  <span className="w-32 shrink-0 font-semibold text-lrp-black">Capacity:</span>
                  <span className="text-[#444]">{vehicle.capacity} passengers</span>
                </div>
                <div className="flex flex-wrap items-baseline gap-y-1">
                  <span className="w-32 shrink-0 font-semibold text-lrp-black">Type:</span>
                  <span className="text-[#444] capitalize">{vehicle.type}</span>
                </div>
                {vehicle.specifications?.make && (
                  <div className="flex flex-wrap items-baseline gap-y-1">
                    <span className="w-32 shrink-0 font-semibold text-lrp-black">Make/Model:</span>
                    <span className="text-[#444]">
                      {vehicle.specifications.make} {vehicle.specifications.model}
                    </span>
                  </div>
                )}
                {vehicle.specifications?.year && (
                  <div className="flex flex-wrap items-baseline gap-y-1">
                    <span className="w-32 shrink-0 font-semibold text-lrp-black">Year:</span>
                    <span className="text-[#444]">{vehicle.specifications.year}</span>
                  </div>
                )}
              </div>

              {vehicle.amenities && vehicle.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-lrp-black mb-3">
                    Amenities
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.amenities.map((amenityObj, index) => (
                      <li key={index} className="flex items-start text-[#444]">
                        <svg className="mr-2 h-5 w-5 shrink-0 text-[#2f730e]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {amenityObj.amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vehicle.pricing && (
                <div className={styles.price}>
                  <h3 className="text-xl font-semibold text-lrp-black mb-4">
                    Pricing Options
                  </h3>

                  {/* Point-to-Point Pricing */}
                  {vehicle.pricing.pointToPointMinimum && (
                    <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-[#444]">
                          Point-to-Point
                        </span>
                        <span className="text-xs text-[#444]">
                          (Taxi-style)
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#2f730e]">
                        Starting at ${vehicle.pricing.pointToPointMinimum}
                      </p>
                    </div>
                  )}

                  {/* Hourly Rate Pricing */}
                  {vehicle.pricing.hourlyRate && (
                    <div className={`${vehicle.pricing.dailyRate ? 'mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700' : 'mb-4'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-[#444]">
                          Hourly Charter
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#2f730e]">
                        ${vehicle.pricing.hourlyRate}/hour
                      </p>
                    </div>
                  )}

                  {/* Daily Rate Pricing */}
                  {vehicle.pricing.dailyRate && (
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-[#444]">
                          Full Day Rate
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#2f730e]">
                        ${vehicle.pricing.dailyRate}
                      </p>
                    </div>
                  )}

                  {/* Pricing Notes */}
                  {vehicle.pricing.notes && (
                    <p className="text-sm text-[#444] mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
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
        <FleetTestimonials
          testimonials={testimonials}
          title="What Our Clients Say"
          subtitle={`Hear from customers who loved riding in our ${vehicle.name.toLowerCase()}`}
        />
      )}

      {/* Booking Section */}
      <section className={`${styles.wrap} py-16`}>
        <div className={styles.cta}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Book This Vehicle
            </h2>
            <p className="text-lg text-white">
              Reserve {vehicle.name} for your next trip
            </p>
          </div>
          <div>
            <FleetBookingCTA vehicleName={vehicle.name} accentVariant={accentVariant} />
          </div>
        </div>
      </section>
    </div>
  );
}

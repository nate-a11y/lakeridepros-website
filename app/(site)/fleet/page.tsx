import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getVehicles, getMediaUrl } from '@/lib/api/sanity';
import type { Vehicle } from '@/types/sanity';
import { resolveSlug } from '@/types/sanity';
import styles from '@/components/fleet-editorial/FleetEditorial.module.css';

export const metadata: Metadata = {
  title: 'Our Fleet - Luxury Vehicles | Lake Ride Pros',
  description: 'Explore Lake Ride Pros limo buses, sprinter vans, shuttle buses, SUVs and specialty vehicles for groups at Lake of the Ozarks.',
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

const TIER_LABELS: Record<string, string> = { flex: 'Flex', elite: 'Elite', 'lrp-black': 'LRP Black' };

export default async function FleetPage() {
  const vehiclesData = await getVehicles().catch(() => ({ docs: [] as Vehicle[] }));
  // Keep everyday rides discoverable, then respect CMS ordering within each group.
  const vehicles = [...(vehiclesData.docs || [])].sort((a, b) => {
    const rank = (vehicle: Vehicle) => resolveSlug(vehicle.slug) === 'flex' ? 0
      : resolveSlug(vehicle.slug) === 'elite' ? 1 : vehicle.capacity <= 7 ? 2 : 3;
    return rank(a) - rank(b) || (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name);
  });
  const privateVehicles = vehicles.filter((vehicle) => vehicle.capacity <= 7);
  const groupVehicles = vehicles.filter((vehicle) => vehicle.capacity > 7);
  const heroVehicle = vehicles.find((vehicle) => resolveSlug(vehicle.slug) === 'elite') || privateVehicles[0];
  // Flex/Elite featured assets are category logos; their galleries hold the actual cars.
  const heroPhoto = heroVehicle?.images?.[0];
  const heroImage = heroPhoto?.image ? getMediaUrl(heroPhoto.image) : null;

  return (
    <div className={styles.page}>
      <section className="bg-lrp-black text-white">
        <div className={`${styles.wrap} py-10 sm:py-16`}>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-boardson text-3xl text-primary-light">From one seat to the whole group</p>
              <h1 className="mt-5 text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.045em]">Our Luxury Fleet</h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed">Professional vehicles for every occasion at Lake of the Ozarks</p>
              <p className="mt-4 max-w-lg text-base leading-relaxed">Not just buses. Flex rides for 1–4 and private SUVs for up to 7 bring the same Lake Ride Pros service to everyday plans.</p>
              <Link href="/book" className={`${styles.primary} mt-7 focus-visible:!outline-white`}>Check Availability</Link>
            </div>
            {heroImage && heroVehicle && (
              <figure className="min-w-0">
                <div className="relative aspect-[4/3]">
                  <Image src={heroImage} alt={heroPhoto?.alt || `${heroVehicle.name} private SUV transportation`} fill sizes="(min-width: 1024px) 48vw, 100vw" quality={85} loading="eager" fetchPriority="high" className="object-contain" />
                </div>
                <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-sm"><span>Private SUVs</span><span>1–7 passengers</span></figcaption>
              </figure>
            )}
          </div>
          <nav aria-label="Find your vehicle" className={`${styles.fleetNav} mt-10 grid border-t border-white/40 sm:grid-cols-2`}>
            <a href="#everyday-rides" className="flex min-h-20 items-center justify-between gap-4 border-b border-white/40 py-5 font-bold hover:text-primary-light focus-visible:!outline-white sm:pr-8"><span>Everyday rides & private SUVs</span><span>1–7</span></a>
            <a href="#group-vehicles" className="flex min-h-20 items-center justify-between gap-4 border-b border-white/40 py-5 font-bold hover:text-primary-light focus-visible:!outline-white sm:pl-8"><span>Vans, buses & specialty rides</span><span>8+</span></a>
          </nav>
        </div>
      </section>

      <div className={`${styles.wrap} pb-16 sm:pb-24`}>
        {vehicles.length === 0 ? (
          <div className="py-16">
            <p className={styles.text}>Our fleet information is being updated. Please check back soon or contact us for vehicle availability.</p>
            <Link href="/contact" className={`${styles.primary} mt-6`}>Contact Us</Link>
          </div>
        ) : (
          [
            { id: 'everyday-rides', title: 'Everyday rides. Private comfort.', description: 'Flex, Elite, and our signature SUVs. For airport arrivals, dinner plans, appointments, and the ride home.', vehicles: privateVehicles },
            { id: 'group-vehicles', title: 'Bring everyone along.', description: 'Executive vans, full-size shuttles, and unmistakable Lake Ride Pros vehicles for plans worth sharing.', vehicles: groupVehicles },
          ].map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28 pt-16 sm:pt-24">
              <header className="mb-10 max-w-3xl">
                <h2 id={`${group.id}-heading`} className="text-4xl leading-tight tracking-[-0.025em] sm:text-5xl">{group.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-[#444]">{group.description}</p>
              </header>
              <div>
                {group.vehicles.map((vehicle) => {
                  const vehicleSlug = resolveSlug(vehicle.slug);
                  const preferredPhoto = vehicleSlug === 'flex' ? vehicle.images?.find((photo) => photo.alt === 'LRP11')
                    : vehicleSlug === 'elite' ? vehicle.images?.[0]
                    : vehicleSlug === 'pink-patrol' ? vehicle.images?.find((photo) => getMediaUrl(photo.image) !== getMediaUrl(vehicle.featuredImage)) : undefined;
                  const photo = preferredPhoto?.image || vehicle.featuredImage || vehicle.images?.[0]?.image;
                  const imageUrl = photo ? getMediaUrl(photo) : null;
                  const imageAlt = preferredPhoto?.alt || vehicle.featuredImage?.alt || `${vehicle.name} - Luxury transportation`;
                  return (
                    <article key={resolveSlug(vehicle.slug)} className="grid items-start gap-7 border-t border-[#b5b5b5] py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
                      {imageUrl ? (
                        <div className="relative aspect-[4/3] min-w-0 bg-lrp-gray lg:sticky lg:top-28">
                          <Image src={imageUrl} alt={imageAlt} fill sizes="(min-width: 1024px) 48vw, 100vw" quality={85} className="object-contain" />
                        </div>
                      ) : <p className="py-8 text-[#444]">{vehicle.name} Image</p>}
                      <div className="min-w-0">
                        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                          <h3 className="text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">{vehicle.name}</h3>
                          <p className="font-bold">{vehicle.capacity} passenger{vehicle.capacity !== 1 ? 's' : ''}</p>
                        </div>
                        {vehicle.pricingTiers && vehicle.pricingTiers.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold text-[#2f730e]">
                            {vehicle.pricingTiers.map((tier) => TIER_LABELS[tier] ? <span key={tier}>{TIER_LABELS[tier]}</span> : null)}
                          </div>
                        )}
                        {vehicle.pricing?.pointToPointMinimum ? <p className="mb-4 font-semibold text-[#2f730e]">Starting at ${vehicle.pricing.pointToPointMinimum}</p>
                          : vehicle.pricing?.hourlyRate ? <p className="mb-4 font-semibold text-[#2f730e]">${vehicle.pricing.hourlyRate}/hr</p> : null}
                        <p className={styles.text}>{vehicle.description}</p>
                        {vehicle.amenities && vehicle.amenities.length > 0 && (
                          <div className="mt-6">
                            <h4 className="mb-3 font-semibold">Features & Amenities:</h4>
                            <ul className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
                              {vehicle.amenities.slice(0, 6).map((item, index) => <li key={index} className="border-l-2 border-primary pl-3 text-sm leading-relaxed text-[#444]">{item.amenity}</li>)}
                            </ul>
                            {vehicle.amenities.length > 6 && <p className="mt-3 text-sm text-[#444]">+{vehicle.amenities.length - 6} more features</p>}
                          </div>
                        )}
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                          <Link href={`/fleet/${resolveSlug(vehicle.slug)}`} className={styles.primary} aria-label={`View details about ${vehicle.name}`}>View Details</Link>
                          <Link href="/book" className={styles.secondary}>Check Availability</Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}
        <section className={styles.cta}>
          <h2>Not Sure Which Vehicle Is Right for You?</h2>
          <p>Contact us and we&apos;ll help you choose the perfect vehicle for your event.</p>
          <Link href="/contact" className={styles.primary}>Contact Us</Link>
        </section>
      </div>
    </div>
  );
}

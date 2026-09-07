import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/drivers-editorial/DriversEditorial.module.css';
import { getDriverProfiles, getMediaUrl } from '@/lib/api/sanity';

export const metadata: Metadata = {
  title: 'Our Team | Lake Ride Pros',
  description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners providing premium transportation services at Lake of the Ozarks.',
  keywords: 'Lake Ride Pros team, professional drivers, transportation team, Lake of the Ozarks, our drivers, meet the team',
  alternates: {
    canonical: 'https://www.lakeridepros.com/our-drivers',
  },
  openGraph: {
    title: 'Our Team | Lake Ride Pros',
    description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners providing premium transportation services.',
    url: 'https://www.lakeridepros.com/our-drivers',
    siteName: 'Lake Ride Pros',
    images: [
      {
        url: 'https://www.lakeridepros.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lake Ride Pros Team',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team | Lake Ride Pros',
    description: 'Meet the professional team behind Lake Ride Pros - dedicated drivers, dispatchers, and owners.',
    images: ['https://www.lakeridepros.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

function getRoleLabel(role: string[] | undefined): string {
  if (!role || role.length === 0) return 'Team Member';

  const labels = role.map((r) => {
    switch (r) {
      case 'owner': return 'Owner';
      case 'admin': return 'Admin';
      case 'dispatcher': return 'Dispatcher';
      case 'driver': return 'Professional Driver';
      case 'cdl_trainer': return 'CDL Trainer';
      case 'aesthetic_master_technician': return 'Aesthetic Master Technician';
      case 'manager': return 'Manager';
      case 'trainer': return 'Trainer';
      case 'brand_ambassador': return 'Brand Ambassador';
      default: return 'Team Member';
    }
  });

  return labels.join(' & ');
}

export default async function OurDriversPage() {
  const drivers = await getDriverProfiles();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <h1>Meet Our Team</h1>
            <p className={styles.intro}>
              The professionals behind your premium transportation experience
            </p>
          </div>
          <div className={styles.certification}>
            <Image
              src="https://dhwnlzborisjihhauchp.supabase.co/storage/v1/object/public/media/1769395379565-1000010589.webp"
              alt="First Aid, CPR, AED, and Stop the Bleed Certified"
              width={64}
              height={64}
            />
            <div>
              <p>
                All Drivers Certified in First Aid, CPR, AED &amp; Stop the
                Bleed
              </p>
              <p className={styles.caption}>
                Your safety is our training—every driver is emergency response
                certified.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className={styles.section}
        aria-label="Lake Ride Pros team profiles"
      >
        <div className={styles.container}>
          {drivers.length === 0 ? (
            <div className={styles.empty}>
              <h2>Coming Soon</h2>
              <p>
                We&apos;re working on something great. Check back soon to meet
                our amazing team!
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {drivers.map((driver, index) => {
                const imageUrl = getMediaUrl(driver.image);
                const roleLabel = getRoleLabel(driver.role);
                const isOwner = driver.role && driver.role.includes('owner');
                const nameParts = driver.name.trim().split(/\s+/);
                const displayName = isOwner
                  ? driver.name
                  : nameParts.length > 1
                    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
                    : nameParts[0];
                const driverSlug = driver.slug;
                return (
                  <article key={driver._id} className={styles.profile}>
                    <Link
                      href={`/our-drivers/${driverSlug}`}
                      className={styles.portrait}
                      aria-label={`View ${displayName}'s profile`}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${displayName} - ${roleLabel}`}
                          fill
                          sizes="(min-width: 1280px) 286px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                      ) : (
                        <span className={styles.placeholder} aria-hidden="true">
                          {driver.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </Link>
                    <div className={styles.profileInfo}>
                      <div className={styles.nameRow}>
                        <h2>
                          <Link href={`/our-drivers/${driverSlug}`}>
                            {displayName}
                          </Link>
                        </h2>
                        {driver.assignmentNumber && (
                          <span className={styles.assignment}>
                            {driver.assignmentNumber}
                          </span>
                        )}
                      </div>
                      <p className={styles.role}>{roleLabel}</p>
                      {driver.vehicles && driver.vehicles.length > 0 && (
                        <div className={styles.vehicles}>
                          {driver.vehicles.map((vehicle) => (
                            <span key={vehicle} className={styles.vehicle}>
                              {vehicle
                                .split('_')
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(' ')}
                            </span>
                          ))}
                        </div>
                      )}
                      {driver.bio && (
                        <p className={styles.bioPreview}>{driver.bio}</p>
                      )}
                      <Link
                        href={`/our-drivers/${driverSlug}`}
                        className={styles.textLink}
                        aria-label={`View ${displayName}'s profile`}
                      >
                        View Profile
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className={styles.close}>
        <div className={`${styles.container} ${styles.closeGrid}`}>
          <div>
            <h2>Join Our Team</h2>
            <p className={styles.intro}>
              Are you a professional driver looking for a great opportunity?
              We&apos;re always looking for talented individuals to join our
              team.
            </p>
          </div>
          <Link href="/careers/driver-application" className={styles.button}>
            View Career Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}

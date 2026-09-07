import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/drivers-editorial/DriversEditorial.module.css';
import { ArrowLeft } from 'lucide-react';
import { getDriverProfileBySlug, getMediaUrl } from '@/lib/api/sanity';
import { metaDescription, metaTitle } from '@/lib/seo/metadata';

interface Props {
  params: Promise<{ id: string }>;
}

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

function formatDisplayName(name: string, role: string[] | undefined): string {
  if (role && role.includes('owner')) return name;
  const nameParts = name.trim().split(/\s+/);
  return nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
    : nameParts[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params;
  const driver = await getDriverProfileBySlug(slug);

  if (!driver) {
    return {
      title: 'Team Member Not Found | Lake Ride Pros',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayName = formatDisplayName(driver.name, driver.role);
  const roleLabel = getRoleLabel(driver.role);
  const imageUrl = getMediaUrl(driver.image);
  const isOpenProfile = driver.name.trim().toLowerCase() === 'open';
  const titleText = metaTitle(`${displayName} - ${roleLabel}`);
  const descriptionText = metaDescription(
    driver.bio ? `Meet ${displayName}, ${roleLabel} at Lake Ride Pros. ${driver.bio}` : '',
    `Meet ${displayName}, ${roleLabel} at Lake Ride Pros, providing premium transportation services at Lake of the Ozarks.`
  );

  return {
    title: titleText,
    description: descriptionText,
    alternates: {
      canonical: `https://www.lakeridepros.com/our-drivers/${slug}`,
    },
    robots: isOpenProfile
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: `https://www.lakeridepros.com/our-drivers/${slug}`,
      siteName: 'Lake Ride Pros',
      images: [{ url: imageUrl || 'https://www.lakeridepros.com/og-image.jpg', width: 1200, height: 630, alt: displayName }],
      type: 'profile',
    },
  };
}

// Use dynamic rendering with ISR - regenerate every hour
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function DriverDetailPage({ params }: Props) {
  const { id: slug } = await params;
  const driver = await getDriverProfileBySlug(slug);

  if (!driver) {
    notFound();
  }

  const imageUrl = getMediaUrl(driver.image);
  const roleLabel = getRoleLabel(driver.role);
  const displayName = formatDisplayName(driver.name, driver.role);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.back}>
            <Link href="/our-drivers" className={styles.textLink}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back to Team
            </Link>
          </div>
          <h1>{displayName}</h1>
          <p className={styles.detailRole}>{roleLabel}</p>
          {driver.assignmentNumber && (
            <span className={styles.detailAssignment}>
              {driver.assignmentNumber}
            </span>
          )}
        </div>
      </section>
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.detailGrid}`}>
          <div className={styles.detailPortrait}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${displayName} - ${roleLabel}`}
                fill
                sizes="(min-width: 1280px) 550px, (min-width: 768px) 45vw, 100vw"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                {driver.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.facts}>
            <div className={styles.nameRow}>
              <h2>{displayName}</h2>
              {driver.assignmentNumber && (
                <span className={styles.assignment}>
                  {driver.assignmentNumber}
                </span>
              )}
            </div>
            <p className={styles.role}>{roleLabel}</p>
            {driver.vehicles && driver.vehicles.length > 0 && (
              <div className={styles.factSection}>
                <h3>Vehicles</h3>
                <div className={styles.vehicles}>
                  {driver.vehicles.map((vehicle) => (
                    <span key={vehicle} className={styles.vehicle}>
                      {vehicle
                        .split('_')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {driver.bio && (
              <div className={styles.factSection}>
                <h3>About</h3>
                <p className={styles.biography}>{driver.bio}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className={styles.close}>
        <div className={`${styles.container} ${styles.closeGrid}`}>
          <div>
            <h2>Ready to Book Your Ride?</h2>
            <p className={styles.intro}>
              Our team is ready to provide you with premium transportation
              services at Lake of the Ozarks.
            </p>
          </div>
          <div className={styles.actions}>
            <Link href="/book" className={styles.button}>
              Book Now
            </Link>
            <Link href="/our-drivers" className={styles.secondaryButton}>
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

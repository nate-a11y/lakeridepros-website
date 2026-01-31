import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, ArrowLeft } from 'lucide-react';
import {
  getDriverById,
  getDriverImageUrl,
  getDriverRoleLabel,
  formatDriverDisplayName,
} from '@/lib/supabase/drivers';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const driver = await getDriverById(id);

  if (!driver) {
    return {
      title: 'Team Member Not Found | Lake Ride Pros',
    };
  }

  const displayName = formatDriverDisplayName(driver);
  const roleLabel = getDriverRoleLabel(driver.role);
  const imageUrl = getDriverImageUrl(driver);

  return {
    title: `${displayName} - ${roleLabel} | Lake Ride Pros`,
    description: driver.bio
      ? `Meet ${displayName}, ${roleLabel} at Lake Ride Pros. ${driver.bio.slice(0, 150)}...`
      : `Meet ${displayName}, ${roleLabel} at Lake Ride Pros - providing premium transportation services at Lake of the Ozarks.`,
    alternates: {
      canonical: `https://www.lakeridepros.com/our-drivers/${id}`,
    },
    openGraph: {
      title: `${displayName} - ${roleLabel} | Lake Ride Pros`,
      description: driver.bio || `${roleLabel} at Lake Ride Pros`,
      url: `https://www.lakeridepros.com/our-drivers/${id}`,
      siteName: 'Lake Ride Pros',
      images: [{ url: imageUrl || 'https://www.lakeridepros.com/og-image.jpg', width: 1200, height: 630, alt: displayName }],
      type: 'profile',
    },
  };
}

// Use dynamic rendering with ISR - regenerate every hour
// This avoids static generation at build time while still caching
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function DriverDetailPage({ params }: Props) {
  const { id } = await params;
  const driver = await getDriverById(id);

  if (!driver) {
    redirect('/our-drivers');
  }

  const imageUrl = getDriverImageUrl(driver);
  const roleLabel = getDriverRoleLabel(driver.role);
  const displayName = formatDriverDisplayName(driver);
  const isOwner = driver.role && driver.role.includes('owner');

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/our-drivers"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Team</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-boardson text-4xl sm:text-5xl font-bold">
              {displayName}
            </h1>
            {driver.assignment_number && (
              <span className="inline-flex items-center px-3 py-1 text-sm font-bold bg-white/20 text-white rounded-lg border border-white/30">
                {driver.assignment_number}
              </span>
            )}
          </div>
          <p className="text-xl text-white/90 mt-2">{roleLabel}</p>
        </div>
      </section>

      {/* Driver Profile Section */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[400px] bg-gradient-to-br from-primary/10 to-primary/5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={driver.media?.alt || `${displayName} - ${roleLabel}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary">
                        {driver.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {displayName}
                  </h2>
                  {driver.assignment_number && (
                    <span className="inline-flex items-center px-2.5 py-1 text-sm font-bold bg-[#1f2937] text-white dark:bg-[#f5f5f5] dark:text-[#1f2937] rounded">
                      {driver.assignment_number}
                    </span>
                  )}
                </div>
                <p className="text-lg font-medium text-primary dark:text-primary-light mb-4">
                  {roleLabel}
                </p>

                {/* Vehicles */}
                {driver.vehicles && driver.vehicles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                      Vehicles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {driver.vehicles.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-full"
                        >
                          {vehicle
                            .split('_')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {driver.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                      About
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                      {driver.bio}
                    </p>
                  </div>
                )}

                {/* Contact Info for Owners */}
                {isOwner && (driver.phone || driver.email) && (
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3">
                      Contact
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {driver.phone && (
                        <a
                          href={`tel:${driver.phone}`}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-lrp-black rounded-lg font-medium transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                          <span>{driver.phone}</span>
                        </a>
                      )}
                      {driver.email && (
                        <a
                          href={`mailto:${driver.email}`}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary hover:text-lrp-black text-primary dark:bg-primary/20 dark:text-primary-light dark:hover:bg-primary dark:hover:text-lrp-black rounded-lg font-medium transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                          <span>Send Email</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-8">
            Our team is ready to provide you with premium transportation services at Lake of the Ozarks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-lrp-black bg-primary hover:bg-primary-dark transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/our-drivers"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-primary dark:text-primary-light border-2 border-primary hover:bg-primary hover:text-lrp-black transition-colors"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

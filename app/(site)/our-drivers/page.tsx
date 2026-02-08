import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
      case 'dispatcher': return 'Dispatcher';
      case 'driver': return 'Professional Driver';
      case 'cdl_trainer': return 'CDL Trainer';
      case 'aesthetic_master_technician': return 'Aesthetic Master Technician';
      case 'manager': return 'Manager';
      case 'trainer': return 'Trainer';
      default: return 'Team Member';
    }
  });

  return labels.join(' & ');
}

export default async function OurDriversPage() {
  const drivers = await getDriverProfiles();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">
            Meet Our Team
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            The professionals behind your premium transportation experience
          </p>
        </div>
      </section>

      {/* Certification Banner */}
      <section className="bg-white dark:bg-dark-bg-primary border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Image
              src="https://dhwnlzborisjihhauchp.supabase.co/storage/v1/object/public/media/1769395379565-1000010589.webp"
              alt="First Aid, CPR, AED, and Stop the Bleed Certified"
              width={64}
              height={64}
              className="object-contain"
            />
            <div className="text-center sm:text-left">
              <p className="font-bold text-neutral-900 dark:text-white">
                All Drivers Certified in First Aid, CPR, AED & Stop the Bleed
              </p>
              <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                Your safety is our training—every driver is emergency response certified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {drivers.length === 0 ? (
            <div className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary">
                We&apos;re working on something great. Check back soon to meet our amazing team!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {drivers.map((driver) => {
                const imageUrl = getMediaUrl(driver.image);
                const roleLabel = getRoleLabel(driver.role);
                const isOwner = driver.role && driver.role.includes('owner');

                // Format name as "First L."
                const nameParts = driver.name.trim().split(/\s+/);
                const displayName = isOwner
                  ? driver.name
                  : nameParts.length > 1
                    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
                    : nameParts[0];

                const driverSlug = driver.slug;

                return (
                  <div
                    key={driver._id}
                    className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl group"
                  >
                    {/* Driver Image - Clickable */}
                    <Link
                      href={`/our-drivers/${driverSlug}`}
                      className="block relative w-full aspect-square bg-gradient-to-br from-primary/10 to-primary/5"
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${displayName} - ${roleLabel}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">
                              {driver.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </Link>

                    {/* Driver Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/our-drivers/${driverSlug}`}>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                            {displayName}
                          </h3>
                        </Link>
                        {driver.assignmentNumber && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-[#1f2937] text-white dark:bg-[#f5f5f5] dark:text-[#1f2937] rounded">
                            {driver.assignmentNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary dark:text-primary-light mb-2">
                        {roleLabel}
                      </p>
                      {driver.vehicles && driver.vehicles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {driver.vehicles.map((vehicle) => (
                            <span
                              key={vehicle}
                              className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-full"
                            >
                              {vehicle
                                .split('_')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </span>
                          ))}
                        </div>
                      )}
                      {driver.bio && (
                        <p className="text-lrp-text-secondary dark:text-dark-text-secondary text-sm line-clamp-3">
                          {driver.bio}
                        </p>
                      )}
                      <Link
                        href={`/our-drivers/${driverSlug}`}
                        className="mt-3 text-sm font-medium text-primary dark:text-primary-light opacity-0 group-hover:opacity-100 transition-opacity inline-block"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Join Our Team
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary mb-8">
            Are you a professional driver looking for a great opportunity? We&apos;re always looking for talented individuals to join our team.
          </p>
          <Link
            href="/careers/driver-application"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-lrp-black bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View Career Opportunities
          </Link>
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import TeamMemberCard from '@/components/TeamMemberCard';
import { getTeamMembersByRole } from '@/lib/api/team';

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

// Force dynamic rendering to fetch fresh data from Supabase
export const dynamic = 'force-dynamic';

export default async function OurDriversPage() {
  const { owners, dispatchers, drivers } = await getTeamMembersByRole();

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

      {/* Owners Section */}
      {owners.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Owners
              </h2>
              <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                Leadership dedicated to providing exceptional service
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {owners.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dispatchers Section */}
      {dispatchers.length > 0 && (
        <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Dispatchers
              </h2>
              <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                Coordinating your seamless transportation experience
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dispatchers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Drivers Section */}
      {drivers.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Drivers
              </h2>
              <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                Professional drivers ensuring safe and comfortable journeys
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {drivers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {owners.length === 0 && dispatchers.length === 0 && drivers.length === 0 && (
        <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                No Team Members Found
              </h2>
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary mb-6">
                To display team members on this page, you need to:
              </p>
              <div className="text-left max-w-xl mx-auto space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">1</span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Add users to the <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">users</code> table in Supabase
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">2</span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Add corresponding entries to the <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">directory</code> table with <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">is_active = true</code>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">3</span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Set the <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">role</code> field in directory to "Owner", "Dispatcher", or "Driver"
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">4</span>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Ensure users have <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">employment_status = 'active'</code>
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Check the server console for detailed error messages if data exists but isn't displaying.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

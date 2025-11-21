import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Lake Ride Pros',
  description: 'The page you are looking for could not be found. Return to Lake Ride Pros for luxury transportation services at Lake of the Ozarks.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg-primary px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary dark:text-primary-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary dark:text-primary-light hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}

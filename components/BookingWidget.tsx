'use client';

import { useEffect, useRef } from 'react';

interface BookingWidgetProps {
  className?: string;
}

export default function BookingWidget({ className = '' }: BookingWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moovsEmbedUrl = process.env.NEXT_PUBLIC_MOOVS_EMBED_URL;

  useEffect(() => {
    // This will load the Moovs booking widget iframe when available
    if (containerRef.current && moovsEmbedUrl) {
      // Clear any existing content
      containerRef.current.innerHTML = '';

      // Create and append iframe
      const iframe = document.createElement('iframe');
      iframe.src = moovsEmbedUrl;
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.title = 'Book Your Ride';

      containerRef.current.appendChild(iframe);
    }
  }, [moovsEmbedUrl]);

  // Fallback UI when Moovs URL is not configured
  if (!moovsEmbedUrl) {
    return (
      <div className={`bg-neutral-100 dark:bg-dark-bg-tertiary rounded-lg p-8 text-center transition-colors ${className}`}>
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Book Your Luxury Ride
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
          Experience premium transportation at Lake of the Ozarks
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            To complete your booking, please contact us directly:
          </p>
          <div className="space-y-3">
            <a
              href="tel:5732069499"
              className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              📞 Call: (573) 206-9499
            </a>
            <a
              href="mailto:contactus@lakeridepros.com"
              className="block w-full bg-secondary dark:bg-primary hover:bg-secondary-dark dark:hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ✉️ Email: contactus@lakeridepros.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-widget-container ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}

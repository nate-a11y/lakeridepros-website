'use client';

import { useCallback, useEffect, useRef } from 'react';
import { trackServiceEvent } from '@/lib/analytics';
import { PhoneLink } from '@/components/PhoneLink';

interface BookingWidgetProps {
  className?: string;
  serviceSlug?: string;
}

export default function BookingWidget({ className = '', serviceSlug }: BookingWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moovsEmbedUrl = process.env.NEXT_PUBLIC_MOOVS_EMBED_URL;
  const trackedRef = useRef(false);
  const iframeLoadedRef = useRef(false);

  useEffect(() => {
    // Track booking intent when widget is displayed (only once)
    if (serviceSlug && !trackedRef.current) {
      trackServiceEvent(serviceSlug, 'booking');
      trackedRef.current = true;
    }
  }, [serviceSlug]);

  const loadBookingIframe = useCallback(() => {
    if (iframeLoadedRef.current || !containerRef.current || !moovsEmbedUrl) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create and append iframe
    const iframe = document.createElement('iframe');
    iframe.src = moovsEmbedUrl;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.title = 'Book Your Ride';
    iframe.loading = 'lazy';

    containerRef.current.appendChild(iframe);
    iframeLoadedRef.current = true;
  }, [moovsEmbedUrl]);

  useEffect(() => {
    if (typeof window === 'undefined' || !moovsEmbedUrl) return;

    const container = containerRef.current;
    if (!container) return;

    if (!('IntersectionObserver' in window)) {
      loadBookingIframe();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadBookingIframe();
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [loadBookingIframe, moovsEmbedUrl]);

  // Fallback UI when Moovs URL is not configured
  if (!moovsEmbedUrl) {
    return (
      <div className={`bg-neutral-100 dark:bg-dark-bg-tertiary rounded-lg p-8 text-center transition-colors ${className}`}>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Book Your Luxury Ride
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
          Experience premium transportation at Lake of the Ozarks
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            To complete your booking, please contact us directly:
          </p>
          <div className="space-y-3">
            <PhoneLink
              className="block w-full bg-primary-dark hover:bg-primary text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Call/Text: (573) 206-9499
            </PhoneLink>
            <a
              href="mailto:contactus@lakeridepros.com"
              className="block w-full bg-secondary-dark dark:bg-primary-dark hover:bg-secondary dark:hover:bg-primary text-lrp-black font-semibold py-3 px-6 rounded-lg transition-colors"
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
      {/* Fixed height container prevents layout shift when iframe loads */}
      <div ref={containerRef} style={{ minHeight: '600px' }} />
    </div>
  );
}

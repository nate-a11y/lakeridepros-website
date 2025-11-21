'use client';

import { useState, useEffect, useRef } from 'react';

interface SpotifyEmbedProps {
  artistId?: string;
  title?: string;
  subtitle?: string;
}

export default function SpotifyEmbed({
  artistId = '44y7Dl9jKhtIq1SJ7uKv7v',
  title = 'Ride With The Vibe',
  subtitle = 'Listen to music from our featured artist',
}: SpotifyEmbedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before it comes into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          ref={containerRef}
          className="w-full rounded-xl overflow-hidden shadow-lg bg-neutral-100 dark:bg-dark-bg-secondary"
          style={{ minHeight: '380px' }}
        >
          {isVisible ? (
            <iframe
              style={{ borderRadius: '12px' }}
              src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
              width="100%"
              height="380"
              frameBorder="0"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Artist Embed"
            />
          ) : (
            <div className="w-full h-[380px] flex flex-col items-center justify-center gap-4">
              <svg
                className="w-16 h-16 text-neutral-400 dark:text-neutral-600 animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Loading music player...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

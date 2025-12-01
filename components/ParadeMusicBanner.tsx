'use client';

import { useState, useEffect } from 'react';

type ParadeEvent = { date: string; name: string };

export default function ParadeMusicBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showBookmarkTip, setShowBookmarkTip] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [events, setEvents] = useState<ParadeEvent[] | null>(null);

  const bookmarkUrl = 'https://www.lakeride.pro/parade-music';

  useEffect(() => {
    // Detect Mac for keyboard shortcut display
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    // Calculate events based on current date (client-side only to avoid hydration issues)
    const now = new Date();
    const december7_2025 = new Date(2025, 11, 7); // December 7, 2025
    const december14_2025 = new Date(2025, 11, 14); // December 14, 2025

    // Hide banner after December 13, 2025 (on 14th or later)
    if (now >= december14_2025) {
      setEvents([]);
      return;
    }

    // If current date is before December 7, 2025, show both events
    if (now < december7_2025) {
      setEvents([
        { date: '12/6', name: 'Eldon Lighted Parade' },
        { date: '12/13', name: 'Lake Area Chamber in Lake Ozark' },
      ]);
    } else {
      // On or after December 7th, only show the second event
      setEvents([{ date: '12/13', name: 'Lake Area Chamber in Lake Ozark' }]);
    }
  }, []);

  const handleBookmarkClick = () => {
    // Try to trigger bookmark dialog (works in some browsers)
    // Most modern browsers block this, so we show a tip instead
    try {
      // @ts-expect-error - sidebar is not in TypeScript definitions
      if (window.sidebar && window.sidebar.addPanel) {
        // Firefox <23
        // @ts-expect-error - sidebar is not in TypeScript definitions
        window.sidebar.addPanel(document.title, bookmarkUrl, '');
      } else if (
        // @ts-expect-error - external is not standard
        window.external?.AddFavorite
      ) {
        // IE Favorites
        // @ts-expect-error - AddFavorite is IE specific
        window.external.AddFavorite(bookmarkUrl, 'Lake Ride Pros Parade Music');
      } else {
        // Show tip for modern browsers
        setShowBookmarkTip(true);
        setTimeout(() => setShowBookmarkTip(false), 5000);
      }
    } catch {
      setShowBookmarkTip(true);
      setTimeout(() => setShowBookmarkTip(false), 5000);
    }
  };

  // Don't render until client-side date check completes, or if dismissed, or if no events
  if (!isVisible || events === null || events.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white">
      {/* Animated sparkle/star background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
        <div
          className="absolute top-4 left-[25%] w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse opacity-80"
          style={{ animationDelay: '0.3s' }}
        />
        <div
          className="absolute top-1 left-[40%] w-1 h-1 bg-white rounded-full animate-pulse opacity-50"
          style={{ animationDelay: '0.6s' }}
        />
        <div
          className="absolute top-3 left-[60%] w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse opacity-70"
          style={{ animationDelay: '0.9s' }}
        />
        <div
          className="absolute top-2 left-[75%] w-1 h-1 bg-white rounded-full animate-pulse opacity-60"
          style={{ animationDelay: '1.2s' }}
        />
        <div
          className="absolute top-5 left-[90%] w-1 h-1 bg-yellow-200 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute bottom-2 left-[15%] w-1 h-1 bg-white rounded-full animate-pulse opacity-40"
          style={{ animationDelay: '0.4s' }}
        />
        <div
          className="absolute bottom-3 left-[50%] w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: '0.7s' }}
        />
        <div
          className="absolute bottom-1 left-[85%] w-1 h-1 bg-white rounded-full animate-pulse opacity-50"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10 min-h-0"
        aria-label="Dismiss banner"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Banner content */}
      <div className="relative max-w-7xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          {/* Heading */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-purple-200 uppercase tracking-wider">
              Something Magical is Coming...
            </p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent">
                Synchronized Parade Music
              </span>
            </h2>
          </div>

          {/* Events */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2"
              >
                <span className="text-yellow-300 font-bold text-sm sm:text-base">
                  {event.date}
                </span>
                <span className="text-white/90 text-xs sm:text-sm">
                  {event.name}
                </span>
              </div>
            ))}
          </div>

          {/* Bookmark CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <p className="text-xs sm:text-sm text-purple-100">
              Save the music page to tune in during the parade:
            </p>
            <div className="flex items-center gap-2">
              <a
                href={bookmarkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors min-h-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Visit Page
              </a>
              <button
                onClick={handleBookmarkClick}
                className="inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-semibold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors min-h-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Bookmark
              </button>
            </div>
          </div>

          {/* Bookmark tip tooltip */}
          {showBookmarkTip && (
            <div className="absolute bottom-full mb-2 bg-white text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-lg shadow-lg animate-fadeIn">
              Press{' '}
              <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                {isMac ? '⌘' : 'Ctrl'}+D
              </kbd>{' '}
              to bookmark this page
            </div>
          )}

          {/* Footer note */}
          <p className="text-[10px] sm:text-xs text-purple-200/70">
            Experience the magic with synchronized music right from your car
          </p>
        </div>
      </div>
    </div>
  );
}

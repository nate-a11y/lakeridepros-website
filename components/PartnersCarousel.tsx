'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PartnerData {
  id: string;
  name: string;
  slug?: string;
  website?: string;
  blurb?: string;
  logoUrl: string;
  isPremierPartner?: boolean | null;
  isWeddingPartner?: boolean | null;
}

interface PartnersCarouselProps {
  partners: PartnerData[];
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clone partners on client side for infinite scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Handle seamless loop animation
    const handleAnimationIteration = () => {
      container.style.animation = 'none';
      // Trigger reflow by reading layout property
      void container.offsetHeight;
      container.style.animation = '';
    };

    container.addEventListener('animationiteration', handleAnimationIteration);
    return () => container.removeEventListener('animationiteration', handleAnimationIteration);
  }, []);

  if (!partners.length) return null;

  return (
    <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
          Trusted by Leading Organizations
        </h2>
      </div>
      <div className="relative overflow-x-auto scrollbar-hide">
        <div
          ref={scrollRef}
          className="flex animate-scroll-left"
          style={{ width: 'max-content' }}
        >
          {/* Render partners twice for seamless infinite scroll */}
          {[...partners, ...partners].map((partner, index) => {
            // Determine the correct URL path based on partner type
            const getPartnerUrl = (): string | undefined => {
              if (!partner.slug) return partner.website;
              if (partner.isPremierPartner) return `/local-premier-partners/${partner.slug}`;
              if (partner.isWeddingPartner) return `/wedding-partners/${partner.slug}`;
              return `/partners/${partner.slug}`;
            };
            const partnerLink = getPartnerUrl();
            const partnerContent = (
              <div className="flex flex-col items-center space-y-3 p-6 bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-md hover:shadow-xl transition-all w-80">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={200}
                  height={100}
                  className="h-24 w-auto object-contain transition-all"
                />
                <div className="text-center">
                  <h3 className="font-semibold text-neutral-900 dark:text-white text-lg mb-1">
                    {partner.name}
                  </h3>
                  {partner.blurb && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {partner.blurb}
                    </p>
                  )}
                </div>
              </div>
            );

            return partnerLink ? (
              <Link
                key={`partner-${partner.id}-${index}`}
                href={partnerLink}
                className="flex-shrink-0 mx-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                aria-label={`View ${partner.name} partner page`}
                {...(!partner.slug ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {partnerContent}
              </Link>
            ) : (
              <div key={`partner-${partner.id}-${index}`} className="flex-shrink-0 mx-4 flex items-center justify-center">
                {partnerContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

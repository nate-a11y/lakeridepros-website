'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Service } from '@/src/payload-types';
import { DynamicIcon } from '@/lib/iconMapper';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { BookingModal } from './BookingModal';

interface PopularServicesRankingProps {
  services: Service[];
  title?: string;
  subtitle?: string;
}

export default function PopularServicesRanking({
  services,
  title = 'Most Requested Services',
  subtitle = 'See what our customers book most often',
}: PopularServicesRankingProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (services.length === 0) {
    return null;
  }

  return (
    <>
      <section
        aria-labelledby="popular-services-heading"
        className="py-16 bg-white dark:bg-dark-bg-primary transition-colors"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Trending Now
          </div>
          <h2
            id="popular-services-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative"
            >
              {/* Gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-light rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

              <div className="relative bg-neutral-50 dark:bg-dark-bg-secondary rounded-xl p-6 hover:bg-white dark:hover:bg-dark-bg-tertiary transition-all duration-300 h-full flex flex-col">
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                {service.icon && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <DynamicIcon name={service.icon} size={24} />
                  </div>
                )}

                {/* Content */}
                <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {service.title}
                </h3>

                {(service.shortDescription || service.description) && (
                  <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary mb-4 flex-grow line-clamp-3">
                    {service.shortDescription || service.description}
                  </p>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  {service.pricing?.basePrice ? (
                    <span className="text-sm text-primary dark:text-primary-light font-semibold">
                      From ${service.pricing.basePrice}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsBookingOpen(true);
                      }}
                      className="text-sm text-primary dark:text-primary-light font-semibold hover:underline focus:outline-none focus:underline"
                    >
                      Get Quote
                    </button>
                  )}
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-primary dark:group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
                </div>

                {/* Popularity indicator */}
                {index === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                      #1 Choice
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}

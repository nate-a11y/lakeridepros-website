'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';
import { DynamicIcon } from '@/lib/iconMapper';
import { ChevronRight } from 'lucide-react';
import { BookingModal } from './BookingModal';

interface ServicesShowcaseProps {
  services: Service[];
  title?: string;
  subtitle?: string;
}

export default function ServicesShowcase({
  services,
  title = 'Our Services',
  subtitle = 'From airport transfers to special events, we provide premium transportation for every occasion',
}: ServicesShowcaseProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (services.length === 0) {
    return null;
  }

  return (
    <>
      <section
        aria-labelledby="services-showcase-heading"
        className="py-16 bg-white dark:bg-dark-bg-primary transition-colors"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="services-showcase-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            {title}
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Services Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All Services as Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white dark:bg-dark-bg-tertiary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <Link href={`/services/${service.slug}`} className="block relative h-48 overflow-hidden">
                {service.image && typeof service.image === 'object' && (
                  <Image
                    src={getMediaUrl(service.image.url)}
                    alt={service.image.alt || service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                )}
                {/* Icon badge */}
                {service.icon && (
                  <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-lg">
                    <DynamicIcon name={service.icon} size={20} />
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-6">
                <Link
                  href={`/services/${service.slug}`}
                  className="font-bold text-neutral-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary-light transition-colors text-lg block focus:outline-none focus:underline"
                >
                  {service.title}
                </Link>
                <p className="text-lrp-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-4 text-sm leading-relaxed">
                  {service.shortDescription || service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                  {service.pricing?.basePrice ? (
                    <span className="text-primary dark:text-primary-light font-semibold text-sm">
                      From ${service.pricing.basePrice}
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="text-primary dark:text-primary-light font-semibold text-sm hover:underline focus:outline-none focus:underline"
                    >
                      Get Quote
                    </button>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center text-primary dark:text-primary-light font-semibold text-sm hover:gap-2 gap-1 transition-all focus:outline-none focus:underline"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View All Services
            <ChevronRight className="w-5 h-5" />
          </Link>
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

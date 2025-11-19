'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';
import { DynamicIcon } from '@/lib/iconMapper';
import { ChevronRight } from 'lucide-react';

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
  if (services.length === 0) {
    return null;
  }

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All Services as Cards */}
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="relative h-[280px]">
                {service.image && typeof service.image === 'object' && (
                  <Image
                    src={getMediaUrl(service.image.url)}
                    alt={service.image.alt || service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Icon badge */}
                {service.icon && (
                  <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white">
                    <DynamicIcon name={service.icon} size={16} />
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-bold text-white mb-2 group-hover:text-primary-light transition-colors text-lg">
                    {service.title}
                  </h3>
                  <p className="text-white/90 line-clamp-2 mb-3 text-sm">
                    {service.shortDescription || service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {service.pricing?.basePrice ? (
                      <span className="text-primary-light font-semibold text-sm">
                        From ${service.pricing.basePrice}
                      </span>
                    ) : (
                      <span className="text-white/70 text-sm">Get Quote</span>
                    )}
                    <span className="inline-flex items-center text-primary-light font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
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
  );
}

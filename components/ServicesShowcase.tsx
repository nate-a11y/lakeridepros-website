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

  const [featuredService, ...otherServices] = services;

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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Service - Large Card */}
          <Link
            href={`/services/${featuredService.slug}`}
            className="group lg:col-span-2 lg:row-span-2 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <div className="relative h-[300px] lg:h-full min-h-[400px]">
              {featuredService.image && typeof featuredService.image === 'object' && (
                <Image
                  src={getMediaUrl(featuredService.image.url)}
                  alt={featuredService.image.alt || featuredService.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  {featuredService.icon && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
                      <DynamicIcon name={featuredService.icon} size={20} />
                    </div>
                  )}
                  <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured Service
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                  {featuredService.title}
                </h3>
                <p className="text-white/90 text-sm lg:text-base line-clamp-2 max-w-xl mb-3">
                  {featuredService.shortDescription || featuredService.description}
                </p>
                {featuredService.pricing?.basePrice && (
                  <p className="text-primary-light font-semibold mb-3">
                    Starting at ${featuredService.pricing.basePrice}
                  </p>
                )}
                <span className="inline-flex items-center text-primary-light font-semibold group-hover:gap-3 gap-2 transition-all">
                  Learn More
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          {/* Other Services - Smaller Cards */}
          {otherServices.slice(0, 4).map((service, index) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white dark:bg-dark-bg-tertiary"
            >
              <div className="relative h-32 overflow-hidden">
                {service.image && typeof service.image === 'object' && (
                  <Image
                    src={getMediaUrl(service.image.url)}
                    alt={service.image.alt || service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {service.icon && (
                  <div className="absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm text-white">
                    <DynamicIcon name={service.icon} size={16} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs line-clamp-2 mb-2">
                  {service.shortDescription || service.description}
                </p>
                <div className="flex items-center justify-between">
                  {service.pricing?.basePrice && (
                    <span className="text-xs text-primary dark:text-primary-light font-semibold">
                      From ${service.pricing.basePrice}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-primary dark:text-primary-light group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

          {/* View All Card */}
          {services.length > 5 && (
            <Link
              href="/services"
              className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-primary dark:hover:border-primary bg-neutral-50 dark:bg-dark-bg-secondary p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                View All Services
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {services.length - 5} more available
              </span>
            </Link>
          )}
        </div>

        {services.length <= 5 && (
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              View All Services
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { MapPin, Navigation } from 'lucide-react';

interface ServiceArea {
  name: string;
  description: string;
  highlight?: boolean;
}

const serviceAreas: ServiceArea[] = [
  {
    name: 'Osage Beach',
    description: 'Tan-Tar-A Resort, Margaritaville, Bagnell Dam Strip, lakefront venues',
    highlight: true,
  },
  {
    name: 'Camdenton',
    description: 'Old Kinderhook, local wineries, wedding venues, special events',
  },
  {
    name: 'Lake Ozark',
    description: 'Lodge of Four Seasons, lakefront properties, event venues',
  },
  {
    name: 'Statewide Service',
    description: 'Columbia, Jefferson City, Kansas City, St. Louis, and beyond',
  },
];

export default function ServiceAreasMap() {
  return (
    <section
      aria-labelledby="service-areas-heading"
      className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Navigation className="w-4 h-4" />
            Serving All of Missouri
          </div>
          <h2
            id="service-areas-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            Serving Lake of the Ozarks and Beyond
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Based at <strong className="text-neutral-900 dark:text-white">Lake of the Ozarks</strong>, we provide luxury transportation throughout{' '}
            <strong className="text-neutral-900 dark:text-white">Missouri</strong>, specializing in premium service for the area's top destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceAreas.map((area, index) => (
            <div
              key={area.name}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                area.highlight
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-white dark:bg-dark-bg-tertiary hover:shadow-lg hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Pin icon */}
              <div className={`absolute top-4 right-4 ${area.highlight ? 'text-white/30' : 'text-primary/10 dark:text-primary/20'}`}>
                <MapPin className="w-12 h-12" />
              </div>

              <div className="relative p-6">
                {/* Location marker */}
                <div className={`flex items-center gap-2 mb-3 ${area.highlight ? 'text-white' : 'text-primary dark:text-primary-light'}`}>
                  <div className={`w-3 h-3 rounded-full ${area.highlight ? 'bg-white' : 'bg-primary'} ${area.highlight ? '' : 'animate-pulse'}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {area.highlight ? 'Headquarters' : 'Service Area'}
                  </span>
                </div>

                {/* Area name */}
                <h3 className={`text-xl font-bold mb-2 ${area.highlight ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                  {area.name}
                </h3>

                {/* Description */}
                <p className={`text-sm ${area.highlight ? 'text-white/90' : 'text-lrp-text-secondary dark:text-dark-text-secondary'}`}>
                  {area.description}
                </p>

                {/* Hover indicator */}
                {!area.highlight && (
                  <div className="mt-4 flex items-center gap-1 text-primary dark:text-primary-light text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View venues</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bottom border animation */}
              {!area.highlight && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

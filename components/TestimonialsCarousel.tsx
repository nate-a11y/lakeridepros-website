'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/api/payload';
import type { Testimonial } from '@/src/payload-types';
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from 'lucide-react';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number;
  includeSchema?: boolean;
}

export default function TestimonialsCarousel({
  testimonials,
  title = 'What Our Clients Say',
  subtitle = 'Real experiences from our valued customers',
  autoPlayInterval = 6000,
  includeSchema = true,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % testimonials.length);
  }, [currentIndex, testimonials.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);
  }, [currentIndex, testimonials.length, goToSlide]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, autoPlayInterval, testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  // Generate Review schema
  const reviewSchema = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (
        testimonials
          .filter(t => t.rating)
          .reduce((sum, t) => sum + (t.rating || 0), 0) /
        testimonials.filter(t => t.rating).length
      ).toFixed(1),
      reviewCount: testimonials.filter(t => t.rating).length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials
      .filter(t => t.rating)
      .map(testimonial => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: testimonial.name,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: testimonial.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: testimonial.content,
        datePublished: testimonial.createdAt || new Date().toISOString(),
      })),
  } : null;

  return (
    <>
      {/* Review Schema */}
      {includeSchema && reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}

      <section
        aria-labelledby="testimonials-heading"
        className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Main Testimonial Display */}
          <div className="relative">
            {/* Large Quote Icon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white dark:bg-dark-bg-tertiary rounded-2xl shadow-xl p-8 pt-12 md:p-12 md:pt-16">
              <div
                className={`transition-all duration-500 ${
                  isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                }`}
              >
                {/* Star Rating */}
                {currentTestimonial.rating && (
                  <div className="flex justify-center mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-6 w-6 ${
                          i < currentTestimonial.rating! ? 'text-yellow-400 fill-current' : 'text-neutral-300 dark:text-neutral-600 fill-current'
                        }`}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Quote Content */}
                <blockquote className="text-xl md:text-2xl text-center text-neutral-800 dark:text-white leading-relaxed mb-8 font-light italic">
                  &ldquo;{currentTestimonial.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center">
                  {currentTestimonial.image && typeof currentTestimonial.image === 'object' && (
                    <Image
                      src={getMediaUrl(currentTestimonial.image.url)}
                      alt={currentTestimonial.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full mb-4 object-cover ring-4 ring-primary/20"
                    />
                  )}
                  <p className="font-semibold text-lg text-neutral-900 dark:text-white">
                    {currentTestimonial.name}
                  </p>
                  {currentTestimonial.title && (
                    <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                      {currentTestimonial.title}
                    </p>
                  )}
                  {currentTestimonial.company && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {currentTestimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white dark:bg-dark-bg-tertiary shadow-md hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-white" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        index === currentIndex
                          ? 'bg-primary w-8'
                          : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                      aria-current={index === currentIndex ? 'true' : 'false'}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white dark:bg-dark-bg-tertiary shadow-md hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-white" />
                </button>

                {/* Auto-play toggle */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 rounded-full bg-white dark:bg-dark-bg-tertiary shadow-md hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary ml-2"
                  aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-4 h-4 text-neutral-700 dark:text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-neutral-700 dark:text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Counter */}
            {testimonials.length > 1 && (
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-300 mt-4">
                {currentIndex + 1} of {testimonials.length} reviews
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

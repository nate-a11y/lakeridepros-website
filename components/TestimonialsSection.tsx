import { getMediaUrl } from '@/lib/api/payload';
import type { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  showCount?: number;
  includeSchema?: boolean;
}

/**
 * Reusable testimonials section component with Review schema markup
 *
 * @param testimonials - Array of testimonials from CMS
 * @param title - Section heading (default: "What Our Clients Say")
 * @param subtitle - Section subheading
 * @param showCount - Number of testimonials to display (default: 3)
 * @param includeSchema - Whether to include Review schema markup (default: true)
 */
export default function TestimonialsSection({
  testimonials,
  title = "What Our Clients Say",
  subtitle = "Real experiences from our valued customers",
  showCount = 3,
  includeSchema = true,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Limit displayed testimonials
  const displayedTestimonials = testimonials.slice(0, showCount);

  // Generate Review schema for each testimonial
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
    review: displayedTestimonials
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

      <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-lrp-black dark:text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-dark-bg-tertiary p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Star Rating */}
                {testimonial.rating && (
                  <div className="flex text-secondary dark:text-primary mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating! ? 'fill-current' : 'fill-neutral-300 dark:fill-neutral-600'
                        }`}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                      {testimonial.rating}/5
                    </span>
                  </div>
                )}

                {/* Testimonial Content */}
                <blockquote className="text-neutral-700 dark:text-neutral-300 mb-4 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  {testimonial.image && typeof testimonial.image === 'object' && (
                    <img
                      src={getMediaUrl(testimonial.image.url)}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    {testimonial.title && (
                      <p className="text-sm text-lrp-text-secondary dark:text-dark-text-muted">
                        {testimonial.title}
                      </p>
                    )}
                    {testimonial.company && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

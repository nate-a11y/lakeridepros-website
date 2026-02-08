import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { getTestimonialsLocal, getMediaUrl } from '@/lib/api/sanity'
import type { Testimonial } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | Lake Ride Pros',
  description: 'Read what our customers say about Lake Ride Pros. Real 5-star reviews from weddings, bachelor parties, corporate events, and airport transportation at Lake of the Ozarks.',
  keywords: [
    'Lake Ride Pros reviews',
    'Lake Ozarks transportation reviews',
    'limo bus reviews Lake of the Ozarks',
    'wedding transportation reviews Missouri',
    'Lake Ride Pros testimonials',
    'party bus reviews Lake Ozarks'
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/testimonials',
  },
  openGraph: {
    title: 'Customer Reviews & Testimonials | Lake Ride Pros',
    description: 'Read what our customers say about Lake Ride Pros. Real 5-star reviews from Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/testimonials',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Reviews' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Reviews & Testimonials | Lake Ride Pros',
    description: 'Read what our customers say about Lake Ride Pros at Lake of the Ozarks.',
    images: ['/og-image.jpg'],
  },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 dark:text-neutral-600'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full border border-neutral-200 dark:border-neutral-700">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-primary/30" aria-hidden="true" />
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      {/* Content */}
      <blockquote className="text-neutral-700 dark:text-neutral-300 flex-grow mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Author */}
      <footer className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        {testimonial.image && typeof testimonial.image === 'object' && (
          <Image
            src={getMediaUrl(testimonial.image)}
            alt={testimonial.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            {testimonial.name}
          </p>
          {testimonial.title && (
            <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
              {testimonial.title}
            </p>
          )}
          {testimonial.company && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {testimonial.company}
            </p>
          )}
        </div>
      </footer>
    </article>
  )
}

export default async function TestimonialsPage() {
  // Fetch all testimonials with 4+ star ratings
  const testimonials = await getTestimonialsLocal(false, 4)

  // Calculate aggregate rating
  const ratedTestimonials = testimonials.filter(t => t.rating)
  const averageRating = ratedTestimonials.length > 0
    ? (ratedTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / ratedTestimonials.length).toFixed(1)
    : '5.0'
  const reviewCount = ratedTestimonials.length

  // Aggregate Rating Schema for rich snippets
  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Lake Ride Pros',
    image: 'https://www.lakeridepros.com/logo.png',
    url: 'https://www.lakeridepros.com',
    telephone: '+1-573-206-9499',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lake of the Ozarks',
      addressRegion: 'MO',
      addressCountry: 'US'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: ratedTestimonials.slice(0, 10).map(testimonial => ({
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
      datePublished: testimonial.createdAt,
    })),
  }

  return (
    <>
      {/* Aggregate Rating Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />

      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg-primary">
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              What Our Customers Say
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto mb-8">
              Real reviews from real customers. See why Lake Ride Pros is the trusted choice
              for luxury transportation at Lake of the Ozarks.
            </p>

            {/* Aggregate Rating Display */}
            {reviewCount > 0 && (
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(parseFloat(averageRating))
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/50'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">{averageRating}</span>
                <span className="text-white/80">from {reviewCount} reviews</span>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {testimonials.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                  No reviews available at this time.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white dark:bg-dark-bg-secondary">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready to Experience 5-Star Service?
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-8">
              Join our satisfied customers and book your luxury transportation today.
              Whether it&apos;s a wedding, bachelor party, or corporate event,
              Lake Ride Pros delivers exceptional service every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="bg-primary hover:bg-primary-dark text-lrp-black px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                Book Your Ride
              </Link>
              <Link
                href="/services"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-lrp-black px-10 py-4 rounded-lg font-bold text-lg transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

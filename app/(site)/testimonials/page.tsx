import { notFound } from 'next/navigation'
import DirectoryPagination from '@/components/DirectoryPagination'
import { DIRECTORY_PAGE_SIZE, getPageNumber } from '@/lib/seo/pagination'
import { localBusinessSchema } from '@/lib/schemas'
import CorePage from '@/components/core-editorial/CorePage'
import CoreHero from '@/components/core-editorial/CoreHero'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { getTestimonialsLocal, getMediaUrl, getGoogleReviewSummary } from '@/lib/api/sanity'
import type { Testimonial } from '@/types/sanity'

const baseMetadata: Metadata = {
  title: 'Customer Reviews & Testimonials | Lake Ride Pros',
  description: 'Read real Lake Ride Pros customer reviews for weddings, airport transfers, bachelor parties, corporate events and transportation at Lake of the Ozarks.',
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
            i < rating ? 'text-primary-light fill-primary-light' : 'text-neutral-300 '
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bg-white py-8 flex flex-col h-full border-t border-black/25">
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
      <blockquote className="text-neutral-700 text-lg flex-grow mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Author */}
      <footer className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        {testimonial.image && typeof testimonial.image === 'object' && (
          <Image
            src={getMediaUrl(testimonial.image)}
            alt={testimonial.name}
            width={48}
            height={48}
            className="w-12 h-12 object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-900">
            {testimonial.name}
          </p>
          {testimonial.title && (
            <p className="text-sm text-lrp-text-secondary">
              {testimonial.title}
            </p>
          )}
          {testimonial.company && (
            <p className="text-xs text-neutral-500">
              {testimonial.company}
            </p>
          )}
        </div>
      </footer>
    </article>
  )
}

type PageProps = { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = getPageNumber((await searchParams).page)
  if (page === null) return { ...baseMetadata, robots: { index: false } }
  return {
    ...baseMetadata,
    title: page === 1 ? baseMetadata.title : `Customer Reviews - Page ${page} | Lake Ride Pros`,
    description: page === 1 ? baseMetadata.description : `More real Lake Ride Pros customer reviews. Page ${page} of our curated transportation testimonials.`,
    alternates: { canonical: `https://www.lakeridepros.com/testimonials${page === 1 ? '' : `?page=${page}`}` },
  }
}

export default async function TestimonialsPage({ searchParams }: PageProps) {
  const page = getPageNumber((await searchParams).page)
  if (page === null) notFound()
  const [testimonials, summary] = await Promise.all([getTestimonialsLocal(false, 4), getGoogleReviewSummary()])
  const totalPages = Math.max(1, Math.ceil(testimonials.length / DIRECTORY_PAGE_SIZE))
  if (page > totalPages) notFound()
  const visibleTestimonials = testimonials.slice((page - 1) * DIRECTORY_PAGE_SIZE, page * DIRECTORY_PAGE_SIZE)
  const averageRating = (summary.ratingValue ?? 0).toFixed(1)
  const reviewCount = summary.reviewCount

  return (
    <CorePage>
      {/* Shared business identity; testimonials are not a full-corpus rating. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <CoreHero image="pinkPatrol">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              What Our Customers Say
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto mb-8">
              Real reviews from real customers. See why Lake Ride Pros is the trusted choice
              for luxury transportation at Lake of the Ozarks.
            </p>

            {/* Aggregate Rating Display */}
            {reviewCount > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/30 pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(parseFloat(averageRating))
                          ? 'text-primary-light fill-primary-light'
                          : 'text-white/50'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">{averageRating}</span>
                <span className="text-white/80">from {reviewCount} Google reviews</span>
              </div>
            )}
          </CoreHero>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <p className="mb-8 text-neutral-700">A curated selection of customer stories. The Google rating above includes all synced Google reviews, not just the testimonials shown here.</p>
            {testimonials.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6 max-w-7xl mx-auto">
                {visibleTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>
            ) : (
              <div className="text-left py-12">
                <p className="text-neutral-600 text-lg">
                  No reviews available at this time.
                </p>
              </div>
            )}
            <DirectoryPagination page={page} totalPages={totalPages} path="/testimonials" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-left max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Ready to Experience 5-Star Service?
            </h2>
            <p className="text-neutral-700 text-lg mb-8">
              Join our satisfied customers and book your luxury transportation today.
              Whether it&apos;s a wedding, bachelor party, or corporate event,
              Lake Ride Pros delivers exceptional service every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link
                href="/book"
                className="bg-primary hover:bg-primary-light text-lrp-black px-10 py-4 font-bold text-lg transition-all"
              >
                Book Your Ride
              </Link>
              <Link
                href="/services"
                className="border-2 border-primary text-[#2f730e] hover:bg-primary hover:text-lrp-black px-10 py-4 font-bold text-lg transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CorePage>
  )
}

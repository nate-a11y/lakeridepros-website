import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Testimonial } from '@/types/sanity'

interface ReviewsEditorialProps {
  testimonials: Testimonial[]
  ratingValue: number
  reviewCount: number
}

export default function ReviewsEditorial({
  testimonials,
  ratingValue,
  reviewCount,
}: ReviewsEditorialProps) {
  if (testimonials.length === 0) return null

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lake Ride Pros',
    review: testimonials
      .slice(0, 3)
      .filter(testimonial => testimonial.rating)
      .map(testimonial => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: testimonial.name },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: testimonial.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: testimonial.content,
        datePublished: testimonial._createdAt,
      })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <section aria-labelledby="reviews-heading" className="bg-white py-20 text-lrp-black sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 border-t border-black/30 pt-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-4 font-semibold text-lrp-black">The part technology cannot manufacture</p>
              <h2
                id="reviews-heading"
                className="max-w-4xl font-celebri text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
              >
                Trust, earned one arrival at a time.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-5xl font-black tracking-[-0.04em]">{ratingValue.toFixed(1)} / 5</p>
              <p className="mt-2 text-sm text-black/65">Based on {reviewCount}+ Google reviews</p>
            </div>
          </div>

          <div className="mt-14 grid border-y border-black/30 lg:grid-cols-12">
            <figure className="py-9 lg:col-span-8 lg:pr-12">
              <div className="mb-7 text-lg tracking-[0.12em] text-primary-dark" role="img" aria-label={`${testimonials[0].rating || 5} out of 5 stars`}>
                <span aria-hidden="true">★★★★★</span>
              </div>
              <blockquote className="max-w-4xl text-balance text-3xl font-black leading-[1.12] tracking-[-0.03em] sm:text-4xl">
                “{testimonials[0].content}”
              </blockquote>
              <figcaption className="mt-7 text-sm text-black/65">
                <span className="font-bold text-black">{testimonials[0].name}</span>
                {testimonials[0].company ? ` · ${testimonials[0].company}` : ''}
              </figcaption>
            </figure>

            {testimonials.length > 1 && (
              <div className="border-t border-black/30 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8">
                {testimonials.slice(1, 3).map((testimonial, index) => (
                  <figure key={testimonial._id} className={`py-8 ${index > 0 ? 'border-t border-black/30' : ''}`}>
                    <blockquote className="text-lg font-semibold leading-relaxed tracking-[-0.015em]">
                      “{testimonial.content}”
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-black/65">
                      <span className="font-bold text-black">{testimonial.name}</span>
                      {testimonial.company ? ` · ${testimonial.company}` : ''}
                      <span className="ml-2 text-primary-dark" aria-label={`${testimonial.rating || 5} out of 5 stars`}>★★★★★</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>

          <aside aria-label="Awards and recognition" className="mt-12 border-y border-black/30 py-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-start">
              <div>
                <p className="font-boardson text-4xl leading-none text-primary-dark sm:text-5xl">Award-winning</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/65">
                  Recognized by statewide and Lake-area readers for private and wedding transportation.
                </p>
              </div>
              <div className="border-t border-black/30 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <h3 className="text-xl font-black">Missouri&apos;s Best</h3>
                <p className="mt-3 leading-relaxed">Private Transportation · 2024–2027</p>
                <p className="mt-1 leading-relaxed">Wedding Transportation · 2027</p>
              </div>
              <div className="border-t border-black/30 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <h3 className="text-xl font-black">Lake Lifestyles Best of the Lake</h3>
                <p className="mt-3 leading-relaxed">Winner · 2024–2026</p>
              </div>
            </div>
          </aside>

          <Link
            href="/testimonials"
            className="mt-7 inline-flex items-center gap-2 border-b border-black pb-1 font-bold text-black hover:border-primary-dark hover:text-primary-dark"
          >
            Read more customer stories <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}

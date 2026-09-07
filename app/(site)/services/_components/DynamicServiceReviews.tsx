import Image from 'next/image';
import { getMediaUrl } from '@/lib/api/sanity';
import type { Testimonial } from '@/types/sanity';

/** The existing three-review selection, rendered without cards or client JavaScript. */
export default function DynamicServiceReviews({ testimonials, serviceTitle }: {
  testimonials: Testimonial[];
  serviceTitle: string;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="service-reviews-heading" className="bg-white py-16 text-lrp-black sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="border-t border-black/25 pt-6">
          <h2 id="service-reviews-heading" className="font-celebri text-4xl font-black tracking-[-0.035em] sm:text-5xl">What Our Clients Say</h2>
          <p className="mt-4 text-black/65">See why customers love our {serviceTitle.toLowerCase()}</p>
        </header>
        <div className="mt-10 grid gap-x-10 md:grid-cols-3">
          {testimonials.slice(0, 3).map(testimonial => (
            <figure key={testimonial._id} className="min-w-0 border-t border-black/25 py-8">
              {!!testimonial.rating && (
                <p role="img" className="mb-5 text-sm font-bold text-lrp-black" aria-label={`${testimonial.rating} out of 5 stars`}>
                  <span aria-hidden="true">{'★'.repeat(Math.round(testimonial.rating))} · {testimonial.rating}/5</span>
                </p>
              )}
              <blockquote className="text-xl font-semibold leading-relaxed">&ldquo;{testimonial.content}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                {testimonial.image && typeof testimonial.image === 'object' && (
                  <Image src={getMediaUrl(testimonial.image)} alt={testimonial.name} width={48} height={48} className="h-12 w-12 object-cover" />
                )}
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  {testimonial.title && <p className="mt-1 text-sm text-black/65">{testimonial.title}</p>}
                  {testimonial.company && <p className="mt-1 text-sm text-black/65">{testimonial.company}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

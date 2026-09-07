import Image from 'next/image'
import type { Testimonial } from '@/types/sanity'
import { getMediaUrl } from '@/lib/api/sanity'
import LocationSection from '@/components/location/LocationSection'

/** All supplied reviews remain readable in server HTML; no autoplay or hidden slides. */
export default function LocationTestimonials({
  testimonials,
  title,
  subtitle,
}: {
  testimonials: Testimonial[]
  title: string
  subtitle: string
}) {
  if (testimonials.length === 0) return null

  return (
    <LocationSection id="local-testimonials" title={title} introduction={<p>{subtitle}</p>} tone="dark">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-16">
        {testimonials.map((testimonial, index) => (
          <figure
            key={testimonial._id}
            className={`min-w-0 border-t border-white/30 pt-6 ${index === 0 ? 'lg:row-span-2' : ''}`}
          >
            {testimonial.rating && (
              <p className="mb-5 text-sm font-bold text-primary-light">{testimonial.rating} out of 5 stars</p>
            )}
            <blockquote
              className={`max-w-prose text-pretty leading-relaxed ${index === 0 ? 'font-celebri text-2xl sm:text-3xl' : 'text-lg'}`}
            >
              <p>{testimonial.content}</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              {testimonial.image && typeof testimonial.image === 'object' && (
                <Image
                  src={getMediaUrl(testimonial.image)}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
              )}
              <div>
                <p className="font-bold">{testimonial.name}</p>
                {testimonial.title && <p className="mt-1 text-sm">{testimonial.title}</p>}
                {testimonial.company && <p className="mt-1 text-sm">{testimonial.company}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </LocationSection>
  )
}

import Image from 'next/image'
import { getMediaUrl } from '@/lib/api/sanity'
import type { Testimonial } from '@/types/sanity'
import styles from './FleetEditorial.module.css'

export default function FleetTestimonials({ testimonials, title, subtitle }: {
  testimonials: Testimonial[]; title: string; subtitle: string
}) {
  return (
    <section className="bg-lrp-gray py-16 sm:py-20">
      <div className={styles.wrap}>
        <h2 className="text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">{subtitle}</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <figure key={testimonial._id} className="min-w-0 border-t border-[#999] pt-6">
              {testimonial.rating && <p className="mb-4 font-bold text-[#2f730e]">{testimonial.rating}/5</p>}
              <blockquote className="text-lg leading-relaxed">&ldquo;{testimonial.content}&rdquo;</blockquote>
              <figcaption className="mt-6 flex gap-4">
                {testimonial.image && typeof testimonial.image === 'object' && <Image src={getMediaUrl(testimonial.image)} alt={testimonial.name} width={48} height={48} className="h-12 w-12 shrink-0 object-cover" />}
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  {testimonial.title && <p className="mt-1 text-sm">{testimonial.title}</p>}
                  {testimonial.company && <p className="mt-1 text-sm">{testimonial.company}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

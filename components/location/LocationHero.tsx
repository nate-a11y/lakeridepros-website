import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'
import { PhoneLink } from '@/components/PhoneLink'

export interface LocationHeroProps {
  title: string
  /** Keep the route's complete local introduction, including named destinations. */
  introduction: ReactNode
  image: {
    src: ImageProps['src']
    alt: string
    objectPosition?: string
    caption?: string
    aspectRatio?: string
  }
  eyebrow?: string
  bookingLabel: string
  bookingLocation: string
  /** Preserve a route's existing internal booking journey when provided. */
  bookingHref?: string
  /** Optional facts are editorial text, not a replacement for detailed route content. */
  facts?: readonly { label: string; value: string }[]
}

/** Server-rendered, image-led counterpart to the homepage fleet hero. */
export default function LocationHero({
  title,
  introduction,
  image,
  eyebrow,
  bookingLabel,
  bookingLocation,
  bookingHref,
  facts,
}: LocationHeroProps) {
  const bookingClass =
    'inline-flex min-h-14 items-center justify-center bg-primary px-6 py-4 text-center font-bold text-lrp-black hover:bg-primary-light focus-visible:ring-white focus-visible:ring-offset-lrp-black'
  return (
    <section aria-labelledby="location-heading" className="bg-lrp-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-white underline underline-offset-4 hover:text-primary-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Lake Ride Pros
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="min-w-0 lg:col-span-6">
            {eyebrow && <p className="font-boardson text-3xl leading-tight text-primary-light">{eyebrow}</p>}
            <h1
              id="location-heading"
              className="mt-4 text-balance font-celebri text-[clamp(2.15rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.04em]"
            >
              {title}
            </h1>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed">{introduction}</div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {bookingHref ? (
                <Link href={bookingHref} className={bookingClass}>
                  {bookingLabel}
                </Link>
              ) : (
                <MoovsBookingLink location={bookingLocation} className={bookingClass}>
                  {bookingLabel}
                </MoovsBookingLink>
              )}
              <PhoneLink className="inline-flex min-h-12 items-center py-3 font-bold text-white underline underline-offset-4 hover:text-primary-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Call (573) 206-9499
              </PhoneLink>
            </div>
          </div>
          <figure className="min-w-0 lg:col-span-6">
            <div
              className="relative overflow-hidden bg-lrp-black"
              style={{ aspectRatio: image.aspectRatio ?? '4 / 3' }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 584px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                quality={65}
                loading="eager"
                fetchPriority="high"
                className="object-contain"
                style={{ objectPosition: image.objectPosition ?? 'center' }}
              />
            </div>
            {image.caption && (
              <figcaption className="mt-3 text-sm leading-relaxed text-white">{image.caption}</figcaption>
            )}
          </figure>
        </div>
        {facts && facts.length > 0 && (
          <dl className="mt-10 grid gap-x-8 border-t border-white/30 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="border-b border-white/30 py-5">
                <dt className="text-sm">{fact.label}</dt>
                <dd className="mt-2 font-celebri text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface ServicePreview {
  slug: string
  title: string
  imageUrl: string
  imageAlt: string
  objectPosition: string
}

interface ServicesLensProps { services: ServicePreview[] }

const serviceDetails = [
  { slug: 'airport-transfers', title: 'Airport transfers', description: 'Flight-aware airport and private aviation pickups, with space planned for passengers and luggage.' },
  { slug: 'wedding-transportation', title: 'Weddings', description: 'One coordinated plan for the wedding party, guests, hotels, ceremony, reception, and final pickup.' },
  { slug: 'corporate-executive-travel', title: 'Corporate & resorts', description: 'Professional transportation for executive travel, client visits, retreats, meetings, and resort stays.' },
  { slug: 'group-shuttle-services', title: 'Group shuttles', description: 'Move the group together with the right capacity, stops, timing, and property access built into the plan.' },
  { slug: 'events-festivals', title: 'Events & festivals', description: 'A dependable way into concerts, festivals, games, and busy Lake weekends—and a pickup plan afterward.' },
  { slug: 'party-bus-nightlife', title: 'Party buses & nightlife', description: 'Make the ride part of the night while a professional driver keeps the group and the way home together.' },
] as const

const connections = [
  { href: '/services/hotel-shuttle-service', title: 'Hotels' },
  { href: '/services/vacation-rental-transportation', title: 'Vacation rentals' },
  { href: '/services/boat-dock-pickup', title: 'Boat docks' },
  { href: '/services/golf-outing-transportation', title: 'Golf outings' },
  { href: '/lake-ozarks-airport-transportation', title: 'Statewide airport connections' },
] as const

type ServiceSlug = typeof serviceDetails[number]['slug']

export default function ServicesLens({ services }: ServicesLensProps) {
  const entries = serviceDetails.flatMap(detail => {
    const service = services.find(item => item.slug === detail.slug)
    if (!service) return []
    return [{
      ...detail,
      imageUrl: service.imageUrl,
      imageAlt: service.imageAlt,
      objectPosition: service.objectPosition,
    }]
  })
  const firstSlug = entries[0]?.slug
  const [requestedSlug, setRequestedSlug] = useState(firstSlug)
  const [displayedSlug, setDisplayedSlug] = useState(firstSlug)
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>(firstSlug ? [firstSlug] : [])
  const [loadedSlugs, setLoadedSlugs] = useState<string[]>([])
  const active = entries.find(entry => entry.slug === requestedSlug) || entries[0]
  const displayed = entries.find(entry => entry.slug === displayedSlug) || entries[0]

  function preview(slug: ServiceSlug) {
    setRequestedSlug(slug)
    setVisitedSlugs(previous => previous.includes(slug) ? previous : [...previous, slug])
    if (loadedSlugs.includes(slug)) setDisplayedSlug(slug)
  }

  if (!active) return null

  return (
    <section aria-labelledby="services-lens-heading" className="bg-white py-16 text-lrp-black sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-semibold text-lrp-black">Not every ride is the same ride</p>
            <h2 id="services-lens-heading" className="mt-3 max-w-4xl text-balance font-celebri text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl">
              Start with the plan. We&apos;ll match what moves it.
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-black/65 lg:col-span-4">
            From a one-person airport pickup to a statewide itinerary or an entire wedding weekend, the vehicle, timing, and service should fit the trip.
          </p>
        </header>

        <div className="mt-12 grid border-y border-black/25 lg:grid-cols-[minmax(17rem,0.72fr)_1.28fr]">
          <nav aria-label="Transportation services" className="border-black/25 lg:border-r">
            <ul>
              {entries.map(entry => {
                const selected = requestedSlug === entry.slug
                return (
                  <li key={entry.slug} className="border-b border-black/20 last:border-b-0">
                    <Link
                      href={`/services/${entry.slug}`}
                      prefetch={false}
                      onPointerEnter={event => { if (event.pointerType !== 'touch') preview(entry.slug) }}
                      onFocus={() => preview(entry.slug)}
                      className={`group min-h-16 items-center justify-between gap-6 px-5 py-4 font-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-dark ${selected ? 'bg-lrp-black text-white' : 'bg-white text-lrp-black hover:bg-lrp-gray'}`}
                      style={{ display: 'flex' }}
                    >
                      <span className="text-lg sm:text-xl">{entry.title}</span>
                      <span aria-hidden="true" className={`text-xl ${selected ? 'text-primary-light' : 'text-primary-dark'}`}>↗</span>
                      <span className="sr-only">. {entry.description}</span>
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link href="/services" className="min-h-16 items-center px-5 py-4 text-sm font-bold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary-dark" style={{ display: 'flex' }}>
                  Explore every transportation service
                </Link>
              </li>
            </ul>
          </nav>

          <figure className="relative min-h-[23rem] overflow-hidden bg-lrp-black sm:min-h-[32rem] lg:min-h-0">
            {entries.filter(entry => entry.imageUrl && visitedSlugs.includes(entry.slug)).map(entry => (
              <Image
                key={entry.slug}
                src={entry.imageUrl}
                alt={entry.slug === active.slug ? entry.imageAlt : ''}
                aria-hidden={entry.slug !== active.slug}
                fill
                quality={75}
                loading="lazy"
                sizes="(min-width: 1024px) 62vw, 100vw"
                className={`object-cover motion-safe:transition-opacity motion-safe:duration-300 ${entry.slug === displayed.slug ? 'opacity-100' : 'opacity-0'}`}
                style={{ objectPosition: entry.objectPosition }}
                onLoad={() => {
                  setLoadedSlugs(previous => previous.includes(entry.slug) ? previous : [...previous, entry.slug])
                  if (requestedSlug === entry.slug) setDisplayedSlug(entry.slug)
                }}
              />
            ))}
            <figcaption className="absolute inset-x-0 bottom-0 bg-lrp-black px-6 py-5 text-white sm:px-8 sm:py-6">
              <p className="text-sm font-black text-primary-light">{active.title}</p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{active.description}</p>
            </figcaption>
          </figure>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-b border-black/25 pb-7 text-sm sm:flex-row sm:items-baseline sm:gap-8">
          <p className="shrink-0 font-black">Also at the Lake</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {connections.map(connection => (
              <li key={connection.href}><Link href={connection.href} className="underline decoration-primary underline-offset-4 hover:decoration-2">{connection.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

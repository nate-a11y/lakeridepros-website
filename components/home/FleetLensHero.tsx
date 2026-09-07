'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

export interface FleetLensVehicle {
  _id: string
  name: string
  slug: string
  images: Array<{
    url: string
    alt: string
    objectPosition: string
  }>
}

interface FleetLensHeroProps {
  vehicles: FleetLensVehicle[]
  ratingValue: number
  reviewCount: number
}

const fleetLenses = [
  {
    slug: 'flex',
    capacity: '1–4',
    label: 'Everyday rides',
    bestFor: 'Point-to-point trips and flexible transportation around the Lake.',
  },
  {
    slug: 'elite',
    capacity: 'Up to 7',
    label: 'Private SUVs',
    bestFor: 'Private SUV options for airports, resorts, dinners, and smaller groups.',
  },
  {
    slug: 'executive-sprinter-van',
    capacity: 'Up to 13',
    label: 'Travel together',
    bestFor: 'Executive travel, wedding parties, golf groups, and luggage-heavy trips.',
  },
  {
    slug: 'lrp-limo-bus',
    capacity: 'Up to 14',
    label: 'Limo Bus',
    bestFor: 'A polished group ride for weddings, celebrations, dinners, and Lake events.',
  },
  {
    slug: 'rescue-squad-1',
    capacity: 'Up to 14',
    label: 'Rescue Squad',
    bestFor: 'A one-of-a-kind Lake Ride Pros experience for distinctive group travel.',
  },
  {
    slug: 'pink-patrol',
    capacity: 'Up to 23',
    label: 'Make an entrance',
    bestFor: 'Celebrations, concerts, weddings, and unmistakable group transportation.',
  },
  {
    slug: 'executive-shuttle-bus',
    capacity: 'Up to 37',
    label: 'Move the whole group',
    bestFor: 'Guest shuttles, corporate movement, events, and large group plans.',
  },
] as const

export default function FleetLensHero({ vehicles, ratingValue, reviewCount }: FleetLensHeroProps) {
  const [activeLens, setActiveLens] = useState(1)
  const [visitedLenses, setVisitedLenses] = useState<string[]>([])
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const id = useId()

  const availableFleet = fleetLenses.flatMap((lens) => {
    const vehicle = vehicles.find((item) => item.slug === lens.slug)
    if (!vehicle) return []
    return vehicle.images.length > 0 ? [{ ...lens, vehicle }] : []
  })

  // The homepage H1, sponsor, and booking path must survive a temporary CMS
  // outage or an unpublished vehicle. The local fallback is a real LRP image.
  const fleet = availableFleet.length > 0 ? availableFleet : [{
    ...fleetLenses[1],
    vehicle: {
      _id: 'fleet-fallback',
      name: 'ELITE',
      slug: 'elite',
      images: [{
        url: '/placeholder-vehicle.jpg',
        alt: 'Lake Ride Pros ELITE SUV with green lighting',
        objectPosition: 'center',
      }],
    },
  }]
  const safeActiveLens = Math.min(activeLens, fleet.length - 1)

  function selectLens(index: number) {
    setActiveLens(index)
    const slug = fleet[index]?.slug
    if (slug) setVisitedLenses(previous => previous.includes(slug) ? previous : [...previous, slug])
  }

  function moveFocus(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    let next: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % fleet.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + fleet.length) % fleet.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = fleet.length - 1
    if (next === undefined) return

    event.preventDefault()
    selectLens(next)
    tabs.current[next]?.focus()
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="overflow-hidden bg-lrp-black text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/25 pb-5">
          <p className="font-boardson text-2xl leading-none text-primary-light sm:text-3xl">
            Every group has a right ride.
          </p>
          <Link
            href="/local-premier-partners/legacy-real-estate-group"
            aria-label="Powered by Legacy Real Estate Group"
            className="flex items-center gap-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
          >
            <span className="text-[10px] text-white/65 sm:text-xs">Powered by</span>
            <Image
              src="https://cdn.sanity.io/images/1hcdphjr/production/20de425c0da23174b563da7bfe1499ae7dbc7923-1024x762.webp"
              alt="Legacy Real Estate Group"
              width={1024}
              height={762}
              sizes="96px"
              className="h-auto w-20 brightness-0 invert sm:w-24"
            />
          </Link>
        </div>

        <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-14">
          <div className="lg:col-span-5">
            <h1
              id={`${id}-heading`}
              className="text-balance font-celebri text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.86] tracking-[-0.06em]"
            >
              One local fleet for every way the Lake moves.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:mt-7 sm:text-lg">
              From a private SUV for one airport pickup to a 37-passenger shuttle for a full
              wedding weekend, our Lake of the Ozarks fleet serves trips throughout Missouri—
              everyday rides, resorts, events, and nights out included.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-row">
              <MoovsBookingLink
                location="fleet_lens_hero"
                className="inline-flex min-h-14 items-center justify-center bg-primary px-4 py-4 text-center text-sm font-bold text-lrp-black hover:bg-primary-light focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lrp-black motion-safe:transition-colors sm:px-6 sm:text-base"
              >
                Quote or book a ride
              </MoovsBookingLink>
              <Link
                href="/fleet"
                className="inline-flex min-h-14 items-center justify-center border border-white/50 px-4 py-4 text-center text-sm font-bold text-white hover:border-white hover:bg-white hover:text-lrp-black focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary-light motion-safe:transition-colors sm:px-6 sm:text-base"
              >
                Explore all 20+ vehicles
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="relative min-h-80 bg-lrp-black sm:min-h-0 sm:aspect-video">
              {fleet.map((lens, index) => (
                <figure
                  key={lens.vehicle._id}
                  id={`${id}-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-tab-${index}`}
                  hidden={safeActiveLens !== index}
                  className={`absolute inset-0 min-h-0 grid-rows-[minmax(0,1fr)_auto] ${safeActiveLens === index ? 'grid' : 'hidden'}`}
                >
                  {(index === safeActiveLens || visitedLenses.includes(lens.slug)) && (
                    <div className={`relative grid min-h-0 gap-1 ${lens.vehicle.images.length > 1 ? 'grid-cols-[minmax(0,1.65fr)_minmax(5.5rem,0.8fr)] grid-rows-2' : 'grid-cols-1'}`}>
                      {lens.vehicle.images.slice(0, 3).map((image, imageIndex) => (
                        <div
                          key={image.url}
                          className={`relative min-h-0 overflow-hidden bg-black ${imageIndex === 0 && lens.vehicle.images.length > 1 ? 'row-span-2' : ''}`}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            loading={index === safeActiveLens && imageIndex === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === safeActiveLens && imageIndex === 0 ? 'high' : 'auto'}
                            quality={imageIndex === 0 ? 75 : 65}
                            sizes={imageIndex === 0
                              ? '(min-width: 1024px) 40vw, 70vw'
                              : '(min-width: 1024px) 18vw, 30vw'}
                            className="object-cover"
                            style={{ objectPosition: image.objectPosition }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <figcaption className="flex min-h-16 items-end justify-between gap-5 bg-lrp-black px-4 py-3 sm:px-5">
                    <span className="text-lg font-black sm:text-xl">{lens.vehicle.name}</span>
                    <span className="shrink-0 text-right text-sm text-white/70">{lens.capacity} passengers</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="border-y border-white/25 py-5">
          <div className="grid gap-5 lg:grid-cols-[12rem_1fr] lg:items-start">
            <div className="min-w-0">
              <h2 className="font-bold">How many are riding?</h2>
              <p className="mt-1 text-sm text-white/60">Representative matches from our 20+ vehicle fleet.</p>
            </div>
            <div className="min-w-0">
              <div
                role="tablist"
                aria-label="Match a Lake Ride Pros vehicle by passenger count"
                className="flex w-full max-w-full snap-x snap-mandatory overflow-x-auto border-l border-white/25 lg:snap-none lg:overflow-visible"
              >
                {fleet.map((lens, index) => {
                  const active = safeActiveLens === index
                  return (
                    <button
                      key={lens.slug}
                      ref={(node) => { tabs.current[index] = node }}
                      id={`${id}-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`${id}-panel-${index}`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => selectLens(index)}
                      onKeyDown={(event) => moveFocus(index, event)}
                      className={`flex min-h-20 min-w-[8.5rem] flex-1 snap-start flex-col justify-center gap-1 border-b-4 border-r border-r-white/25 px-4 py-3 text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-white motion-safe:transition-colors lg:min-w-0 ${
                        active ? 'border-b-primary bg-lrp-black text-white' : 'border-b-transparent bg-lrp-black text-white hover:border-b-white'
                      }`}
                    >
                      <span className={`text-lg font-black ${active ? 'text-primary-light' : ''}`}>{lens.capacity}</span>
                      <span className="text-xs text-current opacity-65">
                        {lens.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 min-h-12 text-sm leading-relaxed text-white/70" aria-live="polite">
                <strong className="text-white">{fleet[safeActiveLens].vehicle.name}:</strong>{' '}
                {fleet[safeActiveLens].bestFor}
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-b border-white/25 py-5 sm:grid-cols-4">
          <div className="border-r border-white/20 pr-4">
            <dt className="text-xs text-white/55">Fleet</dt>
            <dd className="mt-1 text-lg font-black">20+ vehicles</dd>
          </div>
          <div className="px-4 sm:border-r sm:border-white/20">
            <dt className="text-xs text-white/55">Rides completed</dt>
            <dd className="mt-1 text-lg font-black">15,000+</dd>
          </div>
          <div className="mt-5 border-r border-white/20 pr-4 sm:mt-0 sm:px-4">
            <dt className="text-xs text-white/55">Google rating</dt>
            <dd className="mt-1 text-lg font-black">{ratingValue.toFixed(1)} · {reviewCount}+</dd>
          </div>
          <div className="mt-5 pl-4 sm:mt-0">
            <dt className="text-xs text-white/55">Recognition</dt>
            <dd className="mt-1 text-sm font-black">Missouri&apos;s Best · Best of the Lake</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

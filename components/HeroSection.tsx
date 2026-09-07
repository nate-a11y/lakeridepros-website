import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { MoovsBookingLink } from '@/components/MoovsBookingLink'

interface HeroSectionProps {
  heroImageUrl: string
  heroImageAlt: string
  reviewCount: number
  ratingValue: number
}

export default function HeroSection({
  heroImageUrl,
  heroImageAlt,
  reviewCount,
  ratingValue,
}: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-[780px] overflow-hidden bg-black text-white lg:min-h-[calc(100svh-5rem)]">
      <Image
        src={heroImageUrl}
        alt={heroImageAlt}
        fill
        preload
        quality={75}
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.94)_0%,rgba(0,0,0,.72)_42%,rgba(0,0,0,.15)_76%,rgba(0,0,0,.38)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      <Link
        href="/local-premier-partners/legacy-real-estate-group"
        className="absolute right-3 top-3 z-10 flex items-center gap-2 bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black sm:right-6 sm:top-5 sm:gap-3 sm:px-4 sm:py-2 lg:right-8"
        aria-label="Powered by Legacy Real Estate Group"
      >
        <span className="text-[9px] text-white/65 sm:text-[11px]">Powered by</span>
        <Image
          src="https://cdn.sanity.io/images/1hcdphjr/production/20de425c0da23174b563da7bfe1499ae7dbc7923-1024x762.webp"
          alt="Legacy Real Estate Group"
          width={80}
          height={60}
          loading="eager"
          sizes="80px"
          className="brightness-0 invert"
        />
      </Link>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-24 hidden h-36 w-full opacity-80 lg:block"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          className="lrp-route-path"
          d="M0 115 C220 145 315 16 520 64 S825 160 1022 78 S1270 26 1440 72"
          fill="none"
          pathLength="1"
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="1022" cy="78" fill="var(--primary)" r="6" />
      </svg>

      <div className="relative mx-auto flex min-h-[780px] max-w-7xl flex-col justify-end px-4 pb-10 pt-32 sm:px-6 sm:pb-12 lg:min-h-[calc(100svh-5rem)] lg:px-8 lg:pb-14">
        <div className="max-w-3xl">
          <h1 className="text-balance font-celebri text-[clamp(3.35rem,8.4vw,8.25rem)] font-black leading-[0.82] tracking-[-0.065em]">
            <span className="mb-5 block text-sm font-semibold tracking-[0.08em] text-[#7bea45] sm:text-base">
              Lake of the Ozarks transportation, re-engineered.
            </span>
            Every ride.
            <span className="block text-primary">One local team.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/82 sm:text-xl">
            Airport pickups before sunrise. Wedding and resort logistics all day. Concerts,
            dinners, and rides home after dark. From one passenger to thirty-seven.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MoovsBookingLink
              location="hero"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-primary px-6 py-4 font-bold text-black transition-colors hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Quote or book a ride <ArrowUpRight className="size-5" aria-hidden="true" />
            </MoovsBookingLink>
            <Link
              href="/services"
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/45 bg-black/25 px-6 py-4 font-bold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              Find the right service <ArrowDownRight className="size-5" aria-hidden="true" />
            </Link>
          </div>

        </div>

        <dl className="mt-12 grid grid-cols-2 border-t border-white/30 pt-5 text-white lg:grid-cols-4 lg:gap-8">
          <div className="border-r border-white/20 pr-4">
            <dt className="text-xs text-white/60">Local since</dt>
            <dd className="mt-1 text-xl font-bold sm:text-2xl">2020</dd>
          </div>
          <div className="pl-4 lg:border-r lg:border-white/20 lg:pl-0">
            <dt className="text-xs text-white/60">Rides completed</dt>
            <dd className="mt-1 text-xl font-bold sm:text-2xl">15,000+</dd>
          </div>
          <div className="mt-5 border-r border-white/20 pr-4 lg:mt-0">
            <dt className="text-xs text-white/60">Google rating</dt>
            <dd className="mt-1 text-xl font-bold sm:text-2xl">
              {ratingValue.toFixed(1)} <span className="text-sm font-normal text-white/65">({reviewCount}+)</span>
            </dd>
          </div>
          <div className="mt-5 pl-4 lg:mt-0 lg:pl-0">
            <dt className="text-xs text-white/60">Passenger options</dt>
            <dd className="mt-1 text-xl font-bold sm:text-2xl">1–37</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

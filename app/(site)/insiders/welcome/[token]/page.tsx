import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  BusFront,
  CalendarDays,
  CarFront,
  Crown,
  Gift,
  Headphones,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { INSIDER_TIERS } from '@/lib/insiders/constants'
import { formatInsiderDate } from '@/lib/insiders/format'
import { readInsiderWelcomeToken } from '@/lib/insiders/welcome-link'
import { getInsiderWelcomeProfile } from '@/lib/insiders/welcome-server'
import { INSIDER_MEMBERSHIP_DETAILS } from '@/lib/insiders/welcome'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Your Insider Welcome Packet | Lake Ride Pros',
  description: 'Your personalized Lake Ride Pros Insider Rewards welcome.',
  robots: { index: false, follow: false },
}

const TIER_ACCENTS = {
  bronze: {
    text: 'text-amber-300',
    border: 'border-amber-500/45',
    glow: 'from-amber-700/30',
  },
  silver: {
    text: 'text-slate-100',
    border: 'border-slate-300/45',
    glow: 'from-slate-400/25',
  },
  gold: {
    text: 'text-yellow-300',
    border: 'border-yellow-400/45',
    glow: 'from-yellow-400/25',
  },
  diamond: {
    text: 'text-cyan-200',
    border: 'border-cyan-200/50',
    glow: 'from-cyan-300/25',
  },
} as const

const VEHICLE_CATEGORIES = [
  {
    name: 'FLEX',
    detail: 'Everyday rides and smaller groups of 1–4 passengers.',
    icon: CarFront,
  },
  {
    name: 'ELITE',
    detail: 'Extra room and luggage capacity for groups up to 7.',
    icon: Star,
  },
  {
    name: 'LRP BLACK',
    detail: 'Personalized curbside luxury available through hourly service.',
    icon: Crown,
  },
  {
    name: 'Group Fleet',
    detail: 'Limo buses, specialty vehicles, sprinters, and shuttle buses.',
    icon: BusFront,
  },
] as const

function greetingName(name: string) {
  return name.trim().split(/\s+/)[0] || 'Insider'
}

export default async function InsiderWelcomePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const payload = readInsiderWelcomeToken(token)
  if (!payload) notFound()

  const profile = await getInsiderWelcomeProfile(payload.memberId)
  if (!profile) notFound()

  const tier = INSIDER_TIERS[profile.tier]
  const membership = INSIDER_MEMBERSHIP_DETAILS[profile.membershipType]
  const accent = TIER_ACCENTS[profile.tier]
  const activeRiders = [profile.name, ...profile.approvedRiders]

  return (
    <div className="overflow-hidden bg-black text-white">
      <section className="relative border-b border-primary/25 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary-alpha-20),transparent_46%),linear-gradient(to_bottom,#050505,#000)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary sm:text-sm">
              Lake Ride Pros Insider Rewards
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Welcome,{' '}
              <span className="text-primary">
                {greetingName(profile.name)}.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Your personalized welcome packet has everything you need to start
              saving, earning rewards, and making the most of every ride.
            </p>
          </div>

          <div
            className={`relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] border ${accent.border} bg-gradient-to-br ${accent.glow} via-zinc-950 to-black p-6 shadow-2xl sm:p-9`}
          >
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/5 blur-2xl"
            />
            <div className="relative flex flex-col justify-between gap-10 sm:min-h-80">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Insider Rewards
                  </p>
                  <p className="mt-2 text-lg font-bold text-white/75">
                    {membership.label}
                  </p>
                </div>
                <BadgeCheck
                  aria-hidden="true"
                  className={`h-10 w-10 ${accent.text}`}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Member
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-5xl">
                  {profile.name}
                </h2>
                {profile.lifetimeTier ? (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-200/10 px-3 py-1.5 text-sm font-black text-cyan-100">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    {INSIDER_TIERS[profile.lifetimeTier].label} for life
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 border-t border-white/12 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Current status
                  </p>
                  <p className={`mt-1 text-xl font-black ${accent.text}`}>
                    {tier.label}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Eligible ride savings
                  </p>
                  <p className="mt-1 text-xl font-black">{tier.discount}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Member since
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {profile.joinedAt
                      ? formatInsiderDate(profile.joinedAt)
                      : 'Welcome aboard'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              Your membership
            </p>
            <h2 className="mt-3 text-3xl font-black">{membership.label}</h2>
            <p className="mt-3 leading-7 text-white/65">{membership.summary}</p>
            <div className="mt-7 flex items-start gap-4 rounded-2xl border border-primary/25 bg-primary/8 p-5">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 h-6 w-6 shrink-0 text-primary"
              />
              <div>
                <p className="font-black">Start saving immediately</p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Your {tier.label} status includes {tier.discount}% savings on
                  eligible rides. Complete paid reservations to earn status
                  points and unlock more benefits.
                </p>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              {profile.membershipType === 'business' ? (
                <Building2 aria-hidden="true" className="h-7 w-7 text-primary" />
              ) : (
                <Users aria-hidden="true" className="h-7 w-7 text-primary" />
              )}
              <h2 className="text-2xl font-black">Approved riders</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Your plan supports up to {membership.riderLimit}{' '}
              {membership.riderLimit === 1 ? 'member' : 'approved riders'}.
            </p>
            <ul className="mt-5 space-y-3">
              {activeRiders.map((rider, index) => (
                <li
                  key={`${rider}-${index}`}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
                >
                  <BadgeCheck
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-primary"
                  />
                  <span className="font-semibold">{rider}</span>
                  {index === 0 ? (
                    <span className="ml-auto text-xs font-bold uppercase tracking-wider text-white/40">
                      Owner
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            {profile.membershipType !== 'individual' ? (
              <Link
                href="/insiders/login"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Manage approved riders
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Status levels
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Your rewards grow with every ride.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(INSIDER_TIERS).map(([key, item]) => {
              const isCurrent = key === profile.tier
              return (
                <article
                  key={key}
                  className={`rounded-2xl border p-5 ${
                    isCurrent
                      ? `${TIER_ACCENTS[key as keyof typeof TIER_ACCENTS].border} bg-white/8`
                      : 'border-white/10 bg-black/35'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Crown
                      aria-hidden="true"
                      className={`h-6 w-6 ${TIER_ACCENTS[key as keyof typeof TIER_ACCENTS].text}`}
                    />
                    {isCurrent ? (
                      <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                        You are here
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 text-2xl font-black">{item.label}</h3>
                  <p className="mt-1 text-3xl font-black text-primary">
                    {item.discount}%
                  </p>
                  <p className="mt-2 text-sm text-white/55">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Member benefits
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            More than a discount.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Gift, 'Local perks & promotions'],
              [ShieldCheck, 'Member Price Protection'],
              [CalendarDays, 'Advance event notifications'],
              [Sparkles, 'Flex Credits and anniversary rewards'],
              [Users, 'Guest Savings Passes'],
              [Crown, 'Expanded Diamond assistance'],
            ].map(([Icon, label]) => {
              const BenefitIcon = Icon as typeof Gift
              return (
                <div
                  key={label as string}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5"
                >
                  <BenefitIcon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-primary"
                  />
                  <p className="font-bold">{label as string}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            A vehicle for every occasion
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">
            From everyday transportation to unforgettable celebrations.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {VEHICLE_CATEGORIES.map((vehicle) => {
              const Icon = vehicle.icon
              return (
                <article
                  key={vehicle.name}
                  className="rounded-2xl border border-white/10 bg-black/45 p-6"
                >
                  <Icon aria-hidden="true" className="h-8 w-8 text-primary" />
                  <h3 className="mt-5 text-xl font-black">{vehicle.name}</h3>
                  <p className="mt-2 leading-7 text-white/60">{vehicle.detail}</p>
                </article>
              )
            })}
          </div>
          <Link
            href="/fleet"
            className="mt-7 inline-flex items-center gap-2 font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Explore the Lake Ride Pros fleet
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/35 bg-[radial-gradient(circle_at_top,var(--primary-alpha-20),transparent_55%),#090909] p-7 text-center sm:p-12">
          <Headphones aria-hidden="true" className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Your Insider account is ready.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/65">
            Securely view your status, points, rides, benefits, promotions, and
            membership details. No password required.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/insiders/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-black text-black transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Access my account
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-black text-white transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Book a ride
              <CarFront aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 text-sm text-white/60 sm:flex-row sm:gap-6">
            <a
              href="tel:+15732069499"
              className="inline-flex items-center justify-center gap-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              (573) 206-9499
            </a>
            <a
              href="mailto:contactus@lakeridepros.com"
              className="inline-flex items-center justify-center gap-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              contactus@lakeridepros.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

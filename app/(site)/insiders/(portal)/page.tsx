import Link from 'next/link'
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  CarFront,
  Crown,
  Gift,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import { INSIDER_BENEFIT_LABELS, INSIDER_TIERS } from '@/lib/insiders/constants'
import { DEMO_INSIDER_TRIPS } from '@/lib/insiders/demo'
import {
  formatInsiderCurrency,
  formatInsiderDate,
  titleCaseInsiderValue,
} from '@/lib/insiders/format'

const TIER_STYLES = {
  bronze: {
    card: 'border-amber-700/45 bg-[radial-gradient(circle_at_88%_16%,rgba(180,83,9,0.25),transparent_30%),linear-gradient(135deg,rgba(120,53,15,0.22),rgba(24,24,27,0.96)_48%,#000)]',
    icon: 'border-amber-500/35 bg-amber-500/10 text-amber-300',
    title:
      'bg-gradient-to-r from-amber-200 via-orange-300 to-amber-600 bg-clip-text text-transparent',
    accent: 'text-amber-300',
    meter: 'bg-gradient-to-r from-amber-700 via-orange-400 to-amber-200',
    badge: 'border-amber-500/30 bg-amber-950/45',
  },
  silver: {
    card: 'border-slate-300/40 bg-[radial-gradient(circle_at_88%_16%,rgba(203,213,225,0.2),transparent_30%),linear-gradient(135deg,rgba(71,85,105,0.24),rgba(24,24,27,0.96)_48%,#000)]',
    icon: 'border-slate-200/35 bg-slate-200/10 text-slate-100',
    title:
      'bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent',
    accent: 'text-slate-100',
    meter: 'bg-gradient-to-r from-slate-500 via-slate-200 to-white',
    badge: 'border-slate-300/30 bg-slate-950/45',
  },
  gold: {
    card: 'border-yellow-400/45 bg-[radial-gradient(circle_at_88%_16%,rgba(250,204,21,0.24),transparent_31%),linear-gradient(135deg,rgba(113,63,18,0.28),rgba(24,24,27,0.96)_48%,#000)] shadow-[0_18px_70px_-32px_rgba(250,204,21,0.55)]',
    icon: 'border-yellow-300/40 bg-yellow-300/10 text-yellow-300',
    title:
      'bg-gradient-to-r from-yellow-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent',
    accent: 'text-yellow-300',
    meter: 'bg-gradient-to-r from-amber-500 via-yellow-300 to-yellow-100',
    badge: 'border-yellow-300/35 bg-yellow-950/40',
  },
  diamond: {
    card: 'border-cyan-300/45 bg-[radial-gradient(circle_at_88%_16%,rgba(103,232,249,0.22),transparent_31%),linear-gradient(135deg,rgba(14,116,144,0.22),rgba(24,24,27,0.96)_48%,#000)] shadow-[0_18px_70px_-32px_rgba(103,232,249,0.5)]',
    icon: 'border-cyan-200/40 bg-cyan-200/10 text-cyan-200',
    title:
      'bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent',
    accent: 'text-cyan-200',
    meter: 'bg-gradient-to-r from-cyan-500 via-cyan-200 to-white',
    badge: 'border-cyan-200/35 bg-cyan-950/40',
  },
} as const

const DEMO_TIER_PREVIEWS = {
  bronze: {
    points: 20,
    nextTierAt: 41,
    benefits: {},
  },
  silver: {
    points: 82,
    nextTierAt: 121,
    benefits: {
      flex_credit: 2,
      anniversary_credit: 10,
    },
  },
  gold: {
    points: 148,
    nextTierAt: 201,
    benefits: {
      flex_credit: 4,
      guest_savings_pass: 1,
      anniversary_credit: 25,
      event_access: 1,
    },
  },
  diamond: {
    points: 225,
    nextTierAt: null,
    benefits: {
      flex_credit: 6,
      guest_savings_pass: 2,
      anniversary_credit: 50,
      event_access: 1,
      priority_pass: 1,
      merch_gift: 1,
    },
  },
} as const

function formatBenefitValue(key: string, value: number) {
  if (key === 'anniversary_credit') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)
}

export default async function InsiderDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    tier?: string | string[]
    lifetime?: string | string[]
  }>
}) {
  const {
    dashboard: baseDashboard,
    supabase,
    isDemo,
  } = await requireInsiderDashboard()
  const resolvedSearchParams = await searchParams
  const requestedTier = resolvedSearchParams.tier
  const showLifetimePreview =
    isDemo &&
    requestedTier === 'diamond' &&
    resolvedSearchParams.lifetime === 'true'
  const tierPreview =
    isDemo && typeof requestedTier === 'string'
      ? DEMO_TIER_PREVIEWS[requestedTier as keyof typeof DEMO_TIER_PREVIEWS]
      : undefined
  const dashboard = tierPreview
    ? {
        ...baseDashboard,
        member: showLifetimePreview
          ? {
              ...baseDashboard.member,
              lifetimeTier: 'diamond' as const,
              complimentaryMembership: true,
            }
          : baseDashboard.member,
        tier: requestedTier as keyof typeof DEMO_TIER_PREVIEWS,
        ...tierPreview,
      }
    : baseDashboard
  const tier = INSIDER_TIERS[dashboard.tier]
  const tierStyle = TIER_STYLES[dashboard.tier]
  const nextTierPoints =
    dashboard.nextTierAt === null
      ? null
      : Math.max(dashboard.nextTierAt - dashboard.points, 0)

  const trips = isDemo
    ? DEMO_INSIDER_TRIPS
    : (
        await supabase.rpc('get_my_insider_trips', {
          page_limit: 3,
          page_offset: 0,
        })
      ).data

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <div
          className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${tierStyle.card}`}
        >
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/5 bg-white/3 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/3 h-40 w-96 rotate-[-12deg] bg-white/4 blur-3xl"
          />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${tierStyle.icon}`}
                >
                  <Crown aria-hidden="true" className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">
                    Current status
                  </p>
                </div>
                <h2
                  className={`mt-3 w-fit text-5xl font-black tracking-tight sm:text-6xl ${tierStyle.title}`}
                >
                  {tier.label}
                </h2>
                <p className="mt-1 text-lg font-medium text-white/65">
                  {tier.description}
                </p>
                {dashboard.member.lifetimeTier ? (
                  <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-200/35 bg-cyan-200/10 px-3 py-2 text-sm font-black text-cyan-100 shadow-[0_0_28px_-12px_rgba(165,243,252,0.9)]">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    <span>Diamond for life</span>
                    {dashboard.member.complimentaryMembership ? (
                      <span className="font-semibold text-cyan-100/70">
                        · Complimentary lifetime membership
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div
                className={`rounded-2xl border px-6 py-4 text-center backdrop-blur-sm ${tierStyle.badge}`}
              >
                <p className={`text-4xl font-black ${tierStyle.accent}`}>
                  {tier.discount}%
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/55">
                  Ride savings
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-black">{dashboard.points}</p>
                  <p className="text-sm text-white/55">rolling status points</p>
                </div>
                <p className="text-right text-sm font-semibold text-white/70">
                  {nextTierPoints === null
                    ? 'Top-tier status achieved'
                    : `${nextTierPoints} points to the next level`}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${tierStyle.meter}`}
                  style={{
                    width:
                      dashboard.nextTierAt === null
                        ? '100%'
                        : `${Math.min(
                            (dashboard.points / dashboard.nextTierAt) * 100,
                            100,
                          )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <ShieldCheck aria-hidden="true" className="h-8 w-8 text-primary" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            Membership
          </p>
          <h2 className="mt-2 text-2xl font-black capitalize">
            {dashboard.member.membershipType}
          </h2>
          <p className="mt-2 text-sm text-white/55">
            {dashboard.member.memberId
              ? `Member ${dashboard.member.memberId}`
              : 'Active Insider account'}
          </p>
          <Link
            href="/insiders/account"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            Manage membership
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section
        aria-label="Insider savings and next ride"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-[0.7fr_0.7fr_1.6fr]"
      >
        <div className="rounded-3xl border border-primary/20 bg-primary/8 p-6">
          <BadgeDollarSign
            aria-hidden="true"
            className="h-7 w-7 text-primary"
          />
          <p className="mt-5 text-3xl font-black">
            {formatInsiderCurrency(dashboard.savings.currentYear)}
          </p>
          <p className="mt-1 text-sm text-white/55">Savings this year</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <TrendingUp aria-hidden="true" className="h-7 w-7 text-primary" />
          <p className="mt-5 text-3xl font-black">
            {formatInsiderCurrency(dashboard.savings.lifetime)}
          </p>
          <p className="mt-1 text-sm text-white/55">Savings since joining</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 md:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Next ride
              </p>
              {dashboard.nextRide ? (
                <>
                  <p className="mt-2 text-2xl font-black">
                    {formatInsiderDate(dashboard.nextRide.pickupDate)}
                    {dashboard.nextRide.pickupTime
                      ? ` at ${dashboard.nextRide.pickupTime.slice(0, 5)}`
                      : ''}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    {dashboard.nextRide.vehicleName ||
                      dashboard.nextRide.tripType ||
                      'Lake Ride Pros ride'}
                    {dashboard.nextRide.tripConf
                      ? ` · Trip ${dashboard.nextRide.tripConf}`
                      : ''}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-xl font-black">
                    No upcoming ride scheduled
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Your next matched reservation will appear here.
                  </p>
                </>
              )}
            </div>
            <CarFront
              aria-hidden="true"
              className="h-7 w-7 shrink-0 text-white/60"
            />
          </div>
          {dashboard.nextRide?.pickupAddress ? (
            <p className="mt-4 flex gap-2 text-sm text-white/55">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              />
              <span>{dashboard.nextRide.pickupAddress}</span>
            </p>
          ) : null}
          {dashboard.nextRide ? (
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-white/60">
              {titleCaseInsiderValue(dashboard.nextRide.status || 'scheduled')}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="benefits-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Ready to use
            </p>
            <h2 id="benefits-heading" className="mt-1 text-2xl font-black">
              Your benefits
            </h2>
          </div>
          <Link
            href="/insiders/rewards"
            className="text-sm font-bold text-primary hover:underline"
          >
            View rewards
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(dashboard.benefits).length ? (
            Object.entries(dashboard.benefits).map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
              >
                <Gift aria-hidden="true" className="h-6 w-6 text-primary" />
                <p className="mt-5 text-3xl font-black">
                  {formatBenefitValue(key, value)}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {INSIDER_BENEFIT_LABELS[key] || key}
                </p>
                {dashboard.benefitExpirations[key] ? (
                  <p className="mt-3 text-xs font-semibold text-amber-200/75">
                    Next expiration{' '}
                    {formatInsiderDate(dashboard.benefitExpirations[key])}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/3 p-6 text-white/55">
              Benefit balances will appear here as they are issued.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Moovs activity
              </p>
              <h2 className="mt-1 text-2xl font-black">Recent rides</h2>
            </div>
            <CarFront aria-hidden="true" className="h-7 w-7 text-white/60" />
          </div>

          <div className="mt-5 divide-y divide-white/10">
            {Array.isArray(trips) && trips.length ? (
              trips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(`${trip.pickup_date}T12:00:00`))}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {trip.vehicle_name ||
                        trip.trip_type ||
                        'Lake Ride Pros ride'}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">
                    {trip.status_slug}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-5 text-white/50">
                Your matching Moovs rides will appear here.
              </p>
            )}
          </div>

          <Link
            href="/insiders/rides"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            View all rides
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            href="/insiders/perks"
            className="group flex flex-col items-start justify-start rounded-3xl border border-white/10 bg-zinc-900 p-6 text-left transition hover:border-primary/45"
          >
            <span className="inline-flex rounded-xl border border-primary/20 bg-primary/8 p-2.5 text-primary">
              <Gift aria-hidden="true" className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-black">Local Insider Perks</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Explore offers and special access from participating Lake-area
              partners.
            </p>
            <ArrowRight
              aria-hidden="true"
              className="mt-5 h-5 w-5 text-primary transition group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/insiders/events"
            className="group flex flex-col items-start justify-start rounded-3xl border border-white/10 bg-zinc-900 p-6 text-left transition hover:border-primary/45"
          >
            <span className="inline-flex rounded-xl border border-primary/20 bg-primary/8 p-2.5 text-primary">
              <CalendarDays aria-hidden="true" className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-black">Member Events</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              See early-access notices, availability, and Insider-only
              opportunities.
            </p>
            <ArrowRight
              aria-hidden="true"
              className="mt-5 h-5 w-5 text-primary transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/8 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex gap-4">
          <TrendingUp
            aria-hidden="true"
            className="mt-1 h-7 w-7 shrink-0 text-primary"
          />
          <div>
            <h2 className="text-xl font-black">Every completed ride counts.</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Eligible completed and paid rides automatically build your rolling
              status and unlock stronger Insider benefits.
            </p>
          </div>
        </div>
        <Link
          href="/book"
          className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-dark sm:mt-0"
        >
          Book a ride
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}

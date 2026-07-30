import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  Check,
  Gift,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  InsiderPlanSelector,
  type InsiderCheckoutStatus,
  type InsiderPublicPlan,
} from './InsiderPlanSelector'

export const metadata: Metadata = {
  title: 'Insider Rewards Membership | Save From Your First Ride',
  description:
    'Join Lake Ride Pros Insider Rewards for immediate ride savings, status rewards, Lake-area perks, and up to 20% off eligible rides.',
  keywords: [
    'Lake Ride Pros Insider Rewards',
    'Lake of the Ozarks transportation membership',
    'ride discounts',
    'VIP transportation membership',
    'Lake of the Ozarks local perks',
  ],
  alternates: {
    canonical: 'https://www.lakeridepros.com/insider-membership-benefits',
  },
  openGraph: {
    title: 'Insiders Just Got Better | Lake Ride Pros',
    description:
      'Save from your first ride and earn bigger rewards every time you ride.',
    url: 'https://www.lakeridepros.com/insider-membership-benefits',
    siteName: 'Lake Ride Pros',
    images: [
      {
        url: '/insider-rewards/all-new.webp',
        width: 1672,
        height: 941,
        alt: 'All-new Lake Ride Pros Insider Rewards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insiders Just Got Better | Lake Ride Pros',
    description:
      'Immediate savings, Lake-area perks, priority treatment, and rewards up to 20% off.',
    images: ['/insider-rewards/all-new.webp'],
  },
}

const plans = [
  {
    membershipType: 'individual',
    name: 'Individual',
    monthly: '$9.99',
    annual: '$99',
    capacity: '1 member',
    description:
      'Best for solo riders, airport transfers, repeat nights out, and everyday rides.',
    image: '/insider-rewards/individual.webp',
  },
  {
    membershipType: 'family',
    name: 'Family',
    monthly: '$19.99',
    annual: '$199',
    capacity: 'Up to 5 approved riders',
    description:
      'Approved riders can live at different addresses—more flexibility and more shared value.',
    image: '/insider-rewards/family.webp',
    featured: true,
  },
  {
    membershipType: 'business',
    name: 'Business',
    monthly: '$29.99',
    annual: '$299',
    capacity: 'Up to 10 approved riders',
    description:
      'Built for teams, clients, vendors, and repeat transportation needs in every season.',
    image: '/insider-rewards/business.webp',
  },
] satisfies InsiderPublicPlan[]

const tiers = [
  {
    name: 'Bronze',
    discount: '5%',
    individual: '0–20',
    shared: '0–40',
    description: 'Immediate savings',
    badge: 'border-amber-600/50 bg-amber-950/35 text-amber-300',
    benefits: [
      '5% off eligible rides',
      'Insider Local Perks',
      'Exclusive member promotions',
      'Earn status points',
      'Deposits waived on eligible rides',
      'Lost item coordination fee waived',
      'Price Protection after confirmation',
      'Savings statements and member portal',
    ],
  },
  {
    name: 'Silver',
    discount: '10%',
    individual: '21–60',
    shared: '41–120',
    description: 'Frequent rider value',
    badge: 'border-slate-300/50 bg-slate-400/10 text-slate-200',
    benefits: [
      'Everything included in Bronze',
      '10% off eligible rides',
      'Priority waitlist',
      'Early-access notices',
      '2 Flex Credits per year',
      '$10 anniversary ride credit upon renewal',
    ],
  },
  {
    name: 'Gold',
    discount: '15%',
    individual: '61–100',
    shared: '121–200',
    description: 'VIP-level perks',
    badge: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-300',
    benefits: [
      'Everything included in Silver',
      '15% off eligible rides',
      '48-hour event access',
      '4 Flex Credits per year',
      'Nonalcoholic beverage package on eligible hourly rides when requested in advance',
      '10% merchandise discount',
      '1 Guest Savings Pass per membership year',
      '$25 anniversary ride credit upon renewal',
    ],
  },
  {
    name: 'Diamond',
    discount: '20%',
    individual: '101+',
    shared: '201+',
    description: 'Premier status',
    badge: 'border-cyan-300/50 bg-cyan-300/10 text-cyan-200',
    benefits: [
      'Everything included in Gold',
      '20% off eligible rides',
      'Top-priority waitlist',
      '72-hour event access',
      'Limited-edition merchandise gift',
      '6 Flex Credits per year',
      'Nonalcoholic beverage package on eligible hourly rides when requested in advance',
      '2 Guest Savings Passes per membership year',
      'Dedicated membership booking assistance',
      '$50 anniversary ride credit upon renewal',
      'Diamond Priority Pass',
    ],
  },
]

const definitions = [
  {
    title: 'Flex Credit',
    body: 'Waives one eligible change or cancellation fee on a standard point-to-point reservation when notice is provided at least two hours before pickup. It does not cover no-shows, late cancellations, hourly vehicles, specialty vehicles, or expenses already incurred.',
    icon: ShieldCheck,
  },
  {
    title: 'Guest Savings Pass',
    body: 'Allows the account owner to share their current percentage discount on one eligible standard ride. The member must book and pay for the reservation.',
    icon: Gift,
  },
  {
    title: 'Anniversary Ride Credit',
    body: 'Issued after a paid annual renewal or 12 consecutive monthly payments. It expires after 60 days and applies only to eligible standard transportation.',
    icon: CalendarClock,
  },
  {
    title: 'Insider Local Perks',
    body: 'Discounts, upgrades, complimentary items, or special access provided by participating Premier Partners. Offers can change throughout the year.',
    icon: Sparkles,
  },
]

const points = [
  ['Point-to-point one-way', '1 point'],
  ['Point-to-point round trip', '2 points'],
  ['Additional stops', '0 points'],
  ['Hourly SUV', '3 points'],
  ['Limo Bus or Rescue Squad', '4 points'],
  ['Luxury Sprinter or Luxury Shuttle Bus', '5 points'],
]

const checkoutStatuses = new Set<InsiderCheckoutStatus>([
  'success',
  'cancelled',
  'unavailable',
  'error',
])

interface InsiderMembershipBenefitsPageProps {
  searchParams: Promise<{
    checkout?: string | string[]
  }>
}

export default async function InsiderMembershipBenefitsPage({
  searchParams,
}: InsiderMembershipBenefitsPageProps) {
  const checkout = (await searchParams).checkout
  const checkoutStatus =
    typeof checkout === 'string' &&
    checkoutStatuses.has(checkout as InsiderCheckoutStatus)
      ? (checkout as InsiderCheckoutStatus)
      : undefined

  return (
    <div className="overflow-hidden bg-black text-white">
      <section className="relative border-b border-primary/20">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,var(--primary-alpha-20),transparent_33%),radial-gradient(circle_at_90%_70%,rgba(190,255,0,0.09),transparent_28%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
              Insiders just got better
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Pay less now.
              <span className="mt-2 block text-primary">
                Get treated better.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65 sm:text-xl">
              Save from your first ride. Earn bigger rewards every time you
              ride—with local perks, priority treatment, and up to 20% off
              eligible transportation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#join"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-3.5 font-black text-black transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                View plans
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <Link
                href="/insiders"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/20 px-6 py-3.5 font-bold text-white transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LockKeyhole aria-hidden="true" className="h-4 w-4" />
                Member login
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl"
            />
            <Image
              src="/insider-rewards/all-new.webp"
              alt="Lake Ride Pros Insider Rewards: 5% off from day one, with Bronze, Silver, Gold, and Diamond reward levels"
              width={1672}
              height={941}
              priority
              className="relative h-auto w-full rounded-2xl border border-primary/25 shadow-2xl shadow-primary/10"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="value-heading"
        className="border-b border-white/10"
      >
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-3">
          {[
            ['5%', 'Savings from day one'],
            ['20%', 'Maximum Diamond savings'],
            ['365', 'Rolling qualification days'],
          ].map(([value, label]) => (
            <div key={label} className="bg-zinc-950 px-6 py-8 text-center">
              <p className="text-4xl font-black text-primary">{value}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-white/50">
                {label}
              </p>
            </div>
          ))}
        </div>
        <h2 id="value-heading" className="sr-only">
          Insider Rewards value
        </h2>
      </section>

      <section
        id="join"
        aria-labelledby="plans-heading"
        className="scroll-mt-28 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              Simple membership options
            </p>
            <h2
              id="plans-heading"
              className="mt-3 text-4xl font-black sm:text-5xl"
            >
              Choose how you ride.
            </h2>
            <p className="mt-4 text-lg text-white/55">
              Pay monthly or save with an annual plan. Checkout, renewals, and
              billing are securely managed online.
            </p>
          </div>

          <InsiderPlanSelector plans={plans} checkoutStatus={checkoutStatus} />
        </div>
      </section>

      <section
        aria-labelledby="tiers-heading"
        className="border-y border-white/10 bg-zinc-950 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              Clear reward levels
            </p>
            <h2
              id="tiers-heading"
              className="mt-3 text-4xl font-black sm:text-5xl"
            >
              Every level has a real win.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/55">
              Status is based on eligible points earned during a rolling
              12-month period. Family and Business plans share higher group
              thresholds.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`rounded-3xl border p-6 ${tier.badge}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em]">
                      {tier.name}
                    </p>
                    <p className="mt-2 text-5xl font-black">{tier.discount}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                      eligible ride savings
                    </p>
                  </div>
                  {tier.name === 'Diamond' ? (
                    <Image
                      src="/insider-rewards/diamond.webp"
                      alt=""
                      width={1672}
                      height={941}
                      className="h-16 w-24 rounded-lg object-cover"
                    />
                  ) : null}
                </div>
                <p className="mt-5 font-bold text-white">{tier.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-sm text-white">
                  <div>
                    <dt className="text-xs text-white/60">Individual</dt>
                    <dd className="mt-1 font-black">{tier.individual} pts</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-white/60">Family / Business</dt>
                    <dd className="mt-1 font-black">{tier.shared} pts</dd>
                  </div>
                </dl>
                <ul className="mt-5 space-y-3 text-sm leading-5 text-white/70">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="benefits-heading" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              Benefits that work in real life
            </p>
            <h2
              id="benefits-heading"
              className="mt-3 text-4xl font-black sm:text-5xl"
            >
              More value between rides.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {definitions.map((definition) => {
              const Icon = definition.icon
              return (
                <article
                  key={definition.title}
                  className="rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8"
                >
                  <Icon aria-hidden="true" className="h-8 w-8 text-primary" />
                  <h3 className="mt-5 text-2xl font-black">
                    {definition.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/55 sm:text-base">
                    {definition.body}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
              <BadgeDollarSign
                aria-hidden="true"
                className="h-8 w-8 text-primary"
              />
              <h3 className="mt-5 text-2xl font-black">Price Protection</h3>
              <p className="mt-3 leading-7 text-white/55">
                Once confirmed, your quoted member rate does not increase unless
                the ride changes.
              </p>
            </article>
            <article className="rounded-3xl border border-primary/25 bg-primary/8 p-6 sm:p-8">
              <CalendarClock
                aria-hidden="true"
                className="h-8 w-8 text-primary"
              />
              <h3 className="mt-5 text-2xl font-black">Event notifications</h3>
              <p className="mt-3 leading-7 text-white/55">
                Get advance notice of selected event transportation, specialty
                availability, and member-only opportunities.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="points-heading"
        className="border-y border-white/10 bg-zinc-950 py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
              Earn with every paid ride
            </p>
            <h2
              id="points-heading"
              className="mt-3 text-4xl font-black sm:text-5xl"
            >
              Points without the guesswork.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/55">
              Completed, paid reservations under an active membership earn
              status points automatically. Your portal shows the ride, points,
              balance, tier, and next threshold.
            </p>
            <Link
              href="/insiders"
              className="mt-8 inline-flex items-center gap-2 font-black text-primary hover:underline"
            >
              Open the member portal
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
            <dl className="divide-y divide-white/10">
              {points.map(([ride, value]) => (
                <div
                  key={ride}
                  className="flex items-center justify-between gap-6 px-5 py-4 sm:px-7"
                >
                  <dt className="font-semibold text-white/70">{ride}</dt>
                  <dd className="shrink-0 text-lg font-black text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles
            aria-hidden="true"
            className="mx-auto h-10 w-10 text-primary"
          />
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">
            Save from your first ride.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/55">
            Join Insider Rewards, choose the membership that fits, and start
            with 5% savings from day one.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#join"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-black text-black transition hover:bg-primary-dark"
            >
              Join Insider Rewards
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <Link
              href="/insider-terms-and-conditions"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 font-bold hover:border-primary hover:text-primary"
            >
              Read program terms
            </Link>
          </div>
          <p className="mt-6 text-xs leading-5 text-white/60">
            Eligibility, availability, exclusions, and expiration rules apply.
            Partner offers can change. Membership does not guarantee vehicle
            availability.
          </p>
        </div>
      </section>
    </div>
  )
}

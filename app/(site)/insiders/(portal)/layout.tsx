import Link from 'next/link'
import {
  CalendarDays,
  CarFront,
  CreditCard,
  Gift,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from 'lucide-react'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import { InsiderTierBadge } from './InsiderTierBadge'
import { signOutInsider } from './actions'

const navItems = [
  { href: '/insiders', label: 'Overview', icon: LayoutDashboard },
  { href: '/insiders/rides', label: 'My Rides', icon: CarFront },
  { href: '/insiders/rewards', label: 'Rewards', icon: Sparkles },
  { href: '/insiders/perks', label: 'Local Perks', icon: Gift },
  { href: '/insiders/events', label: 'Events', icon: CalendarDays },
  { href: '/insiders/account', label: 'Account', icon: Users },
]

export default async function InsiderPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { dashboard, isDemo } = await requireInsiderDashboard()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-white/10 bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Insider Rewards
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-black sm:text-2xl">
                {dashboard.member.name}
              </h1>
              <InsiderTierBadge tier={dashboard.tier} allowPreview={isDemo} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/insiders/account"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CreditCard aria-hidden="true" className="h-4 w-4" />
              Membership
            </Link>
            <form action={signOutInsider}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      <nav
        aria-label="Insider portal"
        className="sticky top-20 z-30 border-b border-white/10 bg-zinc-950/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}

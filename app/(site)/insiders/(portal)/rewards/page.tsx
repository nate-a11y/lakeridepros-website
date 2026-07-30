import { Sparkles, TrendingUp } from 'lucide-react'
import { INSIDER_BENEFIT_LABELS, INSIDER_TIERS } from '@/lib/insiders/constants'
import { formatInsiderDate, titleCaseInsiderValue } from '@/lib/insiders/format'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import {
  DEMO_BENEFIT_EVENTS,
  DEMO_POINT_EVENTS,
  DEMO_TIER_HISTORY,
} from '@/lib/insiders/demo'

export default async function InsiderRewardsPage() {
  const { dashboard, supabase, isDemo } = await requireInsiderDashboard()
  const [pointResult, benefitResult, tierResult] = isDemo
    ? [
        { data: DEMO_POINT_EVENTS },
        { data: DEMO_BENEFIT_EVENTS },
        { data: DEMO_TIER_HISTORY },
      ]
    : await Promise.all([
        supabase
          .from('insider_reward_events')
          .select('id, event_type, points_delta, reason, occurred_at')
          .eq('member_id', dashboard.member.id)
          .order('occurred_at', { ascending: false })
          .limit(50),
        supabase
          .from('insider_benefit_events')
          .select(
            'id, benefit_type, event_type, quantity_delta, unit, reason, occurred_at, expires_at',
          )
          .eq('member_id', dashboard.member.id)
          .order('occurred_at', { ascending: false })
          .limit(50),
        supabase
          .from('insider_tier_history')
          .select('id, tier, qualifying_points, source, reason, effective_at')
          .eq('member_id', dashboard.member.id)
          .order('effective_at', { ascending: false })
          .limit(12),
      ])
  const pointEvents = pointResult.data
  const benefitEvents = benefitResult.data
  const tierHistory = tierResult.data

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Transparent rewards
        </p>
        <h2 className="mt-1 text-3xl font-black">Rewards ledger</h2>
        <p className="mt-2 max-w-2xl text-white/55">
          See every status point, tier decision, and benefit grant tied to your
          membership.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-primary/20 bg-primary/8 p-6">
          <TrendingUp aria-hidden="true" className="h-7 w-7 text-primary" />
          <p className="mt-5 text-4xl font-black">{dashboard.points}</p>
          <p className="mt-1 text-white/55">rolling 12-month status points</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6">
          <Sparkles aria-hidden="true" className="h-7 w-7 text-primary" />
          <p className="mt-5 text-4xl font-black">
            {INSIDER_TIERS[dashboard.tier].discount}%
          </p>
          <p className="mt-1 text-white/55">
            {INSIDER_TIERS[dashboard.tier].label} ride savings
          </p>
        </div>
      </section>

      <section aria-labelledby="point-history-heading">
        <h3 id="point-history-heading" className="text-2xl font-black">
          Status point history
        </h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          {pointEvents?.length ? (
            <ul className="divide-y divide-white/10">
              {pointEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-5 p-5"
                >
                  <div>
                    <p className="font-bold">
                      {event.reason || titleCaseInsiderValue(event.event_type)}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {formatInsiderDate(event.occurred_at)}
                    </p>
                  </div>
                  <span
                    className={`text-xl font-black ${event.points_delta > 0 ? 'text-primary' : 'text-red-300'}`}
                  >
                    {event.points_delta > 0 ? '+' : ''}
                    {event.points_delta}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-white/50">
              Point activity will appear after eligible rides are reconciled.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-black">Benefit activity</h3>
          <div className="mt-4 space-y-3">
            {benefitEvents?.length ? (
              benefitEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-bold">
                        {INSIDER_BENEFIT_LABELS[event.benefit_type] ||
                          titleCaseInsiderValue(event.benefit_type)}
                      </p>
                      <p className="mt-1 text-sm text-white/60">
                        {titleCaseInsiderValue(event.event_type)} ·{' '}
                        {formatInsiderDate(event.occurred_at)}
                      </p>
                      {event.reason ? (
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          {event.reason}
                        </p>
                      ) : null}
                    </div>
                    <span className="font-black text-primary">
                      {Number(event.quantity_delta) > 0 ? '+' : ''}
                      {event.unit === 'usd' ? '$' : ''}
                      {Number(event.quantity_delta)}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 p-5 text-white/50">
                No benefit activity yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black">Tier history</h3>
          <div className="mt-4 space-y-3">
            {tierHistory?.length ? (
              tierHistory.map((history) => (
                <article
                  key={history.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold capitalize">{history.tier}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {formatInsiderDate(history.effective_at)} ·{' '}
                        {titleCaseInsiderValue(history.source)}
                      </p>
                    </div>
                    <p className="font-black text-primary">
                      {history.qualifying_points} pts
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 p-5 text-white/50">
                Your first tier record will appear at launch.
              </p>
            )}
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-white/10 bg-white/4 p-5 text-sm leading-6 text-white/55">
        Status uses eligible rides from the previous 12 months. Manual
        corrections and reversals always remain visible in this ledger.
      </aside>
    </div>
  )
}

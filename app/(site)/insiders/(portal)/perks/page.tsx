import { BadgeCheck, Gift, Store } from 'lucide-react'
import { formatInsiderDate, titleCaseInsiderValue } from '@/lib/insiders/format'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import { DEMO_PERKS, DEMO_PERK_REDEMPTIONS } from '@/lib/insiders/demo'
import { requestInsiderPerk } from '../actions'

function requestMessage(value: string | undefined) {
  if (value === 'submitted')
    return 'Your perk request was sent to the Insider team.'
  if (value === 'unavailable')
    return 'That perk is not available for your current tier.'
  if (value === 'invalid')
    return 'That perk request was not valid. Please try again.'
  if (value === 'error')
    return 'We could not send that request. Please try again.'
  return null
}

export default async function InsiderPerksPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>
}) {
  const params = await searchParams
  const { dashboard, supabase, isDemo } = await requireInsiderDashboard()
  const [perksResult, redemptionsResult] = isDemo
    ? [{ data: DEMO_PERKS }, { data: DEMO_PERK_REDEMPTIONS }]
    : await Promise.all([
        supabase
          .from('insider_perks')
          .select(
            'id, title, partner_name, description, redemption_instructions, eligible_tiers, starts_at, ends_at',
          )
          .contains('eligible_tiers', [dashboard.tier])
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('insider_perk_redemptions')
          .select(
            'id, perk_id, status, notes, redeemed_at, created_at, insider_perks(title, partner_name)',
          )
          .eq('member_id', dashboard.member.id)
          .order('created_at', { ascending: false }),
      ])
  const perks = perksResult.data
  const redemptions = redemptionsResult.data
  const latestRedemptionByPerk = new Map(
    (redemptions || []).map((redemption) => [redemption.perk_id, redemption]),
  )
  const message = requestMessage(params.request)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Insider Local Perks
        </p>
        <h2 className="mt-1 text-3xl font-black">Lake-area member offers</h2>
        <p className="mt-2 max-w-2xl text-white/55">
          Special access and offers from participating local partners, curated
          for active Insider members.
        </p>
      </header>

      {message ? (
        <p
          role="status"
          className={`rounded-2xl border p-4 ${
            params.request === 'submitted'
              ? 'border-emerald-400/25 bg-emerald-950/30 text-emerald-100'
              : 'border-amber-400/25 bg-amber-950/30 text-amber-100'
          }`}
        >
          {message}
        </p>
      ) : null}

      <section
        aria-label="Available local perks"
        className="grid gap-5 lg:grid-cols-2"
      >
        {perks?.length ? (
          perks.map((perk) => {
            const redemption = latestRedemptionByPerk.get(perk.id)
            const isOpen =
              redemption &&
              ['requested', 'approved'].includes(redemption.status)
            return (
              <article
                key={perk.id}
                className="flex flex-col rounded-3xl border border-white/10 bg-zinc-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <Store aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">
                    {dashboard.tier}
                  </span>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {perk.partner_name}
                </p>
                <h3 className="mt-1 text-2xl font-black">{perk.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-white/55">
                  {perk.description}
                </p>
                {perk.ends_at ? (
                  <p className="mt-4 text-xs text-white/60">
                    Available through {formatInsiderDate(perk.ends_at)}
                  </p>
                ) : null}
                {perk.redemption_instructions ? (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      How to use it
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {perk.redemption_instructions}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 border-t border-white/10 pt-5">
                  {isOpen ? (
                    <p className="inline-flex items-center gap-2 font-bold text-emerald-300">
                      <BadgeCheck aria-hidden="true" className="h-5 w-5" />
                      {redemption.status === 'approved'
                        ? 'Approved — see instructions from our team'
                        : 'Request pending'}
                    </p>
                  ) : (
                    <form action={requestInsiderPerk}>
                      <input type="hidden" name="perkId" value={perk.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                      >
                        <Gift aria-hidden="true" className="h-4 w-4" />
                        Request this perk
                      </button>
                    </form>
                  )}
                </div>
              </article>
            )
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/3 p-8 text-center">
            <Gift aria-hidden="true" className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 font-bold">New local perks are on the way.</p>
            <p className="mt-2 text-sm text-white/50">
              Active offers for your tier will appear here automatically.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="perk-history-heading">
        <h3 id="perk-history-heading" className="text-2xl font-black">
          Redemption history
        </h3>
        <div className="mt-4 space-y-3">
          {redemptions?.length ? (
            redemptions.map((redemption) => {
              const relatedPerk = Array.isArray(redemption.insider_perks)
                ? redemption.insider_perks[0]
                : redemption.insider_perks
              return (
                <article
                  key={redemption.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black">
                        {relatedPerk?.title || 'Insider perk'}
                      </p>
                      <p className="mt-1 text-sm text-white/60">
                        {[
                          relatedPerk?.partner_name,
                          formatInsiderDate(redemption.created_at),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {redemption.notes ? (
                        <p className="mt-3 text-sm leading-6 text-white/60">
                          {redemption.notes}
                        </p>
                      ) : null}
                      {redemption.redeemed_at ? (
                        <p className="mt-2 text-xs text-white/60">
                          Redeemed {formatInsiderDate(redemption.redeemed_at)}
                        </p>
                      ) : null}
                    </div>
                    <span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/65">
                      {titleCaseInsiderValue(redemption.status)}
                    </span>
                  </div>
                </article>
              )
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-white/15 p-5 text-white/50">
              Your perk requests and completed redemptions will appear here.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

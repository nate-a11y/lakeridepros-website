import Link from 'next/link'
import type { InsiderRider } from '@/lib/insiders/types'
import { RemoveRiderControl } from './RemoveRiderControl'

const CHARGEBEE_PORTAL =
  'https://lakeridepros.chargebeeportal.com/portal/v2/login?forward=portal_main'

export function InsiderBillingControls({
  isOwner,
  managementEnabled,
}: {
  isOwner: boolean
  managementEnabled: boolean
}) {
  if (!isOwner) {
    return (
      <p className="mt-6 text-sm leading-6 text-white/60">
        Billing changes are available to the account owner.
      </p>
    )
  }

  if (!managementEnabled) {
    return (
      <p className="mt-6 text-sm leading-6 text-white/60">
        Online billing changes are temporarily unavailable. Please contact our
        team for help with your plan.
      </p>
    )
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <form action="/api/insiders/billing/pricing-page" method="post">
        <button
          type="submit"
          className="inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          Change plan
        </button>
      </form>
      <Link
        href={CHARGEBEE_PORTAL}
        className="inline-flex rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Manage billing
      </Link>
    </div>
  )
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() || null
}

export function getVisibleAccountRiders({
  riders,
  accessRole,
  currentUserEmail,
}: {
  riders: InsiderRider[]
  accessRole: 'owner' | 'rider'
  currentUserEmail: string | null
}) {
  if (accessRole === 'owner') return riders

  const normalizedUserEmail = normalizeEmail(currentUserEmail)
  if (!normalizedUserEmail) return []

  return riders
    .filter(
      (rider) =>
        !rider.isAccountOwner &&
        normalizeEmail(rider.email) === normalizedUserEmail,
    )
    .slice(0, 1)
}

export function InsiderRiderList({
  riders,
  accessRole,
  currentUserEmail,
}: {
  riders: InsiderRider[]
  accessRole: 'owner' | 'rider'
  currentUserEmail: string | null
}) {
  const visibleRiders = getVisibleAccountRiders({
    riders,
    accessRole,
    currentUserEmail,
  })
  const isOwner = accessRole === 'owner'

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleRiders.length ? (
        visibleRiders.map((rider) => (
          <article
            key={rider.id}
            className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black">{rider.name}</p>
                <p className="mt-1 text-sm text-white/60">
                  {rider.role ||
                    (rider.isAccountOwner ? 'Account owner' : 'Approved rider')}
                </p>
              </div>
              {rider.isAccountOwner ? (
                <span className="rounded-full bg-primary/12 px-2.5 py-1 text-xs font-bold text-primary">
                  Owner
                </span>
              ) : null}
            </div>
            <p className="mt-4 break-all text-sm text-white/55">
              {rider.email ||
                rider.phone ||
                'Contact details managed by support'}
            </p>
            {isOwner && !rider.isAccountOwner ? (
              <RemoveRiderControl riderId={rider.id} riderName={rider.name} />
            ) : null}
          </article>
        ))
      ) : (
        <p className="col-span-full rounded-2xl border border-dashed border-white/15 p-5 text-white/50">
          {isOwner
            ? 'Approved riders will appear here once they are added.'
            : 'Your rider profile is still syncing. Please contact our team if you need help.'}
        </p>
      )}
    </div>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'
import { INSIDER_TIERS } from '@/lib/insiders/constants'
import type { InsiderTier } from '@/lib/insiders/types'

const TIERS = new Set<InsiderTier>(['bronze', 'silver', 'gold', 'diamond'])

export function InsiderTierBadge({
  tier,
  allowPreview,
}: {
  tier: InsiderTier
  allowPreview: boolean
}) {
  const searchParams = useSearchParams()
  const requestedTier = searchParams.get('tier')
  const displayedTier =
    allowPreview && TIERS.has(requestedTier as InsiderTier)
      ? (requestedTier as InsiderTier)
      : tier
  const details = INSIDER_TIERS[displayedTier]

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${details.badgeClass}`}
    >
      {details.label}
    </span>
  )
}

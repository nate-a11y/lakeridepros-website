import type {
  InsiderMembershipType,
  InsiderTier,
} from '@/lib/insiders/types'

export const INSIDER_TERMS_VERSION = '2026-07-29'

export const INSIDER_TIERS: Record<
  InsiderTier,
  {
    label: string
    discount: number
    description: string
    badgeClass: string
  }
> = {
  bronze: {
    label: 'Bronze',
    discount: 5,
    description: 'Immediate savings',
    badgeClass: 'bg-gradient-to-r from-amber-700 to-amber-950 text-white',
  },
  silver: {
    label: 'Silver',
    discount: 10,
    description: 'Frequent rider value',
    badgeClass: 'bg-gradient-to-r from-slate-300 to-slate-600 text-black',
  },
  gold: {
    label: 'Gold',
    discount: 15,
    description: 'VIP-level perks',
    badgeClass: 'bg-gradient-to-r from-yellow-300 to-amber-600 text-black',
  },
  diamond: {
    label: 'Diamond',
    discount: 20,
    description: 'Premier status',
    badgeClass: 'bg-gradient-to-r from-cyan-100 to-cyan-500 text-black',
  },
}

export const INSIDER_THRESHOLDS: Record<
  InsiderMembershipType,
  Record<InsiderTier, number>
> = {
  individual: { bronze: 0, silver: 21, gold: 61, diamond: 101 },
  family: { bronze: 0, silver: 41, gold: 121, diamond: 201 },
  business: { bronze: 0, silver: 41, gold: 121, diamond: 201 },
}

export const INSIDER_BENEFIT_LABELS: Record<string, string> = {
  flex_credit: 'Flex Credits',
  guest_savings_pass: 'Guest Savings Passes',
  anniversary_credit: 'Anniversary Credit',
  event_access: 'Event Access',
  priority_pass: 'Priority Pass',
  merch_gift: 'Merch Gifts',
  other: 'Other Benefits',
}

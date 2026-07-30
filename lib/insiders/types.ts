export type InsiderTier = 'bronze' | 'silver' | 'gold' | 'diamond'
export type InsiderMembershipType = 'individual' | 'family' | 'business'
export type InsiderNotificationCategory =
  'program' | 'event' | 'perk' | 'billing' | 'account'

export interface InsiderNotificationPreferences {
  emailAddress: string | null
  smsPhone: string | null
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  categoryPreferences: Record<InsiderNotificationCategory, boolean>
  smsConsentAt: string | null
}

export interface InsiderRider {
  id: string
  name: string
  role: string | null
  email: string | null
  phone: string | null
  isAccountOwner: boolean
}

export interface InsiderSubscription {
  id: string
  chargebee_subscription_id: string
  chargebee_customer_id: string | null
  membership_type: InsiderMembershipType
  billing_interval: 'month' | 'year'
  status: string
  current_term_start: string | null
  current_term_end: string | null
  plan_id: string
}

export interface InsiderDashboard {
  member: {
    id: string
    name: string
    memberId: string | null
    membershipType: InsiderMembershipType
    status: string
    isActive: boolean
    accessRole: 'owner' | 'rider'
    joinedAt: string | null
    lifetimeTier: InsiderTier | null
    complimentaryMembership: boolean
    protectedTierUntil: string | null
    termsAcceptedAt: string | null
    termsVersion: string | null
  }
  points: number
  tier: InsiderTier
  nextTierAt: number | null
  benefits: Record<string, number>
  benefitExpirations: Record<string, string>
  savings: {
    currentYear: number
    lifetime: number
  }
  nextRide: {
    id: string
    tripConf: string | null
    pickupDate: string
    pickupTime: string | null
    tripType: string | null
    vehicleName: string | null
    pickupAddress: string | null
    dropoffAddress: string | null
    status: string | null
  } | null
  riders: InsiderRider[]
  subscription: InsiderSubscription | null
}

export interface InsiderTrip {
  id: string
  trip_conf: string
  reservation_conf: string | null
  pickup_date: string
  pickup_time: string | null
  status_slug: string
  trip_type: string | null
  vehicle_name: string | null
  pickup_address: string | null
  dropoff_address: string | null
  total_amount: number | null
  amount_paid: number | null
  discount_amount: number | null
  cancelled: boolean | null
}

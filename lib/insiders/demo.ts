import type { InsiderDashboard, InsiderTrip } from '@/lib/insiders/types'

export { isInsiderDemoMode } from '@/lib/insiders/demo-mode'

export const DEMO_INSIDER_DASHBOARD: InsiderDashboard = {
  member: {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Nate Bullock',
    memberId: 'LRP-INS-0101',
    membershipType: 'family',
    status: 'active',
    isActive: true,
    accessRole: 'owner',
    joinedAt: '2025-08-01T12:00:00Z',
    lifetimeTier: null,
    complimentaryMembership: false,
    protectedTierUntil: '2026-08-01T12:00:00Z',
    termsAcceptedAt: '2026-07-29T12:00:00Z',
    termsVersion: '2026-07-29',
  },
  points: 148,
  tier: 'gold',
  nextTierAt: 201,
  benefits: {
    flex_credit: 4,
    guest_savings_pass: 1,
    anniversary_credit: 25,
    event_access: 1,
  },
  benefitExpirations: {
    flex_credit: '2027-06-01T12:00:00Z',
    anniversary_credit: '2027-07-01T12:00:00Z',
  },
  savings: {
    currentYear: 153.75,
    lifetime: 327.25,
  },
  nextRide: {
    id: '00000000-0000-4000-8000-000000000103',
    tripConf: 'TRIP-8460',
    pickupDate: '2026-08-14',
    pickupTime: '17:45:00',
    tripType: 'One-way',
    vehicleName: 'Executive SUV',
    pickupAddress: 'Lake Ozark, MO',
    dropoffAddress: 'Columbia Regional Airport',
    status: 'scheduled',
  },
  riders: [
    {
      id: '00000000-0000-4000-8000-000000000011',
      name: 'Nate Bullock',
      role: 'Account owner',
      email: 'nate@example.com',
      phone: null,
      isAccountOwner: true,
    },
    {
      id: '00000000-0000-4000-8000-000000000012',
      name: 'Approved Family Rider',
      role: 'Family',
      email: 'family@example.com',
      phone: null,
      isAccountOwner: false,
    },
  ],
  subscription: {
    id: '00000000-0000-4000-8000-000000000021',
    chargebee_subscription_id: 'demo-insider-family-annual',
    chargebee_customer_id: 'demo-insider-customer',
    membership_type: 'family',
    billing_interval: 'year',
    status: 'active',
    current_term_start: '2026-01-01T12:00:00Z',
    current_term_end: '2027-01-01T12:00:00Z',
    plan_id: 'insider-family-annual',
  },
}

export const DEMO_INSIDER_TRIPS: InsiderTrip[] = [
  {
    id: '00000000-0000-4000-8000-000000000101',
    trip_conf: 'TRIP-8102',
    reservation_conf: 'RES-8102',
    pickup_date: '2026-07-18',
    pickup_time: '18:30:00',
    status_slug: 'done',
    trip_type: 'Hourly',
    vehicle_name: 'LRP Limo Bus',
    pickup_address: 'Osage Beach, MO',
    dropoff_address: 'Lake Ozark, MO',
    total_amount: 685,
    amount_paid: 685,
    discount_amount: 102.75,
    cancelled: false,
  },
  {
    id: '00000000-0000-4000-8000-000000000102',
    trip_conf: 'TRIP-7920',
    reservation_conf: 'RES-7920',
    pickup_date: '2026-06-27',
    pickup_time: '14:00:00',
    status_slug: 'done',
    trip_type: 'Round-trip Pickup',
    vehicle_name: 'Luxury Suburban',
    pickup_address: 'Camdenton, MO',
    dropoff_address: 'Osage Beach, MO',
    total_amount: 340,
    amount_paid: 340,
    discount_amount: 51,
    cancelled: false,
  },
  {
    id: '00000000-0000-4000-8000-000000000103',
    trip_conf: 'TRIP-8460',
    reservation_conf: 'RES-8460',
    pickup_date: '2026-08-14',
    pickup_time: '17:45:00',
    status_slug: 'scheduled',
    trip_type: 'One-way',
    vehicle_name: 'Executive SUV',
    pickup_address: 'Lake Ozark, MO',
    dropoff_address: 'Columbia Regional Airport',
    total_amount: 425,
    amount_paid: 100,
    discount_amount: 63.75,
    cancelled: false,
  },
]

export const DEMO_POINT_EVENTS = [
  {
    id: 'demo-point-1',
    event_type: 'trip_award',
    points_delta: 4,
    reason: 'Limo Bus hourly ride',
    occurred_at: '2026-07-18T23:30:00Z',
  },
  {
    id: 'demo-point-2',
    event_type: 'trip_award',
    points_delta: 2,
    reason: 'Round-trip ride',
    occurred_at: '2026-06-27T19:00:00Z',
  },
  {
    id: 'demo-point-3',
    event_type: 'manual_adjustment',
    points_delta: 5,
    reason: 'Launch status adjustment',
    occurred_at: '2026-06-01T16:00:00Z',
  },
]

export const DEMO_BENEFIT_EVENTS = [
  {
    id: 'demo-benefit-1',
    benefit_type: 'anniversary_credit',
    event_type: 'grant',
    quantity_delta: 25,
    unit: 'usd',
    reason: 'Annual member anniversary',
    occurred_at: '2026-07-01T12:00:00Z',
    expires_at: '2027-07-01T12:00:00Z',
  },
  {
    id: 'demo-benefit-2',
    benefit_type: 'guest_savings_pass',
    event_type: 'grant',
    quantity_delta: 1,
    unit: 'count',
    reason: 'Gold tier benefit',
    occurred_at: '2026-06-01T12:00:00Z',
    expires_at: null,
  },
]

export const DEMO_TIER_HISTORY = [
  {
    id: 'demo-tier-1',
    tier: 'gold',
    qualifying_points: 148,
    source: 'calculated',
    reason: 'Rolling 12-month activity',
    effective_at: '2026-06-01T12:00:00Z',
  },
  {
    id: 'demo-tier-2',
    tier: 'silver',
    qualifying_points: 82,
    source: 'calculated',
    reason: 'Rolling 12-month activity',
    effective_at: '2025-11-01T12:00:00Z',
  },
]

export const DEMO_PERKS = [
  {
    id: '00000000-0000-4000-8000-000000000201',
    title: 'Complimentary appetizer',
    partner_name: 'The Lake House',
    description:
      'Enjoy a complimentary appetizer with the purchase of two entrées. Show your approved Insider confirmation at arrival.',
    redemption_instructions: 'Request access before your visit.',
    eligible_tiers: ['bronze', 'silver', 'gold', 'diamond'],
    starts_at: '2026-07-01T12:00:00Z',
    ends_at: '2026-12-31T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000202',
    title: 'VIP tasting experience',
    partner_name: 'Lake-area Partner',
    description:
      'Reserved Insider tasting access on select dates, subject to availability.',
    redemption_instructions:
      'Request access and our team will confirm availability.',
    eligible_tiers: ['gold', 'diamond'],
    starts_at: '2026-07-01T12:00:00Z',
    ends_at: null,
  },
]

export const DEMO_PERK_REDEMPTIONS = [
  {
    id: '00000000-0000-4000-8000-000000000211',
    perk_id: '00000000-0000-4000-8000-000000000201',
    status: 'redeemed',
    notes: 'Confirmed for your visit. Show your Insider account at arrival.',
    redeemed_at: '2026-07-20T18:00:00Z',
    created_at: '2026-07-18T14:00:00Z',
    insider_perks: {
      title: 'Complimentary appetizer',
      partner_name: 'The Lake House',
    },
  },
]

export const DEMO_NOTIFICATIONS = [
  {
    id: '00000000-0000-4000-8000-000000000301',
    title: 'Insider summer event access is open',
    body: 'Gold and Diamond members can now request early access to select Lake-area transportation packages.',
    notification_type: 'event',
    action_label: 'Request access',
    action_url: '/insiders/account',
    visible_from: '2026-07-25T12:00:00Z',
    read_at: null,
  },
  {
    id: '00000000-0000-4000-8000-000000000302',
    title: 'Your Gold benefits are ready',
    body: 'Your updated Guest Savings Pass and anniversary credit balances are now visible in Rewards.',
    notification_type: 'program',
    action_label: 'View rewards',
    action_url: '/insiders/rewards',
    visible_from: '2026-07-01T12:00:00Z',
    read_at: '2026-07-02T12:00:00Z',
  },
]

export const DEMO_REQUESTS = [
  {
    id: 'demo-request-1',
    requested_by: '00000000-0000-4000-8000-000000000001',
    request_type: 'booking_assistance',
    status: 'completed',
    subject: 'Airport transfer assistance',
    created_at: '2026-06-20T12:00:00Z',
  },
]

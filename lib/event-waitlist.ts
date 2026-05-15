import { createHash, randomInt } from 'crypto'
import { getSupabaseServerClient } from '@/lib/supabase/client'

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizeWaitlistIdentifier(value: string) {
  const trimmed = value.trim()
  if (trimmed.includes('@')) {
    return { type: 'email' as const, value: trimmed.toLowerCase() }
  }
  return { type: 'phone' as const, value: normalizePhone(trimmed) }
}

export function getTodayCentralDateString() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}

export function createOtpCode() {
  return String(randomInt(100000, 1000000))
}

export function hashOtpCode(identifier: string, code: string) {
  const secret =
    process.env.EVENT_WAITLIST_OTP_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    'event-waitlist-otp-development-secret'

  return createHash('sha256')
    .update(`${identifier}:${code}:${secret}`)
    .digest('hex')
}

export function getEventWaitlistCountKey(eventId: string, rideType: string) {
  return `${eventId}:${rideType}`
}

export async function getActiveEventWaitlistCounts(eventIds: string[]) {
  const uniqueEventIds = Array.from(new Set(eventIds.filter(Boolean)))
  if (uniqueEventIds.length === 0) return {}

  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('event_waitlist_entries')
      .select('event_id, ride_type')
      .in('event_id', uniqueEventIds)
      // Count matching event IDs from the already-upcoming Events page.
      // Include NULL dates so rows created before event_date_iso existed still count.
      .or(`event_date_iso.gte.${getTodayCentralDateString()},event_date_iso.is.null`)

    if (error) throw error

    return (data || []).reduce<Record<string, number>>((counts, entry) => {
      const key = getEventWaitlistCountKey(entry.event_id, entry.ride_type)
      counts[key] = (counts[key] || 0) + 1
      return counts
    }, {})
  } catch (error) {
    console.error('Error fetching event waitlist counts:', error)
    return {}
  }
}

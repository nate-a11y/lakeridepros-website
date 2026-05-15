import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import {
  createOtpCode,
  getTodayCentralDateString,
  hashOtpCode,
  normalizeWaitlistIdentifier,
} from '@/lib/event-waitlist'
import { sendEventWaitlistOtpCode } from '@/lib/email'

const requestCodeSchema = z.object({
  action: z.literal('request_code'),
  identifier: z.string().trim().min(3, 'Enter your email or phone number').max(255),
})

const verifyCodeSchema = z.object({
  action: z.literal('verify_code'),
  identifier: z.string().trim().min(3, 'Enter your email or phone number').max(255),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

const statusSchema = z.discriminatedUnion('action', [requestCodeSchema, verifyCodeSchema])

type LookupEntry = {
  email: string
}

function normalizeIdentifierOrError(identifier: string) {
  const normalized = normalizeWaitlistIdentifier(identifier)
  if (normalized.type === 'email') return normalized
  if (normalized.value.length < 7) return null
  return normalized
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = rateLimit(`event-waitlist-status:${ip}`, { limit: 8, windowMs: 60000 })
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const parsed = statusSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: 400 }
      )
    }

    const normalized = normalizeIdentifierOrError(parsed.data.identifier)
    if (!normalized) {
      return NextResponse.json(
        { error: 'Enter a valid email address or at least 7 digits of your phone number.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()
    const today = getTodayCentralDateString()

    if (parsed.data.action === 'request_code') {
      let entryQuery = supabase
        .from('event_waitlist_entries')
        .select('email')
        .gte('event_date_iso', today)
        .limit(25)

      entryQuery = normalized.type === 'email'
        ? entryQuery.eq('email', normalized.value)
        : entryQuery.eq('phone_normalized', normalized.value)

      const { data: matches, error: matchesError } = await entryQuery
      if (matchesError) throw matchesError

      const emails = Array.from(new Set(((matches || []) as LookupEntry[]).map((entry) => entry.email).filter(Boolean)))

      // Always return a generic success message to avoid exposing whether a person is on the waitlist.
      if (emails.length > 0) {
        const code = createOtpCode()
        const codeHash = hashOtpCode(`${normalized.type}:${normalized.value}`, code)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

        const { error: insertError } = await supabase.from('event_waitlist_lookup_codes').insert({
          identifier: `${normalized.type}:${normalized.value}`,
          code_hash: codeHash,
          expires_at: expiresAt,
        })
        if (insertError) throw insertError

        await Promise.all(emails.map((email) => sendEventWaitlistOtpCode(email, code)))
      }

      return NextResponse.json(
        { message: 'If we found an active waitlist entry, we sent a verification code to the email on file.' },
        { status: 200 }
      )
    }

    const identifier = `${normalized.type}:${normalized.value}`
    const { data: codes, error: codeError } = await supabase
      .from('event_waitlist_lookup_codes')
      .select('*')
      .eq('identifier', identifier)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (codeError) throw codeError

    const activeCode = codes?.[0]
    if (!activeCode) {
      return NextResponse.json({ error: 'Code expired or invalid. Request a new code.' }, { status: 400 })
    }

    if (activeCode.attempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 400 })
    }

    const submittedHash = hashOtpCode(identifier, parsed.data.code)
    if (submittedHash !== activeCode.code_hash) {
      await supabase
        .from('event_waitlist_lookup_codes')
        .update({ attempts: activeCode.attempts + 1 })
        .eq('id', activeCode.id)

      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
    }

    await supabase
      .from('event_waitlist_lookup_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', activeCode.id)

    let waitlistQuery = supabase
      .from('event_waitlist_entries')
      .select('id, created_at, event_id, event_name, event_date, event_time, venue_name, ride_type, ride_type_label, party_size, status')
      .gte('event_date_iso', today)
      .order('event_date_iso', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(25)

    waitlistQuery = normalized.type === 'email'
      ? waitlistQuery.eq('email', normalized.value)
      : waitlistQuery.eq('phone_normalized', normalized.value)

    const { data: entries, error: entriesError } = await waitlistQuery
    if (entriesError) throw entriesError

    const eventIds = Array.from(new Set((entries || []).map((entry) => entry.event_id)))
    let counts: Record<string, number> = {}
    if (eventIds.length > 0) {
      const { data: countRows, error: countError } = await supabase
        .from('event_waitlist_entries')
        .select('event_id, ride_type')
        .in('event_id', eventIds)
        .gte('event_date_iso', today)

      if (countError) throw countError

      counts = (countRows || []).reduce<Record<string, number>>((acc, row) => {
        const key = `${row.event_id}:${row.ride_type}`
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
    }

    const safeEntries = (entries || []).map((entry) => ({
      id: entry.id,
      created_at: entry.created_at,
      event_name: entry.event_name,
      event_date: entry.event_date,
      event_time: entry.event_time,
      venue_name: entry.venue_name,
      ride_type_label: entry.ride_type_label,
      party_size: entry.party_size,
      status: entry.status,
      queue_count: counts[`${entry.event_id}:${entry.ride_type}`] || 0,
    }))

    return NextResponse.json({ entries: safeEntries }, { status: 200 })
  } catch (error) {
    console.error('Event waitlist status error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

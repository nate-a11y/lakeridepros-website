import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { eventWaitlistSubmitSchema } from '@/lib/validation/event-waitlist'
import {
  sendEventWaitlistAdminNotification,
  sendEventWaitlistConfirmation,
} from '@/lib/email'
import { normalizePhone } from '@/lib/event-waitlist'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = rateLimit(`event-waitlist:${ip}`, { limit: 5, windowMs: 60000 })
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const parsed = eventWaitlistSubmitSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: 400 }
      )
    }

    const data = parsed.data

    if (data._honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    if (data._timestamp && Date.now() - data._timestamp < 1500) {
      return NextResponse.json(
        { error: 'Please take your time to fill out the form.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from('event_waitlist_entries').insert({
      event_id: data.eventId,
      event_name: data.eventName,
      event_date: data.eventDate,
      event_date_iso: data.eventDateIso || null,
      event_time: data.eventTime || null,
      venue_name: data.venueName || null,
      ride_type: data.rideType,
      ride_type_label: data.rideTypeLabel,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      phone_normalized: data.phone ? normalizePhone(data.phone) || null : null,
      party_size: data.partySize,
      pickup_location: data.pickupLocation || null,
      dropoff_location: data.dropoffLocation || null,
      desired_pickup_time: data.desiredPickupTime || null,
      notes: data.notes || null,
      status: 'new',
      source: 'events_page',
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already on the waitlist for this event and vehicle type.' },
          { status: 409 }
        )
      }
      console.error('Event waitlist Supabase error:', error)
      return NextResponse.json(
        { error: 'Could not add you to the waitlist. Please call us at (573) 206-9499.' },
        { status: 500 }
      )
    }

    const emailDetails = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      eventName: data.eventName,
      eventDate: data.eventDate,
      eventTime: data.eventTime || null,
      venueName: data.venueName || null,
      rideTypeLabel: data.rideTypeLabel,
      partySize: data.partySize,
      pickupLocation: data.pickupLocation || null,
      dropoffLocation: data.dropoffLocation || null,
      desiredPickupTime: data.desiredPickupTime || null,
      notes: data.notes || null,
    }

    const [confirmationSent, adminNotificationSent] = await Promise.all([
      sendEventWaitlistConfirmation(emailDetails),
      sendEventWaitlistAdminNotification(emailDetails),
    ])

    if (!confirmationSent) {
      console.error('Event waitlist confirmation email failed for:', data.email)
    }
    if (!adminNotificationSent) {
      console.error('Event waitlist admin notification failed for:', data.email)
    }

    return NextResponse.json(
      {
        message:
          "You're on the waitlist. We sent a confirmation email and will reach out if availability opens.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Event waitlist submission error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

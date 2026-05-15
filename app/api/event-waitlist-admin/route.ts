import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import { getTodayCentralDateString } from '@/lib/event-waitlist'

type AdminRequest =
  | { action: 'auth'; password: string }
  | { action: 'list_entries'; password: string; includePast?: boolean }
  | { action: 'delete_entry'; password: string; id: string }

function checkAuth(password: string): boolean {
  const expected = process.env.EVENT_WAITLIST_ADMIN_PASSWORD || process.env.GIVEAWAY_ADMIN_PASSWORD
  if (!expected) {
    console.error('EVENT_WAITLIST_ADMIN_PASSWORD or GIVEAWAY_ADMIN_PASSWORD not set')
    return false
  }
  return password === expected
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdminRequest

    if (!body || typeof body !== 'object' || !('password' in body)) {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 })
    }

    if (!checkAuth(body.password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    if (body.action === 'auth') {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (body.action === 'list_entries') {
      const supabase = getSupabaseServerClient()
      let query = supabase
        .from('event_waitlist_entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (!body.includePast) {
        query = query.or(`event_date_iso.gte.${getTodayCentralDateString()},event_date_iso.is.null`)
      }

      const { data, error } = await query

      if (error) throw error

      return NextResponse.json({ entries: data || [] }, { status: 200 })
    }

    if (body.action === 'delete_entry') {
      if (!body.id) {
        return NextResponse.json({ error: 'Missing waitlist entry ID' }, { status: 400 })
      }

      const supabase = getSupabaseServerClient()
      const { error } = await supabase
        .from('event_waitlist_entries')
        .delete()
        .eq('id', body.id)

      if (error) throw error

      return NextResponse.json({ ok: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Event waitlist admin error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

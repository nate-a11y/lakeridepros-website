import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import { giveawayEntrySchema } from '@/lib/validation/giveaways';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

interface EntryBody {
  _honeypot?: string;
  _timestamp?: number;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const ip = getClientIp(request);
    const { success } = rateLimit(`giveaway-enter:${ip}`, { limit: 5, windowMs: 60000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body: EntryBody = await request.json();

    if (body._honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    if (typeof body._timestamp === 'number') {
      const elapsed = Date.now() - body._timestamp;
      if (elapsed < 2000) {
        return NextResponse.json(
          { error: 'Please take your time to fill out the form' },
          { status: 400 }
        );
      }
    }

    const parsed = giveawayEntrySchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data: giveaway, error: giveawayErr } = await supabase
      .from('giveaways')
      .select('*')
      .eq('slug', slug)
      .single();

    if (giveawayErr || !giveaway) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    if (!giveaway.active) {
      return NextResponse.json({ error: 'This giveaway is not currently accepting entries.' }, { status: 400 });
    }

    const now = Date.now();
    if (now < new Date(giveaway.start_date).getTime()) {
      return NextResponse.json({ error: 'This giveaway has not started yet.' }, { status: 400 });
    }
    if (now > new Date(giveaway.end_date).getTime()) {
      return NextResponse.json({ error: 'This giveaway has ended.' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();

    const { data: existing } = await supabase
      .from('giveaway_entries')
      .select('id')
      .eq('giveaway_id', giveaway.id)
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'This email has already been entered for this giveaway.' },
        { status: 400 }
      );
    }

    const hasUsed = parsed.data.has_used_service;
    const hasApp = hasUsed ? (parsed.data.has_app ?? false) : null;

    const { data: entry, error: insertErr } = await supabase
      .from('giveaway_entries')
      .insert({
        giveaway_id: giveaway.id,
        name: parsed.data.name,
        email,
        phone: parsed.data.phone,
        address_line1: parsed.data.address_line1,
        address_line2: parsed.data.address_line2 || null,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        has_used_service: hasUsed,
        has_app: hasApp,
        knows_apple_music: parsed.data.knows_apple_music,
        knows_spotify: parsed.data.knows_spotify,
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Giveaway entry insert error:', insertErr);
      return NextResponse.json(
        { error: 'Failed to save entry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "You're entered. Good luck!", id: entry?.id },
      { status: 200 }
    );
  } catch (err) {
    console.error('Giveaway entry error:', err);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

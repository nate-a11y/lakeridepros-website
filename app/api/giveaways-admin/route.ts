import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import { giveawayUpsertSchema } from '@/lib/validation/giveaways';

type AdminAction =
  | { action: 'auth'; password: string }
  | { action: 'list_giveaways'; password: string }
  | { action: 'create_giveaway'; password: string; data: unknown }
  | { action: 'update_giveaway'; password: string; id: string; data: unknown }
  | { action: 'delete_giveaway'; password: string; id: string }
  | { action: 'list_entries'; password: string; giveaway_id: string }
  | { action: 'select_winner'; password: string; giveaway_id: string }
  | { action: 'clear_winner'; password: string; giveaway_id: string };

function checkAuth(password: string): boolean {
  const expected = process.env.GIVEAWAY_ADMIN_PASSWORD;
  if (!expected) {
    console.error('GIVEAWAY_ADMIN_PASSWORD not set');
    return false;
  }
  return password === expected;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdminAction;

    if (!body || typeof body !== 'object' || !('password' in body)) {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 });
    }

    if (!checkAuth(body.password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    switch (body.action) {
      case 'auth': {
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      case 'list_giveaways': {
        const { data: giveaways, error } = await supabase
          .from('giveaways')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const ids = (giveaways || []).map((g) => g.id);
        const counts: Record<string, number> = {};

        if (ids.length > 0) {
          const { data: entries, error: entriesErr } = await supabase
            .from('giveaway_entries')
            .select('giveaway_id')
            .in('giveaway_id', ids);

          if (entriesErr) throw entriesErr;
          for (const e of entries || []) {
            counts[e.giveaway_id] = (counts[e.giveaway_id] || 0) + 1;
          }
        }

        const enriched = (giveaways || []).map((g) => ({
          ...g,
          entry_count: counts[g.id] || 0,
        }));

        return NextResponse.json({ giveaways: enriched }, { status: 200 });
      }

      case 'create_giveaway': {
        const parsed = giveawayUpsertSchema.safeParse(body.data);
        if (!parsed.success) {
          const errors = parsed.error.issues.map((i) => i.message).join(', ');
          return NextResponse.json({ error: errors }, { status: 400 });
        }

        const { data, error } = await supabase
          .from('giveaways')
          .insert({
            slug: parsed.data.slug,
            title: parsed.data.title,
            description: parsed.data.description || null,
            prize_description: parsed.data.prize_description || null,
            social_post_url: parsed.data.social_post_url || null,
            start_date: parsed.data.start_date,
            end_date: parsed.data.end_date,
            active: parsed.data.active,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return NextResponse.json(
              { error: 'A giveaway with this slug already exists.' },
              { status: 400 }
            );
          }
          throw error;
        }

        return NextResponse.json({ giveaway: data }, { status: 200 });
      }

      case 'update_giveaway': {
        const parsed = giveawayUpsertSchema.safeParse(body.data);
        if (!parsed.success) {
          const errors = parsed.error.issues.map((i) => i.message).join(', ');
          return NextResponse.json({ error: errors }, { status: 400 });
        }

        const { data, error } = await supabase
          .from('giveaways')
          .update({
            slug: parsed.data.slug,
            title: parsed.data.title,
            description: parsed.data.description || null,
            prize_description: parsed.data.prize_description || null,
            social_post_url: parsed.data.social_post_url || null,
            start_date: parsed.data.start_date,
            end_date: parsed.data.end_date,
            active: parsed.data.active,
          })
          .eq('id', body.id)
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return NextResponse.json(
              { error: 'A giveaway with this slug already exists.' },
              { status: 400 }
            );
          }
          throw error;
        }

        return NextResponse.json({ giveaway: data }, { status: 200 });
      }

      case 'delete_giveaway': {
        const { error } = await supabase
          .from('giveaways')
          .delete()
          .eq('id', body.id);

        if (error) throw error;
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      case 'list_entries': {
        const { data, error } = await supabase
          .from('giveaway_entries')
          .select('*')
          .eq('giveaway_id', body.giveaway_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ entries: data || [] }, { status: 200 });
      }

      case 'select_winner': {
        // Clear any existing winner first, then pick a fresh random one in the DB.
        await supabase
          .from('giveaway_entries')
          .update({ is_winner: false, winner_selected_at: null })
          .eq('giveaway_id', body.giveaway_id)
          .eq('is_winner', true);

        const { data: entries, error: entriesErr } = await supabase
          .from('giveaway_entries')
          .select('id')
          .eq('giveaway_id', body.giveaway_id);

        if (entriesErr) throw entriesErr;
        if (!entries || entries.length === 0) {
          return NextResponse.json(
            { error: 'No entries to choose from.' },
            { status: 400 }
          );
        }

        const winnerIdx = Math.floor(Math.random() * entries.length);
        const winnerId = entries[winnerIdx].id;

        const { data: winner, error: winnerErr } = await supabase
          .from('giveaway_entries')
          .update({
            is_winner: true,
            winner_selected_at: new Date().toISOString(),
          })
          .eq('id', winnerId)
          .select()
          .single();

        if (winnerErr) throw winnerErr;
        return NextResponse.json({ winner }, { status: 200 });
      }

      case 'clear_winner': {
        const { error } = await supabase
          .from('giveaway_entries')
          .update({ is_winner: false, winner_selected_at: null })
          .eq('giveaway_id', body.giveaway_id)
          .eq('is_winner', true);

        if (error) throw error;
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Giveaways admin error:', err);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

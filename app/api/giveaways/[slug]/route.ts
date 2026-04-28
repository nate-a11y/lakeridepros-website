import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';

// Public: fetch a single giveaway by slug. Returns 404 if not found,
// inactive, or outside the start/end date window.
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('giveaways')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Giveaway not found' }, { status: 404 });
    }

    const now = Date.now();
    const start = new Date(data.start_date).getTime();
    const end = new Date(data.end_date).getTime();

    const status: 'upcoming' | 'open' | 'closed' | 'inactive' = !data.active
      ? 'inactive'
      : now < start
        ? 'upcoming'
        : now > end
          ? 'closed'
          : 'open';

    return NextResponse.json({ giveaway: data, status }, { status: 200 });
  } catch (err) {
    console.error('Error fetching giveaway:', err);
    return NextResponse.json({ error: 'Failed to fetch giveaway' }, { status: 500 });
  }
}

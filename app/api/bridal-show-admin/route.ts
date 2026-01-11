import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';

interface AdminRequest {
  password: string;
}

// POST endpoint for admin page to authenticate and retrieve registrations
export async function POST(request: NextRequest) {
  try {
    const body: AdminRequest = await request.json();

    // Check password from environment variable
    const expectedPassword = process.env.BRIDAL_SHOW_ADMIN_PASSWORD;
    if (!expectedPassword || body.password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('bridal_show_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch registrations.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrations: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

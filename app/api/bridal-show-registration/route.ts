import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client';
import { bridalShowRegistrationSchema } from '@/lib/validation/bridal-show';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

interface BridalShowFormData {
  name: string;
  email: string;
  phone: string;
  transportation_needs: string;
  _honeypot?: string;
  _timestamp?: number;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`bridal-show:${ip}`, { limit: 5, windowMs: 60000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      );
    }

    const body: BridalShowFormData = await request.json();

    // Anti-bot validation: Check honeypot field
    if (body._honeypot) {
      console.log('Bot detected: honeypot field filled');
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Anti-bot validation: Check submission timing (must be at least 2 seconds)
    if (body._timestamp) {
      const timeSinceLoad = Date.now() - body._timestamp;
      if (timeSinceLoad < 2000) {
        console.log('Bot detected: form submitted too quickly');
        return NextResponse.json(
          { error: 'Please take your time to fill out the form' },
          { status: 400 }
        );
      }
    }

    // Validate with Zod schema
    const validationResult = bridalShowRegistrationSchema.safeParse({
      name: body.name,
      email: body.email,
      phone: body.phone,
      transportation_needs: body.transportation_needs,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }

    // Get Supabase client
    const supabase = getSupabaseServerClient();

    // Check for duplicate email submissions
    const { data: existingEntry } = await supabase
      .from('bridal_show_registrations')
      .select('id')
      .eq('email', validationResult.data.email.toLowerCase())
      .single();

    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email has already been registered for the giveaway.' },
        { status: 400 }
      );
    }

    // Insert the registration
    const { data, error } = await supabase
      .from('bridal_show_registrations')
      .insert({
        name: validationResult.data.name,
        email: validationResult.data.email.toLowerCase(),
        phone: validationResult.data.phone,
        transportation_needs: validationResult.data.transportation_needs,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save registration. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful! You have been entered to win.',
        id: data?.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bridal show registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin page to retrieve all registrations
export async function GET(request: NextRequest) {
  try {
    // Simple auth check using a query parameter (in production, use proper auth)
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');

    // Check admin key from environment variable
    const expectedKey = process.env.BRIDAL_SHOW_ADMIN_KEY;
    if (!expectedKey || adminKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getTrustedSiteOrigin } from '@/lib/chargebee/site-origin'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

const requestSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
})

const GENERIC_MESSAGE =
  'If that email belongs to an active Insider membership, a secure sign-in link is on the way.'

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase service environment variables')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase auth environment variables')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function hasActiveMembership(email: string) {
  const supabase = createServiceClient()
  const { data: owner, error: ownerError } = await supabase
    .from('insider_members')
    .select('id')
    .eq('is_active', true)
    .ilike('email', email)
    .limit(1)
    .maybeSingle()

  if (ownerError) throw ownerError
  if (owner) return true

  const { data: rider, error: riderError } = await supabase
    .from('insider_riders')
    .select('id, insider_members!inner(is_active)')
    .eq('is_active', true)
    .ilike('email', email)
    .eq('insider_members.is_active', true)
    .limit(1)
    .maybeSingle()

  // The normalized riders table is introduced by the Insider platform
  // migration. Before that migration exists, owner-email login still works.
  if (riderError?.code === '42P01') return false
  if (riderError) throw riderError
  return Boolean(rider)
}

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  const emailHash = createHash('sha256').update(parsed.data.email).digest('hex')
  const ip = getClientIp(request)
  const limiter = rateLimit(`insider-magic-link:${ip}:${emailHash}`, {
    limit: 4,
    windowMs: 15 * 60 * 1000,
  })

  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many sign-in attempts. Please try again shortly.' },
      { status: 429 },
    )
  }

  try {
    if (await hasActiveMembership(parsed.data.email)) {
      const auth = createAuthClient()
      const redirectTo = new URL(
        '/insiders/auth/callback',
        getTrustedSiteOrigin(request),
      )
      const { error } = await auth.auth.signInWithOtp({
        email: parsed.data.email,
        options: {
          emailRedirectTo: redirectTo.toString(),
          shouldCreateUser: true,
          data: {
            account_type: 'insider',
          },
        },
      })

      if (error) throw error
    }

    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Insider magic-link request failed', error)
    return NextResponse.json(
      { error: 'We could not send a sign-in link. Please try again.' },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'

const endpointSchema = z.string().url().max(4096)
const subscriptionSchema = z.object({
  subscription: z.object({
    endpoint: endpointSchema,
    expirationTime: z.number().nullable().optional(),
    keys: z.object({
      p256dh: z.string().min(1).max(1024),
      auth: z.string().min(1).max(1024),
    }),
  }),
  userAgent: z.string().max(1000).optional(),
  platform: z.string().max(200).optional(),
})
const deleteSchema = z.object({ endpoint: endpointSchema })

async function authenticatedInsider() {
  const supabase = await createInsiderServerClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  const userId = typeof claims?.sub === 'string' ? claims.sub : null
  const email = typeof claims?.email === 'string' ? claims.email : null

  if (claimsError || !userId) return null

  const { data: dashboard, error } = await supabase.rpc(
    'get_my_insider_dashboard',
  )
  if (error || !dashboard) return null

  return { userId, email }
}

function adminClient() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase server configuration')

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function POST(request: Request) {
  const parsed = subscriptionSchema.safeParse(
    await request.json().catch(() => null),
  )
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'The browser notification subscription was invalid.' },
      { status: 400 },
    )
  }

  const insider = await authenticatedInsider()
  if (!insider) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  const admin = adminClient()
  const endpoint = parsed.data.subscription.endpoint
  const { data: existing, error: existingError } = await admin
    .from('fcm_tokens')
    .select('user_id')
    .eq('token', endpoint)
    .maybeSingle()

  if (existingError) {
    console.error('Unable to inspect Insider push subscription', existingError)
    return NextResponse.json(
      { error: 'We could not connect browser notifications.' },
      { status: 500 },
    )
  }
  if (existing?.user_id && existing.user_id !== insider.userId) {
    return NextResponse.json(
      { error: 'This browser notification subscription is already in use.' },
      { status: 409 },
    )
  }

  const { error } = await admin.from('fcm_tokens').upsert(
    {
      token: endpoint,
      user_id: insider.userId,
      user_email: insider.email,
      token_source: 'web-push',
      device_info: {
        subscription: parsed.data.subscription,
        userAgent: parsed.data.userAgent,
        platform: parsed.data.platform,
        audience: 'insider-rewards',
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'token' },
  )

  if (error) {
    console.error('Unable to save Insider push subscription', error)
    return NextResponse.json(
      { error: 'We could not connect browser notifications.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'The browser notification subscription was invalid.' },
      { status: 400 },
    )
  }

  const insider = await authenticatedInsider()
  if (!insider) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  const { error } = await adminClient()
    .from('fcm_tokens')
    .delete()
    .eq('token', parsed.data.endpoint)
    .eq('user_id', insider.userId)
    .eq('token_source', 'web-push')

  if (error) {
    console.error('Unable to remove Insider push subscription', error)
    return NextResponse.json(
      { error: 'We could not turn off browser notifications.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true })
}

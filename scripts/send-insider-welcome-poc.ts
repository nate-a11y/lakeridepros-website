import nextEnv from '@next/env'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { writeFileSync } from 'node:fs'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const CONFIRMATION = 'SEND-SHERRY-WELCOME-POC'
const confirmation = process.argv.find((value) => value.startsWith('--confirm='))
const prepareOnly = process.argv.includes('--prepare-only')

if (!prepareOnly && confirmation !== `--confirm=${CONFIRMATION}`) {
  throw new Error(`Pass --confirm=${CONFIRMATION} to send the proof email`)
}

async function main() {
  const [
    { buildInsiderWelcomeEmail },
    { createInsiderWelcomeToken },
    { getInsiderWelcomeProfileFromClient },
  ] = await Promise.all([
    import('../lib/insiders/welcome'),
    import('../lib/insiders/welcome-link'),
    import('../lib/insiders/welcome'),
  ])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  if (!supabaseUrl || !serviceKey || !resendKey) {
    throw new Error('Supabase and Resend server credentials are required')
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: members, error } = await supabase
    .from('insider_members')
    .select('id,name,created_at,joined_at,is_active')
    .ilike('name', 'Sherry Grabow')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(2)

  if (error) throw error
  if (!members || members.length !== 1) {
    throw new Error(
      `Expected exactly one active Sherry Grabow membership; found ${members?.length || 0}`,
    )
  }

  const profile = await getInsiderWelcomeProfileFromClient(
    supabase as never,
    members[0].id,
  )
  if (!profile) throw new Error('Sherry Grabow welcome profile is unavailable')

  const token = createInsiderWelcomeToken(profile.memberId, {
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  const siteUrl = (
    process.env.INSIDERS_WELCOME_POC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.lakeridepros.com'
  ).replace(/\/$/, '')
  const welcomeUrl = `${siteUrl}/insiders/welcome/${token}`
  const message = buildInsiderWelcomeEmail(profile, welcomeUrl)

  if (prepareOnly) {
    writeFileSync('/private/tmp/insider-welcome-poc-url.txt', welcomeUrl, {
      mode: 0o600,
    })
    console.log(
      JSON.stringify({
        prepared: true,
        memberName: profile.name,
        membershipType: profile.membershipType,
        tier: profile.tier,
        joinedAt: profile.joinedAt,
      }),
    )
    return
  }

  const resend = new Resend(resendKey)
  const { data, error: sendError } = await resend.emails.send(
    {
      from:
        process.env.INSIDERS_EMAIL_FROM ||
        'Lake Ride Pros Insider Rewards <contactus@updates.lakeridepros.com>',
      replyTo: 'contactus@lakeridepros.com',
      to: 'nate@lakeridepros.com',
      cc: 'contactus@lakeridepros.com',
      subject: `[PROOF] ${message.subject}`,
      text: message.text,
      html: message.html,
      tags: [
        { name: 'audience', value: 'internal_proof' },
        { name: 'message', value: 'insider_welcome' },
      ],
    },
    {
      idempotencyKey: `insider-welcome-proof/${profile.memberId}/2026-08-04`,
    },
  )

  if (sendError) throw new Error(sendError.message)
  console.log(
    JSON.stringify({
      sent: true,
      emailId: data?.id || null,
      memberName: profile.name,
      membershipType: profile.membershipType,
      tier: profile.tier,
      to: 'nate@lakeridepros.com',
      cc: 'contactus@lakeridepros.com',
      welcomeUrl,
    }),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

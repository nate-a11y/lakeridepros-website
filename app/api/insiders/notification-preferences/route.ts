import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'
import type { InsiderNotificationPreferences } from '@/lib/insiders/types'

const requestSchema = z.object({
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  smsPhone: z.string().trim().max(30).nullable().optional(),
  categoryPreferences: z.object({
    program: z.boolean(),
    event: z.boolean(),
    perk: z.boolean(),
    billing: z.boolean(),
    account: z.boolean(),
  }),
  smsConsent: z.boolean(),
})

interface PreferenceRpcRow {
  email_address: string | null
  sms_phone: string | null
  email_enabled: boolean
  push_enabled: boolean
  sms_enabled: boolean
  category_preferences: InsiderNotificationPreferences['categoryPreferences']
  sms_consent_at: string | null
}

function toPreferences(row: PreferenceRpcRow): InsiderNotificationPreferences {
  return {
    emailAddress: row.email_address,
    smsPhone: row.sms_phone,
    emailEnabled: row.email_enabled,
    pushEnabled: row.push_enabled,
    smsEnabled: row.sms_enabled,
    categoryPreferences: row.category_preferences,
    smsConsentAt: row.sms_consent_at,
  }
}

function customerFacingError(message: string | undefined) {
  const normalized = message?.toLowerCase() || ''
  if (normalized.includes('consent')) {
    return 'Confirm text message consent before enabling texts.'
  }
  if (normalized.includes('phone')) {
    return 'Enter a valid mobile phone number for text messages.'
  }
  if (normalized.includes('membership')) {
    return 'Your Insider membership could not be confirmed. Please sign in again.'
  }
  return 'We could not save your notification settings. Please try again.'
}

export async function PUT(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check your notification settings and try again.' },
      { status: 400 },
    )
  }

  const supabase = await createInsiderServerClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  if (claimsError || !claimsData?.claims) {
    return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })
  }

  const { data, error } = await supabase.rpc(
    'update_my_insider_notification_preferences',
    {
      target_email_enabled: parsed.data.emailEnabled,
      target_push_enabled: parsed.data.pushEnabled,
      target_sms_enabled: parsed.data.smsEnabled,
      target_sms_phone: parsed.data.smsPhone || null,
      target_category_preferences: parsed.data.categoryPreferences,
      target_sms_consent: parsed.data.smsConsent,
    },
  )

  const row = Array.isArray(data) ? data[0] : data
  if (error || !row) {
    console.error('Unable to update Insider notification preferences', error)
    return NextResponse.json(
      {
        error: customerFacingError(error?.message),
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    preferences: toPreferences(row as PreferenceRpcRow),
  })
}

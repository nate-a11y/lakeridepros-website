'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { isInsiderDemoMode } from '@/lib/insiders/demo'
import { INSIDER_TERMS_VERSION } from '@/lib/insiders/constants'
import { requireInsiderDashboard } from '@/lib/insiders/server'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'

const requestSchema = z.object({
  requestType: z.enum([
    'priority_waitlist',
    'booking_assistance',
    'flex_credit',
    'guest_savings_pass',
    'account_support',
    'other',
  ]),
  subject: z.string().trim().min(3).max(120),
  details: z.string().trim().max(2000).optional(),
  tripConf: z.string().trim().max(50).optional(),
})

const riderSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    role: z.string().trim().max(60).optional(),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase())
      .optional()
      .or(z.literal('')),
    phone: z.string().trim().max(30).optional(),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: 'Email or phone is required',
  })

export async function signOutInsider() {
  const supabase = await createInsiderServerClient()
  await supabase.auth.signOut()
  redirect('/insiders/login')
}

export async function createInsiderRequest(formData: FormData) {
  const parsed = requestSchema.safeParse({
    requestType: formData.get('requestType'),
    subject: formData.get('subject'),
    details: formData.get('details') || undefined,
    tripConf: formData.get('tripConf') || undefined,
  })

  if (!parsed.success) {
    redirect('/insiders/account?request=invalid')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/account?request=submitted')
  }

  const { dashboard, claims, supabase } = await requireInsiderDashboard()
  const { error } = await supabase.from('insider_requests').insert({
    member_id: dashboard.member.id,
    requested_by: claims.sub,
    request_type: parsed.data.requestType,
    subject: parsed.data.subject,
    details: parsed.data.details || null,
    trip_conf: parsed.data.tripConf || null,
    status: 'submitted',
  })

  if (error) {
    console.error('Unable to submit Insider request', error)
    redirect('/insiders/account?request=error')
  }

  revalidatePath('/insiders/account')
  redirect('/insiders/account?request=submitted')
}

export async function cancelInsiderRequest(formData: FormData) {
  const requestId = z.string().uuid().safeParse(formData.get('requestId'))
  if (!requestId.success) {
    redirect('/insiders/account?request=invalid')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/account?request=cancelled')
  }

  const supabase = await createInsiderServerClient()
  const { data, error } = await supabase.rpc('cancel_my_insider_request', {
    request_id: requestId.data,
  })

  if (error || !data) {
    console.error('Unable to cancel Insider request', error)
    redirect('/insiders/account?request=cancel_error')
  }

  revalidatePath('/insiders/account')
  redirect('/insiders/account?request=cancelled')
}

export async function requestInsiderPerk(formData: FormData) {
  const perkId = z.string().uuid().safeParse(formData.get('perkId'))
  if (!perkId.success) {
    redirect('/insiders/perks?request=invalid')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/perks?request=submitted')
  }

  const { dashboard, supabase } = await requireInsiderDashboard()
  const { data: perk, error: perkError } = await supabase
    .from('insider_perks')
    .select('id, eligible_tiers')
    .eq('id', perkId.data)
    .maybeSingle()

  if (
    perkError ||
    !perk ||
    !Array.isArray(perk.eligible_tiers) ||
    !perk.eligible_tiers.includes(dashboard.tier)
  ) {
    redirect('/insiders/perks?request=unavailable')
  }

  const { error } = await supabase.from('insider_perk_redemptions').insert({
    perk_id: perk.id,
    member_id: dashboard.member.id,
    status: 'requested',
  })

  if (error) {
    console.error('Unable to request Insider perk', error)
    redirect('/insiders/perks?request=error')
  }

  revalidatePath('/insiders/perks')
  redirect('/insiders/perks?request=submitted')
}

export async function markInsiderNotificationRead(formData: FormData) {
  const notificationId = z
    .string()
    .uuid()
    .safeParse(formData.get('notificationId'))
  if (!notificationId.success) return
  if (isInsiderDemoMode()) return

  const supabase = await createInsiderServerClient()
  await supabase.rpc('mark_my_insider_notification_read', {
    target_notification_id: notificationId.data,
  })
  revalidatePath('/insiders/events')
}

export async function acceptInsiderTerms(formData: FormData) {
  if (formData.get('acceptTerms') !== 'yes') {
    redirect('/insiders/account?terms=required')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/account?terms=accepted')
  }

  const { supabase } = await requireInsiderDashboard()
  const { data, error } = await supabase.rpc('accept_my_insider_terms', {
    target_terms_version: INSIDER_TERMS_VERSION,
  })

  if (error || !data) {
    console.error('Unable to accept Insider terms', error)
    redirect('/insiders/account?terms=error')
  }

  revalidatePath('/insiders')
  revalidatePath('/insiders/account')
  redirect('/insiders/account?terms=accepted')
}

export async function addInsiderRider(formData: FormData) {
  const parsed = riderSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role') || undefined,
    email: formData.get('email') || undefined,
    phone: formData.get('phone') || undefined,
  })
  if (!parsed.success) {
    redirect('/insiders/account?rider=invalid')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/account?rider=added')
  }

  const { supabase } = await requireInsiderDashboard()
  const { error } = await supabase.rpc('add_my_insider_rider', {
    rider_name: parsed.data.name,
    rider_email: parsed.data.email || null,
    rider_phone: parsed.data.phone || null,
    rider_role: parsed.data.role || 'Approved rider',
  })
  if (error) {
    console.error('Unable to add Insider rider', error)
    const status = error.message.toLowerCase().includes('limit')
      ? 'limit'
      : error.message.toLowerCase().includes('another membership')
        ? 'duplicate'
        : 'error'
    redirect(`/insiders/account?rider=${status}`)
  }

  revalidatePath('/insiders')
  revalidatePath('/insiders/account')
  redirect('/insiders/account?rider=added')
}

export async function removeInsiderRider(formData: FormData) {
  const riderId = z.string().uuid().safeParse(formData.get('riderId'))
  if (!riderId.success) {
    redirect('/insiders/account?rider=invalid')
  }
  if (isInsiderDemoMode()) {
    redirect('/insiders/account?rider=removed')
  }

  const { supabase } = await requireInsiderDashboard()
  const { data, error } = await supabase.rpc('remove_my_insider_rider', {
    target_rider_id: riderId.data,
  })
  if (error || !data) {
    console.error('Unable to remove Insider rider', error)
    redirect('/insiders/account?rider=error')
  }

  revalidatePath('/insiders')
  revalidatePath('/insiders/account')
  redirect('/insiders/account?rider=removed')
}

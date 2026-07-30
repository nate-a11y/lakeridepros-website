import { NextResponse } from 'next/server'
import { isChargebeeManagementEnabled } from '@/lib/chargebee/management-mode'
import { createExistingSubscriptionPricingPageSession } from '@/lib/chargebee/pricing-page'
import { getTrustedSiteOrigin } from '@/lib/chargebee/site-origin'
import { isInsiderDemoMode } from '@/lib/insiders/demo'
import type { InsiderDashboard } from '@/lib/insiders/types'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'

function accountRedirect(request: Request, status: string) {
  return NextResponse.redirect(
    new URL(
      `/insiders/account?billing=${status}`,
      getTrustedSiteOrigin(request),
    ),
    303,
  )
}

export async function POST(request: Request) {
  if (!isChargebeeManagementEnabled()) {
    return accountRedirect(request, 'unavailable')
  }

  if (isInsiderDemoMode()) {
    return accountRedirect(request, 'preview')
  }

  const supabase = await createInsiderServerClient()
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims()
  if (claimsError || !claimsData?.claims) {
    return NextResponse.redirect(
      new URL('/insiders/login', getTrustedSiteOrigin(request)),
      303,
    )
  }

  const { data, error } = await supabase.rpc('get_my_insider_dashboard')
  if (error || !data) {
    return accountRedirect(request, 'syncing')
  }

  const dashboard = data as unknown as InsiderDashboard
  if (dashboard.member.accessRole !== 'owner') {
    return accountRedirect(request, 'owner_required')
  }

  const subscriptionId = dashboard.subscription?.chargebee_subscription_id
  if (!subscriptionId) {
    return accountRedirect(request, 'syncing')
  }

  try {
    const session = await createExistingSubscriptionPricingPageSession({
      subscriptionId,
      redirectUrl: new URL(
        '/insiders/account?billing=updated',
        getTrustedSiteOrigin(request),
      ).toString(),
    })

    return NextResponse.redirect(session.url, 303)
  } catch (error) {
    console.error('Unable to create Chargebee pricing-page session', error)
    return accountRedirect(request, 'error')
  }
}

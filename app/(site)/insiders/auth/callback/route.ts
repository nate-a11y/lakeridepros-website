import { NextRequest, NextResponse } from 'next/server'
import { getTrustedSiteOrigin } from '@/lib/chargebee/site-origin'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'

function safeNextPath(value: string | null) {
  if (
    !value ||
    (value !== '/insiders' && !value.startsWith('/insiders/'))
  ) {
    return '/insiders'
  }
  return value
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = safeNextPath(request.nextUrl.searchParams.get('next'))
  const siteOrigin = getTrustedSiteOrigin(request)
  const loginUrl = new URL('/insiders/login', siteOrigin)

  if (!code) {
    loginUrl.searchParams.set('error', 'invalid_link')
    return NextResponse.redirect(loginUrl)
  }

  const supabase = await createInsiderServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    loginUrl.searchParams.set('error', 'expired_link')
    return NextResponse.redirect(loginUrl)
  }

  // The auth trigger links most first-time users synchronously. This
  // authenticated fallback also repairs identities created before the Insider
  // migration and fails closed when an email matches zero or multiple accounts.
  const { data: membershipLink, error: membershipLinkError } =
    await supabase.rpc('link_my_insider_membership')

  if (membershipLinkError || !membershipLink) {
    await supabase.auth.signOut()
    loginUrl.searchParams.set('error', 'membership_not_linked')
    return NextResponse.redirect(loginUrl)
  }

  const { data, error: dashboardError } = await supabase.rpc(
    'get_my_insider_dashboard',
  )

  if (dashboardError || !data) {
    await supabase.auth.signOut()
    loginUrl.searchParams.set('error', 'membership_not_linked')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL(next, siteOrigin))
}

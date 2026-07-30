import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createInsiderServerClient } from '@/lib/supabase/auth-server'
import type { InsiderDashboard } from '@/lib/insiders/types'
import {
  DEMO_INSIDER_DASHBOARD,
  isInsiderDemoMode,
} from '@/lib/insiders/demo'

export const requireInsiderDashboard = cache(async () => {
  const supabase = await createInsiderServerClient()

  if (isInsiderDemoMode()) {
    return {
      supabase,
      claims: { sub: '00000000-0000-4000-8000-000000000001' },
      dashboard: DEMO_INSIDER_DASHBOARD,
      isDemo: true,
    }
  }

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (claimsError || !claimsData?.claims) {
    redirect('/insiders/login')
  }

  const { data, error } = await supabase.rpc('get_my_insider_dashboard')

  if (error) {
    throw new Error(`Unable to load Insider dashboard: ${error.message}`)
  }

  if (!data) {
    redirect('/insiders/login?error=membership_not_linked')
  }

  return {
    supabase,
    claims: claimsData.claims,
    dashboard: data as unknown as InsiderDashboard,
    isDemo: false,
  }
})

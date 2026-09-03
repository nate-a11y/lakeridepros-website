'use client'

import { useEffect } from 'react'
import { detectAIReferral, storeAIReferralSource } from '@/lib/ai-referrals'
import { event } from '@/lib/gtag'

export function AIReferralTracker() {
  useEffect(() => {
    const source = detectAIReferral(window.location.search, document.referrer)
    if (!source) return

    storeAIReferralSource(source)
    event('ai_referral_visit', {
      category: 'acquisition',
      ai_referral_source: source,
      landing_page: window.location.pathname,
    })
  }, [])

  return null
}

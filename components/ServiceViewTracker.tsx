'use client'

import { useEffect } from 'react'
import { trackServiceEvent } from '@/lib/analytics'

interface ServiceViewTrackerProps {
  serviceSlug: string
}

export default function ServiceViewTracker({ serviceSlug }: ServiceViewTrackerProps) {
  useEffect(() => {
    // Track view on mount
    trackServiceEvent(serviceSlug, 'view')
  }, [serviceSlug])

  // This component doesn't render anything
  return null
}

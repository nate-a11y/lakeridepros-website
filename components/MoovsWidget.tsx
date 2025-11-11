'use client'

import { useEffect } from 'react'

export function MoovsWidget() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.moovsAPI = window.moovsAPI || []
    window.moovsAPI.push(['operator', '49dfb7de-bbdf-11ee-a55e-57f07b7dc566'])

    const script = document.createElement('script')
    script.src = 'https://static.moovs.app'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}

declare global {
  interface Window {
    moovsAPI: any[]
  }
}

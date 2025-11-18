'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function MoovsWidget() {
  const pathname = usePathname()
  const shouldHide = pathname?.startsWith('/careers')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Don't load the widget on careers pages
    if (shouldHide) return

    window.moovsAPI = window.moovsAPI || []
    window.moovsAPI.push(['operator', '49dfb7de-bbdf-11ee-a55e-57f07b7dc566'])

    const script = document.createElement('script')
    script.src = 'https://static.moovs.app'
    script.async = true
    document.head.appendChild(script)
  }, [shouldHide])

  // Hide the FAB if we navigate to a careers page after it's loaded
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hideMoovsFAB = () => {
      const selectors = [
        '[id*="moovs"]',
        '[class*="moovs"]',
        '#moovs-fab-button',
        'div[style*="position: fixed"][style*="bottom"][style*="right"]'
      ]

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          if (el instanceof HTMLElement) {
            const isLikelyFAB =
              el.tagName === 'BUTTON' ||
              el.querySelector('button') ||
              (el.style.position === 'fixed' &&
               el.style.bottom &&
               el.style.right)

            if (isLikelyFAB) {
              el.style.display = shouldHide ? 'none' : ''
            }
          }
        })
      })
    }

    hideMoovsFAB()
    const timeout = setTimeout(hideMoovsFAB, 500)

    return () => clearTimeout(timeout)
  }, [shouldHide])

  return null
}

declare global {
  interface Window {
    moovsAPI: unknown[]
  }
}

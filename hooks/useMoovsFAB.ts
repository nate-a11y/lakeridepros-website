'use client'

import { useEffect } from 'react'

export function useMoovsFAB(hide: boolean) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hideMoovsFAB = () => {
      // Find all possible Moovs FAB elements
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
            // Check if it's likely the FAB (has button-like characteristics)
            const isLikelyFAB =
              el.tagName === 'BUTTON' ||
              el.querySelector('button') ||
              (el.style.position === 'fixed' &&
               el.style.bottom &&
               el.style.right)

            if (isLikelyFAB) {
              el.style.display = hide ? 'none' : ''
            }
          }
        })
      })
    }

    // Run immediately
    hideMoovsFAB()

    // Run after a short delay (in case Moovs script loads late)
    const timeout = setTimeout(hideMoovsFAB, 500)

    return () => clearTimeout(timeout)
  }, [hide])
}

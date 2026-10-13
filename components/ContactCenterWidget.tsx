'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function ContactCenterWidget() {
  useEffect(() => {
    const applyContrast = () => {
      const shadow = document.getElementById('moovs-website-assistant')?.shadowRoot
      if (!shadow) return
      if (!shadow.querySelector('[data-lrp-contrast]')) {
        const style = document.createElement('style')
        style.dataset.lrpContrast = 'true'
        // The LRP green launcher requires dark text; page CSS cannot cross its shadow root.
        style.textContent = 'button[aria-label="Open transportation assistant"] { color: #000 !important; }'
        shadow.appendChild(style)
      }
      observer.disconnect()
    }
    const observer = new MutationObserver(applyContrast)
    observer.observe(document.body, { childList: true })
    applyContrast()
    return () => observer.disconnect()
  }, [])

  return (
    <Script
      src="https://contact-center.moovs.app/moovs-contact-center-widget.js"
      data-config-url="https://aakyuztlpgx4ll6nghevco6q7u0vxiop.lambda-url.us-east-1.on.aws/public/website-widget/b47bc1b5-99f1-4ca9-b13f-4e3b82257af8/config"
      strategy="afterInteractive"
    />
  )
}

'use client'

import Script from 'next/script'
import { useHasMounted } from '@/hooks/useHasMounted'

export function GoogleAnalytics() {
  const mounted = useHasMounted()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Prevent hydration mismatch by not rendering until after mount
  // The env var check can differ between server and client, causing React Error #418
  if (!mounted || !measurementId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

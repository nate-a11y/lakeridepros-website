'use client'

import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile'
import { useTheme } from 'next-themes'

interface TurnstileProps {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export default function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
  const { resolvedTheme } = useTheme()
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  if (!siteKey) {
    console.error('Turnstile site key not configured')
    return null
  }

  return (
    <TurnstileWidget
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        size: 'normal',
      }}
    />
  )
}

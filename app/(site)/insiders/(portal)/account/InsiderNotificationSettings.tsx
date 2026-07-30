'use client'

import { useEffect, useMemo, useState } from 'react'
import { BellRing, Mail, MessageSquareText, Smartphone } from 'lucide-react'
import type {
  InsiderNotificationCategory,
  InsiderNotificationPreferences,
} from '@/lib/insiders/types'

const CATEGORY_LABELS: Record<InsiderNotificationCategory, string> = {
  program: 'Program updates',
  event: 'Events',
  perk: 'Local perks',
  billing: 'Billing',
  account: 'Account & support',
}

function urlBase64ToUint8Array(value: string) {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  const decoded = window.atob(base64)
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0))
}

async function responseMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    error?: string
  } | null
  return body?.error || 'We could not save your notification settings.'
}

export function InsiderNotificationSettings({
  initialPreferences,
  isDemo,
}: {
  initialPreferences: InsiderNotificationPreferences
  isDemo: boolean
}) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [smsConsent, setSmsConsent] = useState(false)
  const [pushSupported, setPushSupported] = useState<boolean | null>(null)
  const [hasPushSubscription, setHasPushSubscription] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const needsSmsConsent = preferences.smsEnabled && !preferences.smsConsentAt

  const selectedCategories = useMemo(
    () => Object.values(preferences.categoryPreferences).filter(Boolean).length,
    [preferences.categoryPreferences],
  )

  useEffect(() => {
    const supported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    setPushSupported(supported)

    if (!supported) return

    void navigator.serviceWorker
      .register('/insider-push-sw.js')
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setHasPushSubscription(Boolean(subscription)))
      .catch(() => setHasPushSubscription(false))
  }, [])

  async function syncPushSubscription(enabled: boolean) {
    if (!pushSupported) {
      throw new Error('Browser notifications are not supported on this device.')
    }

    if (enabled && Notification.permission === 'denied') {
      throw new Error(
        'Browser notifications are blocked. Update this site’s notification permission in your browser settings.',
      )
    }
    if (enabled && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Browser notification permission was not granted.')
      }
    }

    const registration = await navigator.serviceWorker.register(
      '/insider-push-sw.js',
    )
    let subscription = await registration.pushManager.getSubscription()

    if (!enabled) {
      if (subscription) {
        const response = await fetch('/api/insiders/push-subscription', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        if (!response.ok) throw new Error(await responseMessage(response))
        await subscription.unsubscribe()
      }
      setHasPushSubscription(false)
      return
    }

    if (!subscription) {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) {
        throw new Error('Browser notifications are not configured yet.')
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    const response = await fetch('/api/insiders/push-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      }),
    })
    if (!response.ok) throw new Error(await responseMessage(response))
    setHasPushSubscription(true)
  }

  async function savePreferences(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus(null)

    if (needsSmsConsent && !smsConsent) {
      setStatus({
        type: 'error',
        message: 'Confirm text message consent before enabling texts.',
      })
      return
    }

    setIsSaving(true)
    try {
      if (!isDemo && preferences.pushEnabled !== hasPushSubscription) {
        await syncPushSubscription(preferences.pushEnabled)
      }

      if (isDemo) {
        setSmsConsent(false)
        setStatus({
          type: 'success',
          message: 'Notification settings saved for this preview.',
        })
        return
      }

      const response = await fetch('/api/insiders/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailEnabled: preferences.emailEnabled,
          pushEnabled: preferences.pushEnabled,
          smsEnabled: preferences.smsEnabled,
          smsPhone: preferences.smsPhone,
          categoryPreferences: preferences.categoryPreferences,
          smsConsent,
        }),
      })
      if (!response.ok) throw new Error(await responseMessage(response))

      const body = (await response.json()) as {
        preferences: InsiderNotificationPreferences
      }
      setPreferences(body.preferences)
      setSmsConsent(false)
      setStatus({
        type: 'success',
        message: 'Your notification settings are up to date.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'We could not save your notification settings.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section
      aria-labelledby="notification-settings-heading"
      className="overflow-hidden rounded-3xl border border-primary/20 bg-[radial-gradient(circle_at_top_right,rgba(76,187,23,0.13),transparent_35%),#18181b]"
    >
      <div className="border-b border-white/10 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span className="rounded-2xl border border-primary/25 bg-primary/10 p-3 text-primary">
            <BellRing aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Stay in the loop
            </p>
            <h3
              id="notification-settings-heading"
              className="mt-1 text-2xl font-black"
            >
              Notification settings
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
              Messages always appear in your Insider account. Choose where else
              you want to hear from us.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={savePreferences} className="space-y-7 p-6 sm:p-7">
        <fieldset>
          <legend className="text-sm font-black uppercase tracking-[0.14em] text-white/55">
            Delivery
          </legend>
          <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/8 p-4">
              <div className="flex items-center gap-3">
                <BellRing aria-hidden="true" className="h-5 w-5 text-primary" />
                <p className="font-black">In your account</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/50">
                Always on, so important updates are waiting when you sign in.
              </p>
            </div>

            <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-white/20">
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 font-black">
                  <Mail aria-hidden="true" className="h-5 w-5 text-primary" />
                  Email
                </span>
                <input
                  type="checkbox"
                  checked={preferences.emailEnabled}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      emailEnabled: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-primary"
                />
              </span>
              <span className="mt-2 block break-all text-xs leading-5 text-white/50">
                {preferences.emailAddress || 'Your sign-in email'}
              </span>
            </label>

            <label
              className={`rounded-2xl border border-white/10 bg-black/25 p-4 transition ${
                pushSupported === false
                  ? 'cursor-not-allowed opacity-45'
                  : 'cursor-pointer hover:border-white/20'
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 font-black">
                  <Smartphone
                    aria-hidden="true"
                    className="h-5 w-5 text-primary"
                  />
                  Push
                </span>
                <input
                  type="checkbox"
                  checked={preferences.pushEnabled}
                  disabled={pushSupported === false}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      pushEnabled: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-primary"
                />
              </span>
              <span className="mt-2 block text-xs leading-5 text-white/50">
                {hasPushSubscription
                  ? 'Connected on this device'
                  : 'Enable alerts on this device'}
              </span>
            </label>

            <label className="cursor-pointer rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-white/20">
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 font-black">
                  <MessageSquareText
                    aria-hidden="true"
                    className="h-5 w-5 text-primary"
                  />
                  Text
                </span>
                <input
                  type="checkbox"
                  checked={preferences.smsEnabled}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      smsEnabled: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-primary"
                />
              </span>
              <span className="mt-2 block text-xs leading-5 text-white/50">
                Optional and only sent with your consent
              </span>
            </label>
          </div>
        </fieldset>

        {preferences.smsEnabled ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <label htmlFor="insiderSmsPhone" className="text-sm font-black">
              Mobile phone
            </label>
            <input
              id="insiderSmsPhone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              required
              value={preferences.smsPhone || ''}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  smsPhone: event.target.value,
                }))
              }
              className="mt-2 w-full max-w-md rounded-xl border border-white/15 bg-black px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {needsSmsConsent ? (
              <label className="mt-4 flex max-w-3xl items-start gap-3 text-xs leading-5 text-white/55">
                <input
                  type="checkbox"
                  required
                  checked={smsConsent}
                  onChange={(event) => setSmsConsent(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                />
                <span>
                  I agree to receive recurring automated Insider Rewards text
                  messages from Lake Ride Pros. Message and data rates may
                  apply. Reply STOP to opt out. Consent is not a condition of
                  purchase.
                </span>
              </label>
            ) : (
              <p className="mt-3 text-xs leading-5 text-white/60">
                Text messages are enabled for this number. Turn Text off at any
                time to opt out.
              </p>
            )}
          </div>
        ) : null}

        <fieldset>
          <legend className="text-sm font-black uppercase tracking-[0.14em] text-white/55">
            What you want to receive
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {(
              Object.keys(CATEGORY_LABELS) as InsiderNotificationCategory[]
            ).map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-white/12 bg-black/25 px-4 py-2.5 text-sm font-bold transition hover:border-white/25"
              >
                <input
                  type="checkbox"
                  checked={preferences.categoryPreferences[category]}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      categoryPreferences: {
                        ...current.categoryPreferences,
                        [category]: event.target.checked,
                      },
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                {CATEGORY_LABELS[category]}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/60">
            {selectedCategories} of {Object.keys(CATEGORY_LABELS).length}{' '}
            categories selected
          </p>
        </fieldset>

        {status ? (
          <p
            role="status"
            className={`rounded-xl border px-4 py-3 text-sm ${
              status.type === 'success'
                ? 'border-emerald-400/25 bg-emerald-950/30 text-emerald-100'
                : 'border-amber-400/25 bg-amber-950/30 text-amber-100'
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-5 py-3 font-bold text-black transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
        >
          {isSaving ? 'Saving…' : 'Save notification settings'}
        </button>
      </form>
    </section>
  )
}

'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

type WaitlistStatusEntry = {
  id: string
  created_at: string
  event_name: string
  event_date: string
  event_time: string | null
  venue_name: string | null
  ride_type_label: string
  party_size: number
  status: 'new' | 'contacted' | 'booked' | 'closed'
  queue_count: number
}

export default function EventWaitlistStatusLookup() {
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'request' | 'verify' | 'results'>('request')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<WaitlistStatusEntry[]>([])

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    setEntries([])

    try {
      const response = await fetch('/api/event-waitlist/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_code', identifier }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Could not send a code.')
      setMessage(json.message)
      setStep('verify')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not send a code.')
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/event-waitlist/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', identifier, code }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Could not verify the code.')
      setEntries(json.entries || [])
      setStep('results')
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Could not verify the code.')
    } finally {
      setLoading(false)
    }
  }

  const resetLookup = () => {
    setStep('request')
    setCode('')
    setMessage(null)
    setError(null)
    setEntries([])
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-dark-bg-secondary sm:p-8">
      {error && (
        <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
          {message}
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={requestCode} className="space-y-5">
          <div>
            <label htmlFor="waitlist-identifier" className="mb-1.5 block text-sm font-semibold text-lrp-black dark:text-white">
              Email or phone number
            </label>
            <input
              id="waitlist-identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              autoComplete="email tel"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lrp-black focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg-primary dark:text-white"
              placeholder="name@example.com or (573) 555-1234"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Sending code...' : 'Email me a code'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={verifyCode} className="space-y-5">
          <div>
            <label htmlFor="waitlist-code" className="mb-1.5 block text-sm font-semibold text-lrp-black dark:text-white">
              6-digit verification code
            </label>
            <input
              id="waitlist-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lrp-black focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg-primary dark:text-white"
              placeholder="123456"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Checking...' : 'Check my waitlist'}
            </button>
            <button
              type="button"
              onClick={resetLookup}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white dark:hover:bg-dark-bg-secondary"
            >
              Use a different email/phone
            </button>
          </div>
        </form>
      )}

      {step === 'results' && (
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-lrp-black dark:text-white">Your active waitlist entries</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Past events are hidden automatically.</p>
            </div>
            <button
              type="button"
              onClick={resetLookup}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-bold text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-white dark:hover:bg-dark-bg-secondary"
            >
              New lookup
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-700 dark:border-gray-700 dark:bg-dark-bg-primary dark:text-gray-300">
              No active waitlist entries were found for that verified email or phone. If you think this is wrong, call <a href="tel:5732069499" className="font-semibold text-primary hover:underline">(573) 206-9499</a>.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <article key={entry.id} className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-lrp-black dark:text-white">{entry.event_name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {entry.event_date}{entry.event_time ? ` at ${entry.event_time}` : ''}
                        {entry.venue_name ? ` • ${entry.venue_name}` : ''}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Vehicle: <strong>{entry.ride_type_label}</strong> • Party size: <strong>{entry.party_size}</strong>
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {entry.queue_count} on the waitlist for this event / vehicle
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-lrp-black dark:text-primary">
                      {entry.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
            Need to change something? <Link href="/contact" className="font-semibold text-primary hover:underline">Contact Lake Ride Pros</Link> or call <a href="tel:5732069499" className="font-semibold text-primary hover:underline">(573) 206-9499</a>.
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react'

export function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/insiders/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const payload = (await response.json()) as {
        message?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send sign-in link.')
      }

      setMessage(
        payload.message || 'Check your email for a secure sign-in link.',
      )
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to send sign-in link.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="insider-email"
          className="mb-2 block text-sm font-semibold text-white"
        >
          Membership email
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
          />
          <input
            id="insider-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/20 bg-white/8 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-white/60 focus:border-primary focus:ring-2 focus:ring-primary/35"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-black transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            Sending secure link
          </>
        ) : (
          <>
            Email me a magic link
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </>
        )}
      </button>

      {message ? (
        <div
          role="status"
          className="flex gap-3 rounded-xl border border-primary/35 bg-primary/10 p-4 text-sm text-white"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          />
          <p>{message}</p>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/35 bg-red-500/10 p-4 text-sm text-red-100"
        >
          {error}
        </p>
      ) : null}
    </form>
  )
}

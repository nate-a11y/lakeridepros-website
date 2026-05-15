'use client'

import { FormEvent, ReactElement, useEffect, useId, useState } from 'react'
import { X } from 'lucide-react'

export interface EventWaitlistContext {
  eventId: string
  eventName: string
  eventDate: string
  eventDateIso?: string
  eventTime?: string
  venueName?: string
  rideType: string
  rideTypeLabel: string
}

interface EventWaitlistModalProps {
  waitlist: EventWaitlistContext | null
  onClose: () => void
}

const initialForm = {
  name: '',
  email: '',
  phone: '',
  partySize: '1',
  pickupLocation: '',
  dropoffLocation: '',
  desiredPickupTime: '',
  notes: '',
  _honeypot: '',
}

const FIELD_CONTROL_CLASS =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lrp-black transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg-primary dark:text-white'

export default function EventWaitlistModal({ waitlist, onClose }: EventWaitlistModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const errorId = useId()
  const [form, setForm] = useState(initialForm)
  const [timestamp, setTimestamp] = useState<number>(() => Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!waitlist) return
    setForm(initialForm)
    setTimestamp(Date.now())
    setError(null)
    setSuccess(null)
  }, [waitlist])

  useEffect(() => {
    if (!waitlist) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, waitlist])

  if (!waitlist) return null

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/event-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...waitlist,
          ...form,
          partySize: Number(form.partySize),
          _timestamp: timestamp,
        }),
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'Could not add you to the waitlist.')
      }

      setSuccess(json.message || "You're on the waitlist.")
      setForm(initialForm)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not add you to the waitlist.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        aria-label="Close waitlist form"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-dark-bg-secondary sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close waitlist form"
          className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-white dark:hover:bg-dark-bg-primary"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="pr-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">Sold out</p>
          <h2 id={titleId} className="text-2xl font-bold text-lrp-black dark:text-white">
            Join the event waitlist
          </h2>
          <p id={descriptionId} className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Enter your trip details for {waitlist.eventName} and we&apos;ll email a confirmation. If a {waitlist.rideTypeLabel} opens up, we&apos;ll reach out.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-dark-bg-primary">
          <p className="font-semibold text-lrp-black dark:text-white">{waitlist.eventName}</p>
          <p className="text-gray-600 dark:text-gray-300">
            {waitlist.eventDate}{waitlist.eventTime ? ` at ${waitlist.eventTime}` : ''}
            {waitlist.venueName ? ` • ${waitlist.venueName}` : ''}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-300">Vehicle type: {waitlist.rideTypeLabel}</p>
        </div>

        {success ? (
          <div role="status" className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
            <p className="font-semibold">You&apos;re on the waitlist.</p>
            <p className="mt-1 text-sm">{success}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate aria-describedby={error ? errorId : undefined}>
            {error && (
              <div id={errorId} role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="hidden" aria-hidden="true">
              <label htmlFor="event-waitlist-company">Company</label>
              <input
                id="event-waitlist-company"
                type="text"
                value={form._honeypot}
                onChange={(event) => updateField('_honeypot', event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" required>
                <input
                  id="waitlist-name"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                  autoComplete="name"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Email" required>
                <input
                  id="waitlist-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  autoComplete="email"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Phone">
                <input
                  id="waitlist-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  autoComplete="tel"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Party size" required>
                <input
                  id="waitlist-party-size"
                  type="number"
                  min="1"
                  max="99"
                  value={form.partySize}
                  onChange={(event) => updateField('partySize', event.target.value)}
                  required
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Desired pickup time">
                <input
                  id="waitlist-pickup-time"
                  type="text"
                  value={form.desiredPickupTime}
                  onChange={(event) => updateField('desiredPickupTime', event.target.value)}
                  placeholder="Example: 5:30 PM"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Pickup location">
                <input
                  id="waitlist-pickup-location"
                  type="text"
                  value={form.pickupLocation}
                  onChange={(event) => updateField('pickupLocation', event.target.value)}
                  placeholder="Hotel, house, or landmark"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
              <Field label="Dropoff location">
                <input
                  id="waitlist-dropoff-location"
                  type="text"
                  value={form.dropoffLocation}
                  onChange={(event) => updateField('dropoffLocation', event.target.value)}
                  placeholder="Venue or destination"
                  className={FIELD_CONTROL_CLASS}
                />
              </Field>
            </div>

            <Field label="Anything else we should know?">
              <textarea
                id="waitlist-notes"
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                rows={4}
                className={FIELD_CONTROL_CLASS}
                placeholder="Return trip, extra stops, preferred timing, accessibility needs, etc."
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? 'Adding to waitlist...' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactElement<{ id?: string }>
}) {
  const id = children.props.id
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-lrp-black dark:text-white">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  )
}

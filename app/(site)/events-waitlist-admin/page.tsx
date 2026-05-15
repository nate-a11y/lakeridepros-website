'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { Tables } from '@/lib/supabase/database.types'

const STORAGE_KEY = 'event_waitlist_admin_pwd'

type WaitlistEntry = Tables<'event_waitlist_entries'>

export default function EventWaitlistAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)

  const callApi = useCallback(
    async (payload: Record<string, unknown>) => {
      const response = await fetch('/api/event-waitlist-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, password }),
      })
      const json = await response.json()

      if (response.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY)
        setAuthed(false)
        setAuthError('Session expired. Please log in again.')
        throw new Error('unauthorized')
      }

      if (!response.ok) {
        throw new Error(json.error || 'Request failed')
      }

      return json
    },
    [password]
  )

  const loadEntries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await callApi({ action: 'list_entries', includePast: showPast })
      setEntries(json.entries || [])
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message !== 'unauthorized') {
        setError(loadError.message)
      }
    } finally {
      setLoading(false)
    }
  }, [callApi, showPast])

  useEffect(() => {
    const storedPassword = sessionStorage.getItem(STORAGE_KEY)
    if (storedPassword) {
      setPassword(storedPassword)
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed && password) {
      loadEntries()
    }
  }, [authed, password, loadEntries])

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return entries

    return entries.filter((entry) =>
      [
        entry.name,
        entry.email,
        entry.phone,
        entry.event_name,
        entry.event_date,
        entry.event_time,
        entry.venue_name,
        entry.ride_type_label,
        entry.pickup_location,
        entry.dropoff_location,
        entry.notes,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [entries, search])

  const groupedCounts = useMemo(() => {
    return entries.reduce<Record<string, number>>((counts, entry) => {
      const key = `${entry.event_name} • ${entry.ride_type_label}`
      counts[key] = (counts[key] || 0) + 1
      return counts
    }, {})
  }, [entries])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    try {
      const response = await fetch('/api/event-waitlist-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auth', password }),
      })
      const json = await response.json()
      if (!response.ok) {
        setAuthError(json.error || 'Invalid password')
        return
      }
      sessionStorage.setItem(STORAGE_KEY, password)
      setAuthed(true)
    } catch {
      setAuthError('Network error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
    setPassword('')
    setEntries([])
    setSearch('')
    setDeletingId(null)
    setShowPast(false)
  }

  const handleDelete = async (entry: WaitlistEntry) => {
    const confirmed = confirm(
      `Remove ${entry.name} from the waitlist for ${entry.event_name} (${entry.ride_type_label})?`
    )
    if (!confirmed) return

    setDeletingId(entry.id)
    setError(null)
    try {
      await callApi({ action: 'delete_entry', id: entry.id })
      setEntries((current) => current.filter((item) => item.id !== entry.id))
    } catch (deleteError) {
      if (deleteError instanceof Error && deleteError.message !== 'unauthorized') {
        setError(deleteError.message)
      }
    } finally {
      setDeletingId(null)
    }
  }

  const getQueueCount = (entry: WaitlistEntry) => {
    const key = `${entry.event_name} • ${entry.ride_type_label}`
    return groupedCounts[key] || 0
  }

  const exportCsv = () => {
    const headers = [
      'Created',
      'Status',
      'Event',
      'Date',
      'Time',
      'Venue',
      'Vehicle Type',
      'Name',
      'Email',
      'Phone',
      'Party Size',
      'Desired Pickup Time',
      'Pickup Location',
      'Dropoff Location',
      'Notes',
    ]
    const rows = filteredEntries.map((entry) => [
      formatDateTime(entry.created_at),
      entry.status,
      entry.event_name,
      entry.event_date,
      entry.event_time || '',
      entry.venue_name || '',
      entry.ride_type_label,
      entry.name,
      entry.email,
      entry.phone || '',
      String(entry.party_size),
      entry.desired_pickup_time || '',
      entry.pickup_location || '',
      entry.dropoff_location || '',
      entry.notes || '',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `event-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-dark-bg-primary">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-dark-bg-secondary">
          <h1 className="text-3xl font-bold text-lrp-black dark:text-white">Event Waitlist Admin</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Log in to view event transportation waitlist requests.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                {authError}
              </div>
            )}
            <div>
              <label htmlFor="waitlist-admin-password" className="mb-1.5 block text-sm font-semibold text-lrp-black dark:text-white">
                Password
              </label>
              <input
                id="waitlist-admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lrp-black focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg-primary dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-dark-bg-primary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Lake Ride Pros</p>
            <h1 className="text-3xl font-bold text-lrp-black dark:text-white">Event Waitlist</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {entries.length} {showPast ? 'total' : 'active'} request{entries.length === 1 ? '' : 's'} across sold-out event vehicle types.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadEntries}
              disabled={loading}
              className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 dark:border-gray-700 dark:bg-dark-bg-secondary dark:text-white dark:hover:bg-dark-bg-primary"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={() => setShowPast((current) => !current)}
              className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-dark-bg-secondary dark:text-white dark:hover:bg-dark-bg-primary"
              aria-pressed={showPast}
            >
              {showPast ? 'Hide past events' : 'Show past events'}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredEntries.length === 0}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 font-bold text-black transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-lrp-black transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-dark-bg-secondary dark:text-white dark:hover:bg-dark-bg-primary"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <section aria-labelledby="waitlist-summary" className="mt-8 rounded-2xl bg-white p-6 shadow dark:bg-dark-bg-secondary">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="waitlist-summary" className="text-xl font-bold text-lrp-black dark:text-white">Summary</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Top event + vehicle combinations{showPast ? ', including past events.' : ' for active/upcoming events.'}
              </p>
            </div>
            <label className="block md:w-96">
              <span className="mb-1.5 block text-sm font-semibold text-lrp-black dark:text-white">Search waitlist</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, event, email, vehicle..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lrp-black focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-bg-primary dark:text-white"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedCounts).slice(0, 6).map(([label, count]) => (
              <div key={label} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-semibold text-lrp-black dark:text-white">{label}</p>
                <p className="mt-2 text-2xl font-bold text-primary">{count}</p>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">No waitlist requests yet.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="waitlist-entries" className="mt-8 overflow-hidden rounded-2xl bg-white shadow dark:bg-dark-bg-secondary">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <h2 id="waitlist-entries" className="text-xl font-bold text-lrp-black dark:text-white">Requests</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredEntries.length} request{filteredEntries.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-gray-50 text-lrp-black dark:bg-dark-bg-primary dark:text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Vehicle / Queue</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Party</th>
                  <th className="px-4 py-3 font-semibold">Trip Details</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="align-top text-lrp-black dark:text-white">
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{formatDateTime(entry.created_at)}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{entry.event_name}</p>
                      <p className="text-gray-600 dark:text-gray-300">{entry.event_date}{entry.event_time ? ` at ${entry.event_time}` : ''}</p>
                      {entry.venue_name && <p className="text-gray-600 dark:text-gray-300">{entry.venue_name}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{entry.ride_type_label}</p>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {getQueueCount(entry)} on waitlist
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{entry.name}</p>
                      <a href={`mailto:${entry.email}`} className="text-primary hover:underline">{entry.email}</a>
                      {entry.phone && <p><a href={`tel:${entry.phone}`} className="text-primary hover:underline">{entry.phone}</a></p>}
                    </td>
                    <td className="px-4 py-4">{entry.party_size}</td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      {entry.desired_pickup_time && <p><strong>Pickup time:</strong> {entry.desired_pickup_time}</p>}
                      {entry.pickup_location && <p><strong>Pickup:</strong> {entry.pickup_location}</p>}
                      {entry.dropoff_location && <p><strong>Dropoff:</strong> {entry.dropoff_location}</p>}
                      {entry.notes && <p className="mt-1 whitespace-pre-wrap"><strong>Notes:</strong> {entry.notes}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-lrp-black dark:text-primary">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
                        disabled={deletingId === entry.id}
                        className="inline-flex min-h-10 items-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:bg-dark-bg-primary dark:text-red-300 dark:hover:bg-red-900/20"
                        aria-label={`Delete ${entry.name} from the waitlist for ${entry.event_name}`}
                      >
                        {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-600 dark:text-gray-300">
                      {loading ? 'Loading waitlist requests...' : 'No waitlist requests found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

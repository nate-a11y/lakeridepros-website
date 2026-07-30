'use client'

import { useState } from 'react'
import { removeInsiderRider } from '../actions'

export function RemoveRiderControl({
  riderId,
  riderName,
}: {
  riderId: string
  riderName: string
}) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-4 text-sm font-bold text-red-300 transition hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      >
        Remove rider
      </button>
    )
  }

  return (
    <div className="mt-4 rounded-xl border border-red-300/20 bg-red-950/25 p-3">
      <p className="text-sm text-red-100">
        Remove {riderName}? They will lose access to this membership.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <form action={removeInsiderRider}>
          <input type="hidden" name="riderId" value={riderId} />
          <button
            type="submit"
            className="rounded-lg bg-red-300 px-3 py-2 text-sm font-black text-red-950 transition hover:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            Confirm removal
          </button>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Keep rider
        </button>
      </div>
    </div>
  )
}

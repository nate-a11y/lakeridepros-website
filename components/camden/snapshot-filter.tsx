"use client"

import { FormEvent, useEffect, useState } from "react"
import type { CamdenSnapshotFilter, CamdenSnapshotPeriod } from "@/lib/camden/types"
import { fieldClass, primaryButtonClass } from "./ui"

const periods: { value: CamdenSnapshotPeriod; label: string }[] = [
  { value: "program_to_date", label: "Program to date" },
  { value: "current_month", label: "Current month" },
  { value: "previous_month", label: "Previous month" },
  { value: "custom", label: "Custom dates" },
]

export function SnapshotFilter({ value, onApply, busy = false, idPrefix }: { value: CamdenSnapshotFilter; onApply: (filter: CamdenSnapshotFilter) => void; busy?: boolean; idPrefix: string }) {
  const [draft, setDraft] = useState(value)
  useEffect(() => setDraft(value), [value])

  function submit(event: FormEvent) {
    event.preventDefault()
    onApply(draft.period === "custom" ? draft : { period: draft.period })
  }

  return (
    <form onSubmit={submit} aria-label="Reporting period" className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
      <div>
        <label htmlFor={`${idPrefix}-period`} className="mb-1 block text-sm font-bold">Reporting period</label>
        <select id={`${idPrefix}-period`} className={fieldClass} value={draft.period} onChange={(event) => setDraft((current) => ({ ...current, period: event.target.value as CamdenSnapshotPeriod }))}>
          {periods.map((period) => <option key={period.value} value={period.value}>{period.label}</option>)}
        </select>
      </div>
      {draft.period === "custom" && <>
        <div><label htmlFor={`${idPrefix}-start`} className="mb-1 block text-sm font-bold">Start date</label><input id={`${idPrefix}-start`} type="date" className={fieldClass} value={draft.startDate ?? ""} max={draft.endDate} onChange={(event) => setDraft((current) => ({ ...current, startDate: event.target.value }))} required /></div>
        <div><label htmlFor={`${idPrefix}-end`} className="mb-1 block text-sm font-bold">End date</label><input id={`${idPrefix}-end`} type="date" className={fieldClass} value={draft.endDate ?? ""} min={draft.startDate} onChange={(event) => setDraft((current) => ({ ...current, endDate: event.target.value }))} required /></div>
      </>}
      <button type="submit" disabled={busy || (draft.period === "custom" && (!draft.startDate || !draft.endDate))} className={`${primaryButtonClass} sm:col-span-2 lg:col-span-1`}>{busy ? "Loading…" : "Apply filter"}</button>
    </form>
  )
}

"use client"

import { CalendarCheck2 } from "lucide-react"
import { useCallback, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import type { CamdenSnapshotFilter } from "@/lib/camden/types"
import { SnapshotFilter } from "./snapshot-filter"
import { ErrorState, LoadingState } from "./ui"
import { useCamdenData } from "./use-camden-data"

function percent(value: number) {
  return `${Math.round(value * 10) / 10}%`
}

export function RiderAccountability() {
  const [filter, setFilter] = useState<CamdenSnapshotFilter>({ period: "program_to_date" })
  const loader = useCallback(() => createCamdenPortalService("rider").getParticipantSnapshots(filter), [filter])
  const { data, error, loading, reload } = useCamdenData(loader)
  const participant = data?.role === "rider" ? data.participants[0] : undefined

  return <section aria-labelledby="accountability-heading" className="mt-9">
    <div className="flex gap-3"><CalendarCheck2 className="mt-1 size-6 shrink-0 text-[#245f0b]" aria-hidden="true" /><div><h2 id="accountability-heading" className="text-2xl font-extrabold">Your ride accountability</h2><p className="mt-1 text-sm text-neutral-600">Track your transportation activity for a selected period.</p></div></div>
    <div className="mt-4"><SnapshotFilter idPrefix="rider-accountability" value={filter} onApply={setFilter} busy={loading} /></div>
    {loading && !data ? <LoadingState label="Loading your ride stats" /> : error ? <div className="mt-4"><ErrorState message={error} retry={reload} /></div> : participant ? <><dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7"><Stat label="Treatment Court phase" value={participant.profile.phase ?? "Not assigned"} /><Stat label="Scheduled" value={participant.metrics.ridesScheduled} /><Stat label="Completed" value={participant.metrics.ridesCompleted} /><Stat label="Cancelled" value={participant.metrics.ridesCancelled} /><Stat label="No-shows" value={participant.metrics.noShows} /><Stat label="Finalized" value={participant.metrics.finalizedRides} /><Stat label="Cancellation rate" value={percent(participant.metrics.cancellationRate)} /></dl><p className="mt-3 text-sm text-neutral-600">Ride activity comes from Moovs and may take up to 15 minutes to appear.</p></> : <p className="mt-4 rounded-xl bg-neutral-100 p-4 text-sm text-neutral-600">No ride activity was found for this period.</p>}
  </section>
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-0 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"><dt className="text-xs font-semibold text-neutral-600">{label}</dt><dd className="mt-2 break-words text-2xl font-extrabold">{value}</dd></div>
}

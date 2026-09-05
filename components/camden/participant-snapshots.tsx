"use client"

import { Activity, CircleDollarSign, MapPin, Phone, UserRoundCheck } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import type { CamdenCoordinatorParticipantSnapshot, CamdenLocation, CamdenSnapshotFilter } from "@/lib/camden/types"
import { PortalShell } from "./portal-shell"
import { SnapshotFilter } from "./snapshot-filter"
import { EmptyState, ErrorState, formatPortalDate, LoadingState } from "./ui"
import { useCamdenData } from "./use-camden-data"

function percent(value: number) {
  return `${Math.round(value * 10) / 10}%`
}

const phaseLabel = (value?: string) => ({ phase_1: "Phase 1", phase_2: "Phase 2", phase_3: "Phase 3", phase_4: "Phase 4", phase_5: "Phase 5", graduation: "Graduation" } as Record<string, string>)[value ?? ""] ?? "Not provided"
const programLabel = (value?: string) => value === "dwi" ? "DWI Court" : value === "drug" ? "Drug Court" : value === "veterans" ? "Veterans Court" : "Not provided"
const eligibilityLabel = (value: string) => ({ pending: "Pending review", approved: "Approved", not_needed: "Transportation not needed", suspended: "Suspended" } as Record<string, string>)[value] ?? "Pending review"

function LocationList({ title, locations }: { title: string; locations: CamdenLocation[] }) {
  if (!locations.length) return null
  return <div><h4 className="text-xs font-bold uppercase tracking-wide text-neutral-600">{title}</h4><ul className="mt-2 space-y-2">{locations.map((location) => <li key={location.id} className="flex min-w-0 gap-2 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" /><span className="min-w-0"><strong>{location.name}</strong><br /><span className="break-words text-neutral-600">{location.address}</span></span></li>)}</ul></div>
}

function SnapshotCard({ participant }: { participant: CamdenCoordinatorParticipantSnapshot }) {
  const { profile, roster, metrics } = participant
  return (
    <article className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-xl font-extrabold">{profile.fullName}</h3><p className="mt-1 text-sm text-neutral-600">{profile.status || "Participant profile"}</p></div><span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${profile.phase === "Not assigned" ? "bg-amber-100 text-amber-950" : "bg-green-100 text-green-900"}`}>{profile.phase || "Not assigned"}</span></div>
      <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">{profile.phone && <a href={`tel:${profile.phone}`} className="inline-flex min-h-11 items-center font-semibold text-[#245f0b] underline"><Phone className="mr-2 size-4" aria-hidden="true" />{profile.phone}</a>}{profile.email && <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 min-w-0 items-center break-all font-semibold text-[#245f0b] underline">{profile.email}</a>}</div>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Scheduled" value={metrics.ridesScheduled} /><Metric label="Completed" value={metrics.ridesCompleted} /><Metric label="Cancelled" value={metrics.ridesCancelled} /><Metric label="No-shows" value={metrics.noShows} /><Metric label="Finalized" value={metrics.finalizedRides} /><Metric label="Cancellation rate" value={percent(metrics.cancellationRate)} /><Metric label="Total cost" value={metrics.totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })} /><Metric label="Personal transportation billed separately" value={participant.hasPersonalTransportation ? "Yes" : "No"} /></dl>
      <section aria-label="Confidential roster details" className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-extrabold">Roster details</h4><span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${roster.transportationEligibility === "approved" ? "bg-green-100 text-green-900" : roster.transportationEligibility === "suspended" ? "bg-red-100 text-red-900" : "bg-amber-100 text-amber-950"}`}>{eligibilityLabel(roster.transportationEligibility)}</span></div>
        <dl className="mt-3 grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          <div><dt className="font-bold text-neutral-600">Court program</dt><dd>{programLabel(roster.courtProgram)}</dd></div>
          <div><dt className="font-bold text-neutral-600">County</dt><dd>{roster.jurisdictionCounty || "Not provided"}</dd></div>
          <div><dt className="font-bold text-neutral-600">Case number</dt><dd className="break-all">{roster.caseNumber || "Not provided"}</dd></div>
          <div><dt className="font-bold text-neutral-600">Current phase began</dt><dd>{roster.phaseStartedOn ? formatPortalDate(roster.phaseStartedOn) : "Not provided"}{roster.phaseStartNeedsReview ? <strong className="ml-2 text-amber-800">Review date</strong> : null}</dd></div>
          <div><dt className="font-bold text-neutral-600">Next milestone</dt><dd>{phaseLabel(roster.nextPhase)}{roster.nextPhaseTargetOn ? <><br /><span className="text-xs text-neutral-500">Target {formatPortalDate(roster.nextPhaseTargetOn)}; does not advance automatically</span></> : null}</dd></div>
          <div><dt className="font-bold text-neutral-600">Phase progress</dt><dd>{roster.phaseProgressStatus === "on_hold" ? "On hold" : "Active"}</dd></div>
          <div><dt className="font-bold text-neutral-600">Supervision provider</dt><dd>{roster.supervisionProvider || "Not provided"}</dd></div>
          <div><dt className="font-bold text-neutral-600">Treatment provider</dt><dd>{roster.treatmentProvider || "Not provided"}</dd></div>
          <div><dt className="font-bold text-neutral-600">Curfew</dt><dd>{roster.curfew || "Not provided"}</dd></div>
          <div className="sm:col-span-2"><dt className="font-bold text-neutral-600">Roster home address</dt><dd className="break-words">{roster.sourceHomeAddress || "Not provided"}</dd><p className="mt-1 text-xs text-neutral-500">Reference only; this is not an approved pickup until LRP reviews it.</p></div>
        </dl>
      </section>
      <details className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50"><summary className="min-h-11 cursor-pointer px-4 py-3 font-bold text-[#245f0b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40">Approved locations</summary><div className="grid gap-5 border-t border-neutral-200 p-4 sm:grid-cols-3"><LocationList title="Home" locations={profile.homeLocations} /><LocationList title="Treatment" locations={profile.treatmentLocations} /><LocationList title="Drug testing" locations={profile.drugTestingSites} />{!profile.homeLocations.length && !profile.treatmentLocations.length && !profile.drugTestingSites.length && <p className="text-sm text-neutral-600">No approved locations are listed.</p>}</div></details>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="min-w-0 rounded-xl bg-neutral-50 p-3"><dt className="text-xs font-semibold text-neutral-600">{label}</dt><dd className="mt-1 break-words text-lg font-extrabold">{value}</dd></div>
}

export function ParticipantSnapshotsView() {
  const [filter, setFilter] = useState<CamdenSnapshotFilter>({ period: "program_to_date", transportationEligibility: "approved" })
  const loader = useCallback(async () => {
    const service = createCamdenPortalService("coordinator")
    const [context, snapshots] = await Promise.all([service.getContext(), service.getParticipantSnapshots(filter)])
    return { context, snapshots }
  }, [filter])
  const { data, error, loading, reload } = useCamdenData(loader)
  const totals = useMemo(() => data?.snapshots.role === "coordinator" ? data.snapshots.participants.reduce((result, participant) => ({ rides: result.rides + participant.metrics.ridesScheduled, completed: result.completed + participant.metrics.ridesCompleted, cost: result.cost + participant.metrics.totalCost, personalUse: result.personalUse + Number(participant.hasPersonalTransportation) }), { rides: 0, completed: 0, cost: 0, personalUse: 0 }) : null, [data])

  if (loading && !data) return <PortalShell><LoadingState label="Loading participant snapshots" /></PortalShell>
  if (error || !data || data.snapshots.role !== "coordinator") return <PortalShell><ErrorState message={error ?? "Participant snapshots are unavailable."} retry={reload} /></PortalShell>
  const snapshots = data.snapshots

  return <PortalShell context={data.context}>
    <div><p className="text-sm font-bold text-[#245f0b]">Camden County coordinator</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Participant snapshots</h1><p className="mt-2 max-w-3xl text-neutral-600">Review participant profiles, transportation accountability, costs, approved locations, and the final personal-use result for the selected period.</p></div>
    <div className="mt-6"><SnapshotFilter idPrefix="participant" value={filter} onApply={setFilter} busy={loading} /></div>
    {totals && <section aria-label="Snapshot totals" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><Summary icon={Activity} label="Scheduled rides" value={totals.rides} /><Summary icon={UserRoundCheck} label="Completed rides" value={totals.completed} /><Summary icon={CircleDollarSign} label="Total cost" value={totals.cost.toLocaleString("en-US", { style: "currency", currency: "USD" })} /><Summary icon={UserRoundCheck} label="Participants with separate personal transportation" value={totals.personalUse} /></section>}
    <section aria-labelledby="participant-list-heading" className="mt-8"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 id="participant-list-heading" className="text-2xl font-extrabold">Participant detail</h2><p className="mt-1 text-sm text-neutral-600">{formatPortalDate(snapshots.window.startDate)} through {formatPortalDate(snapshots.window.endDate)}</p></div><p role="status" className="text-sm font-semibold text-neutral-600">{snapshots.participants.length} participant{snapshots.participants.length === 1 ? "" : "s"}</p></div>{snapshots.participants.length ? <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-2">{snapshots.participants.map((participant) => <SnapshotCard key={participant.profile.riderId} participant={participant} />)}</div> : <div className="mt-4"><EmptyState title="No participant activity" message="No participants matched the transportation and reporting-period filters." /></div>}</section>
  </PortalShell>
}

function Summary({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string | number }) {
  return <article className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"><Icon className="size-5 text-[#245f0b]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-neutral-600">{label}</p><p className="mt-1 break-words text-2xl font-extrabold">{value}</p></article>
}

"use client"

import Link from "next/link"
import { CirclePlus, Download, Filter, WalletCards } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import type { CamdenRequestStatus } from "@/lib/camden/types"
import { PortalShell } from "./portal-shell"
import { RequestCard } from "./request-card"
import { EmptyState, ErrorState, fieldClass, LoadingState, primaryButtonClass, secondaryButtonClass } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function CoordinatorDashboard() {
  const [status, setStatus] = useState<"all" | CamdenRequestStatus | "action_acknowledged">("all")
  const [search, setSearch] = useState("")
  const loader = useCallback(() => createCamdenPortalService("coordinator").getCoordinatorDashboard(), [])
  const { data, error, loading, reload } = useCamdenData(loader)
  const requests = useMemo(() => data?.requests.filter((request) => {
    const matchesStatus = status === "all" || (status === "action_acknowledged" ? request.action?.status === "acknowledged" : request.status === status)
    const haystack = `${request.riderName} ${request.reference} ${request.action?.reasonLabel ?? ""}`.toLowerCase()
    return matchesStatus && (!search || haystack.includes(search.toLowerCase()))
  }) ?? [], [data, search, status])
  function exportCsv() {
    const cell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`
    const rows = [["Reference", "Rider", "Ride status", "Active action", "Action status", "Action reason", "Ride type", "Ride date", "Pickup", "Destination", "Current trip cost"], ...requests.map((request) => [request.reference, request.riderName, request.status, request.action?.kind ?? "", request.action?.status ?? "", request.action?.reasonLabel ?? "", request.rideTypeName, request.rideDate, request.pickupName, request.destinationName, request.trips.reduce((sum, trip) => sum + (trip.cost ?? 0), 0)])]
    const blob = new Blob([rows.map((row) => row.map(cell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob); const link = document.createElement("a")
    link.href = url; link.download = `camden-county-report-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url)
  }
  if (loading) return <PortalShell><LoadingState label="Loading coordinator dashboard" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "No dashboard data was returned."} retry={reload} /></PortalShell>

  return (
    <PortalShell context={data.context}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-[#245f0b]">Camden County coordinator</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Transportation overview</h1><p className="mt-2 max-w-2xl text-neutral-600">Review requests, monitor spending, and coordinate approved riders.</p></div><Link href="/camden-county/requests/new?onBehalf=true" className={primaryButtonClass}><CirclePlus className="mr-2 size-5" aria-hidden="true" /> Request for a rider</Link></div>
      <section aria-label="Program summary" className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[["Pending", data.summary.pendingCount], ["Needs attention", data.summary.needsAttentionCount], ["Confirmed", data.summary.confirmedCount], ["Month to date", data.summary.monthSpend.toLocaleString("en-US", { style: "currency", currency: "USD" })], ["Contract to date", data.summary.contractSpend.toLocaleString("en-US", { style: "currency", currency: "USD" })]].map(([label, value], index) => <article key={String(label)} className={`rounded-2xl border p-4 shadow-sm ${index > 2 ? "border-green-200 bg-green-50" : "border-neutral-200 bg-white"}`}><p className="text-sm font-semibold text-neutral-600">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p>{index > 2 && <p className="mt-1 flex items-center text-xs text-neutral-600"><WalletCards className="mr-1 size-3" aria-hidden="true" /> Updated from trip records</p>}</article>)}
      </section>
      <section aria-labelledby="request-queue-heading" className="mt-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 id="request-queue-heading" className="text-2xl font-extrabold">Request queue</h2><p className="mt-1 text-sm text-neutral-600">Trip costs are visible only to authorized coordinators and Lake Ride Pros staff.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportCsv} disabled={!requests.length} className={secondaryButtonClass}><Download className="mr-2 size-4" aria-hidden="true" /> Export filtered CSV</button></div></div>
        <div className="mt-4 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:grid-cols-2">
          <div><label htmlFor="request-search" className="mb-1 block text-sm font-bold">Search rider or reference</label><input id="request-search" className={fieldClass} type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <div><label htmlFor="status-filter" className="mb-1 flex items-center text-sm font-bold"><Filter className="mr-1 size-4" aria-hidden="true" />Status or active action</label><select id="status-filter" className={fieldClass} value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="needs_information">Needs information</option><option value="information_received">Information received</option><option value="acknowledged">Acknowledged</option><option value="confirmed">Confirmed</option><option value="change_requested">Change requested</option><option value="cancellation_requested">Cancellation requested</option><option value="action_acknowledged">Action acknowledged</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="declined">Declined</option><option value="no_show">No show</option></select></div>
        </div>
        <p role="status" className="mt-4 text-sm font-semibold text-neutral-600">{requests.length} request{requests.length === 1 ? "" : "s"}</p>
        {requests.length ? <div className="mt-3 grid gap-4 xl:grid-cols-2">{requests.map((request) => <RequestCard key={request.id} request={request} showRider showCost />)}</div> : <EmptyState title="No matching requests" message="Try changing your search or status filter." />}
      </section>
      <section aria-labelledby="billing-heading" className="mt-9"><h2 id="billing-heading" className="text-2xl font-extrabold">Monthly billing</h2><p className="mt-1 text-sm text-neutral-600">Invoice status is managed by Lake Ride Pros. Payments are not processed in this portal.</p>{data.invoices.length ? <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-neutral-100"><tr><th className="p-4">Period</th><th className="p-4">Invoice</th><th className="p-4">Status</th><th className="p-4">Document</th></tr></thead><tbody>{data.invoices.map((invoice) => <tr key={invoice.id} className="border-t border-neutral-200"><td className="p-4">{invoice.periodStart} – {invoice.periodEnd}</td><td className="p-4 font-semibold">{invoice.invoiceNumber ?? "Not issued"}</td><td className="p-4 capitalize">{invoice.status.replace("_", " ")}</td><td className="p-4">{invoice.documentUrl ? <a href={invoice.documentUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold text-[#245f0b] underline">View invoice</a> : "Not available"}</td></tr>)}</tbody></table></div> : <div className="mt-4"><EmptyState title="No invoices yet" message="Monthly invoice records will appear here after Lake Ride Pros creates them." /></div>}</section>
    </PortalShell>
  )
}

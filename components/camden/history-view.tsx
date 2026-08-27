"use client"

import { useCallback, useMemo, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import { PortalShell } from "./portal-shell"
import { RequestCard } from "./request-card"
import { EmptyState, ErrorState, fieldClass, LoadingState } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function HistoryView() {
  const [status, setStatus] = useState("all")
  const loader = useCallback(() => createCamdenPortalService().getDashboard(), [])
  const { data, error, loading, reload } = useCamdenData(loader)
  const history = useMemo(() => data?.requests.filter((request) => ["completed", "cancelled", "declined", "no_show"].includes(request.status) && (status === "all" || request.status === status)) ?? [], [data, status])
  if (loading) return <PortalShell><LoadingState label="Loading ride history" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "History is unavailable."} retry={reload} /></PortalShell>
  return <PortalShell context={data.context}><div><p className="text-sm font-bold text-[#245f0b]">Previous 12 months</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Ride history</h1><p className="mt-2 text-neutral-600">Completed, cancelled, declined, and confirmed no-show outcomes.</p></div><div className="mt-6 max-w-xs"><label htmlFor="history-status" className="mb-1 block text-sm font-bold">Filter by outcome</label><select id="history-status" className={fieldClass} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All outcomes</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="declined">Declined</option><option value="no_show">No show</option></select></div><section aria-label="Past ride requests" className="mt-6">{history.length ? <div className="grid gap-4 xl:grid-cols-2">{history.map((request) => <RequestCard key={request.id} request={request} />)}</div> : <EmptyState title="No ride history yet" message="Final ride outcomes from the previous 12 months will appear here." />}</section></PortalShell>
}

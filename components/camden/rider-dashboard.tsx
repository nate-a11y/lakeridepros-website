"use client"

import Link from "next/link"
import { ArrowRight, CirclePlus, PhoneCall } from "lucide-react"
import { useCallback } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import { PortalShell } from "./portal-shell"
import { RequestCard } from "./request-card"
import { RiderAccountability } from "./rider-accountability"
import { EmptyState, ErrorState, LoadingState, Notice, primaryButtonClass } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function RiderDashboard() {
  const loader = useCallback(() => createCamdenPortalService().getDashboard(), [])
  const { data, error, loading, reload } = useCamdenData(loader)
  if (loading) return <PortalShell><LoadingState /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "No portal data was returned."} retry={reload} /></PortalShell>

  const active = data.requests.filter((request) => !["completed", "cancelled", "declined", "no_show"].includes(request.status))
  const pending = active.filter((request) => request.status !== "confirmed")
  const confirmed = active.filter((request) => request.status === "confirmed")

  return (
    <PortalShell context={data.context}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-bold text-[#245f0b]">Welcome back, {data.context.displayName.split(" ")[0]}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Your transportation</h1><p className="mt-2 max-w-2xl text-neutral-600">Request and manage your Treatment Court transportation.</p></div>
        <Link href="/camden-county/requests/new" className={primaryButtonClass}><CirclePlus className="mr-2 size-5" aria-hidden="true" /> Submit a new request</Link>
      </div>
      <section aria-labelledby="urgent-support" className="mt-7">
        <Notice tone="warning" title="Need immediate ride help?">
          <p id="urgent-support">Portal messages are not monitored for emergencies or immediate dispatch assistance. <a href={`tel:${data.context.supportPhone}`} className="mt-2 inline-flex min-h-11 items-center font-bold text-amber-950 underline"><PhoneCall className="mr-2 size-4" aria-hidden="true" />Call urgent support</a></p>
        </Notice>
      </section>
      <RiderAccountability />
      <section aria-labelledby="pending-heading" className="mt-9">
        <div className="mb-4 flex items-center justify-between"><div><h2 id="pending-heading" className="text-2xl font-extrabold">Requests in progress</h2><p className="mt-1 text-sm text-neutral-600">Submitted requests that are being reviewed or scheduled.</p></div></div>
        {pending.length ? <div className="grid gap-4 xl:grid-cols-2">{pending.map((request) => <RequestCard key={request.id} request={request} />)}</div> : <EmptyState title="No pending requests" message="When you submit a request, its review status will appear here." actionHref="/camden-county/requests/new" actionLabel="Submit a request" />}
      </section>
      <section aria-labelledby="confirmed-heading" className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-4"><div><h2 id="confirmed-heading" className="text-2xl font-extrabold">Confirmed rides</h2><p className="mt-1 text-sm text-neutral-600">Rides that have been scheduled and confirmed by Lake Ride Pros.</p></div><Link href="/camden-county/history" className="inline-flex min-h-11 items-center font-bold text-[#245f0b] hover:underline">View history <ArrowRight className="ml-1 size-4" aria-hidden="true" /></Link></div>
        {confirmed.length ? <div className="grid gap-4 xl:grid-cols-2">{confirmed.map((request) => <RequestCard key={request.id} request={request} />)}</div> : <EmptyState title="No confirmed rides" message="Confirmed rides will appear here when scheduling is complete." />}
      </section>
    </PortalShell>
  )
}

import Link from "next/link"
import { ArrowRight, CalendarDays, Clock3, MapPin, UserRound } from "lucide-react"
import type { CamdenRequest } from "@/lib/camden/types"
import { formatPortalDate, formatPortalTime, StatusBadge } from "./ui"

export function RequestCard({ request, showRider = false, showCost = false }: { request: CamdenRequest; showRider?: boolean; showCost?: boolean }) {
  const syncedCost = request.trips.reduce<number | null>((sum, trip) => trip.cost == null ? sum : (sum ?? 0) + trip.cost, null)
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-wide text-neutral-600">{request.reference}</p><h3 className="mt-1 text-lg font-bold">{request.rideTypeName}</h3></div>
        <StatusBadge status={request.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {showRider && <div className="flex gap-2"><UserRound className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" /><div><span className="sr-only">Rider</span><span className="font-semibold">{request.riderName}</span></div></div>}
        <div className="flex gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" /><div><span className="sr-only">Date</span><span>{formatPortalDate(request.rideDate)}</span></div></div>
        <div className="flex gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" /><div><span className="sr-only">Requested pickup</span><span>{formatPortalTime(request.requestedPickupTime)} pickup</span></div></div>
        <div className="flex gap-2 sm:col-span-2"><MapPin className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" /><div><span className="sr-only">Route</span><span>{request.pickupName} <ArrowRight className="mx-1 inline size-4" aria-label="to" /> {request.destinationName}</span></div></div>
      </div>
      {request.lateUrgent && <p className="mt-4 rounded-lg bg-amber-100 px-3 py-2 text-sm font-bold text-amber-950">Late / urgent request — fulfillment is not guaranteed</p>}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
        {showCost ? <p className="text-sm"><span className="text-neutral-600">Moovs cost</span><br /><strong className="text-base">{syncedCost == null ? "Not available" : syncedCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong></p> : <span />}
        <Link href={`/camden-county/requests/${request.id}${showRider ? "?coordinator=true" : ""}`} className="inline-flex min-h-11 items-center rounded-xl px-3 font-bold text-[#245f0b] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40">View details <ArrowRight className="ml-1 size-4" aria-hidden="true" /></Link>
      </div>
    </article>
  )
}

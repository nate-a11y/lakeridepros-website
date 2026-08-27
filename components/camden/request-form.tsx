"use client"

import Link from "next/link"
import { AlertTriangle, ArrowLeft, CheckCircle2, Copy, Info } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import type { CamdenRequestDraft } from "@/lib/camden/types"
import { PortalShell } from "./portal-shell"
import { ErrorState, fieldClass, LoadingState, Notice, primaryButtonClass, secondaryButtonClass } from "./ui"
import { useCamdenData } from "./use-camden-data"

const emptyDraft: CamdenRequestDraft = {
  rideTypeId: "", rideDate: "", requestedPickupTime: "", appointmentTime: "", direction: "one_way",
  pickupLocationId: "", destinationLocationId: "", notes: "", companionCount: 0, companionDetails: "",
}

function similarTime(left: string, right: string) {
  const minutes = (value: string) => { const [hour = "0", minute = "0"] = value.split(":"); return Number(hour) * 60 + Number(minute) }
  return Math.abs(minutes(left) - minutes(right)) <= 90
}

export function NewRequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const persona = searchParams.get("onBehalf") === "true" ? "coordinator" : "rider"
  const duplicateId = searchParams.get("duplicate")
  const loader = useCallback(() => createCamdenPortalService(persona).getDashboard(), [persona])
  const { data, error, loading, reload } = useCamdenData(loader)
  const isCoordinator = data?.context.role === "coordinator"
  const [draft, setDraft] = useState<CamdenRequestDraft>(emptyDraft)
  const [duplicateAcknowledged, setDuplicateAcknowledged] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showLocationRequest, setShowLocationRequest] = useState(false)
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null)
  const [location, setLocation] = useState({ name: "", address_line1: "", address_line2: "", city: "", state: "MO", postal_code: "", notes: "" })

  useEffect(() => {
    if (!data || !duplicateId) return
    const source = data.requests.find((request) => request.id === duplicateId)
    if (!source) return
    setDraft({
      riderId: isCoordinator ? source.riderId : undefined,
      rideTypeId: source.rideTypeId,
      rideDate: "",
      requestedPickupTime: source.requestedPickupTime,
      appointmentTime: source.appointmentTime,
      direction: source.direction,
      returnKind: source.returnKind,
      returnTime: source.returnTime,
      pickupLocationId: source.pickupLocationId,
      destinationLocationId: source.destinationLocationId,
      notes: source.notes,
      companionCount: source.companionCount,
      companionDetails: source.companionDetails,
    })
  }, [data, duplicateId, isCoordinator])

  const possibleDuplicate = useMemo(() => data?.requests.find((request) => request.rideDate === draft.rideDate && request.requestedPickupTime && draft.requestedPickupTime && similarTime(request.requestedPickupTime, draft.requestedPickupTime)), [data, draft.rideDate, draft.requestedPickupTime])
  const selectedRideType = data?.rideTypes.find((type) => type.id === draft.rideTypeId)
  const riders = data?.riders ?? []
  const availablePickups = data?.pickupLocations.filter((location) => !isCoordinator || !draft.riderId || location.riderId === draft.riderId) ?? []

  function update<K extends keyof CamdenRequestDraft>(key: K, value: CamdenRequestDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    if (!data?.context.policyAccepted) { setFormError("Accept the current transportation rules before submitting your first request."); return }
    if (possibleDuplicate && !duplicateAcknowledged) { setFormError("Confirm that this is not an accidental duplicate before submitting."); return }
    setSubmitting(true)
    try {
      const service = createCamdenPortalService(isCoordinator ? "coordinator" : "rider")
      if (duplicateId) await service.duplicateRequest(duplicateId, { ...draft, duplicateConfirmed: duplicateAcknowledged })
      else await service.submitRequest({ ...draft, duplicateConfirmed: duplicateAcknowledged })
      setSuccess(true)
      setTimeout(() => router.push(isCoordinator ? "/camden-county/coordinator" : "/camden-county"), 900)
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Your request could not be submitted.")
    } finally { setSubmitting(false) }
  }

  async function submitLocationRequest() {
    setLocationFeedback(null)
    if (!location.name.trim() || !location.address_line1.trim() || !location.city.trim() || !/^[A-Z]{2}$/.test(location.state) || !/^\d{5}(?:-\d{4})?$/.test(location.postal_code)) {
      setLocationFeedback("Enter the location name and a complete valid address."); return
    }
    setSubmitting(true)
    try {
      await createCamdenPortalService(isCoordinator ? "coordinator" : "rider").requestLocation(location.name, { address_line1: location.address_line1, address_line2: location.address_line2 || undefined, city: location.city, state: location.state, postal_code: location.postal_code }, location.notes || undefined)
      setLocationFeedback("Location submitted for Lake Ride Pros approval. It cannot be selected until approved.")
      setShowLocationRequest(false)
    } catch (caught) { setLocationFeedback(caught instanceof Error ? caught.message : "The location request could not be submitted.") } finally { setSubmitting(false) }
  }

  if (loading) return <PortalShell><LoadingState label="Preparing request form" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "Request options are unavailable."} retry={reload} /></PortalShell>

  if (success) return <PortalShell context={data.context}><div role="status" className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-8 text-center"><CheckCircle2 className="mx-auto size-10 text-green-700" aria-hidden="true" /><h1 className="mt-4 text-2xl font-extrabold">Request submitted</h1><p className="mt-2 text-neutral-700">It is pending review. We&apos;ll text you when its status changes.</p></div></PortalShell>

  return (
    <PortalShell context={data.context}>
      <div className="mx-auto max-w-3xl">
        <Link href={isCoordinator ? "/camden-county/coordinator" : "/camden-county"} className="inline-flex min-h-11 items-center font-bold text-[#245f0b] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40"><ArrowLeft className="mr-2 size-4" aria-hidden="true" />Back</Link>
        <div className="mt-3"><p className="text-sm font-bold text-[#245f0b]">{duplicateId ? "Duplicate a prior request" : "New transportation request"}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">Tell us about the ride</h1><p className="mt-2 text-neutral-600">Submitting a request does not guarantee transportation. Your ride is confirmed after Lake Ride Pros completes scheduling.</p></div>
        {!data.context.policyAccepted && <div className="mt-6"><Notice tone="warning" title="Transportation rules must be accepted"><p>Review and accept the current rules before submitting. <Link href="/camden-county/policy" className="font-bold underline">Review rules</Link></p></Notice></div>}
        <form onSubmit={submit} className="mt-7 space-y-7 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          {formError && <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-900">{formError}</div>}
          {isCoordinator && <fieldset><legend className="text-lg font-extrabold">Rider</legend><div className="mt-3"><label htmlFor="rider" className="mb-1 block text-sm font-bold">Approved rider <span aria-hidden="true">*</span></label><select id="rider" className={fieldClass} value={draft.riderId ?? ""} onChange={(event) => { update("riderId", event.target.value); update("pickupLocationId", "") }} required><option value="">Select a rider</option>{riders.map((rider) => <option key={rider.id} value={rider.id}>{rider.name}</option>)}</select></div></fieldset>}
          <fieldset><legend className="text-lg font-extrabold">Ride details</legend><div className="mt-3 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="ride-type" className="mb-1 block text-sm font-bold">Ride type <span aria-hidden="true">*</span></label><select id="ride-type" className={fieldClass} value={draft.rideTypeId} onChange={(event) => update("rideTypeId", event.target.value)} required><option value="">Select a ride type</option>{data.rideTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select>{selectedRideType && <p className="mt-2 flex text-sm text-neutral-600"><Info className="mr-2 mt-0.5 size-4 shrink-0" aria-hidden="true" />{selectedRideType.noticeSummary}</p>}</div>
            <div><label htmlFor="ride-date" className="mb-1 block text-sm font-bold">Ride date <span aria-hidden="true">*</span></label><input id="ride-date" type="date" className={fieldClass} value={draft.rideDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => { update("rideDate", event.target.value); setDuplicateAcknowledged(false) }} required /></div>
            <div><label htmlFor="pickup-time" className="mb-1 block text-sm font-bold">Requested pickup time <span aria-hidden="true">*</span></label><input id="pickup-time" type="time" className={fieldClass} value={draft.requestedPickupTime} onChange={(event) => { update("requestedPickupTime", event.target.value); setDuplicateAcknowledged(false) }} required /></div>
            <div><label htmlFor="appointment-time" className="mb-1 block text-sm font-bold">Appointment / required arrival <span aria-hidden="true">*</span></label><input id="appointment-time" type="time" className={fieldClass} value={draft.appointmentTime} onChange={(event) => update("appointmentTime", event.target.value)} required /></div>
            <fieldset><legend className="mb-1 text-sm font-bold">Trip direction <span aria-hidden="true">*</span></legend><div className="flex min-h-12 items-center gap-4 rounded-xl border border-neutral-300 px-3"><label className="flex min-h-11 items-center gap-2"><input type="radio" name="direction" value="one_way" checked={draft.direction === "one_way"} onChange={() => setDraft((current) => ({ ...current, direction: "one_way", returnKind: undefined, returnTime: undefined }))} /> One way</label><label className="flex min-h-11 items-center gap-2"><input type="radio" name="direction" value="round_trip" checked={draft.direction === "round_trip"} onChange={() => update("direction", "round_trip")} /> Round trip</label></div></fieldset>
          </div></fieldset>
          <fieldset><legend className="text-lg font-extrabold">Approved locations</legend><div className="mt-3 grid gap-5 sm:grid-cols-2"><div><label htmlFor="pickup-location" className="mb-1 block text-sm font-bold">Pickup <span aria-hidden="true">*</span></label><select id="pickup-location" className={fieldClass} value={draft.pickupLocationId} onChange={(event) => update("pickupLocationId", event.target.value)} required disabled={isCoordinator && !draft.riderId}><option value="">{isCoordinator && !draft.riderId ? "Select a rider first" : "Select approved pickup"}</option>{availablePickups.map((location) => <option key={location.id} value={location.id}>{location.name} — {location.address}</option>)}</select></div><div><label htmlFor="destination" className="mb-1 block text-sm font-bold">Destination <span aria-hidden="true">*</span></label><select id="destination" className={fieldClass} value={draft.destinationLocationId} onChange={(event) => update("destinationLocationId", event.target.value)} required><option value="">Select approved destination</option>{data.destinations.map((location) => <option key={location.id} value={location.id}>{location.name} — {location.address}</option>)}</select><button type="button" onClick={() => setShowLocationRequest((value) => !value)} aria-expanded={showLocationRequest} aria-controls="location-request-fields" className="mt-2 min-h-11 text-sm font-bold text-[#245f0b] underline">Ask for another approved location</button></div></div></fieldset>
          {locationFeedback && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold">{locationFeedback}</div>}
          {showLocationRequest && <section id="location-request-fields" aria-labelledby="location-request-heading" className="rounded-xl border border-blue-200 bg-blue-50 p-4"><h2 id="location-request-heading" className="text-lg font-extrabold">Request another destination</h2><p className="mt-1 text-sm text-neutral-700">This does not add the destination to this ride. Lake Ride Pros must approve it first.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label htmlFor="location-name" className="mb-1 block text-sm font-bold">Location name</label><input id="location-name" className={fieldClass} value={location.name} onChange={(event) => setLocation((current) => ({ ...current, name: event.target.value }))} /></div><div><label htmlFor="location-address1" className="mb-1 block text-sm font-bold">Street address</label><input id="location-address1" className={fieldClass} value={location.address_line1} onChange={(event) => setLocation((current) => ({ ...current, address_line1: event.target.value }))} /></div><div><label htmlFor="location-address2" className="mb-1 block text-sm font-bold">Address line 2 (optional)</label><input id="location-address2" className={fieldClass} value={location.address_line2} onChange={(event) => setLocation((current) => ({ ...current, address_line2: event.target.value }))} /></div><div><label htmlFor="location-city" className="mb-1 block text-sm font-bold">City</label><input id="location-city" className={fieldClass} value={location.city} onChange={(event) => setLocation((current) => ({ ...current, city: event.target.value }))} /></div><div><label htmlFor="location-state" className="mb-1 block text-sm font-bold">State</label><input id="location-state" className={fieldClass} maxLength={2} value={location.state} onChange={(event) => setLocation((current) => ({ ...current, state: event.target.value.toUpperCase() }))} /></div><div><label htmlFor="location-postal" className="mb-1 block text-sm font-bold">ZIP code</label><input id="location-postal" inputMode="numeric" className={fieldClass} value={location.postal_code} onChange={(event) => setLocation((current) => ({ ...current, postal_code: event.target.value }))} /></div><div className="sm:col-span-2"><label htmlFor="location-notes" className="mb-1 block text-sm font-bold">Why is this location needed? (optional)</label><textarea id="location-notes" className={fieldClass} rows={2} value={location.notes} onChange={(event) => setLocation((current) => ({ ...current, notes: event.target.value }))} /></div></div><div className="mt-4 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setShowLocationRequest(false)} className={secondaryButtonClass}>Cancel</button><button type="button" onClick={submitLocationRequest} disabled={submitting} className={primaryButtonClass}>Submit location for approval</button></div></section>}
          {draft.direction === "round_trip" && <fieldset><legend className="text-lg font-extrabold">Return ride <span aria-hidden="true">*</span></legend><div className="mt-3 grid gap-4 sm:grid-cols-2"><label className="flex min-h-12 items-center gap-2 rounded-xl border border-neutral-300 px-3"><input type="radio" name="return-kind" value="scheduled" required checked={draft.returnKind === "scheduled"} onChange={() => update("returnKind", "scheduled")} />Specific return time</label><label className="flex min-h-12 items-center gap-2 rounded-xl border border-neutral-300 px-3"><input type="radio" name="return-kind" value="will_call" required checked={draft.returnKind === "will_call"} onChange={() => update("returnKind", "will_call")} />Call when ready</label>{draft.returnKind === "scheduled" && <div><label htmlFor="return-time" className="mb-1 block text-sm font-bold">Requested return time <span aria-hidden="true">*</span></label><input id="return-time" type="time" className={fieldClass} value={draft.returnTime ?? ""} onChange={(event) => update("returnTime", event.target.value)} required /></div>}</div></fieldset>}
          {data.context.companionFieldsEnabled && <fieldset><legend className="text-lg font-extrabold">Companions</legend><div className="mt-3 grid gap-5 sm:grid-cols-2"><div><label htmlFor="companion-count" className="mb-1 block text-sm font-bold">Number of companions</label><input id="companion-count" type="number" min="0" max="8" className={fieldClass} value={draft.companionCount ?? 0} onChange={(event) => update("companionCount", Number(event.target.value))} /></div>{Boolean(draft.companionCount) && <div><label htmlFor="companion-details" className="mb-1 block text-sm font-bold">Companion details</label><input id="companion-details" className={fieldClass} value={draft.companionDetails ?? ""} onChange={(event) => update("companionDetails", event.target.value)} /></div>}</div></fieldset>}
          <div><label htmlFor="ride-notes" className="mb-1 block text-sm font-bold">Anything else we need to know?</label><textarea id="ride-notes" rows={4} className={fieldClass} maxLength={1000} value={draft.notes ?? ""} onChange={(event) => update("notes", event.target.value)} /><p className="mt-1 text-xs text-neutral-600">Do not include diagnoses or unnecessary medical information.</p></div>
          {possibleDuplicate && <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4"><div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-800" aria-hidden="true" /><div><p className="font-extrabold">Possible duplicate request</p><p className="mt-1 text-sm">You already have {possibleDuplicate.reference} near this time. Multiple rides are allowed, but please confirm this is intentional.</p><label className="mt-3 flex min-h-11 items-center gap-3 font-bold"><input type="checkbox" checked={duplicateAcknowledged} onChange={(event) => setDuplicateAcknowledged(event.target.checked)} />Yes, submit this separate ride</label></div></div></div>}
          <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end"><Link href={isCoordinator ? "/camden-county/coordinator" : "/camden-county"} className={secondaryButtonClass}>Cancel</Link><button type="submit" className={primaryButtonClass} disabled={submitting || !data.context.policyAccepted}>{duplicateId && <Copy className="mr-2 size-4" aria-hidden="true" />}{submitting ? "Submitting…" : "Submit request"}</button></div>
        </form>
      </div>
    </PortalShell>
  )
}

"use client"

import Link from "next/link"
import { AlertTriangle, ArrowLeft, CalendarDays, Clock3, Copy, MapPin, MessageSquareText, Pencil, Send, UserRound } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import { isFollowupActive, type CamdenFollowupStatus, type CamdenRequestStatus } from "@/lib/camden/types"
import { CamdenModal } from "./modal"
import { PortalShell } from "./portal-shell"
import { ErrorState, fieldClass, FollowupBadge, formatPortalDate, formatPortalDateTime, formatPortalTime, LoadingState, Notice, primaryButtonClass, secondaryButtonClass, StatusBadge } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function RequestDetailView() {
  const { id } = useParams<{ id: string }>()
  const coordinator = useSearchParams().get("coordinator") === "true"
  const persona = coordinator ? "coordinator" : "rider"
  const loader = useCallback(async () => {
    const service = createCamdenPortalService(persona)
    const [dashboard, detail] = await Promise.all([service.getDashboard(), service.getRequest(id)])
    if (dashboard.context.role === "rider") detail.request.trips.forEach((trip) => { trip.cost = undefined })
    return { context: dashboard.context, changeReasons: dashboard.changeReasons, detail }
  }, [id, persona])
  const { data, error, loading, reload } = useCamdenData(loader)
  const [message, setMessage] = useState("")
  const [action, setAction] = useState<"change" | "cancellation" | null>(null)
  const [reason, setReason] = useState("")
  const [explanation, setExplanation] = useState("")
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [transitionStatus, setTransitionStatus] = useState<CamdenRequestStatus | "">("")
  const [publicExplanation, setPublicExplanation] = useState("")
  const [coordinatorActionOpen, setCoordinatorActionOpen] = useState(false)
  const [followupDecision, setFollowupDecision] = useState<Exclude<CamdenFollowupStatus, "requested"> | null>(null)
  const [followupDecisionExplanation, setFollowupDecisionExplanation] = useState("")

  async function sendMessage(event: FormEvent) {
    event.preventDefault(); if (!message.trim()) return
    setSaving(true); setFeedback(null)
    try { await createCamdenPortalService(persona).addMessage(id, message.trim()); setMessage(""); setFeedback("Message sent."); await reload() }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Message could not be sent.") } finally { setSaving(false) }
  }

  async function savePending(event: FormEvent) {
    event.preventDefault(); if (!data) return
    setSaving(true); setFeedback(null)
    try { await createCamdenPortalService(persona).updatePendingRequest(id, data.detail.request.version, { notes }); setEditing(false); setFeedback("Request updated."); await reload() }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Request could not be updated.") } finally { setSaving(false) }
  }

  async function submitFollowup(event: FormEvent) {
    event.preventDefault(); if (!action || !reason) return
    setSaving(true); setFeedback(null)
    try { await createCamdenPortalService(persona).createFollowup(id, data?.detail.request.version ?? 0, action, reason, explanation); setAction(null); setReason(""); setExplanation(""); setFeedback(`${action === "change" ? "Change" : "Cancellation"} request added to this ride.`); await reload() }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Request could not be submitted.") } finally { setSaving(false) }
  }

  async function submitFollowupDecision(event: FormEvent) {
    event.preventDefault(); if (!data || !followupDecision) return
    if (followupDecision === "declined" && !followupDecisionExplanation.trim()) {
      setFeedback("Add a rider-visible explanation before declining this action."); return
    }
    setSaving(true); setFeedback(null)
    try {
      await createCamdenPortalService("coordinator").transitionFollowup(id, data.detail.request.version, followupDecision, followupDecisionExplanation.trim() || undefined)
      setFollowupDecision(null); setFollowupDecisionExplanation(""); setFeedback(`Ride action ${followupDecision}.`); await reload()
    } catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Ride action could not be updated.") } finally { setSaving(false) }
  }

  async function submitTransition(event: FormEvent) {
    event.preventDefault(); if (!data || !transitionStatus) return
    if (["declined", "needs_information"].includes(transitionStatus) && !publicExplanation.trim()) {
      setFeedback("Add a rider-visible explanation before changing this status."); return
    }
    setSaving(true); setFeedback(null)
    try {
      await createCamdenPortalService("coordinator").transitionRequest(id, transitionStatus, data.detail.request.version, publicExplanation.trim() || undefined)
      setTransitionStatus(""); setPublicExplanation(""); setCoordinatorActionOpen(false); setFeedback("Request status updated."); await reload()
    } catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Status could not be updated.") } finally { setSaving(false) }
  }

  if (loading) return <PortalShell><LoadingState label="Loading request details" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "Request not found."} retry={reload} /></PortalShell>
  const request = data.detail.request
  const isCoordinator = data.context.role === "coordinator"
  const backHref = isCoordinator ? "/camden-county/coordinator" : "/camden-county"
  const syncedCost = request.trips.reduce<number | null>((sum, trip) => trip.cost == null ? sum : (sum ?? 0) + trip.cost, null)
  const availableReasons = action ? data.changeReasons.filter((item) => item.kind === action) : []
  const selectedReason = availableReasons.find((item) => item.id === reason)
  const activeFollowup = isFollowupActive(request.action) ? request.action : null
  const canRequestFollowup = !activeFollowup && ["acknowledged", "needs_information", "information_received", "confirmed"].includes(request.status)
  const canTransition = isCoordinator && !activeFollowup && !["confirmed", "completed", "cancelled", "declined", "no_show"].includes(request.status)

  return (
    <PortalShell context={data.context}>
      <div className="mx-auto max-w-4xl">
        <Link href={backHref} className="inline-flex min-h-11 items-center font-bold text-[#245f0b] hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40"><ArrowLeft className="mr-2 size-4" aria-hidden="true" />Back to {isCoordinator ? "queue" : "rides"}</Link>
        <header className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wide text-neutral-600">{request.reference}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">{request.rideTypeName}</h1>{isCoordinator && <p className="mt-2 flex items-center font-semibold"><UserRound className="mr-2 size-4" aria-hidden="true" />{request.riderName}</p>}</div><StatusBadge status={request.status} /></header>
        {feedback && <div role="status" className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 font-semibold">{feedback}</div>}
        {request.riderVisibleExplanation && <div className="mt-5"><Notice tone="warning" title="Update from Lake Ride Pros">{request.riderVisibleExplanation}</Notice></div>}
        {request.action && <section aria-labelledby="ride-action-heading" className={`mt-5 rounded-2xl border-2 p-5 sm:p-6 ${isFollowupActive(request.action) ? "border-amber-300 bg-amber-50" : request.action.status === "completed" ? "border-green-200 bg-green-50" : "border-neutral-200 bg-white"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><AlertTriangle className={`mt-1 size-5 shrink-0 ${isFollowupActive(request.action) ? "text-amber-800" : "text-neutral-600"}`} aria-hidden="true" /><div><p className="text-xs font-bold uppercase tracking-wide text-neutral-600">{isFollowupActive(request.action) ? "Active ride action" : "Most recent ride action"}</p><h2 id="ride-action-heading" className="mt-1 text-xl font-extrabold">{request.action.kind === "change" ? "Change request" : "Cancellation request"}</h2></div></div><FollowupBadge action={request.action} /></div><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-bold text-neutral-600">Reason</dt><dd className="mt-1 font-semibold">{request.action.reasonLabel}</dd></div><div><dt className="font-bold text-neutral-600">Requested</dt><dd className="mt-1">{request.action.requestedAt ? formatPortalDateTime(request.action.requestedAt) : "Recently"}</dd></div>{request.action.acknowledgeDueAt && <div><dt className="font-bold text-neutral-600">Review target</dt><dd className="mt-1">{formatPortalDateTime(request.action.acknowledgeDueAt)}</dd></div>}{request.action.resolveDueAt && <div><dt className="font-bold text-neutral-600">Resolution target</dt><dd className="mt-1">{formatPortalDateTime(request.action.resolveDueAt)}</dd></div>}{request.action.explanation && <div className="sm:col-span-2"><dt className="font-bold text-neutral-600">Details</dt><dd className="mt-1 whitespace-pre-wrap">{request.action.explanation}</dd></div>}{request.action.resolutionExplanation && <div className="sm:col-span-2"><dt className="font-bold text-neutral-600">Coordinator update</dt><dd className="mt-1 whitespace-pre-wrap">{request.action.resolutionExplanation}</dd></div>}</dl>{activeFollowup && <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm font-semibold">{activeFollowup.status === "requested" ? "This action is waiting for coordinator review. The original ride stays visible here." : "This action has been acknowledged and is being processed."}</p>}{isCoordinator && activeFollowup && <div className="mt-4 flex flex-col gap-2 border-t border-amber-300 pt-4 sm:flex-row sm:flex-wrap">{activeFollowup.status === "requested" && <button type="button" onClick={() => { setFeedback(null); setFollowupDecisionExplanation(""); setFollowupDecision("acknowledged") }} className={primaryButtonClass}>Acknowledge {activeFollowup.kind}</button>}{activeFollowup.status === "acknowledged" && <button type="button" onClick={() => { setFeedback(null); setFollowupDecisionExplanation(""); setFollowupDecision("completed") }} className={primaryButtonClass}>{activeFollowup.kind === "change" ? "Mark change complete" : "Complete cancellation"}</button>}<button type="button" onClick={() => { setFeedback(null); setFollowupDecisionExplanation(""); setFollowupDecision("declined") }} className={secondaryButtonClass}>Decline {activeFollowup.kind}</button></div>}</section>}
        <section aria-labelledby="itinerary-heading" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3"><h2 id="itinerary-heading" className="text-xl font-extrabold">Request details</h2>{request.status === "pending" && <button type="button" onClick={() => { setFeedback(null); setNotes(request.notes ?? ""); setEditing(true) }} className={secondaryButtonClass}><Pencil className="mr-2 size-4" aria-hidden="true" />Edit pending request</button>}</div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3"><CalendarDays className="mt-0.5 size-5 shrink-0 text-[#245f0b]" aria-hidden="true" /><div><p className="text-xs font-bold uppercase text-neutral-600">Ride date</p><div className="mt-1 font-semibold">{formatPortalDate(request.rideDate)}</div></div></div>
            <div className="flex gap-3"><Clock3 className="mt-0.5 size-5 shrink-0 text-[#245f0b]" aria-hidden="true" /><div><p className="text-xs font-bold uppercase text-neutral-600">Timing</p><div className="mt-1">Pickup {formatPortalTime(request.requestedPickupTime)}<br />Arrive by {formatPortalTime(request.appointmentTime)}{request.direction === "round_trip" && <><br />Return {request.returnKind === "will_call" ? "call when ready" : formatPortalTime(request.returnTime ?? "")}</>}</div></div></div>
            <div className="flex gap-3 sm:col-span-2"><MapPin className="mt-0.5 size-5 shrink-0 text-[#245f0b]" aria-hidden="true" /><div><p className="text-xs font-bold uppercase text-neutral-600">Route</p><div className="mt-1"><strong>{request.pickupName}</strong><br /><span className="text-sm text-neutral-600">{request.pickupAddress}</span><br /><span aria-hidden="true">↓</span><br /><strong>{request.destinationName}</strong><br /><span className="text-sm text-neutral-600">{request.destinationAddress}</span></div></div></div>
            {request.notes && <div className="sm:col-span-2"><p className="text-xs font-bold uppercase text-neutral-600">Request notes</p><div className="mt-1 whitespace-pre-wrap">{request.notes}</div></div>}
            {isCoordinator && <div><p className="text-xs font-bold uppercase text-neutral-600">Assigned transportation specialist</p><div className="mt-1 font-semibold">{request.assigneeName ?? "Unassigned"}</div></div>}
            {isCoordinator && <div><p className="text-xs font-bold uppercase text-neutral-600">Current trip cost</p><div className="mt-1 font-extrabold">{syncedCost == null ? "Available after scheduling" : syncedCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div></div>}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-200 pt-5"><Link href={`/camden-county/requests/new?duplicate=${request.id}${isCoordinator ? "&onBehalf=true" : ""}`} className={secondaryButtonClass}><Copy className="mr-2 size-4" aria-hidden="true" />Duplicate request</Link>{canTransition && <button type="button" onClick={() => { setFeedback(null); setTransitionStatus(""); setPublicExplanation(""); setCoordinatorActionOpen(true) }} className={primaryButtonClass}>Update status</button>}{canRequestFollowup && <><button type="button" onClick={() => { setFeedback(null); setAction("change"); setReason(""); setExplanation("") }} className={secondaryButtonClass}>Request a change</button><button type="button" onClick={() => { setFeedback(null); setAction("cancellation"); setReason(""); setExplanation("") }} className={secondaryButtonClass}>Request cancellation</button></>}{activeFollowup && !isCoordinator && <p className="w-full text-sm font-semibold text-amber-900">You already have an active {activeFollowup.kind} request. Wait for it to be resolved before submitting another action.</p>}</div>
        </section>
        {request.trips.length > 0 && <section aria-labelledby="linked-trips-heading" className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6"><h2 id="linked-trips-heading" className="text-xl font-extrabold">Confirmed trip details</h2><p className="mt-1 text-sm text-neutral-700">Trip details are updated from Lake Ride Pros records and may take up to 15 minutes. Driver and vehicle information will also be sent by text when available.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{request.trips.map((trip, index) => <article key={trip.id} className="rounded-xl bg-white p-4"><p className="text-xs font-bold uppercase text-neutral-600">{request.trips.length > 1 ? `Trip ${index + 1}` : "Scheduled trip"}</p><p className="mt-2 font-semibold capitalize">{trip.status.replaceAll("_", " ")}</p><p className="mt-2 text-sm"><span className="font-bold">Driver:</span> {trip.driverName ?? "Not assigned"}<br /><span className="font-bold">Vehicle:</span> {trip.vehicleName ?? "Not assigned"}</p></article>)}</div></section>}
        <section aria-labelledby="conversation-heading" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex gap-3"><MessageSquareText className="mt-0.5 size-6 text-[#245f0b]" aria-hidden="true" /><div><h2 id="conversation-heading" className="text-xl font-extrabold">Request conversation</h2><p className="mt-1 text-sm text-neutral-600">Messages are text-only and cannot be edited or deleted. Text alerts will send you back here to reply.</p></div></div>
          {data.detail.messages.length ? <ol className="mt-6 space-y-4">{data.detail.messages.map((item) => <li key={item.id} className={`max-w-[90%] rounded-2xl p-4 ${item.authorRole === "rider" ? "ml-auto bg-[#eaf8e4]" : "bg-neutral-100"}`}><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-bold">{item.authorName}</p><time className="text-xs text-neutral-600" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time></div><p className="mt-2 whitespace-pre-wrap text-sm">{item.body}</p></li>)}</ol> : <p className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">No messages yet.</p>}
          <form onSubmit={sendMessage} className="mt-6"><label htmlFor="new-message" className="mb-1 block text-sm font-bold">Add a message</label><textarea id="new-message" rows={3} maxLength={2000} className={fieldClass} value={message} onChange={(event) => setMessage(event.target.value)} required /><div className="mt-3 flex justify-end"><button disabled={saving || !message.trim()} className={primaryButtonClass}><Send className="mr-2 size-4" aria-hidden="true" />Send message</button></div></form>
        </section>
        <CamdenModal
          open={editing}
          onClose={() => setEditing(false)}
          title="Edit pending request"
          description="Changes are recorded in the request audit history."
          busy={saving}
        >
          {feedback && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900"
            >
              {feedback}
            </div>
          )}
          <form onSubmit={savePending} className="space-y-4">
            <div>
              <label
                htmlFor="edit-notes"
                className="mb-1 block text-sm font-bold"
              >
                Request notes
              </label>
              <textarea
                id="edit-notes"
                rows={4}
                maxLength={1000}
                className={fieldClass}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Only pending requests can be edited directly.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={secondaryButtonClass}
              >
                Never mind
              </button>
              <button disabled={saving} className={primaryButtonClass}>
                {saving ? "Saving…" : "Save update"}
              </button>
            </div>
          </form>
        </CamdenModal>

        <CamdenModal
          open={coordinatorActionOpen}
          onClose={() => setCoordinatorActionOpen(false)}
          title="Update request status"
          description="Acknowledgement means the request was reviewed; confirmation occurs after Lake Ride Pros schedules and links the reservation."
          busy={saving}
        >
          {feedback && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900"
            >
              {feedback}
            </div>
          )}
          <form onSubmit={submitTransition} className="space-y-4">
            <div>
              <label
                htmlFor="transition-status"
                className="mb-1 block text-sm font-bold"
              >
                Move request to
              </label>
              <select
                id="transition-status"
                className={fieldClass}
                value={transitionStatus}
                onChange={(event) =>
                  setTransitionStatus(
                    event.target.value as typeof transitionStatus,
                  )
                }
                required
              >
                <option value="">Select an action</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="needs_information">Needs information</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            {["declined", "needs_information"].includes(transitionStatus) && (
              <div>
                <label
                  htmlFor="public-explanation"
                  className="mb-1 block text-sm font-bold"
                >
                  Rider-visible explanation <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="public-explanation"
                  className={fieldClass}
                  rows={3}
                  value={publicExplanation}
                  onChange={(event) => setPublicExplanation(event.target.value)}
                  required
                />
              </div>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCoordinatorActionOpen(false)}
                className={secondaryButtonClass}
              >
                Never mind
              </button>
              <button
                disabled={saving || !transitionStatus}
                className={primaryButtonClass}
              >
                {saving ? "Saving…" : "Save status"}
              </button>
            </div>
          </form>
        </CamdenModal>

        <CamdenModal
          open={Boolean(action)}
          onClose={() => setAction(null)}
          title={`Request ${action === "change" ? "a change" : "cancellation"}`}
          description={`This action stays attached to ${request.reference}. The ride keeps the same reference and remains visible while Lake Ride Pros processes it.`}
          busy={saving}
        >
          {feedback && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900"
            >
              {feedback}
            </div>
          )}
          <form onSubmit={submitFollowup} className="space-y-4">
            <div>
              <label htmlFor="reason" className="mb-1 block text-sm font-bold">
                Reason <span aria-hidden="true">*</span>
              </label>
              <select
                id="reason"
                className={fieldClass}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {availableReasons.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              {!availableReasons.length && (
                <p
                  role="alert"
                  className="mt-2 text-sm font-semibold text-red-800"
                >
                  No reasons are configured. Contact Lake Ride Pros.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="explanation"
                className="mb-1 block text-sm font-bold"
              >
                Explanation{" "}
                {selectedReason?.requiresExplanation && (
                  <span aria-hidden="true">*</span>
                )}
              </label>
              <textarea
                id="explanation"
                className={fieldClass}
                rows={3}
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                required={selectedReason?.requiresExplanation}
              />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setAction(null)}
                className={secondaryButtonClass}
              >
                Never mind
              </button>
              <button
                disabled={saving || !availableReasons.length}
                className={primaryButtonClass}
              >
                {saving ? "Submitting…" : "Submit request"}
              </button>
            </div>
          </form>
        </CamdenModal>

        <CamdenModal
          open={Boolean(followupDecision)}
          onClose={() => setFollowupDecision(null)}
          title={followupDecision === "acknowledged" ? `Acknowledge ${request.action?.kind ?? "ride action"}` : followupDecision === "completed" ? `Complete ${request.action?.kind ?? "ride action"}` : `Decline ${request.action?.kind ?? "ride action"}`}
          description={followupDecision === "acknowledged" ? "This tells the rider their request was reviewed and is now in progress." : followupDecision === "completed" ? "This resolves the active action while preserving the original ride record and audit history." : "Declining restores the ride’s prior status. Tell the rider why the action cannot be completed."}
          busy={saving}
        >
          {feedback && <div role="alert" className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">{feedback}</div>}
          <form onSubmit={submitFollowupDecision} className="space-y-4">
            {followupDecision === "completed" && request.action?.kind === "cancellation" && <Notice tone="warning" title="This will cancel the ride">Completing this cancellation changes the ride status to cancelled. Confirm the Lake Ride Pros workflow is complete first.</Notice>}
            <div><label htmlFor="followup-decision-explanation" className="mb-1 block text-sm font-bold">Rider-visible update {followupDecision === "declined" && <span aria-hidden="true">*</span>}</label><textarea id="followup-decision-explanation" rows={3} className={fieldClass} value={followupDecisionExplanation} onChange={(event) => setFollowupDecisionExplanation(event.target.value)} required={followupDecision === "declined"} /><p className="mt-1 text-xs text-neutral-600">{followupDecision === "declined" ? "Required when declining." : "Optional; add context that will help the rider."}</p></div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setFollowupDecision(null)} className={secondaryButtonClass}>Never mind</button><button disabled={saving || (followupDecision === "declined" && !followupDecisionExplanation.trim())} className={primaryButtonClass}>{saving ? "Saving…" : followupDecision === "acknowledged" ? "Acknowledge action" : followupDecision === "completed" ? "Complete action" : "Decline action"}</button></div>
          </form>
        </CamdenModal>
      </div>
    </PortalShell>
  )
}

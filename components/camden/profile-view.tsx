"use client"

import { CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react"
import { FormEvent, useCallback, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import { PortalShell } from "./portal-shell"
import { ErrorState, fieldClass, LoadingState, Notice, primaryButtonClass } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function ProfileView() {
  const loader = useCallback(() => createCamdenPortalService().getDashboard(), [])
  const { data, error, loading, reload } = useCamdenData(loader)
  const [email, setEmail] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setFeedback(null)
    try {
      await createCamdenPortalService().updateProfile({ email: email ?? data?.context.email ?? "" })
      setFeedback("Your email address was updated.")
    } catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Your profile could not be updated.") } finally { setSaving(false) }
  }

  if (loading) return <PortalShell><LoadingState label="Loading profile" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "Profile is unavailable."} retry={reload} /></PortalShell>

  return (
    <PortalShell context={data.context}>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold text-[#245f0b]">Account</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-neutral-600">Review your approved contact information and pickup locations.</p>
        <div className="mt-6"><Notice title="Protected profile changes"><p>Name changes require Lake Ride Pros review. A different login phone must be verified and approved before it replaces your current number. Contact Rebecca to begin either change.</p></Notice></div>
        <section aria-labelledby="identity-heading" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 id="identity-heading" className="text-xl font-extrabold">Identity</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-xs font-bold uppercase text-neutral-600">Approved name</dt><dd className="mt-1 font-semibold">{data.context.displayName}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-neutral-600">Verified mobile</dt><dd className="mt-1 font-semibold">{data.context.phone ?? "Available through your coordinator"}</dd></div>
          </dl>
        </section>
        {feedback && <div role="status" className="mt-5 flex gap-2 rounded-xl border border-green-200 bg-green-50 p-4 font-semibold"><CheckCircle2 className="size-5" aria-hidden="true" />{feedback}</div>}
        <form onSubmit={submit} className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <label htmlFor="profile-email" className="mb-1 block text-sm font-bold">Email address (optional)</label>
          <input id="profile-email" type="email" autoComplete="email" className={fieldClass} value={email ?? data.context.email ?? ""} onChange={(event) => setEmail(event.target.value)} />
          <button disabled={saving} className={`${primaryButtonClass} mt-4`}>{saving ? "Saving…" : "Save email"}</button>
        </form>
        <section aria-labelledby="pickups-heading" className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex gap-3"><ShieldCheck className="size-6 text-[#245f0b]" aria-hidden="true" /><div><h2 id="pickups-heading" className="text-xl font-extrabold">Approved pickup locations</h2><p className="mt-1 text-sm text-neutral-600">Ask Rebecca to submit a new pickup address for Lake Ride Pros approval.</p></div></div>
          {data.pickupLocations.length ? <ul className="mt-5 space-y-3">{data.pickupLocations.map((location) => <li key={location.id} className="rounded-xl bg-neutral-50 p-4"><p className="font-bold">{location.name}{location.isDefault && <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-900">Default</span>}</p><p className="mt-1 text-sm text-neutral-700">{location.address}</p></li>)}</ul> : <p className="mt-5 text-sm text-neutral-600">No approved pickup locations are available yet.</p>}
        </section>
        <section className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5"><h2 className="font-extrabold">Urgent transportation help</h2><p className="mt-2 text-sm text-neutral-700">Portal messages are not monitored for emergencies or immediate dispatch assistance.</p><a href={`tel:${data.context.supportPhone}`} className="mt-3 inline-flex min-h-11 items-center font-bold text-amber-950 underline"><PhoneCall className="mr-2 size-4" aria-hidden="true" />Call urgent support</a></section>
      </div>
    </PortalShell>
  )
}

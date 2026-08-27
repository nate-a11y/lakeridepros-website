"use client"

import { CheckCircle2, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useCallback, useState } from "react"
import { createCamdenPortalService } from "@/lib/camden/service"
import { PortalShell } from "./portal-shell"
import { ErrorState, LoadingState, primaryButtonClass } from "./ui"
import { useCamdenData } from "./use-camden-data"

export function PolicyView() {
  const router = useRouter()
  const loader = useCallback(() => createCamdenPortalService().getDashboard(), [])
  const { data, error, loading, reload } = useCamdenData(loader)
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  async function accept(event: FormEvent) {
    event.preventDefault(); if (!data?.context.currentPolicy || !agreed) return
    setBusy(true); setFeedback(null)
    try { await createCamdenPortalService().acceptPolicy(data.context.currentPolicy.id); setFeedback("Rules accepted."); setTimeout(() => router.push("/camden-county"), 700) }
    catch (caught) { setFeedback(caught instanceof Error ? caught.message : "Acceptance could not be saved.") } finally { setBusy(false) }
  }
  if (loading) return <PortalShell><LoadingState label="Loading transportation rules" /></PortalShell>
  if (error || !data) return <PortalShell><ErrorState message={error ?? "Transportation rules are unavailable."} retry={reload} /></PortalShell>
  const policy = data.context.currentPolicy
  return <PortalShell context={data.context}><div className="mx-auto max-w-3xl"><div className="flex gap-4"><ShieldCheck className="mt-1 size-9 shrink-0 text-[#245f0b]" aria-hidden="true" /><div><p className="text-sm font-bold text-[#245f0b]">Required before your first request</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Transportation rules</h1></div></div>{policy ? <><article className="mt-7 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"><div className="border-b border-neutral-200 pb-4"><h2 className="text-2xl font-extrabold">{policy.title}</h2><p className="mt-1 text-sm text-neutral-600">Version {policy.version} · Effective {new Date(policy.effectiveAt).toLocaleDateString("en-US", { dateStyle: "long" })}</p></div><div className="mt-6 whitespace-pre-wrap leading-7 text-neutral-800">{policy.body}</div></article>{feedback && <div role="status" className="mt-5 flex gap-2 rounded-xl border border-green-200 bg-green-50 p-4 font-semibold"><CheckCircle2 className="size-5" aria-hidden="true" />{feedback}</div>}{!data.context.policyAccepted ? <form onSubmit={accept} className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5"><label className="flex min-h-12 items-start gap-3 font-semibold"><input type="checkbox" className="mt-1 size-5 shrink-0" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required /><span>I have read and agree to the current Camden County transportation rules, including notice requirements, approved locations, change and cancellation expectations, and that a request is not guaranteed until confirmed.</span></label><button disabled={!agreed || busy} className={`${primaryButtonClass} mt-5 w-full sm:w-auto`}>{busy ? "Saving…" : "Accept and continue"}</button></form> : <div className="mt-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4"><CheckCircle2 className="size-5 text-green-700" aria-hidden="true" /><p className="font-semibold">You accepted the current version of these rules.</p></div>}</> : <p className="mt-7 rounded-xl border border-amber-300 bg-amber-50 p-5">The current policy has not been published yet. Contact your Treatment Court coordinator before requesting a ride.</p>}</div></PortalShell>
}

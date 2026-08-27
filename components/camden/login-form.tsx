"use client"

import { ArrowRight, KeyRound, MessageSquareText, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import Turnstile from "@/components/Turnstile"
import { isCamdenDemoEnabled } from "@/lib/camden/service"
import { PortalShell } from "./portal-shell"
import { fieldClass, primaryButtonClass, secondaryButtonClass } from "./ui"

function normalizeUsPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 4 ? `(***) ***-${digits.slice(-4)}` : "your approved mobile number"
}

const genericError = "We couldn’t sign you in. Check your information or contact your Treatment Court coordinator."

async function postAuth<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`/api/camden/auth/${path}`, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-Camden-CSRF": "1" },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(payload.error || genericError)
  return payload
}

export function CamdenLoginForm() {
  const router = useRouter()
  const demoMode = isCamdenDemoEnabled()
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [phone, setPhone] = useState("")
  const [normalizedPhone, setNormalizedPhone] = useState("")
  const [challengeToken, setChallengeToken] = useState("")
  const [code, setCode] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const [captchaKey, setCaptchaKey] = useState(0)
  const [resendSeconds, setResendSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (resendSeconds <= 0) return
    const timer = window.setInterval(() => setResendSeconds((value) => Math.max(0, value - 1)), 1_000)
    return () => window.clearInterval(timer)
  }, [resendSeconds])

  function resetCaptcha() {
    setCaptchaToken("")
    setCaptchaKey((value) => value + 1)
  }

  async function sendCode(targetPhone: string) {
    const result = await postAuth<{ ok: boolean; challengeToken: string }>("request-code", { phone: targetPhone, captchaToken })
    if (!result.challengeToken) throw new Error(genericError)
    setChallengeToken(result.challengeToken)
    setResendSeconds(60)
    resetCaptcha()
  }

  async function requestCode(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const normalized = normalizeUsPhone(phone)
    if (!normalized || !captchaToken) {
      setError(!normalized ? "Enter a valid 10-digit phone number." : "Complete the security check.")
      return
    }
    setBusy(true)
    try {
      await sendCode(normalized)
      setNormalizedPhone(normalized)
      setStep("code")
    } catch {
      setError(genericError)
      resetCaptcha()
    } finally {
      setBusy(false)
    }
  }

  async function resendCode() {
    if (busy || resendSeconds > 0) return
    if (!captchaToken) { setError("Complete the security check before requesting another code."); return }
    setBusy(true)
    setError(null)
    try {
      await sendCode(normalizedPhone)
      setCode("")
    } catch {
      setError(genericError)
      resetCaptcha()
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (!/^\d{6}$/.test(code) || !challengeToken) { setError("Enter the six-digit code from your text message."); return }
    setBusy(true)
    try {
      const result = await postAuth<{ role: "rider" | "coordinator"; policyAccepted: boolean }>("verify-code", { challengeToken, code })
      router.replace(result.role === "coordinator" ? "/camden-county/coordinator" : result.policyAccepted ? "/camden-county" : "/camden-county/policy")
      router.refresh()
    } catch {
      setError(genericError)
    } finally {
      setBusy(false)
    }
  }

  function enterDemo(persona: "rider" | "coordinator") {
    router.push(persona === "rider" ? "/camden-county" : "/camden-county/coordinator")
  }

  return (
    <PortalShell>
      <div className="mx-auto grid min-h-[calc(100dvh-10rem)] max-w-5xl items-center gap-10 py-5 lg:grid-cols-[1.1fr_.9fr]">
        <section>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#245f0b]">Camden County Treatment Court</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Transportation requests, all in one place.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-700">Submit transportation requests, track their status, and communicate with the transportation team through one secure portal.</p>
          <ul className="mt-7 space-y-4 text-sm font-semibold text-neutral-700">
            <li className="flex gap-3"><MessageSquareText className="size-5 shrink-0 text-[#245f0b]" aria-hidden="true" />Sign in securely with a one-time code sent to your mobile phone</li>
            <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-[#245f0b]" aria-hidden="true" />Submit requests using approved pickup and destination locations</li>
            <li className="flex gap-3"><KeyRound className="size-5 shrink-0 text-[#245f0b]" aria-hidden="true" />View request status, confirmed trip details, and messages</li>
          </ul>
        </section>
        <section aria-labelledby="sign-in-heading" className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-8">
          <h2 id="sign-in-heading" className="text-2xl font-extrabold">{step === "phone" ? "Sign in to your portal" : "Enter your code"}</h2>
          <p className="mt-2 text-sm text-neutral-600">{step === "phone" ? "Enter the mobile number associated with your Treatment Court transportation access." : `We sent a six-digit code to ${maskPhone(normalizedPhone)}.`}</p>
          {error && <div role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">{error}</div>}
          {step === "phone" ? (
            <form onSubmit={requestCode} className="mt-6 space-y-5">
              <div><label htmlFor="portal-phone" className="mb-2 block text-sm font-bold">Mobile phone number</label><input id="portal-phone" type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 555-1234" required aria-describedby="phone-help" /><p id="phone-help" className="mt-2 text-xs text-neutral-600">Standard message and data rates may apply.</p></div>
              {!demoMode && <Turnstile key={captchaKey} onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken("")} onError={() => setError("The security check could not load. Please try again.")} />}
              <button type="submit" disabled={busy || !captchaToken} className={`${primaryButtonClass} w-full`}>{busy ? "Sending code…" : "Text me a code"}<ArrowRight className="ml-2 size-4" aria-hidden="true" /></button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="mt-6 space-y-5">
              <div><label htmlFor="portal-code" className="mb-2 block text-sm font-bold">Six-digit code</label><input id="portal-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} className={`${fieldClass} text-center text-2xl font-bold tracking-[.4em]`} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required /></div>
              <button type="submit" disabled={busy || code.length !== 6} className={`${primaryButtonClass} w-full`}>{busy ? "Signing in…" : "Sign in"}</button>
              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-xs text-neutral-600">Didn’t receive it? For security, complete the check before resending.</p>
                <div className="mt-3"><Turnstile key={captchaKey} onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken("")} onError={() => setError("The security check could not load. Please try again.")} /></div>
                <button type="button" onClick={resendCode} disabled={busy || resendSeconds > 0 || !captchaToken} className={`${secondaryButtonClass} mt-3 w-full`} aria-describedby="resend-status">{resendSeconds > 0 ? `Resend in ${resendSeconds}s` : busy ? "Sending…" : "Send a new code"}</button>
                <span id="resend-status" className="sr-only" aria-live="polite">{resendSeconds > 0 ? `A new code can be requested in ${resendSeconds} seconds.` : "A new code can be requested now."}</span>
              </div>
              <button type="button" onClick={() => { setStep("phone"); setCode(""); setChallengeToken(""); setResendSeconds(0); resetCaptcha(); setError(null) }} className={`${secondaryButtonClass} w-full`}>Use a different number</button>
            </form>
          )}
          <p className="mt-6 border-t border-neutral-200 pt-5 text-center text-xs leading-relaxed text-neutral-600">Need help signing in? Contact your Treatment Court coordinator or Lake Ride Pros support.</p>
          {demoMode && <div className="mt-6 rounded-xl border border-dashed border-violet-400 bg-violet-50 p-4"><p className="text-sm font-extrabold text-violet-950">Development preview only</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => enterDemo("rider")} className={secondaryButtonClass}>Preview rider</button><button type="button" onClick={() => enterDemo("coordinator")} className={secondaryButtonClass}>Preview coordinator</button></div></div>}
        </section>
      </div>
    </PortalShell>
  )
}

import Link from "next/link"
import { AlertCircle, CheckCircle2, Clock3, Info, RefreshCcw } from "lucide-react"
import type { CamdenFollowupAction, CamdenRequestStatus } from "@/lib/camden/types"

const statusLabels: Record<CamdenRequestStatus, string> = {
  pending: "Pending",
  acknowledged: "Acknowledged",
  needs_information: "Needs information",
  information_received: "Information received",
  confirmed: "Confirmed",
  change_requested: "Change requested",
  cancellation_requested: "Cancellation requested",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No show",
}

const statusStyles: Record<CamdenRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  acknowledged: "bg-blue-100 text-blue-900",
  needs_information: "bg-orange-100 text-orange-900",
  information_received: "bg-violet-100 text-violet-900",
  confirmed: "bg-green-100 text-green-900",
  change_requested: "bg-blue-100 text-blue-900",
  cancellation_requested: "bg-orange-100 text-orange-900",
  declined: "bg-red-100 text-red-900",
  cancelled: "bg-neutral-200 text-neutral-800",
  completed: "bg-green-100 text-green-900",
  no_show: "bg-red-100 text-red-900",
}

export function StatusBadge({ status }: { status: CamdenRequestStatus }) {
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${statusStyles[status]}`}>{statusLabels[status]}</span>
}

export function followupLabel(action: CamdenFollowupAction): string {
  const kind = action.kind === "change" ? "Change" : "Cancellation"
  const status = action.status === "requested" ? "requested" : action.status
  return `${kind} ${status}`
}

const followupStyles: Record<CamdenFollowupAction["status"], string> = {
  requested: "bg-amber-100 text-amber-950",
  acknowledged: "bg-blue-100 text-blue-950",
  declined: "bg-red-100 text-red-900",
  completed: "bg-green-100 text-green-900",
}

export function FollowupBadge({ action }: { action: CamdenFollowupAction }) {
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${followupStyles[action.status]}`}>{followupLabel(action)}</span>
}

export function LoadingState({ label = "Loading your portal" }: { label?: string }) {
  return <div role="status" className="mx-auto flex min-h-64 max-w-md flex-col items-center justify-center gap-4 text-center"><RefreshCcw className="size-8 animate-spin text-[#245f0b] motion-reduce:animate-none" aria-hidden="true" /><p className="font-semibold">{label}</p><span className="sr-only">Please wait</span></div>
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <section role="alert" className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center"><AlertCircle className="mx-auto size-8 text-red-700" aria-hidden="true" /><h1 className="mt-3 text-xl font-bold">We couldn&apos;t load the portal</h1><p className="mt-2 text-sm text-neutral-700">{message}</p>{retry && <button onClick={retry} className="mt-5 min-h-11 rounded-xl bg-neutral-900 px-5 py-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400">Try again</button>}</section>
}

export function EmptyState({ title, message, actionHref, actionLabel }: { title: string; message: string; actionHref?: string; actionLabel?: string }) {
  return <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center"><Info className="mx-auto size-8 text-neutral-500" aria-hidden="true" /><h2 className="mt-3 text-lg font-bold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{message}</p>{actionHref && actionLabel && <Link href={actionHref} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#245f0b] px-5 py-2 font-bold text-white hover:bg-[#174005] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40">{actionLabel}</Link>}</div>
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "success" | "warning"; title: string; children: React.ReactNode }) {
  const styles = tone === "success" ? "border-green-200 bg-green-50" : tone === "warning" ? "border-amber-300 bg-amber-50" : "border-blue-200 bg-blue-50"
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? Clock3 : Info
  return <div className={`flex gap-3 rounded-xl border p-4 ${styles}`}><Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div><p className="font-bold">{title}</p><div className="mt-1 text-sm text-neutral-700">{children}</div></div></div>
}

export function formatPortalDate(date: string) {
  if (!date) return "Date pending"
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`))
}

export function formatPortalTime(time: string) {
  if (!time) return "Time pending"
  const [hour = "0", minute = "0"] = time.split(":")
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(Date.UTC(2020, 0, 1, Number(hour), Number(minute))))
}

export function formatPortalDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export const fieldClass = "min-h-12 w-full rounded-xl border border-neutral-400 bg-white px-3 py-2 text-base text-neutral-950 shadow-sm outline-none placeholder:text-neutral-500 focus:border-[#3a8e11] focus:ring-4 focus:ring-[#4cbb17]/25 disabled:cursor-not-allowed disabled:bg-neutral-100"
export const primaryButtonClass = "inline-flex min-h-12 items-center justify-center rounded-xl bg-[#245f0b] px-5 py-3 font-bold text-white shadow-sm hover:bg-[#174005] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 disabled:cursor-not-allowed disabled:opacity-60"
export const secondaryButtonClass = "inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-400 bg-white px-5 py-3 font-bold text-neutral-900 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 disabled:cursor-not-allowed disabled:opacity-60"

"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, ClipboardList, FileChartColumn, History, LogOut, Menu, UserRound, UsersRound, X } from "lucide-react"
import { useState } from "react"
import type { CamdenUserContext } from "@/lib/camden/types"
import { isCamdenDemoEnabled } from "@/lib/camden/service"

interface PortalShellProps {
  context?: CamdenUserContext
  children: React.ReactNode
}

const riderLinks = [
  { href: "/camden-county", label: "My rides", icon: CalendarDays },
  { href: "/camden-county/requests/new", label: "New request", icon: ClipboardList },
  { href: "/camden-county/history", label: "History", icon: History },
  { href: "/camden-county/profile", label: "Profile", icon: UserRound },
]

const coordinatorLinks = [
  { href: "/camden-county/coordinator", label: "Coordinator", icon: FileChartColumn },
  { href: "/camden-county/participants", label: "Participant snapshots", icon: UsersRound },
  { href: "/camden-county/requests/new?onBehalf=true", label: "Request for a rider", icon: ClipboardList },
]

export function PortalShell({ context, children }: PortalShellProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const links = context?.role === "coordinator"
    ? coordinatorLinks
    : riderLinks

  async function signOut() {
    if (!isCamdenDemoEnabled()) {
      await fetch("/api/camden/auth/sign-out", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "X-Camden-CSRF": "1" },
        body: "{}",
      }).catch(() => undefined)
    }
    router.replace("/camden-county/login")
    router.refresh()
  }

  return (
    <div className="min-h-dvh bg-[#f6f8f5] text-neutral-900">
      <a href="#camden-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:ring-4 focus:ring-[#4cbb17]/40">
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href={context?.role === "coordinator" ? "/camden-county/coordinator" : "/camden-county"} className="flex min-h-11 min-w-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40">
            <Image src="/Color logo - no background (1).svg" alt="Lake Ride Pros" width={122} height={42} priority className="h-10 w-auto" />
            <span className="hidden border-l border-neutral-300 pl-3 text-sm font-semibold text-neutral-700 sm:block">Treatment Court Transportation</span>
          </Link>
          {context && (
            <div className="flex items-center gap-2">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold">{context.displayName}</p>
                <p className="text-xs capitalize text-neutral-600">{context.role.replace("_", " ")}</p>
              </div>
              <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="camden-navigation" aria-label={open ? "Close navigation" : "Open navigation"} className="inline-flex size-11 items-center justify-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 lg:hidden">
                {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[230px_1fr]">
        {context && (
          <nav id="camden-navigation" aria-label="Portal navigation" className={`${open ? "block" : "hidden"} border-b border-neutral-200 bg-white px-4 py-3 lg:block lg:min-h-[calc(100dvh-4.5rem)] lg:border-b-0 lg:border-r lg:px-3 lg:py-7`}>
            <ul className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1">
              {links.map(({ href, label, icon: Icon }) => {
                const hrefPath = href.split("?")[0]
                const active = hrefPath === "/camden-county" ? pathname === hrefPath : pathname.startsWith(hrefPath)
                return <li key={href}><Link href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 ${active ? "bg-[#eaf8e4] text-[#245f0b]" : "text-neutral-700 hover:bg-neutral-100"}`}><Icon className="size-5 shrink-0" aria-hidden="true" />{label}</Link></li>
              })}
            </ul>
            <button type="button" onClick={signOut} className="mt-4 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4cbb17]/40 lg:mt-8">
              <LogOut className="size-5" aria-hidden="true" /> Sign out
            </button>
          </nav>
        )}
        <main id="camden-main" tabIndex={-1} className={`min-w-0 px-4 py-6 outline-none sm:px-6 sm:py-8 ${context ? "" : "lg:col-span-2"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

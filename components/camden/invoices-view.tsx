"use client"

import { Download, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import type { CamdenUserContext } from "@/lib/camden/types"
import { CAMDEN_INVOICE_PAGE_SIZE, camdenInvoiceDocumentHref, camdenInvoiceMonth, camdenInvoiceSentDate, type CamdenPublishedInvoicePage } from "@/lib/camden/invoices"
import { loadCamdenInvoicePage } from "@/lib/camden/invoice-client"
import { PortalShell } from "./portal-shell"
import { EmptyState, ErrorState, LoadingState, secondaryButtonClass } from "./ui"

export function CamdenInvoicesView({ context }: { context: CamdenUserContext }) {
  const [offset, setOffset] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [data, setData] = useState<CamdenPublishedInvoicePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authorized = context.role === "coordinator" && context.accessStatus === "active"

  useEffect(() => {
    if (!authorized) return
    const controller = new AbortController()
    let cancelled = false
    setLoading(true); setError(null); setData(null)
    void loadCamdenInvoicePage(offset, controller.signal).then((result) => {
      if (!cancelled) setData(result)
    }).catch((caught) => {
      if (!cancelled) setError(caught instanceof Error ? caught.message : "Monthly statements are temporarily unavailable.")
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; controller.abort() }
  }, [authorized, offset, refresh])

  if (!authorized) return <ErrorState message="Coordinator access is required." />

  return <PortalShell context={context}>
    <header><p className="text-sm font-bold text-[#245f0b]">Camden County coordinator</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Invoices</h1><p className="mt-2 max-w-3xl text-neutral-600">Monthly Lake Ride Pros statements reviewed, sent, and published by our staff. Each PDF is the same version sent by email.</p></header>
    <p className="mt-4 text-sm font-semibold text-neutral-600">Confidential Program Billing Detail. Payments are not processed in this portal.</p>
    <section aria-label="Published monthly statements" aria-busy={loading} className="mt-7">
      {loading ? <LoadingState label="Loading monthly statements" /> : error ? <ErrorState message={error} retry={() => setRefresh((value) => value + 1)} /> : !data?.invoices.length ? <EmptyState title="No published statements" message="Monthly statements will appear here after Lake Ride Pros sends and publishes them." /> : <>
        <p role="status" className="mb-4 text-sm font-semibold text-neutral-600">{offset + 1}–{offset + data.invoices.length} published statement{data.invoices.length === 1 ? "" : "s"}, newest month first</p>
        <div className="grid min-w-0 gap-4">
          {data.invoices.map((invoice) => {
            const month = camdenInvoiceMonth(invoice.periodStart)
            return <article key={invoice.documentVersionId} className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-xl font-extrabold">{month}</h2><p className="mt-1 break-words text-sm text-neutral-600">Invoice {invoice.invoiceNumber}</p></div><p className="text-xl font-extrabold tabular-nums">{(invoice.totalCents / 100).toLocaleString("en-US", { style: "currency", currency: invoice.currency })}</p></div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold text-neutral-600">Sent date</dt><dd><time dateTime={invoice.sentAt}>{camdenInvoiceSentDate(invoice.sentAt)}</time></dd></div><div className="min-w-0"><dt className="font-semibold text-neutral-600">Document version</dt><dd className="break-all font-mono text-xs">{invoice.documentVersionId}</dd></div></dl>
              <div className="mt-5 flex flex-wrap gap-3"><a href={camdenInvoiceDocumentHref(invoice)} target="_blank" rel="noopener noreferrer" aria-label={`View ${month} invoice ${invoice.invoiceNumber} PDF (opens in a new tab)`} className={secondaryButtonClass}><FileText className="mr-2 size-4" aria-hidden="true" /> View PDF</a><a href={camdenInvoiceDocumentHref(invoice, true)} aria-label={`Download ${month} invoice ${invoice.invoiceNumber} PDF`} className={secondaryButtonClass}><Download className="mr-2 size-4" aria-hidden="true" /> Download PDF</a></div>
            </article>
          })}
        </div>
      </>}
      {!loading && !error && (offset > 0 || data?.hasMore) && <nav aria-label="Statement history pages" className="mt-6 flex flex-wrap items-center gap-3"><button type="button" className={secondaryButtonClass} disabled={offset === 0} onClick={() => setOffset((value) => Math.max(0, value - CAMDEN_INVOICE_PAGE_SIZE))}>Newer statements</button><button type="button" className={secondaryButtonClass} disabled={!data?.hasMore} onClick={() => setOffset((value) => value + CAMDEN_INVOICE_PAGE_SIZE)}>Older statements</button><span className="text-sm text-neutral-600">Page {offset / CAMDEN_INVOICE_PAGE_SIZE + 1}</span></nav>}
    </section>
  </PortalShell>
}

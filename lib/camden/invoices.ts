import { z } from "zod"

export const CAMDEN_INVOICE_PAGE_SIZE = 50
export const CamdenInvoiceIdSchema = z.string().uuid()
export const CamdenInvoiceOffsetSchema = z.coerce.number().int().min(0).max(50_000).refine((value) => value % CAMDEN_INVOICE_PAGE_SIZE === 0)
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const instant = z.string().datetime({ offset: true })

// Allowlisted DTO: never forward storage paths, URLs, recipients, or staff findings.
export const PublishedCamdenInvoiceSchema = z.object({
  id: CamdenInvoiceIdSchema,
  document_version_id: CamdenInvoiceIdSchema,
  invoice_number: z.string().trim().min(1).max(100),
  period_start: date, period_end: date,
  total_cents: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  currency: z.literal("USD"), publication_status: z.literal("published"),
  validated_at: instant, sent_at: instant, published_at: instant,
  content_sha256: z.string().regex(/^[a-f0-9]{64}$/),
}).refine((value) => {
  const start = new Date(`${value.period_start}T00:00:00Z`)
  if (!Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== value.period_start || start.getUTCDate() !== 1) return false
  return value.period_end === new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).toISOString().slice(0, 10)
}, { message: "Statements must cover a full calendar month." })

export const PublishedCamdenInvoiceListSchema = z.object({
  invoices: z.array(PublishedCamdenInvoiceSchema).max(CAMDEN_INVOICE_PAGE_SIZE), has_more: z.boolean(),
}).refine((value) => !value.has_more || value.invoices.length === CAMDEN_INVOICE_PAGE_SIZE)
export type PublishedCamdenInvoiceRecord = z.infer<typeof PublishedCamdenInvoiceSchema>

export interface CamdenPublishedInvoice {
  id: string
  documentVersionId: string
  invoiceNumber: string
  periodStart: string
  periodEnd: string
  totalCents: number
  currency: "USD"
  sentAt: string
  publishedAt: string
}
export interface CamdenPublishedInvoicePage { invoices: CamdenPublishedInvoice[]; hasMore: boolean }

export function publishedInvoiceDto(row: PublishedCamdenInvoiceRecord): CamdenPublishedInvoice {
  return {
    id: row.id, documentVersionId: row.document_version_id, invoiceNumber: row.invoice_number,
    periodStart: row.period_start, periodEnd: row.period_end, totalCents: row.total_cents,
    currency: row.currency, sentAt: row.sent_at, publishedAt: row.published_at,
  }
}
export function camdenInvoiceDocumentHref(invoice: Pick<CamdenPublishedInvoice, "id" | "documentVersionId">, download = false) {
  return `/api/camden/invoices/${encodeURIComponent(invoice.id)}/versions/${encodeURIComponent(invoice.documentVersionId)}/document${download ? "?download=1" : ""}`
}
export function camdenInvoiceMonth(periodStart: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${periodStart}T00:00:00Z`))
}
export function camdenInvoiceSentDate(sentAt: string) {
  return `${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(sentAt))} CT`
}

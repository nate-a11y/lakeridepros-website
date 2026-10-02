import "server-only"
import { createHash } from "node:crypto"
import { CamdenServiceError } from "../types"
import { PublishedCamdenInvoiceListSchema, PublishedCamdenInvoiceSchema, publishedInvoiceDto } from "../invoices"
import { callCamdenGateway } from "./gateway"
import { ServerCamdenPortalService } from "./service"
import { getCamdenServerConfig } from "./config"

export const MAX_CAMDEN_INVOICE_BYTES = 20 * 1024 * 1024
export async function requireInvoiceCoordinator(sessionToken: string) {
  const context = await new ServerCamdenPortalService(sessionToken).getContext()
  if (context.accessStatus !== "active" || context.role !== "coordinator") throw new CamdenServiceError("Coordinator access is required.", "forbidden")
  return context
}
export async function listPublishedCamdenInvoices(sessionToken: string, offset: number) {
  await requireInvoiceCoordinator(sessionToken)
  const parsed = PublishedCamdenInvoiceListSchema.safeParse(await callCamdenGateway(sessionToken, "coordinator_invoices", { limit: 50, offset }))
  if (!parsed.success) throw new CamdenServiceError("Monthly statements are temporarily unavailable.", "unavailable")
  return { invoices: parsed.data.invoices.map(publishedInvoiceDto), hasMore: parsed.data.has_more }
}
async function boundedPdf(response: Response): Promise<Buffer> {
  if (Number(response.headers.get("content-length")) > MAX_CAMDEN_INVOICE_BYTES || !response.body) throw new Error("Invalid document")
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_CAMDEN_INVOICE_BYTES) { await reader.cancel(); throw new Error("Invalid document") }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks)
}
export async function readPublishedCamdenInvoicePdf(sessionToken: string, invoiceId: string, versionId: string) {
  await requireInvoiceCoordinator(sessionToken)
  const parsed = PublishedCamdenInvoiceSchema.safeParse(await callCamdenGateway(sessionToken, "coordinator_invoice_document", { invoice_id: invoiceId, document_version_id: versionId }))
  if (!parsed.success || parsed.data.id !== invoiceId || parsed.data.document_version_id !== versionId) throw new CamdenServiceError("Statement not found.", "not_found")
  const config = getCamdenServerConfig()
  // Fixed authenticated backend read only. No direct Storage API/service-role downloads.
  const response = await fetch(`${config.supabaseUrl}/functions/v1/camden-invoice-document`, {
    method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(30_000),
    headers: { Authorization: `Bearer ${config.supabaseServiceRoleKey}`, "Content-Type": "application/json", Accept: "application/pdf" },
    body: JSON.stringify({ session_token: sessionToken, invoice_id: invoiceId, document_version_id: versionId }),
  })
  if (!response.ok) {
    const code = response.status === 401 ? "unauthorized" : response.status === 403 ? "forbidden" : response.status === 404 ? "not_found" : "unavailable"
    throw new CamdenServiceError("Statement unavailable.", code)
  }
  if (response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/pdf") throw new Error("Invalid document")
  const bytes = await boundedPdf(response)
  if (bytes.subarray(0, 5).toString() !== "%PDF-" || createHash("sha256").update(bytes).digest("hex") !== parsed.data.content_sha256) throw new Error("Invalid document")
  return { bytes, filename: `LRP-Camden-${parsed.data.period_start.slice(0, 7)}-${versionId}.pdf` }
}

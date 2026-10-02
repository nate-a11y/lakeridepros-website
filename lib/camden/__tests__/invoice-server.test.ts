// @vitest-environment node
import { createHash } from "node:crypto"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { listPublishedCamdenInvoices, MAX_CAMDEN_INVOICE_BYTES, readPublishedCamdenInvoicePdf } from "../server/invoices"

const { gateway, getContext } = vi.hoisted(() => ({ gateway: vi.fn(), getContext: vi.fn() }))
vi.mock("../server/gateway", () => ({ callCamdenGateway: gateway }))
vi.mock("../server/service", () => ({ ServerCamdenPortalService: class { getContext = getContext } }))
vi.mock("../server/config", () => ({ getCamdenServerConfig: () => ({ supabaseUrl: "https://camden-test.invalid", supabaseServiceRoleKey: "test-transport-not-a-real-key" }) }))

const token = "a".repeat(43)
const id = "10000000-0000-4000-8000-000000000001"
const versionId = "10000000-0000-4000-8000-000000000002"
const bytes = Buffer.from("%PDF-1.7\nSynthetic unit-test document only\n%%EOF")
const record = { id, document_version_id: versionId, invoice_number: "TEST-100", period_start: "2026-09-01", period_end: "2026-09-30", total_cents: 12345, currency: "USD", publication_status: "published", validated_at: "2026-10-01T15:00:00Z", sent_at: "2026-10-01T16:00:00Z", published_at: "2026-10-01T16:00:01Z", content_sha256: createHash("sha256").update(bytes).digest("hex") }

beforeEach(() => { vi.clearAllMocks(); getContext.mockResolvedValue({ role: "coordinator", accessStatus: "active" }) })
afterEach(() => { vi.restoreAllMocks() })

describe("private coordinator invoice reads", () => {
  it("denies riders, staff roles and inactive coordinators before reading invoices", async () => {
    for (const context of [{ role: "rider", accessStatus: "active" }, { role: "lrp_admin", accessStatus: "active" }, { role: "coordinator", accessStatus: "suspended" }, { role: "coordinator", accessStatus: "removed" }]) {
      getContext.mockResolvedValue(context)
      await expect(listPublishedCamdenInvoices(token, 0)).rejects.toMatchObject({ code: "forbidden" })
      await expect(readPublishedCamdenInvoicePdf(token, id, versionId)).rejects.toMatchObject({ code: "forbidden" })
    }
    expect(gateway).not.toHaveBeenCalled()
  })
  it("requests fixed page size without accepting caller program scope", async () => {
    gateway.mockResolvedValue({ invoices: [record], has_more: false })
    const result = await listPublishedCamdenInvoices(token, 50)
    expect(gateway).toHaveBeenCalledWith(token, "coordinator_invoices", { limit: 50, offset: 50 })
    expect(result.invoices[0]).toMatchObject({ invoiceNumber: "TEST-100", totalCents: 12345, documentVersionId: versionId })
  })
  it("fails closed on drafts or incomplete publication metadata", async () => {
    gateway.mockResolvedValue({ invoices: [{ ...record, publication_status: "draft" }], has_more: false })
    await expect(listPublishedCamdenInvoices(token, 0)).rejects.toMatchObject({ code: "unavailable" })
  })
  it("returns exact PDF bytes via fixed backend endpoint, never storage URLs", async () => {
    gateway.mockResolvedValue(record)
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(bytes, { headers: { "Content-Type": "application/pdf" } }))
    const result = await readPublishedCamdenInvoicePdf(token, id, versionId)
    expect(result.bytes.equals(bytes)).toBe(true)
    expect(fetch).toHaveBeenCalledWith("https://camden-test.invalid/functions/v1/camden-invoice-document", expect.objectContaining({ method: "POST", redirect: "error", cache: "no-store", body: JSON.stringify({ session_token: token, invoice_id: id, document_version_id: versionId }) }))
    expect(gateway).toHaveBeenCalledWith(token, "coordinator_invoice_document", { invoice_id: id, document_version_id: versionId })
  })
  it("rejects an unpublished or substituted version before downloading", async () => {
    const fetch = vi.spyOn(globalThis, "fetch")
    for (const value of [null, { ...record, publication_status: "draft" }, { ...record, document_version_id: "10000000-0000-4000-8000-000000000003" }, { ...record, id: "10000000-0000-4000-8000-000000000003" }]) {
      gateway.mockResolvedValue(value)
      await expect(readPublishedCamdenInvoicePdf(token, id, versionId)).rejects.toMatchObject({ code: "not_found" })
    }
    expect(fetch).not.toHaveBeenCalled()
  })
  it.each([401, 403, 404, 500])("preserves backend authorization/failure status %s without reading error diagnostics", async (status) => {
    gateway.mockResolvedValue(record)
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("private upstream diagnostics", { status }))
    await expect(readPublishedCamdenInvoicePdf(token, id, versionId)).rejects.toMatchObject({ code: status === 401 ? "unauthorized" : status === 403 ? "forbidden" : status === 404 ? "not_found" : "unavailable" })
  })
  it("rejects changed content, HTML, non-PDF signatures and oversized documents", async () => {
    gateway.mockResolvedValue(record)
    const fetch = vi.spyOn(globalThis, "fetch")
    for (const response of [new Response("%PDF-changed", { headers: { "Content-Type": "application/pdf" } }), new Response(bytes, { headers: { "Content-Type": "text/html" } }), new Response("not PDF", { headers: { "Content-Type": "application/pdf" } }), new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Length": String(MAX_CAMDEN_INVOICE_BYTES + 1) } }), new Response(new Uint8Array(MAX_CAMDEN_INVOICE_BYTES + 1), { headers: { "Content-Type": "application/pdf" } })]) {
      fetch.mockResolvedValue(response)
      await expect(readPublishedCamdenInvoicePdf(token, id, versionId)).rejects.toThrow("Invalid document")
    }
  })
})

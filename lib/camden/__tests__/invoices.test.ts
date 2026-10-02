import { describe, expect, it } from "vitest"
import { CamdenInvoiceOffsetSchema, PublishedCamdenInvoiceSchema, camdenInvoiceDocumentHref, camdenInvoiceMonth, camdenInvoiceSentDate, publishedInvoiceDto } from "../invoices"

export const invoiceRecord = {
  id: "10000000-0000-4000-8000-000000000001", document_version_id: "10000000-0000-4000-8000-000000000002",
  invoice_number: "TEST-100", period_start: "2026-09-01", period_end: "2026-09-30", total_cents: 12345,
  currency: "USD" as const, publication_status: "published" as const, validated_at: "2026-10-01T15:00:00Z",
  sent_at: "2026-10-01T16:00:00Z", published_at: "2026-10-01T16:00:01Z", content_sha256: "a".repeat(64),
}

describe("published Camden statement contract", () => {
  it("requires publication, validation, send acceptance, immutable IDs, and hash", () => {
    expect(PublishedCamdenInvoiceSchema.safeParse(invoiceRecord).success).toBe(true)
    for (const patch of [{ publication_status: "draft" }, { validated_at: null }, { sent_at: null }, { published_at: null }, { document_version_id: "latest" }, { content_sha256: "" }]) {
      expect(PublishedCamdenInvoiceSchema.safeParse({ ...invoiceRecord, ...patch }).success).toBe(false)
    }
  })
  it("accepts full calendar months including leap February, but not partial/invalid dates", () => {
    expect(PublishedCamdenInvoiceSchema.safeParse({ ...invoiceRecord, period_start: "2024-02-01", period_end: "2024-02-29" }).success).toBe(true)
    for (const patch of [{ period_start: "2026-09-02" }, { period_end: "2026-10-01" }, { period_end: "2026-09-31" }, { period_start: "2026-13-01" }]) {
      expect(PublishedCamdenInvoiceSchema.safeParse({ ...invoiceRecord, ...patch }).success).toBe(false)
    }
  })
  it("does not coerce, invent, or recalculate financial totals", () => {
    for (const total of ["12345", 1.1, -1, null, Number.POSITIVE_INFINITY]) expect(PublishedCamdenInvoiceSchema.safeParse({ ...invoiceRecord, total_cents: total }).success).toBe(false)
    expect(publishedInvoiceDto(invoiceRecord).totalCents).toBe(12345)
  })
  it("strips storage links, staff data, and recipient addresses", () => {
    const parsed = PublishedCamdenInvoiceSchema.parse({ ...invoiceRecord, invoice_url: "https://private.invalid", storage_path: "hidden", findings: "private", recipients: ["private@example.invalid"] })
    expect(JSON.stringify(publishedInvoiceDto(parsed))).not.toMatch(/storage|https:|findings|recipients|sha256|validated/)
  })
  it("uses only same-origin exact-version document links", () => {
    const invoice = publishedInvoiceDto(invoiceRecord)
    expect(camdenInvoiceDocumentHref(invoice)).toBe(`/api/camden/invoices/${invoice.id}/versions/${invoice.documentVersionId}/document`)
    expect(camdenInvoiceDocumentHref(invoice, true)).toMatch(/\?download=1$/)
  })
  it("labels month without timezone rollover and sent timestamp in Central Time", () => {
    expect(camdenInvoiceMonth("2026-09-01")).toBe("September 2026")
    expect(camdenInvoiceSentDate("2026-10-01T16:00:00Z")).toContain("11:00 AM CT")
    expect(camdenInvoiceSentDate("2026-12-01T16:00:00Z")).toContain("10:00 AM CT")
  })
  it("accepts only bounded full-page offsets", () => {
    expect(CamdenInvoiceOffsetSchema.parse("50")).toBe(50)
    for (const offset of ["-1", "1", "1.5", "50001", "NaN"]) expect(CamdenInvoiceOffsetSchema.safeParse(offset).success).toBe(false)
  })
})

// @vitest-environment node
import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { GET as list } from "@/app/api/camden/invoices/route"
import { GET as document } from "@/app/api/camden/invoices/[invoiceId]/versions/[versionId]/document/route"
import { CamdenServiceError } from "../types"

const { listRead, pdfRead } = vi.hoisted(() => ({ listRead: vi.fn(), pdfRead: vi.fn() }))
vi.mock("../server/invoices", () => ({ listPublishedCamdenInvoices: listRead, readPublishedCamdenInvoicePdf: pdfRead }))
const id = "10000000-0000-4000-8000-000000000001"
const versionId = "10000000-0000-4000-8000-000000000002"
const params = { params: Promise.resolve({ invoiceId: id, versionId }) }
const bytes = Buffer.from("%PDF-1.7\nSynthetic document")
const request = (path = "", token: string | null = "a".repeat(43)) => new NextRequest(`https://website-test.invalid/api/camden/invoices${path}`, { headers: token === null ? {} : { cookie: `camden-session=${token}; __Host-camden-session=${token}` } })
beforeEach(() => { vi.clearAllMocks(); listRead.mockResolvedValue({ invoices: [], hasMore: false }); pdfRead.mockResolvedValue({ bytes, filename: "LRP-Camden-test.pdf" }) })

function expectPrivate(response: Response) {
  expect(response.headers.get("cache-control")).toContain("private, no-store")
  expect(response.headers.get("vary")).toBe("Cookie")
  expect(response.headers.get("x-content-type-options")).toBe("nosniff")
  expect(response.headers.get("x-robots-tag")).toContain("noindex")
}

describe("Camden invoice BFF routes", () => {
  it("requires an opaque cookie on list and PDF even when demo mode is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    try {
      for (const token of [null, "invalid-token"]) {
        const a = await list(request("", token)); const b = await document(request("", token), params)
        expect(a.status).toBe(401); expect(b.status).toBe(401); expectPrivate(a); expectPrivate(b)
      }
      expect(listRead).not.toHaveBeenCalled(); expect(pdfRead).not.toHaveBeenCalled()
    } finally { vi.unstubAllEnvs() }
  })
  it("bounds history pages and rejects caller scope, table or storage path selection", async () => {
    for (const query of ["?offset=1", "?offset=-50", "?offset=bad", "?program_id=other", "?storage_path=other", "?limit=500"]) expect((await list(request(query))).status).toBe(400)
    expect(listRead).not.toHaveBeenCalled()
    const result = await list(request("?offset=50"))
    expect(result.status).toBe(200); expectPrivate(result)
    expect(listRead).toHaveBeenCalledWith("a".repeat(43), 50)
  })
  it("returns identical bytes for inline and attachment, with no upstream URLs/headers", async () => {
    for (const [query, disposition] of [["", "inline"], ["?download=1", "attachment"]]) {
      const result = await document(request(query), params)
      expect(result.status).toBe(200); expectPrivate(result)
      expect(result.headers.get("content-type")).toBe("application/pdf")
      expect(result.headers.get("content-disposition")).toBe(`${disposition}; filename="LRP-Camden-test.pdf"`)
      expect(result.headers.get("content-security-policy")).toContain("frame-ancestors 'self'")
      expect(result.headers.get("location")).toBeNull()
      expect(Buffer.from(await result.arrayBuffer()).equals(bytes)).toBe(true)
    }
    expect(pdfRead).toHaveBeenCalledWith("a".repeat(43), id, versionId)
  })
  it("rejects malformed UUIDs, latest aliases, URLs and unknown query parameters", async () => {
    for (const query of ["?download=0", "?url=https://other.invalid", "?storage_path=anything"]) expect((await document(request(query), params)).status).toBe(400)
    expect((await document(request(), { params: Promise.resolve({ invoiceId: id, versionId: "latest" }) })).status).toBe(400)
    expect(pdfRead).not.toHaveBeenCalled()
  })
  it.each([["unauthorized", 401], ["forbidden", 403], ["not_found", 404], ["unavailable", 503]] as const)("returns private generic %s errors without sensitive diagnostics", async (code, status) => {
    pdfRead.mockRejectedValue(new CamdenServiceError("private detail MUST NOT escape", code))
    const result = await document(request(), params)
    expect(result.status).toBe(status); expectPrivate(result)
    expect(await result.text()).not.toContain("private detail")
  })
  it("fails closed on unexpected transport failures and does not log the error", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
    pdfRead.mockRejectedValue(new Error("session secret / storage detail"))
    const result = await document(request(), params)
    expect(result.status).toBe(503); expectPrivate(result)
    expect(await result.text()).not.toContain("secret")
    expect(log).not.toHaveBeenCalled(); log.mockRestore()
  })
})

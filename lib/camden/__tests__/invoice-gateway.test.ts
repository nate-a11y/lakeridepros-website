// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"
import { callCamdenGateway } from "../server/gateway"
import { invoiceError } from "../server/invoice-http"

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }))
vi.mock("../server/service-client", () => ({ createCamdenServiceClient: () => ({ rpc }) }))
beforeEach(() => vi.clearAllMocks())

describe("coordinator invoice gateway denial classification", () => {
  it.each(["current_context", "coordinator_invoices", "coordinator_invoice_document"] as const)("returns private HTTP403 for suspension during %s", async operation => {
    rpc.mockResolvedValue({ data: null, error: { code: "42501", message: "Portal access suspended" } })
    let caught: unknown
    try { await callCamdenGateway("synthetic-session", operation) } catch (error) { caught = error }
    expect(caught).toMatchObject({ code: "forbidden" })
    const response = invoiceError(caught)
    expect(response.status).toBe(403)
    expect(response.headers.get("Cache-Control")).toContain("private, no-store")
    expect(await response.text()).not.toContain("suspended")
  })
  it("classifies a wrong coordinator role as forbidden rather than expired", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "42501", message: "Coordinator access required" } })
    await expect(callCamdenGateway("synthetic-session", "coordinator_invoices")).rejects.toMatchObject({ code: "forbidden" })
  })
  it.each(["Portal session expired", "Portal session required"])("keeps %s unauthorized", async message => {
    rpc.mockResolvedValue({ data: null, error: { code: "42501", message } })
    await expect(callCamdenGateway("synthetic-session", "coordinator_invoices")).rejects.toMatchObject({ code: "unauthorized" })
  })
  it("does not label an unrelated database failure as a permission denial", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "XX000", message: "Database unavailable" } })
    await expect(callCamdenGateway("synthetic-session", "coordinator_invoices")).rejects.toMatchObject({ code: "unavailable" })
  })
})

import { afterEach, describe, expect, it, vi } from "vitest"
import { loadCamdenInvoicePage } from "../invoice-client"
afterEach(() => { vi.restoreAllMocks() })
describe("invoice browser transport", () => {
  it("uses same-origin HttpOnly-cookie authorization and no caching", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ invoices: [], hasMore: false })))
    const controller = new AbortController()
    expect(await loadCamdenInvoicePage(50, controller.signal)).toEqual({ invoices: [], hasMore: false })
    expect(fetch).toHaveBeenCalledWith("/api/camden/invoices?offset=50", { credentials: "same-origin", cache: "no-store", signal: controller.signal })
  })
  it("surfaces the BFF error instead of treating failure as empty history", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "Your session has expired." }), { status: 401 }))
    await expect(loadCamdenInvoicePage(0)).rejects.toThrow("Your session has expired.")
  })
})

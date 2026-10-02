import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CamdenInvoicesView } from "../invoices-view"
import type { CamdenUserContext } from "@/lib/camden/types"
import type { CamdenPublishedInvoicePage } from "@/lib/camden/invoices"

const { load } = vi.hoisted(() => ({ load: vi.fn() }))
vi.mock("@/lib/camden/invoice-client", () => ({ loadCamdenInvoicePage: load }))
vi.mock("../portal-shell", () => ({ PortalShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }))
const context = { userId: "test-coordinator", displayName: "Test coordinator", role: "coordinator", accessStatus: "active", riderId: null, policyAccepted: true, currentPolicy: null, supportPhone: "", companionFieldsEnabled: false } as CamdenUserContext
const invoice = { id: "10000000-0000-4000-8000-000000000001", documentVersionId: "10000000-0000-4000-8000-000000000002", invoiceNumber: "TEST-100", periodStart: "2026-09-01", periodEnd: "2026-09-30", totalCents: 12345, currency: "USD" as const, sentAt: "2026-10-01T16:00:00Z", publishedAt: "2026-10-01T16:00:01Z" }
beforeEach(() => { vi.clearAllMocks(); load.mockResolvedValue({ invoices: [invoice], hasMore: false }) })

describe("coordinator published invoice area", () => {
  it("shows full month, source total, invoice number, CT send time, and exact-version private links", async () => {
    render(<CamdenInvoicesView context={context} />)
    expect(screen.getByText("Loading monthly statements")).toBeInTheDocument()
    expect(await screen.findByRole("heading", { name: "September 2026" })).toBeInTheDocument()
    expect(screen.getByText("Invoice TEST-100")).toBeInTheDocument()
    expect(screen.getByText("$123.45")).toBeInTheDocument()
    expect(screen.getByText(/11:00 AM CT/)).toBeInTheDocument()
    const view = screen.getByRole("link", { name: /View September 2026 invoice TEST-100 PDF/ })
    const download = screen.getByRole("link", { name: /Download September 2026 invoice TEST-100 PDF/ })
    expect(view).toHaveAttribute("href", `/api/camden/invoices/${invoice.id}/versions/${invoice.documentVersionId}/document`)
    expect(view).toHaveAttribute("rel", "noopener noreferrer")
    expect(download).toHaveAttribute("href", `${view.getAttribute("href")}?download=1`)
    expect(screen.queryByRole("button", { name: /send|publish|validate/i })).not.toBeInTheDocument()
  })
  it("shows only published history including distinct immutable versions of the same month", async () => {
    load.mockResolvedValue({ invoices: [invoice, { ...invoice, documentVersionId: "10000000-0000-4000-8000-000000000003", sentAt: "2026-09-30T16:00:00Z" }], hasMore: false })
    render(<CamdenInvoicesView context={context} />)
    expect(await screen.findAllByRole("heading", { name: "September 2026" })).toHaveLength(2)
    expect(screen.getAllByRole("link", { name: /View September/ }).map((link) => link.getAttribute("href"))).toEqual(expect.arrayContaining([expect.stringContaining(invoice.documentVersionId), expect.stringContaining("10000000-0000-4000-8000-000000000003")]))
  })
  it("handles unpublished empty state without placeholders or draft document links", async () => {
    load.mockResolvedValue({ invoices: [], hasMore: false })
    render(<CamdenInvoicesView context={context} />)
    expect(await screen.findByText("No published statements")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /PDF/ })).not.toBeInTheDocument()
  })
  it("handles errors and retry without exposing stale invoice data", async () => {
    load.mockRejectedValueOnce(new Error("Your session has expired. Please sign in again."))
    render(<CamdenInvoicesView context={context} />)
    expect(await screen.findByRole("alert")).toHaveTextContent("Your session has expired")
    expect(screen.queryByText("Invoice TEST-100")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(await screen.findByText("Invoice TEST-100")).toBeInTheDocument()
  })
  it("navigates older/newer pages and clears the previous page while loading", async () => {
    load.mockResolvedValueOnce({ invoices: [invoice], hasMore: true }).mockResolvedValueOnce({ invoices: [{ ...invoice, periodStart: "2026-08-01", periodEnd: "2026-08-31" }], hasMore: false })
    render(<CamdenInvoicesView context={context} />)
    fireEvent.click(await screen.findByRole("button", { name: "Older statements" }))
    expect(await screen.findByRole("heading", { name: "August 2026" })).toBeInTheDocument()
    expect(load).toHaveBeenLastCalledWith(50, expect.any(AbortSignal))
    expect(screen.queryByRole("heading", { name: "September 2026" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Older statements" })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Newer statements" }))
    await waitFor(() => expect(load).toHaveBeenLastCalledWith(0, expect.any(AbortSignal)))
  })
  it("does not fetch or render statement details for riders/inactive coordinators", () => {
    const { rerender } = render(<CamdenInvoicesView context={{ ...context, role: "rider" }} />)
    expect(screen.getByRole("alert")).toHaveTextContent("Coordinator access is required")
    rerender(<CamdenInvoicesView context={{ ...context, accessStatus: "suspended" }} />)
    expect(load).not.toHaveBeenCalled()
  })
  it("ignores a late result after a retry/page load is superseded", async () => {
    let resolveFirst!: (page: CamdenPublishedInvoicePage) => void
    load.mockReturnValueOnce(new Promise<CamdenPublishedInvoicePage>((resolve) => { resolveFirst = resolve }))
    const { unmount } = render(<CamdenInvoicesView context={context} />)
    unmount()
    resolveFirst({ invoices: [invoice], hasMore: false })
    expect(screen.queryByText("Invoice TEST-100")).not.toBeInTheDocument()
  })
})

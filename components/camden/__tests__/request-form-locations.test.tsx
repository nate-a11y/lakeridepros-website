import { fireEvent, render, screen, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createDemoDashboard } from "@/lib/camden/demo-data"
import { NewRequestForm } from "../request-form"

const state = vi.hoisted(() => ({ coordinator: false, duplicate: false }))
const fetchMock = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(`${state.coordinator ? "onBehalf=true&" : ""}${state.duplicate ? "duplicate=source" : ""}`),
  usePathname: () => "/camden-county/requests/new",
  useRouter: () => ({ push: vi.fn() }),
}))

beforeEach(() => {
  state.coordinator = false
  state.duplicate = false
  const dashboard = createDemoDashboard("rider")
  dashboard.context.policyAccepted = true
  dashboard.context.riderId = "rider-1"
  dashboard.requests = []
  dashboard.riders = [{ id: "rider-1", name: "Rider One" }, { id: "rider-2", name: "Rider Two" }]
  dashboard.pickupLocations = [
    { id: "home-1", riderId: "rider-1", name: "Home", address: "1 Home St, Unit A" },
    { id: "home-2", riderId: "rider-2", name: "Other home", address: "2 Home St" },
  ]
  dashboard.destinations = [
    { id: "clinic-a", name: "Clinic", address: "10 Clinic Rd", category: "Treatment" },
    { id: "clinic-b", name: "Clinic", address: "10 Clinic Rd", category: "Appointments" },
    { id: "clinic-c", name: "Clinic", address: "10 Clinic Dr", category: "Treatment" },
    { id: "clinic-unit", name: "Clinic", address: "10 Clinic Rd, Suite 2" },
  ]
  fetchMock.mockImplementation(async (_url, options) => {
    if (options?.method === "POST") return new Response(JSON.stringify({ id: "saved", message: "Saved" }))
    const result = structuredClone(dashboard)
    if (state.coordinator) { result.context.role = "coordinator"; result.context.riderId = null }
    if (state.duplicate) result.requests = [{ ...createDemoDashboard("rider").requests[0], id: "source", riderId: "rider-1", pickupLocationId: "clinic-b", destinationLocationId: "home-1" }]
    return new Response(JSON.stringify(result))
  })
  vi.stubGlobal("fetch", fetchMock)
})

describe("approved request endpoints", () => {
  it("offers the rider's home and approved facilities for both pickup and drop-off without exact duplicates", async () => {
    render(<NewRequestForm />)
    const pickup = await screen.findByRole("combobox", { name: /^Pickup/ })
    const destination = screen.getByRole("combobox", { name: /^Destination/ })
    for (const select of [pickup, destination]) {
      expect(within(select).getByRole("option", { name: "Home — 1 Home St, Unit A" })).toBeInTheDocument()
      expect(within(select).getAllByRole("option", { name: "Clinic — 10 Clinic Rd" })).toHaveLength(1)
      expect(within(select).getByRole("option", { name: "Clinic — 10 Clinic Dr" })).toBeInTheDocument()
      expect(within(select).getByRole("option", { name: "Clinic — 10 Clinic Rd, Suite 2" })).toBeInTheDocument()
      expect(within(select).queryByRole("option", { name: /Other home/ })).not.toBeInTheDocument()
    }
  })

  it.each([
    ["home-1", "clinic-a"],
    ["clinic-a", "home-1"],
  ])("submits pickup %s and destination %s without swapping their IDs", async (pickupId, destinationId) => {
    const user = userEvent.setup()
    render(<NewRequestForm />)
    await screen.findByRole("combobox", { name: /^Pickup/ })
    await user.selectOptions(screen.getByRole("combobox", { name: /^Ride type/ }), "type-treatment")
    fireEvent.change(screen.getByLabelText(/^Ride date/), { target: { value: "2099-10-01" } })
    fireEvent.change(screen.getByLabelText(/^Requested pickup time/), { target: { value: "09:00" } })
    fireEvent.change(screen.getByLabelText(/^Appointment/), { target: { value: "10:00" } })
    await user.selectOptions(screen.getByRole("combobox", { name: /^Pickup/ }), pickupId)
    await user.selectOptions(screen.getByRole("combobox", { name: /^Destination/ }), destinationId)
    await user.click(screen.getByRole("button", { name: "Submit request" }))
    expect(await screen.findByRole("heading", { name: "Request submitted" })).toBeInTheDocument()
    const submitted = fetchMock.mock.calls.find(([url]) => url.endsWith("/submit-request"))
    expect(JSON.parse(submitted![1].body).input).toMatchObject({ pickupLocationId: pickupId, destinationLocationId: destinationId })
  })

  it("requires a coordinator to select a rider and clears both endpoints when that rider changes", async () => {
    state.coordinator = true
    const user = userEvent.setup()
    render(<NewRequestForm />)
    const pickup = await screen.findByRole("combobox", { name: /^Pickup/ })
    const destination = screen.getByRole("combobox", { name: /^Destination/ })
    expect(pickup).toBeDisabled()
    expect(destination).toBeDisabled()
    expect(within(destination).queryByRole("option", { name: /Home —/ })).not.toBeInTheDocument()
    const rider = screen.getByRole("combobox", { name: /^Approved rider/ })
    await user.selectOptions(rider, "rider-1")
    await user.selectOptions(pickup, "clinic-a")
    await user.selectOptions(destination, "home-1")
    await user.selectOptions(rider, "rider-2")
    expect(pickup).toHaveValue("")
    expect(destination).toHaveValue("")
    expect(within(destination).queryByRole("option", { name: "Home — 1 Home St, Unit A" })).not.toBeInTheDocument()
  })

  it("preserves the existing location ID when duplicating a request that used a duplicate catalog entry", async () => {
    state.duplicate = true
    render(<NewRequestForm />)
    const pickup = await screen.findByRole("combobox", { name: /^Pickup/ })
    await waitFor(() => expect(pickup).toHaveValue("clinic-b"))
    expect(within(pickup).getAllByRole("option", { name: "Clinic — 10 Clinic Rd" })).toHaveLength(1)
    expect(screen.getByRole("combobox", { name: /^Destination/ })).toHaveValue("home-1")
  })
})

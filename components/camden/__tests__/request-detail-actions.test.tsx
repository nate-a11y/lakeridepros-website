import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { CamdenDashboardData, CamdenRequest, CamdenRequestDetail, CamdenUserContext } from "@/lib/camden/types"
import { RequestDetailView } from "../request-detail"

const navigation = vi.hoisted(() => ({ coordinator: true }))
const transitionFollowup = vi.hoisted(() => vi.fn().mockResolvedValue({ id: "request-1", message: "Saved" }))

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "request-1" }),
  useSearchParams: () => new URLSearchParams(navigation.coordinator ? "coordinator=true" : ""),
  usePathname: () => "/camden-county/requests/request-1",
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}))

const request: CamdenRequest = {
  id: "request-1",
  reference: "CC-20260827-0042",
  requestKind: "ride",
  riderId: "rider-1",
  riderName: "Jordan Taylor",
  status: "change_requested",
  rideTypeId: "type-1",
  rideTypeName: "Treatment appointment",
  rideDate: "2026-09-02",
  requestedPickupTime: "08:15",
  appointmentTime: "09:00",
  direction: "one_way",
  pickupLocationId: "pickup-1",
  pickupName: "Home",
  pickupAddress: "1 Main St",
  destinationLocationId: "destination-1",
  destinationName: "Compass Health",
  destinationAddress: "2 Main St",
  lateUrgent: false,
  version: 4,
  createdAt: "2026-08-27T15:00:00Z",
  updatedAt: "2026-08-27T15:05:00Z",
  action: {
    cycleId: "cycle-1",
    sequence: 1,
    kind: "change",
    status: "requested",
    previousStatus: "acknowledged",
    reasonId: "reason-1",
    reasonLabel: "Schedule or appointment changed",
    explanation: "Appointment moved to 10:00 AM.",
    requestedAt: "2026-08-27T15:05:00Z",
    lateUrgent: false,
  },
  trips: [],
}

function context(role: "rider" | "coordinator"): CamdenUserContext {
  return {
    userId: `${role}-1`,
    role,
    displayName: role === "rider" ? "Jordan Taylor" : "Rebecca Morgan",
    riderId: role === "rider" ? "rider-1" : null,
    accessStatus: "active",
    policyAccepted: true,
    currentPolicy: null,
    supportPhone: "+15735550199",
    companionFieldsEnabled: false,
  }
}

function dashboard(role: "rider" | "coordinator"): CamdenDashboardData {
  return {
    context: context(role),
    requests: [request],
    riders: [],
    pickupLocations: [],
    destinations: [],
    rideTypes: [],
    changeReasons: [],
  }
}

const getRequest = vi.hoisted(() => vi.fn())
const getDashboard = vi.hoisted(() => vi.fn())

vi.mock("@/lib/camden/service", () => ({
  isCamdenDemoEnabled: () => false,
  createCamdenPortalService: (persona: "rider" | "coordinator" = "rider") => ({
    getDashboard: () => getDashboard(persona),
    getRequest,
    transitionFollowup,
    addMessage: vi.fn(),
    updatePendingRequest: vi.fn(),
    createFollowup: vi.fn(),
    transitionRequest: vi.fn(),
  }),
}))

beforeEach(() => {
  navigation.coordinator = true
  getDashboard.mockImplementation((persona: "rider" | "coordinator") => Promise.resolve(dashboard(persona)))
  getRequest.mockResolvedValue({ request, messages: [] } satisfies CamdenRequestDetail)
  transitionFollowup.mockClear()
})

describe("same-record ride actions", () => {
  it("distinguishes a pending portal request from its linked trip status", async () => {
    const pendingRequest: CamdenRequest = {
      ...request,
      status: "pending",
      action: null,
      trips: [
        {
          id: "trip-1",
          pickupAt: "2026-09-02T08:15:00-05:00",
          pickupName: "Home",
          pickupAddress: "1 Main St",
          destinationName: "Compass Health",
          destinationAddress: "2 Main St",
          status: "confirmed",
        },
      ],
    }
    getRequest.mockResolvedValue({
      request: pendingRequest,
      messages: [],
    } satisfies CamdenRequestDetail)

    render(<RequestDetailView />)

    expect(await screen.findByText("Linked Lake Ride Pros trip")).toBeInTheDocument()
    expect(screen.getByText(/request status shown at the top and the linked trip status below are separate/i)).toBeInTheDocument()
    expect(screen.getByText("Lake Ride Pros trip status")).toBeInTheDocument()
    expect(screen.queryByText("Confirmed trip details")).not.toBeInTheDocument()
  })

  it("prevents a rider from opening a second action while one is active", async () => {
    navigation.coordinator = false
    render(<RequestDetailView />)

    expect(await screen.findByText("Active ride action")).toBeInTheDocument()
    expect(screen.getByText(/already have an active change request/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Request a change" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Request cancellation" })).not.toBeInTheDocument()
    expect(screen.getByText("CC-20260827-0042")).toBeInTheDocument()
  })

  it("lets a coordinator acknowledge the action against the ride version", async () => {
    const user = userEvent.setup()
    render(<RequestDetailView />)

    const acknowledge = await screen.findByRole("button", { name: "Acknowledge change" })
    expect(screen.getByRole("button", { name: "Decline change" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Update status" })).not.toBeInTheDocument()

    await user.click(acknowledge)
    expect(screen.getByRole("dialog", { name: "Acknowledge change" })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Acknowledge action" }))

    await waitFor(() => expect(transitionFollowup).toHaveBeenCalledWith("request-1", 4, "acknowledged", undefined))
  })
})

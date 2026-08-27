import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { RequestCard } from "../request-card"
import type { CamdenRequest } from "@/lib/camden/types"

const request: CamdenRequest = {
  id: "request-1", reference: "CC-20260827-0001", riderId: "rider-1", riderName: "Jordan Taylor",
  status: "confirmed", rideTypeId: "type-1", rideTypeName: "Treatment appointment", rideDate: "2026-09-02",
  requestedPickupTime: "08:15", appointmentTime: "09:00", direction: "one_way", pickupLocationId: "pickup-1",
  pickupName: "Home", pickupAddress: "1 Main St", destinationLocationId: "location-1", destinationName: "Compass Health",
  destinationAddress: "2 Main St", lateUrgent: false, version: 1, createdAt: "2026-08-27T00:00:00Z",
  updatedAt: "2026-08-27T00:00:00Z", action: null, trips: [{ id: "trip-1", pickupAt: "2026-09-02T13:15:00Z",
    pickupName: "Home", pickupAddress: "1 Main St", destinationName: "Compass Health", destinationAddress: "2 Main St",
    status: "confirmed", cost: 64.50 }],
}

describe("RequestCard", () => {
  it("does not render rider costs by default", () => {
    render(<RequestCard request={request} />)
    expect(screen.queryByText("$64.50")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute("href", "/camden-county/requests/request-1")
  })

  it("renders costs and a coordinator detail link only when explicitly requested", () => {
    render(<RequestCard request={request} showRider showCost />)
    expect(screen.getByText("$64.50")).toBeInTheDocument()
    expect(screen.getByText("Jordan Taylor")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute("href", "/camden-county/requests/request-1?coordinator=true")
  })

  it("shows an active action on the original ride card and preserves its detail URL", () => {
    render(<RequestCard request={{
      ...request,
      status: "change_requested",
      version: 2,
      action: {
        cycleId: "action-cycle-1",
        sequence: 1,
        kind: "change",
        status: "requested",
        previousStatus: "confirmed",
        reasonLabel: "Schedule or appointment changed",
        requestedAt: "2026-08-27T15:00:00Z",
        lateUrgent: false,
      },
    }} />)

    expect(screen.getByText("Active ride action")).toBeInTheDocument()
    expect(screen.getByText("Schedule or appointment changed")).toBeInTheDocument()
    expect(screen.getByText("Awaiting coordinator review")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute("href", "/camden-county/requests/request-1")
    expect(screen.getAllByText("CC-20260827-0001")).toHaveLength(1)
  })
})

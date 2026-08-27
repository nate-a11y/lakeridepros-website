import { describe, expect, it } from "vitest"
import { hideRiderCosts, isCamdenDemoEnabled, serializeCamdenRequestDraft } from "../service"
import type { CamdenRequest } from "../types"

function requestWithCost(): CamdenRequest {
  return {
    id: "request-1", reference: "CC-1", riderId: "rider-1", riderName: "Rider", status: "confirmed",
    rideTypeId: "type-1", rideTypeName: "Appointment", rideDate: "2026-09-01", requestedPickupTime: "09:00",
    appointmentTime: "10:00", direction: "one_way", pickupLocationId: "pickup-1", pickupName: "Home",
    pickupAddress: "1 Main St", destinationLocationId: "destination-1", destinationName: "Court",
    destinationAddress: "2 Main St", lateUrgent: false, version: 1, createdAt: "2026-08-27T00:00:00Z",
    updatedAt: "2026-08-27T00:00:00Z", trips: [{ id: "trip-1", pickupAt: "2026-09-01T14:00:00Z",
      pickupName: "Home", pickupAddress: "1 Main St", destinationName: "Court", destinationAddress: "2 Main St",
      status: "confirmed", cost: 75.25 }],
  }
}

describe("Camden portal data boundaries", () => {
  it("removes every synced cost from rider request data", () => {
    const result = hideRiderCosts(requestWithCost())
    expect(result.trips[0].cost).toBeUndefined()
  })

  it("does not mutate the source request while removing costs", () => {
    const source = requestWithCost()
    hideRiderCosts(source)
    expect(source.trips[0].cost).toBe(75.25)
  })

  it("cannot enable the demo adapter in the test or production environment", () => {
    expect(isCamdenDemoEnabled()).toBe(false)
  })

  it("never serializes stale return fields for a one-way request", () => {
    expect(serializeCamdenRequestDraft({
      direction: "one_way",
      returnKind: "scheduled",
      returnTime: "15:30",
    })).toEqual({
      direction: "one_way",
      return_type: null,
      requested_return_time: null,
    })
  })

  it("serializes return fields only for a round trip", () => {
    expect(serializeCamdenRequestDraft({
      direction: "round_trip",
      returnKind: "scheduled",
      returnTime: "15:30",
    })).toMatchObject({
      direction: "round_trip",
      return_type: "specific_time",
      requested_return_time: "15:30",
    })
  })

  it("clears a scheduled return time when changing to will-call", () => {
    expect(serializeCamdenRequestDraft({
      direction: "round_trip",
      returnKind: "will_call",
      returnTime: "15:30",
    })).toMatchObject({
      direction: "round_trip",
      return_type: "call_when_ready",
      requested_return_time: null,
    })
  })
})

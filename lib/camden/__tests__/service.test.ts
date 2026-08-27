import { describe, expect, it } from "vitest"
import { hideRiderCosts, isCamdenDemoEnabled, serializeCamdenRequestDraft } from "../service"
import { mapRequest } from "../mapping"
import type { CamdenRequest } from "../types"

function requestWithCost(): CamdenRequest {
  return {
    id: "request-1", reference: "CC-1", riderId: "rider-1", riderName: "Rider", status: "confirmed",
    rideTypeId: "type-1", rideTypeName: "Appointment", rideDate: "2026-09-01", requestedPickupTime: "09:00",
    appointmentTime: "10:00", direction: "one_way", pickupLocationId: "pickup-1", pickupName: "Home",
    pickupAddress: "1 Main St", destinationLocationId: "destination-1", destinationName: "Court",
    destinationAddress: "2 Main St", lateUrgent: false, version: 1, createdAt: "2026-08-27T00:00:00Z",
    updatedAt: "2026-08-27T00:00:00Z", action: null, trips: [{ id: "trip-1", pickupAt: "2026-09-01T14:00:00Z",
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

  it("maps a follow-up onto the original ride without changing its identity", () => {
    const result = mapRequest({
      id: "00000000-0000-4000-8000-000000000001",
      reference: "CC-20260827-0042",
      request_kind: "ride",
      status: "change_requested",
      version: 3,
      action_cycle_id: "00000000-0000-4000-8000-000000000003",
      action_sequence: 1,
      action_kind: "change",
      action_status: "acknowledged",
      action_previous_status: "confirmed",
      action_reason_id: "00000000-0000-4000-8000-000000000002",
      action_reason_label: "Schedule changed",
      action_explanation: "Appointment moved to 11:00 AM.",
      action_requested_by: "00000000-0000-4000-8000-000000000004",
      action_requested_at: "2026-08-27T15:00:00Z",
      action_acknowledge_due_at: "2026-08-27T17:00:00Z",
      action_resolve_due_at: "2026-08-28T15:00:00Z",
      action_acknowledged_at: "2026-08-27T15:05:00Z",
      action_late_urgent: true,
    })

    expect(result).toMatchObject({
      id: "00000000-0000-4000-8000-000000000001",
      reference: "CC-20260827-0042",
      requestKind: "ride",
      status: "change_requested",
      version: 3,
      action: {
        cycleId: "00000000-0000-4000-8000-000000000003",
        kind: "change",
        status: "acknowledged",
        previousStatus: "confirmed",
        reasonLabel: "Schedule changed",
        acknowledgeDueAt: "2026-08-27T17:00:00Z",
        resolveDueAt: "2026-08-28T15:00:00Z",
        lateUrgent: true,
      },
    })
  })
})

import type {
  CamdenChangeReason,
  CamdenDashboardData,
  CamdenFollowupAction,
  CamdenLocation,
  CamdenParticipantProfile,
  CamdenParticipantRosterDetails,
  CamdenParticipantSnapshots,
  CamdenRequest,
  CamdenRequestDraft,
  CamdenRequestStatus,
  CamdenRideType,
  CamdenSnapshotFilter,
  CamdenUserContext,
} from "./types"

export type UnknownRecord = Record<string, unknown>

export function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {}
}

export function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback
}

export function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value) || fallback
}

export function addressValue(row: UnknownRecord): string {
  if (typeof row.address === "string") return row.address
  return [row.address_line1, row.address_line2, row.city, row.state, row.postal_code]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join(", ")
}

export function serializeCamdenRequestDraft(input: Partial<CamdenRequestDraft>): UnknownRecord {
  const payload: UnknownRecord = {}
  const put = (key: string, value: unknown) => { if (value !== undefined) payload[key] = value }
  put("rider_id", input.riderId)
  put("ride_type_id", input.rideTypeId)
  put("service_date", input.rideDate)
  put("requested_pickup_time", input.requestedPickupTime)
  put("appointment_time", input.appointmentTime)
  put("direction", input.direction)
  if (input.direction === "one_way") {
    put("return_type", null)
    put("requested_return_time", null)
  } else if (input.direction === "round_trip") {
    put("return_type", input.returnKind === "scheduled" ? "specific_time" : input.returnKind === "will_call" ? "call_when_ready" : undefined)
    put("requested_return_time", input.returnKind === "scheduled" ? input.returnTime : input.returnKind === "will_call" ? null : undefined)
  }
  put("pickup_location_id", input.pickupLocationId)
  put("destination_location_id", input.destinationLocationId)
  put("rider_notes", input.notes)
  put("companion_count", input.companionCount)
  put("companion_details", input.companionDetails)
  put("duplicate_override", input.duplicateConfirmed)
  return payload
}

export function hideRiderCosts(request: CamdenRequest): CamdenRequest {
  return { ...request, trips: request.trips.map((trip) => ({ ...trip, cost: undefined })) }
}

export function mapRequest(value: unknown): CamdenRequest {
  const row = record(value)
  const actionKind = stringValue(row.action_kind)
  const actionStatus = stringValue(row.action_status)
  const action: CamdenFollowupAction | null = ["change", "cancellation"].includes(actionKind) && ["requested", "acknowledged", "declined", "completed"].includes(actionStatus) ? {
    cycleId: stringValue(row.action_cycle_id),
    sequence: numberValue(row.action_sequence, 1),
    kind: actionKind as CamdenFollowupAction["kind"],
    status: actionStatus as CamdenFollowupAction["status"],
    previousStatus: stringValue(row.action_previous_status) as CamdenFollowupAction["previousStatus"] || undefined,
    reasonId: stringValue(row.action_reason_id) || undefined,
    reasonLabel: stringValue(row.action_reason_label, actionKind === "change" ? "Requested ride change" : "Requested cancellation"),
    explanation: stringValue(row.action_explanation) || undefined,
    requestedBy: stringValue(row.action_requested_by) || undefined,
    requestedAt: stringValue(row.action_requested_at),
    acknowledgeDueAt: stringValue(row.action_acknowledge_due_at) || undefined,
    resolveDueAt: stringValue(row.action_resolve_due_at) || undefined,
    acknowledgedAt: stringValue(row.action_acknowledged_at) || undefined,
    resolvedAt: stringValue(row.action_resolved_at) || undefined,
    resolutionExplanation: stringValue(row.action_resolution_explanation) || undefined,
    lateUrgent: Boolean(row.action_late_urgent),
  } : null
  const trips = Array.isArray(row.trips) ? row.trips.map((tripValue) => {
    const trip = record(tripValue)
    return {
      id: stringValue(trip.id ?? trip.external_trip_id),
      externalTripId: stringValue(trip.external_trip_id) || undefined,
      pickupAt: stringValue(trip.pickup_at ?? trip.pickupAt) || [trip.pickup_date, trip.pickup_time].filter(Boolean).join("T"),
      appointmentAt: stringValue(trip.appointment_at ?? trip.appointmentAt) || undefined,
      returnAt: stringValue(trip.return_at ?? trip.returnAt) || undefined,
      pickupName: stringValue(trip.pickup_name ?? trip.pickupName),
      pickupAddress: stringValue(trip.pickup_address ?? trip.pickupAddress),
      destinationName: stringValue(trip.destination_name ?? trip.destinationName),
      destinationAddress: stringValue(trip.destination_address ?? trip.destinationAddress ?? trip.dropoff_address),
      driverName: stringValue(trip.driver_name ?? trip.driverName) || undefined,
      vehicleName: stringValue(trip.vehicle_name ?? trip.vehicleName) || undefined,
      status: stringValue(trip.status ?? trip.status_slug ?? trip.closed_status, trip.cancelled ? "cancelled" : "confirmed"),
      cost: (trip.cost ?? trip.total_amount) == null ? undefined : numberValue(trip.cost ?? trip.total_amount),
    }
  }) : []

  return {
    id: stringValue(row.id),
    reference: stringValue(row.reference ?? row.request_reference),
    requestKind: stringValue(row.request_kind ?? row.requestKind, "ride") as CamdenRequest["requestKind"],
    riderId: stringValue(row.rider_id ?? row.riderId),
    riderName: stringValue(row.rider_name ?? row.riderName, "Rider"),
    status: stringValue(row.status, "pending") as CamdenRequestStatus,
    rideTypeId: stringValue(row.ride_type_id ?? row.rideTypeId),
    rideTypeName: stringValue(row.ride_type_name ?? row.rideTypeName, "Ride request"),
    rideDate: stringValue(row.service_date ?? row.ride_date ?? row.rideDate),
    requestedPickupTime: stringValue(row.requested_pickup_time ?? row.requestedPickupTime),
    appointmentTime: stringValue(row.appointment_time ?? row.appointmentTime),
    direction: stringValue(row.direction, "one_way") as CamdenRequest["direction"],
    returnKind: (stringValue(row.return_type) === "specific_time" ? "scheduled" : stringValue(row.return_type) === "call_when_ready" ? "will_call" : stringValue(row.return_kind ?? row.returnKind) || undefined) as CamdenRequest["returnKind"],
    returnTime: stringValue(row.requested_return_time ?? row.return_time ?? row.returnTime) || undefined,
    pickupLocationId: stringValue(row.pickup_location_id ?? row.pickupLocationId),
    pickupName: stringValue(row.pickup_name ?? row.pickupName),
    pickupAddress: stringValue(row.pickup_address ?? row.pickupAddress),
    destinationLocationId: stringValue(row.destination_location_id ?? row.destinationLocationId),
    destinationName: stringValue(row.destination_name ?? row.destinationName),
    destinationAddress: stringValue(row.destination_address ?? row.destinationAddress),
    notes: stringValue(row.rider_notes ?? row.notes) || undefined,
    companionCount: row.companion_count == null ? undefined : numberValue(row.companion_count),
    companionDetails: stringValue(row.companion_details) || undefined,
    lateUrgent: Boolean(row.late_urgent ?? row.lateUrgent),
    version: numberValue(row.version, 1),
    createdAt: stringValue(row.created_at ?? row.createdAt),
    updatedAt: stringValue(row.updated_at ?? row.updatedAt),
    assigneeName: stringValue(row.assignee_name ?? row.assigneeName) || undefined,
    riderVisibleExplanation: stringValue(row.decline_explanation ?? row.rider_visible_explanation ?? row.riderVisibleExplanation) || undefined,
    action,
    trips,
  }
}

function mapSnapshotLocations(value: unknown): CamdenLocation[] {
  return (Array.isArray(value) ? value : []).map((item) => {
    const row = record(item)
    return {
      id: stringValue(row.id),
      name: stringValue(row.name, "Approved location"),
      address: stringValue(row.address) || addressValue(row),
      isDefault: Boolean(row.is_primary),
    }
  })
}

function mapParticipantRoster(value: unknown): CamdenParticipantRosterDetails {
  const row = record(value)
  const courtProgram = stringValue(row.court_program)
  const nextPhase = stringValue(row.next_phase)
  const eligibility = stringValue(row.transportation_eligibility, "pending")
  return {
    courtProgram: (["dwi", "veterans"].includes(courtProgram) ? courtProgram : undefined) as CamdenParticipantRosterDetails["courtProgram"],
    jurisdictionCounty: stringValue(row.jurisdiction_county) || undefined,
    caseNumber: stringValue(row.case_number) || undefined,
    programStartedOn: stringValue(row.program_started_on) || undefined,
    programStartNeedsReview: Boolean(row.program_start_needs_review),
    nextPhase: (/^(?:phase_[2-5]|graduation)$/.test(nextPhase) ? nextPhase : undefined) as CamdenParticipantRosterDetails["nextPhase"],
    treatmentProvider: stringValue(row.treatment_provider) || undefined,
    curfew: stringValue(row.curfew) || undefined,
    sourceHomeAddress: stringValue(row.source_home_address) || undefined,
    transportationEligibility: (["pending", "approved", "not_needed", "suspended"].includes(eligibility) ? eligibility : "pending") as CamdenParticipantRosterDetails["transportationEligibility"],
  }
}

export function mapParticipantSnapshots(
  value: unknown,
  role: "rider" | "coordinator",
  filter: CamdenSnapshotFilter,
): CamdenParticipantSnapshots {
  const payload = record(value)
  const period = record(payload.period)
  const startDate = stringValue(period.start_date, filter.startDate ?? "")
  const endDate = stringValue(period.end_date, filter.endDate ?? "")
  const profileFor = (row: UnknownRecord): CamdenParticipantProfile => ({
    riderId: stringValue(row.rider_id),
    fullName: stringValue(row.full_name, "Participant"),
    phone: stringValue(row.phone) || undefined,
    email: stringValue(row.email) || undefined,
    status: stringValue(row.status) || undefined,
    phase: ({ phase_1: "Phase 1", phase_2: "Phase 2", phase_3: "Phase 3", phase_4: "Phase 4", phase_5: "Phase 5" } as Record<string, string>)[stringValue(row.phase)] ?? "Not assigned",
    homeLocations: mapSnapshotLocations(row.home_locations),
    treatmentLocations: mapSnapshotLocations(row.treatment_locations),
    drugTestingSites: mapSnapshotLocations(row.drug_testing_sites),
  })
  const metricsFor = (row: UnknownRecord) => {
    const metrics = record(row.metrics)
    return {
      ridesScheduled: numberValue(metrics.rides_scheduled),
      ridesCompleted: numberValue(metrics.rides_completed),
      ridesCancelled: numberValue(metrics.rides_cancelled),
      noShows: numberValue(metrics.no_shows),
      finalizedRides: numberValue(metrics.finalized_rides),
      cancellationRate: numberValue(metrics.cancellation_rate),
    }
  }
  const rows = Array.isArray(payload.participants) ? payload.participants.map(record) : []
  const window = {
    period: filter.period,
    startDate,
    endDate,
    label: stringValue(period.label) || [startDate, endDate].filter(Boolean).join(" through ") || "Program to date",
  }

  if (role === "rider") {
    return {
      role,
      window,
      participants: rows.map((row) => ({ role, profile: profileFor(row), metrics: metricsFor(row) })),
    }
  }

  return {
    role,
    window,
    participants: rows.map((row) => {
      const metrics = record(row.metrics)
      return {
        role,
        profile: profileFor(row),
        roster: mapParticipantRoster(row.roster),
        metrics: { ...metricsFor(row), totalCost: numberValue(metrics.total_cost) },
        hasPersonalTransportation: Boolean(row.has_personal_transportation),
      }
    }),
  }
}

export function mapContext(value: unknown): CamdenUserContext {
  const data = record(value)
  const rider = record(data.rider)
  const settings = record(data.settings)
  const policy = data.current_policy ? record(data.current_policy) : null
  const role = stringValue(data.role, "rider") as CamdenUserContext["role"]
  return {
    userId: stringValue(data.portal_identity_id ?? data.user_id ?? data.userId),
    role,
    displayName: stringValue(rider.full_name ?? data.display_name ?? data.displayName, role === "coordinator" ? "Coordinator" : "Portal user"),
    phone: stringValue(rider.normalized_phone ?? data.normalized_phone) || undefined,
    email: stringValue(rider.email ?? data.email) || undefined,
    riderId: stringValue(rider.id ?? data.rider_id ?? data.riderId) || null,
    accessStatus: stringValue(data.access_status, "active") as CamdenUserContext["accessStatus"],
    policyAccepted: policy ? Boolean(policy.accepted) : role !== "rider",
    currentPolicy: policy ? {
      id: stringValue(policy.id), version: policy.version == null ? "" : String(policy.version), title: stringValue(policy.title),
      body: stringValue(policy.body), effectiveAt: stringValue(policy.published_at ?? policy.effective_at ?? policy.effectiveAt),
    } : null,
    supportPhone: stringValue(settings.support_phone ?? data.support_phone ?? data.supportPhone),
    companionFieldsEnabled: Boolean(settings.companion_enabled ?? data.companion_fields_enabled ?? data.companionFieldsEnabled),
  }
}

export function mapDashboard(value: unknown): CamdenDashboardData {
  const payload = record(value)
  const context = mapContext(payload.context)
  const pickups: CamdenLocation[] = (Array.isArray(payload.pickup_locations) ? payload.pickup_locations : []).map((value) => {
    const row = record(value)
    return { id: stringValue(row.id), riderId: stringValue(row.rider_id) || undefined, name: stringValue(row.label ?? row.name, "Pickup location"), address: addressValue(row), isDefault: Boolean(row.is_default) }
  })
  const categories = new Map((Array.isArray(payload.categories) ? payload.categories : []).map((value) => { const row = record(value); return [stringValue(row.id), stringValue(row.name)] }))
  const destinations: CamdenLocation[] = (Array.isArray(payload.locations) ? payload.locations : []).map((value) => {
    const row = record(value)
    return { id: stringValue(row.id), name: stringValue(row.name), address: addressValue(row), category: categories.get(stringValue(row.category_id)) || undefined }
  })
  const rideTypes: CamdenRideType[] = (Array.isArray(payload.ride_types) ? payload.ride_types : []).map((value) => {
    const row = record(value)
    const minimumNotice = numberValue(row.minimum_notice_minutes)
    const noticeSummary = minimumNotice > 0 ? `Please request at least ${minimumNotice >= 1440 ? `${minimumNotice / 1440} day${minimumNotice === 1440 ? "" : "s"}` : `${minimumNotice / 60} hour${minimumNotice === 60 ? "" : "s"}`} ahead.` : "Submit as early as possible."
    return { id: stringValue(row.id), name: stringValue(row.name), description: stringValue(row.description) || undefined, noticeSummary, allowsSameDay: Boolean(row.same_day_allowed) }
  })
  const changeReasons: CamdenChangeReason[] = (Array.isArray(payload.change_reasons) ? payload.change_reasons : []).map((value) => {
    const row = record(value)
    return { id: stringValue(row.id), kind: stringValue(row.kind) as CamdenChangeReason["kind"], label: stringValue(row.label), requiresExplanation: Boolean(row.requires_explanation) }
  }).filter((reason) => reason.id && ["change", "cancellation"].includes(reason.kind))
  const riders = (Array.isArray(payload.riders) ? payload.riders : []).map((value) => { const row = record(value); return { id: stringValue(row.id), name: stringValue(row.full_name), phone: stringValue(row.normalized_phone) || undefined, email: stringValue(row.email) || undefined } })
  const requests = (Array.isArray(payload.requests) ? payload.requests : []).map((value) => {
    const row = record(value)
    return mapRequest({ ...row, pickup_name: row.pickup_label })
  })
  return { context, requests: context.role === "rider" ? requests.map(hideRiderCosts) : requests, riders, pickupLocations: pickups, destinations, rideTypes, changeReasons }
}

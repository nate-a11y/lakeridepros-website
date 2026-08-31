import "server-only"
import type {
  CamdenCoordinatorData,
  CamdenCoordinatorParticipantSnapshot,
  CamdenDashboardData,
  CamdenParticipantProfile,
  CamdenParticipantSnapshots,
  CamdenRequest,
  CamdenRequestDetail,
  CamdenRole,
  CamdenSnapshotFilter,
  CamdenUserContext,
} from "./types"
import { resolveSnapshotDateRange } from "./snapshot-period"

const pickupLocations = [
  { id: "pickup-home", name: "Home", address: "214 Walnut Street, Camden, MO 64017", isDefault: true },
  { id: "pickup-program", name: "Treatment Court", address: "1 Court Circle, Camden, MO 64017" },
]

const destinations = [
  { id: "destination-compass", name: "Compass Health", address: "101 Wellness Way, Camden, MO 64017", category: "Treatment" },
  { id: "destination-court", name: "Camden County Courthouse", address: "1 Court Circle, Camden, MO 64017", category: "Court" },
]

const rideTypes = [
  { id: "type-treatment", name: "Treatment appointment", description: "Transportation to an approved treatment provider.", noticeSummary: "Please request at least 24 hours ahead.", allowsSameDay: false },
  { id: "type-drug-test", name: "Drug test", description: "Same-day testing transportation.", noticeSummary: "Same-day requests are allowed but are not guaranteed.", allowsSameDay: true },
]

const changeReasons = [
  { id: "10000000-0000-4000-8000-000000000001", kind: "change" as const, label: "Schedule or appointment changed", requiresExplanation: false },
  { id: "10000000-0000-4000-8000-000000000002", kind: "change" as const, label: "Pickup or destination changed", requiresExplanation: false },
  { id: "10000000-0000-4000-8000-000000000003", kind: "change" as const, label: "Other change", requiresExplanation: true },
  { id: "20000000-0000-4000-8000-000000000001", kind: "cancellation" as const, label: "Appointment cancelled or rescheduled", requiresExplanation: false },
  { id: "20000000-0000-4000-8000-000000000002", kind: "cancellation" as const, label: "Ride no longer needed", requiresExplanation: false },
  { id: "20000000-0000-4000-8000-000000000003", kind: "cancellation" as const, label: "Other cancellation", requiresExplanation: true },
]

const requests: CamdenRequest[] = [
  {
    id: "demo-request-1",
    reference: "CC-20260827-0042",
    riderId: "demo-rider",
    riderName: "Jordan Taylor",
    status: "change_requested",
    rideTypeId: "type-treatment",
    rideTypeName: "Treatment appointment",
    rideDate: "2026-09-02",
    requestedPickupTime: "08:15",
    appointmentTime: "09:00",
    direction: "round_trip",
    returnKind: "will_call",
    pickupLocationId: "pickup-home",
    pickupName: "Home",
    pickupAddress: pickupLocations[0].address,
    destinationLocationId: "destination-compass",
    destinationName: "Compass Health",
    destinationAddress: destinations[0].address,
    notes: "Please use the side entrance.",
    lateUrgent: false,
    version: 2,
    createdAt: "2026-08-27T15:00:00.000Z",
    updatedAt: "2026-08-27T15:30:00.000Z",
    assigneeName: "Michael",
    action: {
      cycleId: "30000000-0000-4000-8000-000000000001",
      sequence: 1,
      kind: "change",
      status: "requested",
      previousStatus: "acknowledged",
      reasonId: "10000000-0000-4000-8000-000000000001",
      reasonLabel: "Schedule or appointment changed",
      explanation: "My appointment moved to 10:00 AM.",
      requestedBy: "demo-rider-user",
      requestedAt: "2026-08-27T16:00:00.000Z",
      acknowledgeDueAt: "2026-08-27T18:00:00.000Z",
      resolveDueAt: "2026-08-28T16:00:00.000Z",
      lateUrgent: false,
    },
    trips: [],
  },
  {
    id: "demo-request-2",
    reference: "CC-20260825-0038",
    riderId: "demo-rider",
    riderName: "Jordan Taylor",
    status: "confirmed",
    rideTypeId: "type-drug-test",
    rideTypeName: "Drug test",
    rideDate: "2026-08-29",
    requestedPickupTime: "10:00",
    appointmentTime: "10:45",
    direction: "one_way",
    pickupLocationId: "pickup-home",
    pickupName: "Home",
    pickupAddress: pickupLocations[0].address,
    destinationLocationId: "destination-court",
    destinationName: "Camden County Courthouse",
    destinationAddress: destinations[1].address,
    lateUrgent: false,
    version: 2,
    createdAt: "2026-08-25T13:00:00.000Z",
    updatedAt: "2026-08-25T14:00:00.000Z",
    assigneeName: "Nate",
    action: null,
    trips: [{
      id: "demo-trip-1",
      pickupAt: "2026-08-29T15:00:00.000Z",
      appointmentAt: "2026-08-29T15:45:00.000Z",
      pickupName: "Home",
      pickupAddress: pickupLocations[0].address,
      destinationName: "Camden County Courthouse",
      destinationAddress: destinations[1].address,
      driverName: "Chris",
      vehicleName: "Black SUV",
      status: "confirmed",
      cost: 64.50,
    }],
  },
]

function context(role: CamdenRole): CamdenUserContext {
  return {
    userId: role === "rider" ? "demo-rider-user" : "demo-coordinator-user",
    role,
    displayName: role === "rider" ? "Jordan Taylor" : "Rebecca Morgan",
    phone: role === "rider" ? "+15735550123" : undefined,
    email: role === "rider" ? "jordan@example.com" : undefined,
    riderId: role === "rider" ? "demo-rider" : null,
    accessStatus: "active",
    policyAccepted: true,
    currentPolicy: {
      id: "policy-demo",
      version: "1.0",
      title: "Camden County Transportation Rules",
      body: "Submit requests as early as possible. Transportation is limited to approved locations and is not guaranteed until confirmed. Contact urgent support if your scheduled ride has not arrived.",
      effectiveAt: "2026-08-27T00:00:00.000Z",
    },
    supportPhone: "+15735550199",
    companionFieldsEnabled: true,
  }
}

export function createDemoDashboard(role: "rider" | "coordinator" = "rider"): CamdenDashboardData {
  const visibleRequests = requests.map((request) => ({
    ...request,
    trips: request.trips.map((trip) => role === "rider" ? { ...trip, cost: undefined } : { ...trip }),
  }))
  return {
    context: context(role),
    requests: visibleRequests,
    riders: [{ id: "demo-rider", name: "Jordan Taylor", phone: "+15735550123" }],
    pickupLocations,
    destinations,
    rideTypes,
    changeReasons,
  }
}

export function createDemoCoordinatorDashboard(): CamdenCoordinatorData {
  return {
    ...createDemoDashboard("coordinator"),
    invoices: [],
    summary: {
      requestCount: 24,
      pendingCount: 4,
      needsAttentionCount: 2,
      confirmedCount: 13,
      monthSpend: 2841.75,
      contractSpend: 6920.25,
    },
  }
}

const demoProfiles: CamdenParticipantProfile[] = [
  {
    riderId: "demo-rider",
    fullName: "Jordan Taylor",
    phone: "+15735550123",
    email: "jordan@example.com",
    status: "active",
    phase: "Phase 2",
    homeLocations: [{ id: "pickup-home", name: "Home", address: pickupLocations[0].address, isDefault: true }],
    treatmentLocations: [{ id: "destination-compass", name: "Compass Health", address: destinations[0].address }],
    drugTestingSites: [{ id: "destination-court", name: "Camden County Courthouse", address: destinations[1].address }],
  },
  {
    riderId: "demo-rider-2",
    fullName: "Avery Morgan",
    phone: "+15735550145",
    status: "active",
    phase: "Phase 1",
    homeLocations: [{ id: "pickup-avery", name: "Home", address: "34 Oak Street, Camden, MO 64017", isDefault: true }],
    treatmentLocations: [{ id: "destination-compass", name: "Compass Health", address: destinations[0].address }],
    drugTestingSites: [],
  },
]

export function createDemoParticipantSnapshots(role: "rider" | "coordinator", filter: CamdenSnapshotFilter): CamdenParticipantSnapshots {
  const dates = resolveSnapshotDateRange(filter, new Date("2026-08-27T12:00:00Z"))
  const factor = filter.period === "program_to_date" ? 3 : filter.period === "custom" ? 2 : 1
  const coordinatorParticipants: CamdenCoordinatorParticipantSnapshot[] = demoProfiles.map((profile, index) => ({
    role: "coordinator",
    profile,
    roster: {
      courtProgram: index ? "veterans" : "dwi",
      jurisdictionCounty: index ? undefined : "Example County",
      caseNumber: index ? "26XX-DEMO0002" : "26XX-DEMO0001",
      programStartedOn: index ? "2026-06-05" : "2026-01-18",
      programStartNeedsReview: false,
      nextPhase: index ? "phase_2" : "phase_3",
      treatmentProvider: index ? "VA" : "Example Provider",
      curfew: index ? undefined : "10 PM–6 AM",
      sourceHomeAddress: index ? "200 Demo Avenue, Example City, MO 65049" : "100 Demo Street, Example City, MO 65020",
      transportationEligibility: "pending",
    },
    metrics: {
      ridesScheduled: (index ? 4 : 6) * factor,
      ridesCompleted: (index ? 3 : 5) * factor,
      ridesCancelled: index ? 1 : 0,
      noShows: index ? 0 : 1,
      finalizedRides: (index ? 4 : 6) * factor,
      cancellationRate: index ? 25 : 0,
      totalCost: (index ? 218.5 : 386.75) * factor,
    },
    hasPersonalTransportation: index === 1,
  }))
  const window = {
    period: filter.period,
    startDate: dates.startDate ?? "2026-01-01",
    endDate: dates.endDate ?? "2026-08-27",
    label: "",
  }
  if (role === "coordinator") return { role, window, participants: coordinatorParticipants }
  const own = coordinatorParticipants[0]
  return {
    role,
    window,
    participants: [{
      role,
      profile: own.profile,
      metrics: {
        ridesScheduled: own.metrics.ridesScheduled,
        ridesCompleted: own.metrics.ridesCompleted,
        ridesCancelled: own.metrics.ridesCancelled,
        noShows: own.metrics.noShows,
        finalizedRides: own.metrics.finalizedRides,
        cancellationRate: own.metrics.cancellationRate,
      },
    }],
  }
}

export function createDemoRequestDetail(id: string): CamdenRequestDetail {
  const request = requests.find((candidate) => candidate.id === id) ?? requests[0]
  return {
    request: { ...request, trips: request.trips.map((trip) => ({ ...trip, cost: undefined })) },
    messages: [
      { id: "message-1", requestId: id, authorName: "Jordan Taylor", authorRole: "rider", body: "I will be ready at the side entrance.", createdAt: "2026-08-27T15:02:00.000Z" },
      { id: "message-2", requestId: id, authorName: "Michael", authorRole: "lrp_operator", body: "Thank you. We have reviewed your request and are scheduling it now.", createdAt: "2026-08-27T15:30:00.000Z" },
    ],
  }
}

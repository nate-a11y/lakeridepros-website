export type CamdenRole = "rider" | "coordinator" | "lrp_operator" | "lrp_admin"

export type CamdenRequestStatus =
  | "pending"
  | "acknowledged"
  | "needs_information"
  | "information_received"
  | "confirmed"
  | "change_requested"
  | "cancellation_requested"
  | "declined"
  | "cancelled"
  | "completed"
  | "no_show"

export type CamdenTripDirection = "one_way" | "round_trip"
export type CamdenReturnKind = "scheduled" | "will_call"
export type CamdenFollowupKind = "change" | "cancellation"
export type CamdenFollowupStatus = "requested" | "acknowledged" | "declined" | "completed"

export interface CamdenFollowupAction {
  cycleId: string
  sequence: number
  kind: CamdenFollowupKind
  status: CamdenFollowupStatus
  previousStatus?: CamdenRequestStatus
  reasonId?: string
  reasonLabel: string
  explanation?: string
  requestedBy?: string
  requestedAt: string
  acknowledgeDueAt?: string
  resolveDueAt?: string
  acknowledgedAt?: string
  resolvedAt?: string
  resolutionExplanation?: string
  lateUrgent: boolean
}

export function isFollowupActive(action: CamdenFollowupAction | null): boolean {
  return Boolean(action && ["requested", "acknowledged"].includes(action.status))
}

export interface CamdenUserContext {
  userId: string
  role: CamdenRole
  displayName: string
  phone?: string
  email?: string
  riderId: string | null
  accessStatus: "active" | "suspended" | "removed"
  policyAccepted: boolean
  currentPolicy: CamdenPolicy | null
  supportPhone: string
  companionFieldsEnabled: boolean
}

export interface CamdenPolicy {
  id: string
  version: string
  title: string
  body: string
  effectiveAt: string
}

export interface CamdenLocation {
  id: string
  riderId?: string
  name: string
  address: string
  category?: string
  isDefault?: boolean
}

export interface CamdenRiderOption {
  id: string
  name: string
  phone?: string
  email?: string
}

export interface CamdenRideType {
  id: string
  name: string
  description?: string
  noticeSummary: string
  allowsSameDay: boolean
}

export interface CamdenChangeReason {
  id: string
  kind: "change" | "cancellation"
  label: string
  requiresExplanation: boolean
}

export interface CamdenTrip {
  id: string
  externalTripId?: string
  pickupAt: string
  appointmentAt?: string
  returnAt?: string
  pickupName: string
  pickupAddress: string
  destinationName: string
  destinationAddress: string
  driverName?: string
  vehicleName?: string
  status: string
  cost?: number
}

export interface CamdenRequest {
  id: string
  reference: string
  requestKind?: "ride"
  riderId: string
  riderName: string
  status: CamdenRequestStatus
  rideTypeId: string
  rideTypeName: string
  rideDate: string
  requestedPickupTime: string
  appointmentTime: string
  direction: CamdenTripDirection
  returnKind?: CamdenReturnKind
  returnTime?: string
  pickupLocationId: string
  pickupName: string
  pickupAddress: string
  destinationLocationId: string
  destinationName: string
  destinationAddress: string
  notes?: string
  companionCount?: number
  companionDetails?: string
  lateUrgent: boolean
  version: number
  createdAt: string
  updatedAt: string
  assigneeName?: string
  riderVisibleExplanation?: string
  action: CamdenFollowupAction | null
  trips: CamdenTrip[]
}

export interface CamdenMessage {
  id: string
  requestId: string
  authorName: string
  authorRole: CamdenRole
  body: string
  createdAt: string
}

export interface CamdenRequestDetail {
  /** Coordinator-only contact from the authorized request participant. */
  riderPhone?: string
  request: CamdenRequest
  messages: CamdenMessage[]
}

export interface CamdenDashboardData {
  context: CamdenUserContext
  requests: CamdenRequest[]
  riders: CamdenRiderOption[]
  pickupLocations: CamdenLocation[]
  destinations: CamdenLocation[]
  rideTypes: CamdenRideType[]
  changeReasons: CamdenChangeReason[]
}

export interface CamdenCoordinatorSummary {
  requestCount: number
  pendingCount: number
  needsAttentionCount: number
  confirmedCount: number
  monthSpend: number
  contractSpend: number
}

export interface CamdenInvoice {
  id: string
  periodStart: string
  periodEnd: string
  status: "draft" | "issued" | "paid" | "past_due"
  invoiceNumber?: string
  documentUrl?: string
}

export interface CamdenCoordinatorData extends CamdenDashboardData {
  summary: CamdenCoordinatorSummary
  invoices: CamdenInvoice[]
}

export type CamdenSnapshotPeriod = "program_to_date" | "current_month" | "previous_month" | "custom"

export interface CamdenSnapshotFilter {
  transportationEligibility?: "approved" | "all"
  period: CamdenSnapshotPeriod
  startDate?: string
  endDate?: string
}

export interface CamdenSnapshotWindow {
  period: CamdenSnapshotPeriod
  startDate: string
  endDate: string
  label: string
}

export interface CamdenParticipantProfile {
  riderId: string
  fullName: string
  phone?: string
  email?: string
  status?: string
  phase?: string
  homeLocations: CamdenLocation[]
  treatmentLocations: CamdenLocation[]
  drugTestingSites: CamdenLocation[]
}

export interface CamdenParticipantRosterDetails {
  courtProgram?: "dwi" | "drug" | "veterans"
  jurisdictionCounty?: string
  caseNumber?: string
  phaseStartedOn?: string
  phaseStartNeedsReview: boolean
  nextPhase?: "phase_2" | "phase_3" | "phase_4" | "phase_5" | "graduation"
  nextPhaseTargetOn?: string
  supervisionProvider?: string
  phaseProgressStatus: "active" | "on_hold"
  treatmentProvider?: string
  curfew?: string
  sourceHomeAddress?: string
  transportationEligibility: "pending" | "approved" | "not_needed" | "suspended"
}

export interface CamdenAccountabilityMetrics {
  ridesScheduled: number
  ridesCompleted: number
  ridesCancelled: number
  noShows: number
  finalizedRides: number
  cancellationRate: number
}

export interface CamdenRiderParticipantSnapshot {
  role: "rider"
  profile: CamdenParticipantProfile
  metrics: CamdenAccountabilityMetrics
}

export interface CamdenCoordinatorParticipantSnapshot {
  role: "coordinator"
  profile: CamdenParticipantProfile
  roster: CamdenParticipantRosterDetails
  metrics: CamdenAccountabilityMetrics & {
    totalCost: number
  }
  hasPersonalTransportation: boolean
}

export interface CamdenRiderSnapshots {
  role: "rider"
  window: CamdenSnapshotWindow
  participants: CamdenRiderParticipantSnapshot[]
}

export interface CamdenCoordinatorSnapshots {
  role: "coordinator"
  window: CamdenSnapshotWindow
  participants: CamdenCoordinatorParticipantSnapshot[]
}

export type CamdenParticipantSnapshots = CamdenRiderSnapshots | CamdenCoordinatorSnapshots

export interface CamdenRequestDraft {
  riderId?: string
  rideTypeId: string
  rideDate: string
  requestedPickupTime: string
  appointmentTime: string
  direction: CamdenTripDirection
  returnKind?: CamdenReturnKind
  returnTime?: string
  pickupLocationId: string
  destinationLocationId: string
  notes?: string
  companionCount?: number
  companionDetails?: string
  duplicateConfirmed?: boolean
}

export interface CamdenProfileUpdate {
  email?: string
}

export interface CamdenActionResult {
  id: string
  message: string
}

export interface CamdenPortalService {
  getContext(): Promise<CamdenUserContext>
  getDashboard(status?: CamdenRequestStatus): Promise<CamdenDashboardData>
  getCoordinatorDashboard(): Promise<CamdenCoordinatorData>
  getParticipantSnapshots(filter: CamdenSnapshotFilter): Promise<CamdenParticipantSnapshots>
  getRequest(id: string): Promise<CamdenRequestDetail>
  submitRequest(input: CamdenRequestDraft): Promise<CamdenActionResult>
  updatePendingRequest(id: string, version: number, patch: Partial<CamdenRequestDraft>): Promise<CamdenActionResult>
  duplicateRequest(id: string, patch: Partial<CamdenRequestDraft>): Promise<CamdenActionResult>
  addMessage(id: string, body: string): Promise<CamdenActionResult>
  createFollowup(id: string, version: number, kind: CamdenFollowupKind, reasonId: string, explanation?: string): Promise<CamdenActionResult>
  transitionFollowup(id: string, version: number, status: Exclude<CamdenFollowupStatus, "requested">, publicExplanation?: string): Promise<CamdenActionResult>
  transitionRequest(id: string, status: CamdenRequestStatus, version: number, publicExplanation?: string): Promise<CamdenActionResult>
  requestLocation(name: string, address: { address_line1: string; address_line2?: string; city: string; state: string; postal_code: string }, notes?: string): Promise<CamdenActionResult>
  acceptPolicy(policyId: string): Promise<CamdenActionResult>
  updateProfile(input: CamdenProfileUpdate): Promise<CamdenActionResult>
}

export class CamdenServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "unauthorized" | "forbidden" | "conflict" | "validation" | "unavailable" | "unknown" = "unknown",
  ) {
    super(message)
    this.name = "CamdenServiceError"
  }
}

import "server-only"
import {
  addressValue,
  hideRiderCosts,
  mapContext,
  mapDashboard,
  mapParticipantSnapshots,
  mapRequest,
  record,
  serializeCamdenRequestDraft,
  stringValue,
  type UnknownRecord,
} from "../mapping"
import {
  isFollowupActive,
  type CamdenActionResult,
  type CamdenCoordinatorData,
  type CamdenFollowupKind,
  type CamdenFollowupStatus,
  type CamdenParticipantSnapshots,
  type CamdenProfileUpdate,
  type CamdenRequest,
  type CamdenRequestDetail,
  type CamdenRequestDraft,
  type CamdenRequestStatus,
  type CamdenSnapshotFilter,
  type CamdenUserContext,
} from "../types"
import { resolveSnapshotDateRange } from "../snapshot-period"
import { callCamdenGateway, type CamdenGatewayOperation } from "./gateway"

export class ServerCamdenPortalService {
  constructor(private readonly sessionToken: string) {}

  private gateway(operation: CamdenGatewayOperation, payload: UnknownRecord = {}) {
    return callCamdenGateway(this.sessionToken, operation, payload)
  }

  async getContext(): Promise<CamdenUserContext> {
    return mapContext(await this.gateway("current_context"))
  }

  async getDashboard(status?: CamdenRequestStatus) {
    return mapDashboard(await this.gateway("dashboard", { status: status ?? null }))
  }

  async getCoordinatorDashboard(): Promise<CamdenCoordinatorData> {
    const raw = record(await this.gateway("coordinator_dashboard"))
    const dashboard = mapDashboard(raw)
    const invoices = (Array.isArray(raw.invoices) ? raw.invoices : []).map((value) => {
      const row = record(value)
      return {
        id: stringValue(row.id),
        periodStart: stringValue(row.period_start),
        periodEnd: stringValue(row.period_end),
        status: stringValue(row.status, "draft") as "draft" | "issued" | "paid" | "past_due",
        invoiceNumber: stringValue(row.invoice_number) || undefined,
        documentUrl: stringValue(row.invoice_url) || undefined,
      }
    })
    const monthPrefix = new Date().toISOString().slice(0, 7)
    const requestSpend = (request: CamdenRequest) => request.trips.reduce((total, trip) => total + (trip.cost ?? 0), 0)
    return {
      ...dashboard,
      invoices,
      summary: {
        requestCount: dashboard.requests.length,
        pendingCount: dashboard.requests.filter((request) => request.status === "pending").length,
        needsAttentionCount: dashboard.requests.filter((request) =>
          ["needs_information", "information_received", "change_requested", "cancellation_requested"].includes(request.status)
          || isFollowupActive(request.action),
        ).length,
        confirmedCount: dashboard.requests.filter((request) => request.status === "confirmed").length,
        monthSpend: dashboard.requests.filter((request) => request.rideDate.startsWith(monthPrefix)).reduce((total, request) => total + requestSpend(request), 0),
        contractSpend: dashboard.requests.reduce((total, request) => total + requestSpend(request), 0),
      },
    }
  }

  async getParticipantSnapshots(filter: CamdenSnapshotFilter): Promise<CamdenParticipantSnapshots> {
    const dates = resolveSnapshotDateRange(filter)
    const [context, raw] = await Promise.all([
      this.getContext(),
      this.gateway("participant_snapshots", { start_date: dates.startDate, end_date: dates.endDate }),
    ])
    return mapParticipantSnapshots(raw, context.role === "coordinator" ? "coordinator" : "rider", filter)
  }

  async getRequest(id: string): Promise<CamdenRequestDetail> {
    const [context, rawValue] = await Promise.all([
      this.getContext(),
      this.gateway("request_detail", { request_id: id }),
    ])
    const payload = record(rawValue)
    const requestRow = record(payload.request ?? rawValue)
    const riderRow = record(payload.rider)
    const rideTypeRow = record(payload.ride_type)
    const pickupRow = record(payload.pickup_location)
    const destinationRow = record(payload.destination_location)
    const messages = Array.isArray(payload.messages) ? payload.messages.map((value) => {
      const row = record(value)
      const isCurrentUser = stringValue(row.author_portal_identity_id ?? row.author_user_id) === context.userId
      const explicitRole = stringValue(row.author_role)
      const authorRole = (isCurrentUser ? context.role : ["rider", "coordinator", "lrp_operator", "lrp_admin"].includes(explicitRole) ? explicitRole : context.role === "rider" ? "coordinator" : "rider") as CamdenUserContext["role"]
      const fallbackName = authorRole === "rider" ? stringValue(riderRow.full_name, "Rider") : authorRole.startsWith("lrp_") ? "Lake Ride Pros" : "Camden County Coordinator"
      return {
        id: stringValue(row.id),
        requestId: id,
        authorName: isCurrentUser ? context.displayName : stringValue(row.author_name, fallbackName),
        authorRole,
        body: stringValue(row.body),
        createdAt: stringValue(row.created_at),
      }
    }) : []
    const request = mapRequest({
      ...requestRow,
      rider_name: riderRow.full_name,
      ride_type_name: requestRow.ride_type_name ?? rideTypeRow.name,
      pickup_name: requestRow.pickup_name ?? pickupRow.label,
      pickup_address: requestRow.pickup_address ?? addressValue(pickupRow),
      destination_name: requestRow.destination_name ?? destinationRow.name ?? requestRow.requested_location_text,
      destination_address: requestRow.destination_address ?? addressValue(destinationRow),
      trips: payload.trips,
    })
    return { request: context.role === "rider" ? hideRiderCosts(request) : request, messages }
  }

  private async action(operation: CamdenGatewayOperation, payload: UnknownRecord): Promise<CamdenActionResult> {
    const result = record(await this.gateway(operation, payload))
    return { id: stringValue(result.id), message: stringValue(result.message, "Saved") }
  }

  submitRequest(input: CamdenRequestDraft) {
    return this.action("create_request", { request: serializeCamdenRequestDraft(input) })
  }

  updatePendingRequest(id: string, version: number, patch: Partial<CamdenRequestDraft>) {
    return this.action("update_request", { request_id: id, expected_version: version, patch: serializeCamdenRequestDraft(patch) })
  }

  duplicateRequest(id: string, patch: Partial<CamdenRequestDraft>) {
    return this.action("duplicate_request", { source_request_id: id, patch: serializeCamdenRequestDraft(patch) })
  }

  addMessage(id: string, body: string) {
    return this.action("add_message", { request_id: id, body })
  }

  createFollowup(id: string, version: number, kind: CamdenFollowupKind, reasonId: string, explanation?: string) {
    return this.action(kind === "change" ? "request_change" : "request_cancel", {
      request_id: id,
      expected_version: version,
      reason_id: reasonId,
      explanation: explanation ?? null,
    })
  }

  transitionFollowup(id: string, version: number, status: Exclude<CamdenFollowupStatus, "requested">, publicExplanation?: string) {
    return this.action("transition_followup", {
      request_id: id,
      expected_version: version,
      new_status: status,
      public_explanation: publicExplanation ?? null,
    })
  }

  transitionRequest(id: string, status: CamdenRequestStatus, version: number, publicExplanation?: string) {
    return this.action("transition_request", {
      request_id: id,
      new_status: status,
      expected_version: version,
      public_explanation: publicExplanation ?? null,
    })
  }

  requestLocation(name: string, address: { address_line1: string; address_line2?: string; city: string; state: string; postal_code: string }, notes?: string) {
    return this.action("create_location_request", { name, address, notes: notes ?? null })
  }

  acceptPolicy(_policyId: string, metadata?: { ipHash?: string; userAgent?: string | null }) {
    return this.action("accept_policy", { ip_hash: metadata?.ipHash ?? null, user_agent: metadata?.userAgent ?? null })
  }

  updateProfile(input: CamdenProfileUpdate) {
    return this.action("update_profile", { patch: { email: input.email ?? null } })
  }
}

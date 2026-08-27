import { hideRiderCosts, serializeCamdenRequestDraft } from "./mapping"
import {
  CamdenServiceError,
  type CamdenActionResult,
  type CamdenCoordinatorData,
  type CamdenDashboardData,
  type CamdenFollowupKind,
  type CamdenFollowupStatus,
  type CamdenParticipantSnapshots,
  type CamdenPortalService,
  type CamdenProfileUpdate,
  type CamdenRequestDetail,
  type CamdenRequestDraft,
  type CamdenRequestStatus,
  type CamdenSnapshotFilter,
} from "./types"

export { hideRiderCosts, serializeCamdenRequestDraft }

type ApiErrorBody = { error?: string; code?: CamdenServiceError["code"] }

class BffCamdenService implements CamdenPortalService {
  constructor(private readonly persona: "rider" | "coordinator") {}

  private async request<T>(operation: string, options?: { method?: "GET" | "POST"; body?: unknown; query?: URLSearchParams }): Promise<T> {
    const query = options?.query?.toString()
    const response = await fetch(`/api/camden/data/${operation}${query ? `?${query}` : ""}`, {
      method: options?.method ?? "GET",
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        ...(options?.method === "POST" ? { "Content-Type": "application/json", "X-Camden-CSRF": "1" } : {}),
        ...(isCamdenDemoEnabled() ? { "X-Camden-Demo-Persona": this.persona } : {}),
      },
      body: options?.body === undefined ? undefined : JSON.stringify(options.body),
    })
    const payload = await response.json().catch(() => ({})) as T & ApiErrorBody
    if (!response.ok) {
      const code = payload.code || (response.status === 401 ? "unauthorized" : response.status === 403 ? "forbidden" : response.status === 409 ? "conflict" : response.status === 400 ? "validation" : "unavailable")
      throw new CamdenServiceError(payload.error || "The Treatment Court portal is temporarily unavailable.", code)
    }
    return payload
  }

  getContext() { return this.request<CamdenDashboardData["context"]>("context") }
  getDashboard(status?: CamdenRequestStatus) {
    const query = new URLSearchParams()
    if (status) query.set("status", status)
    return this.request<CamdenDashboardData>("dashboard", { query })
  }
  getCoordinatorDashboard() { return this.request<CamdenCoordinatorData>("coordinator-dashboard") }
  getParticipantSnapshots(filter: CamdenSnapshotFilter) {
    const query = new URLSearchParams({ period: filter.period })
    if (filter.startDate) query.set("startDate", filter.startDate)
    if (filter.endDate) query.set("endDate", filter.endDate)
    return this.request<CamdenParticipantSnapshots>("participant-snapshots", { query })
  }
  getRequest(id: string) { return this.request<CamdenRequestDetail>("request", { query: new URLSearchParams({ id }) }) }
  submitRequest(input: CamdenRequestDraft) { return this.request<CamdenActionResult>("submit-request", { method: "POST", body: { input } }) }
  updatePendingRequest(id: string, version: number, patch: Partial<CamdenRequestDraft>) { return this.request<CamdenActionResult>("update-pending-request", { method: "POST", body: { id, version, patch } }) }
  duplicateRequest(id: string, patch: Partial<CamdenRequestDraft>) { return this.request<CamdenActionResult>("duplicate-request", { method: "POST", body: { id, patch } }) }
  addMessage(id: string, body: string) { return this.request<CamdenActionResult>("add-message", { method: "POST", body: { id, body } }) }
  createFollowup(id: string, version: number, kind: CamdenFollowupKind, reasonId: string, explanation?: string) { return this.request<CamdenActionResult>("create-followup", { method: "POST", body: { id, version, kind, reasonId, explanation } }) }
  transitionFollowup(id: string, version: number, status: Exclude<CamdenFollowupStatus, "requested">, publicExplanation?: string) { return this.request<CamdenActionResult>("transition-followup", { method: "POST", body: { id, version, status, publicExplanation } }) }
  transitionRequest(id: string, status: CamdenRequestStatus, version: number, publicExplanation?: string) { return this.request<CamdenActionResult>("transition-request", { method: "POST", body: { id, status, version, publicExplanation } }) }
  requestLocation(name: string, address: { address_line1: string; address_line2?: string; city: string; state: string; postal_code: string }, notes?: string) { return this.request<CamdenActionResult>("request-location", { method: "POST", body: { name, address, notes } }) }
  acceptPolicy(policyId: string) { return this.request<CamdenActionResult>("accept-policy", { method: "POST", body: { policyId } }) }
  updateProfile(input: CamdenProfileUpdate) { return this.request<CamdenActionResult>("update-profile", { method: "POST", body: { input } }) }
}

export function isCamdenDemoEnabled() {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_CAMDEN_DEMO_MODE !== "false"
}

export function createCamdenPortalService(persona: "rider" | "coordinator" = "rider"): CamdenPortalService {
  return new BffCamdenService(persona)
}

import "server-only"
import { createDemoCoordinatorDashboard, createDemoDashboard, createDemoRequestDetail } from "../demo-data"
import type { CamdenFollowupStatus, CamdenRequestStatus } from "../types"

export class ServerDemoCamdenService {
  constructor(private readonly persona: "rider" | "coordinator") {}
  getContext() { return Promise.resolve(createDemoDashboard(this.persona).context) }
  getDashboard() { return Promise.resolve(createDemoDashboard(this.persona)) }
  getCoordinatorDashboard() { return Promise.resolve(createDemoCoordinatorDashboard()) }
  getRequest(id: string) { return Promise.resolve(createDemoRequestDetail(id)) }
  private done(message: string) { return Promise.resolve({ id: crypto.randomUUID(), message }) }
  submitRequest() { return this.done("Request submitted") }
  updatePendingRequest() { return this.done("Request updated") }
  duplicateRequest() { return this.done("Request duplicated") }
  addMessage() { return this.done("Message sent") }
  createFollowup(_id: string, _version: number, kind: "change" | "cancellation") { return this.done(`${kind === "change" ? "Change" : "Cancellation"} requested`) }
  transitionFollowup(_id: string, _version: number, status: Exclude<CamdenFollowupStatus, "requested">) { return this.done(`Follow-up ${status}`) }
  transitionRequest(_id: string, status: CamdenRequestStatus) { return this.done(`Request moved to ${status.replaceAll("_", " ")}`) }
  requestLocation() { return this.done("Location submitted for approval") }
  acceptPolicy() { return this.done("Policy accepted") }
  updateProfile() { return this.done("Profile updated") }
}

export function isServerCamdenDemoEnabled() {
  return process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_CAMDEN_DEMO_MODE !== "false"
}

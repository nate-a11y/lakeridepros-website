import "server-only"
import { CamdenServiceError } from "../types"
import { createCamdenServiceClient } from "./service-client"

export const CAMDEN_GATEWAY_OPERATIONS = [
  "current_context",
  "dashboard",
  "request_detail",
  "accept_policy",
  "create_request",
  "update_request",
  "duplicate_request",
  "add_message",
  "request_change",
  "request_cancel",
  "transition_followup",
  "create_location_request",
  "update_profile",
  "coordinator_dashboard",
  "participant_snapshots",
  "transition_request",
] as const

export type CamdenGatewayOperation = typeof CAMDEN_GATEWAY_OPERATIONS[number]

export async function callCamdenGateway(
  sessionToken: string,
  operation: CamdenGatewayOperation,
  payload: Record<string, unknown> = {},
): Promise<unknown> {
  const { data, error } = await createCamdenServiceClient().rpc("camden_portal_gateway", {
    p_session_token: sessionToken,
    p_operation: operation,
    p_payload: payload,
  })
  if (error) {
    const lower = error.message.toLowerCase()
    if (lower.includes("session") || lower.includes("access required") || lower.includes("expired")) {
      throw new CamdenServiceError("Your session has expired. Please sign in again.", "unauthorized")
    }
    if (lower.includes("permission") || lower.includes("role") || lower.includes("not found")) {
      throw new CamdenServiceError("You do not have access to that information.", "forbidden")
    }
    if (error.code === "40001" || lower.includes("version") || lower.includes("conflict") || lower.includes("changed by another user")) {
      throw new CamdenServiceError("This request changed since you opened it. Refresh and try again.", "conflict")
    }
    if (
      lower.includes("active ride request")
      || lower.includes("active action")
      || lower.includes("active followup")
      || lower.includes("active follow-up")
      || lower.includes("changes and cancellations require")
      || lower.includes("active reason")
      || lower.includes("explanation is required")
    ) {
      throw new CamdenServiceError(error.message, "validation")
    }
    throw new CamdenServiceError("The Treatment Court portal is temporarily unavailable.", "unavailable")
  }
  return data
}

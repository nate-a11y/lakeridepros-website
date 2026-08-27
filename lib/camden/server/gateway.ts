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
  "create_location_request",
  "update_profile",
  "coordinator_dashboard",
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
    if (lower.includes("version") || lower.includes("conflict")) {
      throw new CamdenServiceError("This request changed since you opened it. Refresh and try again.", "conflict")
    }
    if (lower.includes("active ride request") || lower.includes("changes and cancellations require") || lower.includes("active reason") || lower.includes("explanation is required")) {
      throw new CamdenServiceError(error.message, "validation")
    }
    throw new CamdenServiceError("The Treatment Court portal is temporarily unavailable.", "unavailable")
  }
  return data
}

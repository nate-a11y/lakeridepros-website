import { NextRequest } from "next/server"
import { CamdenServiceError, type CamdenFollowupStatus, type CamdenRequestStatus } from "@/lib/camden/types"
import { CAMDEN_MUTATION_OPERATIONS, CAMDEN_READ_OPERATIONS, CamdenDataSchemas, CamdenParticipantSnapshotQuerySchema, type CamdenMutationName } from "@/lib/camden/server/data-contract"
import { noStoreJson, readBoundedJson } from "@/lib/camden/server/http"
import { isSameOriginMutation, requestFingerprint } from "@/lib/camden/server/security"
import { isServerCamdenDemoEnabled, ServerDemoCamdenService } from "@/lib/camden/server/demo-service"
import { ServerCamdenPortalService } from "@/lib/camden/server/service"
import { camdenSessionCookieName } from "@/lib/camden/server/session"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const STATUSES = new Set<CamdenRequestStatus>(["pending", "acknowledged", "needs_information", "information_received", "confirmed", "change_requested", "cancellation_requested", "declined", "cancelled", "completed", "no_show"])

function errorResponse(error: unknown) {
  if (error instanceof CamdenServiceError) {
    const status = error.code === "unauthorized" ? 401 : error.code === "forbidden" ? 403 : error.code === "conflict" ? 409 : error.code === "validation" ? 400 : 503
    return noStoreJson({ error: error.message, code: error.code }, { status })
  }
  return noStoreJson({ error: "The Treatment Court portal is temporarily unavailable.", code: "unavailable" }, { status: 503 })
}

function serviceFor(request: NextRequest): ServerCamdenPortalService | null {
  const token = request.cookies.get(camdenSessionCookieName())?.value
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null
  return new ServerCamdenPortalService(token)
}

function demoServiceFor(request: NextRequest) {
  const persona = request.headers.get("x-camden-demo-persona") === "coordinator" ? "coordinator" : "rider"
  return new ServerDemoCamdenService(persona)
}

export async function GET(request: NextRequest, context: { params: Promise<{ operation: string }> }) {
  const { operation } = await context.params
  if (!(CAMDEN_READ_OPERATIONS as readonly string[]).includes(operation)) return noStoreJson({ error: "Not found." }, { status: 404 })
  if (isServerCamdenDemoEnabled()) {
    const demo = demoServiceFor(request)
    if (operation === "context") return noStoreJson(await demo.getContext())
    if (operation === "coordinator-dashboard") return noStoreJson(await demo.getCoordinatorDashboard())
    if (operation === "participant-snapshots") {
      const parsed = CamdenParticipantSnapshotQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
      if (!parsed.success) return noStoreJson({ error: "Choose a valid reporting period.", code: "validation" }, { status: 400 })
      return noStoreJson(await demo.getParticipantSnapshots(parsed.data))
    }
    if (operation === "request") return noStoreJson(await demo.getRequest(request.nextUrl.searchParams.get("id") || "demo-request"))
    return noStoreJson(await demo.getDashboard())
  }
  const service = serviceFor(request)
  if (!service) return noStoreJson({ error: "Your session has expired. Please sign in again.", code: "unauthorized" }, { status: 401 })
  try {
    if (operation === "context") return noStoreJson(await service.getContext())
    if (operation === "coordinator-dashboard") return noStoreJson(await service.getCoordinatorDashboard())
    if (operation === "participant-snapshots") {
      const parsed = CamdenParticipantSnapshotQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
      if (!parsed.success) return noStoreJson({ error: "Choose a valid reporting period.", code: "validation" }, { status: 400 })
      return noStoreJson(await service.getParticipantSnapshots(parsed.data))
    }
    if (operation === "request") {
      const id = request.nextUrl.searchParams.get("id") || ""
      if (!UUID_PATTERN.test(id)) return noStoreJson({ error: "Invalid request." }, { status: 400 })
      return noStoreJson(await service.getRequest(id))
    }
    const statusValue = request.nextUrl.searchParams.get("status")
    const status = statusValue && STATUSES.has(statusValue as CamdenRequestStatus) ? statusValue as CamdenRequestStatus : undefined
    return noStoreJson(await service.getDashboard(status))
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ operation: string }> }) {
  const { operation } = await context.params
  if (!(CAMDEN_MUTATION_OPERATIONS as readonly string[]).includes(operation)) return noStoreJson({ error: "Not found." }, { status: 404 })
  if (!isSameOriginMutation(request)) return noStoreJson({ error: "Request not allowed." }, { status: 403 })
  if (isServerCamdenDemoEnabled()) {
    const demo = demoServiceFor(request)
    const messages: Record<CamdenMutationName, string> = {
      "submit-request": "Request submitted", "update-pending-request": "Request updated", "duplicate-request": "Request duplicated",
      "add-message": "Message sent", "create-followup": "Follow-up requested", "transition-request": "Request status updated",
      "transition-followup": "Follow-up updated", "request-location": "Location submitted for approval", "accept-policy": "Policy accepted", "update-profile": "Profile updated",
    }
    // Exercise the same server-only fixture adapter without exposing fixture records to browser bundles.
    if (operation === "accept-policy") return noStoreJson(await demo.acceptPolicy())
    return noStoreJson({ id: crypto.randomUUID(), message: messages[operation as CamdenMutationName] })
  }
  const service = serviceFor(request)
  if (!service) return noStoreJson({ error: "Your session has expired. Please sign in again.", code: "unauthorized" }, { status: 401 })
  const body = await readBoundedJson(request)
  if (!body) return noStoreJson({ error: "Invalid request." }, { status: 400 })
  const schema = CamdenDataSchemas[operation as CamdenMutationName]
  const parsed = schema.safeParse(body)
  if (!parsed.success) return noStoreJson({ error: "Check the form and try again.", code: "validation" }, { status: 400 })
  const input = parsed.data as Record<string, unknown>
  try {
    switch (operation as CamdenMutationName) {
      case "submit-request": return noStoreJson(await service.submitRequest(input.input as Parameters<typeof service.submitRequest>[0]))
      case "update-pending-request": return noStoreJson(await service.updatePendingRequest(input.id as string, input.version as number, input.patch as Parameters<typeof service.updatePendingRequest>[2]))
      case "duplicate-request": return noStoreJson(await service.duplicateRequest(input.id as string, input.patch as Parameters<typeof service.duplicateRequest>[1]))
      case "add-message": return noStoreJson(await service.addMessage(input.id as string, input.body as string))
      case "create-followup": return noStoreJson(await service.createFollowup(input.id as string, input.version as number, input.kind as "change" | "cancellation", input.reasonId as string, input.explanation as string | undefined))
      case "transition-followup": return noStoreJson(await service.transitionFollowup(input.id as string, input.version as number, input.status as Exclude<CamdenFollowupStatus, "requested">, input.publicExplanation as string | undefined))
      case "transition-request": return noStoreJson(await service.transitionRequest(input.id as string, input.status as CamdenRequestStatus, input.version as number, input.publicExplanation as string | undefined))
      case "request-location": return noStoreJson(await service.requestLocation(input.name as string, input.address as Parameters<typeof service.requestLocation>[1], input.notes as string | undefined))
      case "accept-policy": return noStoreJson(await service.acceptPolicy(input.policyId as string, { ipHash: requestFingerprint(request), userAgent: request.headers.get("user-agent")?.slice(0, 500) || null }))
      case "update-profile": return noStoreJson(await service.updateProfile(input.input as Parameters<typeof service.updateProfile>[0]))
    }
  } catch (error) {
    return errorResponse(error)
  }
}

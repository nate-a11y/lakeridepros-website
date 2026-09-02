import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { CAMDEN_MUTATION_OPERATIONS, CAMDEN_READ_OPERATIONS, CamdenDataSchemas, CamdenParticipantSnapshotQuerySchema } from "../server/data-contract"
import { mapDashboard, mapParticipantSnapshots } from "../mapping"

const root = resolve(process.cwd())
const source = (path: string) => readFileSync(resolve(root, path), "utf8")

describe("Camden browser isolation", () => {
  it("contains no Supabase client, public Supabase configuration, or auth-token handling in browser modules", () => {
    const browserSources = [
      "lib/camden/service.ts",
      "components/camden/login-form.tsx",
      "components/camden/portal-shell.tsx",
      "components/camden/use-camden-data.ts",
    ].map(source).join("\n")
    expect(browserSources).not.toContain("@supabase/")
    expect(browserSources).not.toContain("NEXT_PUBLIC_SUPABASE")
    expect(browserSources).not.toContain("demo-data")
    expect(browserSources).not.toMatch(/access_token|refresh_token|verifyOtp|signInWithOtp/)
    expect(browserSources).toContain("/api/camden/")
  })

  it("uses an opaque HttpOnly, SameSite=Strict session cookie", () => {
    const sessionSource = source("lib/camden/server/session.ts")
    expect(sessionSource).toContain("httpOnly: true")
    expect(sessionSource).toContain('sameSite: "strict"')
    expect(sessionSource).toContain('"__Host-camden-session"')
    expect(sessionSource).not.toMatch(/access.?token|refresh.?token/i)
  })

  it("keeps Supabase and Twilio credentials in server-only modules", () => {
    const configSource = source("lib/camden/server/config.ts")
    const twilioSource = source("lib/camden/server/twilio.ts")
    expect(configSource).toContain('import "server-only"')
    expect(configSource).not.toContain("NEXT_PUBLIC_SUPABASE")
    expect(configSource).toContain("CAMDEN_SUPABASE_SERVICE_ROLE_KEY")
    expect(twilioSource).toContain("/functions/v1/camden-send-otp")
    expect(twilioSource).toContain("Bearer ${config.supabaseServiceRoleKey}")
  })

  it("defers Twilio delivery until after the generic OTP response path", () => {
    const requestRoute = source("app/api/camden/auth/request-code/route.ts")
    expect(requestRoute).toContain("after(async () =>")
    expect(requestRoute).toContain("MINIMUM_RESPONSE_TIME_MS")
    expect(requestRoute.lastIndexOf("return genericResponse()")).toBeGreaterThan(requestRoute.indexOf("after(async () =>"))
  })

  it("pins mutation origins to deployment configuration instead of forwarded headers", () => {
    const securitySource = source("lib/camden/server/security.ts")
    expect(securitySource).toContain("CAMDEN_ALLOWED_ORIGIN")
    expect(securitySource).not.toContain("x-forwarded-host")
    expect(securitySource).not.toContain("x-forwarded-proto")
    expect(securitySource).toContain('"x-camden-csrf"')
    expect(securitySource).toContain('startsWith("application/json")')
  })
})

describe("Camden BFF allowlists", () => {
  it("exposes only named read and mutation endpoints", () => {
    expect(CAMDEN_READ_OPERATIONS).toEqual(["context", "dashboard", "coordinator-dashboard", "participant-snapshots", "request"])
    expect(CAMDEN_MUTATION_OPERATIONS).toEqual([
      "submit-request", "update-pending-request", "duplicate-request", "add-message", "create-followup",
      "transition-followup", "transition-request", "request-location", "accept-policy", "update-profile",
    ])
  })

  it("requires optimistic concurrency for a same-record ride action", () => {
    const input = {
      id: "00000000-0000-4000-8000-000000000001",
      kind: "change",
      reasonId: "00000000-0000-4000-8000-000000000002",
    }
    expect(CamdenDataSchemas["create-followup"].safeParse(input).success).toBe(false)
    expect(CamdenDataSchemas["create-followup"].safeParse({ ...input, version: 2 }).success).toBe(true)
  })

  it("allows only coordinator follow-up transitions supported by the gateway", () => {
    const baseline = { id: "00000000-0000-4000-8000-000000000001", version: 2 }
    for (const status of ["acknowledged", "declined", "completed"]) {
      expect(CamdenDataSchemas["transition-followup"].safeParse({ ...baseline, status }).success).toBe(true)
    }
    for (const status of ["requested", "pending", "cancelled", "no_show"]) {
      expect(CamdenDataSchemas["transition-followup"].safeParse({ ...baseline, status }).success).toBe(false)
    }
  })

  it("rejects workflow statuses a coordinator must not set", () => {
    const baseline = { id: "00000000-0000-4000-8000-000000000001", version: 1 }
    for (const status of ["pending", "confirmed", "completed", "no_show", "cancelled"]) {
      expect(CamdenDataSchemas["transition-request"].safeParse({ ...baseline, status }).success).toBe(false)
    }
    for (const status of ["acknowledged", "needs_information", "declined"]) {
      expect(CamdenDataSchemas["transition-request"].safeParse({ ...baseline, status }).success).toBe(true)
    }
  })

  it("rejects arbitrary fields instead of forwarding them to the gateway", () => {
    expect(CamdenDataSchemas["add-message"].safeParse({
      id: "00000000-0000-4000-8000-000000000001",
      body: "Hello",
      operation: "drop_table",
    }).success).toBe(false)
  })

  it("does not expose the unused coordinator access-request gateway operation", () => {
    expect(source("lib/camden/server/gateway.ts")).not.toContain('"coordinator_access_request"')
  })

  it("uses one fixed database gateway rather than an arbitrary table or RPC proxy", () => {
    const routeSource = source("app/api/camden/data/[operation]/route.ts")
    const gatewaySource = source("lib/camden/server/gateway.ts")
    expect(routeSource).not.toMatch(/\.from\(|\.rpc\(/)
    expect(gatewaySource).toMatch(/\.rpc\(\s*"camden_portal_gateway"/)
    expect(gatewaySource).not.toMatch(/\.from\(/)
  })

  it("accepts only named participant snapshot periods and complete custom ranges", () => {
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "current_month" }).success).toBe(true)
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "custom", startDate: "2026-08-01", endDate: "2026-08-27" }).success).toBe(true)
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "custom", startDate: "2026-08-27" }).success).toBe(false)
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "custom", startDate: "2026-08-27", endDate: "2026-08-01" }).success).toBe(false)
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "all_time", riderId: "someone-else" }).success).toBe(false)
  })

  it("allowlists the participant snapshot gateway without exposing arbitrary rider selection", () => {
    const gatewaySource = source("lib/camden/server/gateway.ts")
    const routeSource = source("app/api/camden/data/[operation]/route.ts")
    expect(gatewaySource).toContain('"participant_snapshots"')
    expect(routeSource).toContain("CamdenParticipantSnapshotQuerySchema")
    expect(routeSource).not.toContain("riderId")
  })
})

describe("Camden response privacy", () => {
  const raw = (role: "rider" | "coordinator") => ({
    context: { portal_identity_id: "identity-1", role, rider: { id: "rider-1", full_name: "Rider" }, settings: {} },
    requests: [{
      id: "request-1", rider_id: "rider-1", status: "confirmed", service_date: "2026-09-01",
      trips: [{ id: "trip-1", total_amount: 88.5 }],
    }],
  })

  it("strips all Moovs costs for rider-shaped dashboard responses", () => {
    expect(mapDashboard(raw("rider")).requests[0].trips[0].cost).toBeUndefined()
  })

  it("retains Moovs costs for coordinator-shaped dashboard responses", () => {
    expect(mapDashboard(raw("coordinator")).requests[0].trips[0].cost).toBe(88.5)
  })

  const rawSnapshots = {
    period: { start_date: "2026-08-01", end_date: "2026-08-27" },
    participants: [{
      rider_id: "rider-1", full_name: "Rider", status: "active", phase: "phase_5",
      home_locations: [], treatment_locations: [], drug_testing_sites: [],
      roster: {
        court_program: "dwi", jurisdiction_county: "Example County", case_number: "26XX-DEMO0001",
        phase_started_on: "2026-01-10", phase_start_needs_review: false, next_phase: "graduation",
        next_phase_target_on: "2026-09-18", supervision_provider: "OCCS - Camden", phase_progress_status: "on_hold",
        treatment_provider: "Example Provider", curfew: "10 PM–6 AM", source_home_address: "100 Test Street",
        transportation_eligibility: "pending",
      },
      metrics: { rides_scheduled: 6, rides_completed: 5, rides_cancelled: 1, no_shows: 0, finalized_rides: 6, cancellation_rate: 16.67, total_cost: 425.5 },
      personal_usage_detected: true, personal_usage_override: false, has_personal_transportation: false,
    }],
  }

  it("defensively strips cost and all personal-use fields from rider snapshots", () => {
    const result = mapParticipantSnapshots(rawSnapshots, "rider", { period: "current_month" })
    expect(result.role).toBe("rider")
    expect(JSON.stringify(result)).not.toMatch(/cost|personalUse|personal_usage|hasPersonalTransportation|roster|caseNumber|curfew|sourceHomeAddress/i)
    expect(result.participants[0].metrics.ridesCompleted).toBe(5)
    expect(result.participants[0].profile.phase).toBe("Phase 5")
  })

  it("returns cost and the final override-aware personal-use result only to coordinators", () => {
    const result = mapParticipantSnapshots(rawSnapshots, "coordinator", { period: "current_month" })
    if (result.role !== "coordinator") throw new Error("Expected coordinator snapshot shape")
    expect(result.participants[0].metrics.totalCost).toBe(425.5)
    expect(result.participants[0].hasPersonalTransportation).toBe(false)
    expect(result.participants[0].roster.caseNumber).toBe("26XX-DEMO0001")
    expect(result.participants[0].roster.nextPhase).toBe("graduation")
    expect(result.participants[0].roster.phaseStartedOn).toBe("2026-01-10")
    expect(result.participants[0].roster.nextPhaseTargetOn).toBe("2026-09-18")
    expect(result.participants[0].roster.supervisionProvider).toBe("OCCS - Camden")
    expect(result.participants[0].roster.phaseProgressStatus).toBe("on_hold")
    expect(JSON.stringify(result)).not.toMatch(/personalUsageDetected|personalUseOverride|personal_usage/i)
  })

  it("keeps rider accountability UI free of cost, billing, and personal-use language", () => {
    expect(source("components/camden/rider-accountability.tsx")).not.toMatch(/cost|billing|personal.?use/i)
  })
})

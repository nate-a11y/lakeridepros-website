import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { CAMDEN_MUTATION_OPERATIONS, CAMDEN_READ_OPERATIONS, CamdenDataSchemas } from "../server/data-contract"
import { mapDashboard } from "../mapping"

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
    expect(CAMDEN_READ_OPERATIONS).toEqual(["context", "dashboard", "coordinator-dashboard", "request"])
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
})

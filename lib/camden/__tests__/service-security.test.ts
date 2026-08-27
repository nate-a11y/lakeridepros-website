import { afterEach, describe, expect, it, vi } from "vitest"
import { createCamdenPortalService, isCamdenDemoEnabled } from "../service"

describe("Camden County demo-mode security", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("cannot be enabled in production even when the public flag is present", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")

    expect(isCamdenDemoEnabled()).toBe(false)
  })

  it("requires both a development build and an explicit opt-in", () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "false")
    expect(isCamdenDemoEnabled()).toBe(false)

    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    expect(isCamdenDemoEnabled()).toBe(true)
  })

  it("uses the same-origin BFF outside development instead of browser Supabase", async () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      userId: "identity-1", role: "rider", displayName: "Rider", riderId: "rider-1", accessStatus: "active",
      policyAccepted: true, currentPolicy: null, supportPhone: "+15735552323", companionFieldsEnabled: false,
    }), { status: 200, headers: { "Content-Type": "application/json" } }))

    await createCamdenPortalService("rider").getContext()
    expect(fetchMock).toHaveBeenCalledWith("/api/camden/data/context", expect.objectContaining({ credentials: "same-origin", cache: "no-store" }))
    fetchMock.mockRestore()
  })
})

describe("Camden County demo role isolation", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("requests the server-only rider fixture persona", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))
    await createCamdenPortalService("rider").getDashboard()
    expect(fetchMock).toHaveBeenCalledWith("/api/camden/data/dashboard", expect.objectContaining({ headers: expect.objectContaining({ "X-Camden-Demo-Persona": "rider" }) }))
    fetchMock.mockRestore()
  })

  it("requests the server-only coordinator fixture persona", async () => {
    vi.stubEnv("NODE_ENV", "development")
    vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))
    await createCamdenPortalService("coordinator").getCoordinatorDashboard()
    expect(fetchMock).toHaveBeenCalledWith("/api/camden/data/coordinator-dashboard", expect.objectContaining({ headers: expect.objectContaining({ "X-Camden-Demo-Persona": "coordinator" }) }))
    fetchMock.mockRestore()
  })
})

// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { requireCamdenSession } from "../auth"

const { readToken, getContext, redirect } = vi.hoisted(() => ({ readToken: vi.fn(), getContext: vi.fn(), redirect: vi.fn((path: string) => { throw Object.assign(new Error(path), { digest: "NEXT_REDIRECT" }) }) }))
vi.mock("../server/session", () => ({ readCamdenSessionToken: readToken }))
vi.mock("../server/service", () => ({ ServerCamdenPortalService: class { getContext = getContext } }))
vi.mock("next/navigation", () => ({ redirect }))
beforeEach(() => { vi.clearAllMocks(); readToken.mockResolvedValue("a".repeat(43)); getContext.mockResolvedValue({ role: "coordinator", accessStatus: "active" }) })
afterEach(() => { vi.unstubAllEnvs() })

describe("invoice page authorization without development demo bypass", () => {
  it("checks the real Camden session even with development demo enabled", async () => {
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    expect(await requireCamdenSession(["coordinator"], { allowDevelopmentDemo: false })).toMatchObject({ role: "coordinator", accessStatus: "active" })
    expect(readToken).toHaveBeenCalledOnce(); expect(getContext).toHaveBeenCalledOnce()
  })
  it("preserves other pages' existing development demo behavior", async () => {
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("NEXT_PUBLIC_CAMDEN_DEMO_MODE", "true")
    expect(await requireCamdenSession(["coordinator"])).toBeNull()
    expect(readToken).not.toHaveBeenCalled()
  })
  it("redirects without querying context when the cookie is absent", async () => {
    readToken.mockResolvedValue(null)
    await expect(requireCamdenSession(["coordinator"], { allowDevelopmentDemo: false })).rejects.toThrow("/camden-county/login")
    expect(getContext).not.toHaveBeenCalled()
  })
  it("rejects wrong roles, revoked access, expired sessions, and backend outages", async () => {
    for (const context of [{ role: "rider", accessStatus: "active" }, { role: "coordinator", accessStatus: "suspended" }, { role: "coordinator", accessStatus: "removed" }]) {
      getContext.mockResolvedValue(context)
      await expect(requireCamdenSession(["coordinator"], { allowDevelopmentDemo: false })).rejects.toThrow("/camden-county/login")
    }
    getContext.mockRejectedValue(new Error("expired or unavailable"))
    await expect(requireCamdenSession(["coordinator"], { allowDevelopmentDemo: false })).rejects.toThrow("/camden-county/login")
  })
})

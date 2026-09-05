import { beforeEach, describe, expect, it, vi } from "vitest"
import { CamdenParticipantSnapshotQuerySchema } from "../server/data-contract"
import { createDemoParticipantSnapshots } from "../demo-data"
import { createCamdenPortalService } from "../service"
import { ServerCamdenPortalService } from "../server/service"

const gateway = vi.hoisted(() => vi.fn())
vi.mock("server-only", () => ({}))
vi.mock("../server/gateway", () => ({ callCamdenGateway: gateway }))

beforeEach(() => {
  gateway.mockReset()
  gateway.mockImplementation(async (_token, operation) => operation === "current_context" ? { role: "coordinator" } : { participants: [], period: {} })
})

describe("snapshot scope", () => {
  it("only accepts the two supported roster scopes", () => {
    for (const transportationEligibility of ["approved", "all"]) {
      expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "program_to_date", transportationEligibility }).success).toBe(true)
    }
    expect(CamdenParticipantSnapshotQuerySchema.safeParse({ period: "program_to_date", transportationEligibility: "pending" }).success).toBe(false)
  })

  it("requests approval filtering at the database, including for old clients without scope", async () => {
    await new ServerCamdenPortalService("test-session").getParticipantSnapshots({ period: "program_to_date" })
    expect(gateway).toHaveBeenCalledWith("test-session", "participant_snapshots", { start_date: null, end_date: null, approved_only: true })
  })

  it("forwards all-participant and custom-period filters to the database", async () => {
    await new ServerCamdenPortalService("test-session").getParticipantSnapshots({ period: "custom", startDate: "2026-09-01", endDate: "2026-09-05", transportationEligibility: "all" })
    expect(gateway).toHaveBeenCalledWith("test-session", "participant_snapshots", { start_date: "2026-09-01", end_date: "2026-09-05", approved_only: false })
  })

  it("sends the scope through the same-origin endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response('{}'))
    try {
      await createCamdenPortalService("coordinator").getParticipantSnapshots({ period: "program_to_date", transportationEligibility: "all" })
      expect(fetchMock).toHaveBeenCalledWith("/api/camden/data/participant-snapshots?period=program_to_date&transportationEligibility=all", expect.objectContaining({ cache: "no-store", credentials: "same-origin" }))
    } finally { fetchMock.mockRestore() }
  })

  it("keeps demo results consistent with approval defaults and rider isolation", () => {
    const approved = createDemoParticipantSnapshots("coordinator", { period: "program_to_date" })
    const all = createDemoParticipantSnapshots("coordinator", { period: "program_to_date", transportationEligibility: "all" })
    expect(approved.participants).toHaveLength(1)
    expect(all.participants).toHaveLength(2)
    expect(createDemoParticipantSnapshots("rider", { period: "program_to_date" }).participants).toHaveLength(1)
  })
})

describe("authorized request participant phone", () => {
  it.each(["coordinator", "rider"])("only includes the phone for a coordinator, not %s data without authorization", async (role) => {
    gateway.mockImplementation(async (_token, operation) => operation === "current_context" ? { role } : {
      request: { id: "request-1" }, rider: { full_name: "Synthetic Participant", normalized_phone: "+15735550123" },
    })
    const detail = await new ServerCamdenPortalService("test-session").getRequest("request-1")
    if (role === "coordinator") expect(detail.riderPhone).toBe("+15735550123")
    else expect(detail).not.toHaveProperty("riderPhone")
  })
})

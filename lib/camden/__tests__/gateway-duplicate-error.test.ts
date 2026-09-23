import { beforeEach, describe, expect, it, vi } from "vitest"
import { CamdenServiceError } from "../types"
import { callCamdenGateway } from "../server/gateway"

const rpc = vi.hoisted(() => vi.fn())
vi.mock("../server/service-client", () => ({ createCamdenServiceClient: () => ({ rpc }) }))

beforeEach(() => rpc.mockReset())

describe("Camden duplicate confirmation", () => {
  it("returns a typed confirmation conflict instead of a portal outage", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "P0001", message: "POTENTIAL_DUPLICATE_CONFIRMATION_REQUIRED" } })
    await expect(callCamdenGateway("session", "create_request", { request: {} })).rejects.toMatchObject({
      code: "duplicate_confirmation_required",
      message: "A ride near this time already exists. Confirm that this is a separate ride to continue.",
    } satisfies Partial<CamdenServiceError>)
  })

  it("does not reinterpret unrelated database exceptions as duplicates", async () => {
    rpc.mockResolvedValue({ data: null, error: { code: "P0001", message: "unexpected database error" } })
    await expect(callCamdenGateway("session", "create_request", { request: {} })).rejects.toMatchObject({ code: "unavailable" })
  })
})

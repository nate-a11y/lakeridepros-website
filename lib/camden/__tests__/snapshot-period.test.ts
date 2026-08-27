import { describe, expect, it } from "vitest"
import { resolveSnapshotDateRange } from "../snapshot-period"

describe("participant snapshot reporting periods", () => {
  const now = new Date("2026-08-27T15:00:00Z")

  it("leaves program-to-date bounds to the database program configuration", () => {
    expect(resolveSnapshotDateRange({ period: "program_to_date" }, now)).toEqual({ startDate: null, endDate: null })
  })

  it("resolves current and previous calendar months", () => {
    expect(resolveSnapshotDateRange({ period: "current_month" }, now)).toEqual({ startDate: "2026-08-01", endDate: "2026-08-27" })
    expect(resolveSnapshotDateRange({ period: "previous_month" }, now)).toEqual({ startDate: "2026-07-01", endDate: "2026-07-31" })
  })

  it("preserves a validated custom range", () => {
    expect(resolveSnapshotDateRange({ period: "custom", startDate: "2026-06-15", endDate: "2026-07-02" }, now)).toEqual({ startDate: "2026-06-15", endDate: "2026-07-02" })
  })
})

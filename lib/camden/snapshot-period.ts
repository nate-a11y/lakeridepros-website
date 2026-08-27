import type { CamdenSnapshotFilter } from "./types"

function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function easternDateParts(value: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(value)
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value)
  return { year: part("year"), month: part("month") - 1, day: part("day") }
}

export function resolveSnapshotDateRange(filter: CamdenSnapshotFilter, now = new Date()): { startDate: string | null; endDate: string | null } {
  if (filter.period === "program_to_date") return { startDate: null, endDate: null }
  if (filter.period === "custom") return { startDate: filter.startDate ?? null, endDate: filter.endDate ?? null }

  const { year, month, day } = easternDateParts(now)
  if (filter.period === "current_month") {
    return { startDate: isoDate(new Date(Date.UTC(year, month, 1))), endDate: isoDate(new Date(Date.UTC(year, month, day))) }
  }
  return {
    startDate: isoDate(new Date(Date.UTC(year, month - 1, 1))),
    endDate: isoDate(new Date(Date.UTC(year, month, 0))),
  }
}

import type { CamdenDashboardData, CamdenLocation } from "./types"

/** Keep private homes rider-scoped; identical catalog entries need only one option. */
export function approvedRequestLocations(
  data: CamdenDashboardData,
  riderId: string | null | undefined,
  selectedId: string,
): CamdenLocation[] {
  if (!riderId) return []
  const locations = [
    ...data.pickupLocations.filter((location) => location.riderId === riderId),
    ...data.destinations,
  ]
  const unique = new Map<string, CamdenLocation>()
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase()
  for (const location of locations) {
    // Don't collapse different units, street suffixes, names, or ownership scopes.
    const key = JSON.stringify([location.riderId ?? null, normalize(location.name), normalize(location.address)])
    if (!unique.has(key) || location.id === selectedId) unique.set(key, location)
  }
  return [...unique.values()]
}

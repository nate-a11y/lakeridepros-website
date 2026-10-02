import type { CamdenPublishedInvoicePage } from "./invoices"

export async function loadCamdenInvoicePage(offset: number, signal?: AbortSignal): Promise<CamdenPublishedInvoicePage> {
  const response = await fetch(`/api/camden/invoices?offset=${offset}`, { credentials: "same-origin", cache: "no-store", signal })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || "Monthly statements are temporarily unavailable.")
  return payload
}

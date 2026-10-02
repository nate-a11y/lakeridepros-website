import "server-only"
import type { NextRequest } from "next/server"
import { CamdenServiceError } from "../types"
import { noStoreJson } from "./http"
import { camdenSessionCookieName } from "./session"

export const camdenInvoicePrivacyHeaders = {
  "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache", Vary: "Cookie",
  "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow, noarchive", "Referrer-Policy": "no-referrer",
}
export function invoiceSession(request: NextRequest) {
  const token = request.cookies.get(camdenSessionCookieName())?.value
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) throw new CamdenServiceError("Your session has expired. Please sign in again.", "unauthorized")
  return token
}
export function invoiceError(error: unknown) {
  const code = error instanceof CamdenServiceError ? error.code : "unavailable"
  const status = code === "unauthorized" ? 401 : code === "forbidden" ? 403 : code === "not_found" ? 404 : code === "validation" ? 400 : 503
  const message = status === 401 ? "Your session has expired. Please sign in again." : status === 403 ? "Coordinator access is required." : status === 404 ? "Statement not found." : status === 400 ? "Invalid statement request." : "Monthly statements are temporarily unavailable."
  return noStoreJson({ error: message, code }, { status, headers: camdenInvoicePrivacyHeaders })
}

import { NextRequest } from "next/server"
import { revokePortalSession } from "@/lib/camden/server/auth-store"
import { noStoreJson } from "@/lib/camden/server/http"
import { isSameOriginMutation } from "@/lib/camden/server/security"
import { camdenSessionCookieName, clearCamdenSessionCookie } from "@/lib/camden/server/session"

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return noStoreJson({ error: "Request not allowed." }, { status: 403 })
  const token = request.cookies.get(camdenSessionCookieName())?.value
  if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) {
    try { await revokePortalSession(token) } catch { /* The local cookie is still cleared. */ }
  }
  const response = noStoreJson({ ok: true })
  clearCamdenSessionCookie(response)
  return response
}

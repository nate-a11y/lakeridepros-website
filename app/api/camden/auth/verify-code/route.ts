import { NextRequest } from "next/server"
import { verifyPortalChallenge } from "@/lib/camden/server/auth-store"
import { genericAuthFailure, noStoreJson, readBoundedJson } from "@/lib/camden/server/http"
import { createSessionToken, hashOtp, isSameOriginMutation, passLocalRateLimit, requestFingerprint } from "@/lib/camden/server/security"
import { setCamdenSessionCookie } from "@/lib/camden/server/session"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return noStoreJson({ error: "Request not allowed." }, { status: 403 })
  const input = await readBoundedJson(request, 4_096)
  const challengeId = typeof input?.challengeToken === "string" ? input.challengeToken : ""
  const code = typeof input?.code === "string" ? input.code : ""
  if (!UUID_PATTERN.test(challengeId) || !/^\d{6}$/.test(code)) return genericAuthFailure()

  const ipHash = requestFingerprint(request)
  if (!passLocalRateLimit(`verify:${ipHash}`, 30, 15 * 60_000)) return genericAuthFailure(429)

  try {
    const sessionToken = createSessionToken()
    const result = await verifyPortalChallenge({
      challengeId,
      codeHash: hashOtp(challengeId, code),
      sessionToken,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
    })
    if (!result) return genericAuthFailure()
    const response = noStoreJson({ ok: true, role: result.role, policyAccepted: result.policyAccepted })
    setCamdenSessionCookie(response, sessionToken)
    return response
  } catch {
    return genericAuthFailure()
  }
}

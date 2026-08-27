import { after, NextRequest } from "next/server"
import { issuePortalChallenge, recordPortalChallengeDelivery } from "@/lib/camden/server/auth-store"
import { noStoreJson, readBoundedJson } from "@/lib/camden/server/http"
import {
  clientIp,
  createChallengeId,
  createOtp,
  hashOtp,
  isSameOriginMutation,
  passLocalRateLimit,
  requestFingerprint,
  normalizeUsPhone,
  verifyTurnstile,
} from "@/lib/camden/server/security"
import { sendCamdenLoginCode } from "@/lib/camden/server/twilio"

const MINIMUM_RESPONSE_TIME_MS = 650

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const challengeToken = createChallengeId()
  const genericResponse = async () => {
    const wait = MINIMUM_RESPONSE_TIME_MS - (Date.now() - startedAt)
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
    return noStoreJson({ ok: true, challengeToken })
  }

  if (!isSameOriginMutation(request)) return noStoreJson({ error: "Request not allowed." }, { status: 403 })
  const input = await readBoundedJson(request, 8_192)
  const phone = normalizeUsPhone(input?.phone)
  const captchaToken = input?.captchaToken
  if (!phone || typeof captchaToken !== "string") return genericResponse()

  const ip = clientIp(request)
  const ipHash = requestFingerprint(request)
  if (!passLocalRateLimit(`otp:${ipHash}`, 12, 15 * 60_000)) return genericResponse()
  if (!await verifyTurnstile(captchaToken, ip)) return genericResponse()

  try {
    const code = createOtp()
    const accepted = await issuePortalChallenge({
      challengeId: challengeToken,
      normalizedPhone: phone,
      codeHash: hashOtp(challengeToken, code),
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    })
    if (accepted) {
      after(async () => {
        const delivered = await sendCamdenLoginCode(phone, code)
        try { await recordPortalChallengeDelivery(challengeToken, delivered) } catch { /* Keep auth responses generic. */ }
      })
    }
  } catch {
    // Deliberately generic: never reveal membership, rate-limit, or delivery state.
  }
  return genericResponse()
}

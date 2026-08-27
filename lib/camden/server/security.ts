import "server-only"
import { createHmac, randomBytes, randomInt, randomUUID } from "node:crypto"
import type { NextRequest } from "next/server"
import { getCamdenServerConfig } from "./config"

const counters = new Map<string, { count: number; resetAt: number }>()

export function normalizeUsPhone(value: unknown): string | null {
  if (typeof value !== "string") return null
  const digits = value.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

export function createChallengeId(): string {
  return randomUUID()
}

export function createOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0")
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url")
}

function hmac(value: string, pepper: string): string {
  return createHmac("sha256", pepper).update(value).digest("hex")
}

export function hashOtp(challengeId: string, code: string): string {
  return hmac(`${challengeId}:${code}`, getCamdenServerConfig().otpPepper)
}

export function hashRequestValue(value: string): string {
  return hmac(value, getCamdenServerConfig().sessionHashPepper)
}

export function clientIp(request: NextRequest): string {
  return request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown"
}

export function requestFingerprint(request: NextRequest): string {
  return hashRequestValue(clientIp(request))
}

export function isSameOriginMutation(request: NextRequest): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true
  if (request.headers.get("x-camden-csrf") !== "1") return false
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return false
  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite && !["same-origin", "none"].includes(fetchSite)) return false
  const origin = request.headers.get("origin")
  if (!origin) return process.env.NODE_ENV !== "production"
  try {
    const incoming = new URL(origin).origin
    const configured = process.env.CAMDEN_ALLOWED_ORIGIN
    if (process.env.NODE_ENV === "production") return Boolean(configured) && incoming === new URL(configured as string).origin
    return incoming === request.nextUrl.origin || (configured ? incoming === new URL(configured).origin : false)
  } catch {
    return false
  }
}

/** Coarse per-instance protection; durable limits are enforced atomically by the database. */
export function passLocalRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const current = counters.get(key)
  if (!current || current.resetAt <= now) {
    if (counters.size > 2_000) {
      for (const [entryKey, entry] of counters) if (entry.resetAt <= now) counters.delete(entryKey)
    }
    counters.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  current.count += 1
  return current.count <= limit
}

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) return false
  const body = new URLSearchParams({
    secret: getCamdenServerConfig().turnstileSecret,
    response: token,
  })
  if (ip !== "unknown") body.set("remoteip", ip)
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return false
    const result = await response.json() as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}

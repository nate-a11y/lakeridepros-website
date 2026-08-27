import "server-only"
import { NextResponse } from "next/server"

export function noStoreJson(body: unknown, init: ResponseInit = {}): NextResponse {
  const response = NextResponse.json(body, init)
  response.headers.set("Cache-Control", "private, no-store, max-age=0")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Vary", "Cookie")
  return response
}

export function genericAuthFailure(status = 401): NextResponse {
  return noStoreJson({ error: "We couldn’t sign you in. Check your information or contact your Treatment Court coordinator." }, { status })
}

export async function readBoundedJson(request: Request, maxBytes = 32_768): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length") || 0)
  if (length > maxBytes) return null
  try {
    const value = await request.json()
    if (!value || typeof value !== "object" || Array.isArray(value)) return null
    if (JSON.stringify(value).length > maxBytes) return null
    return value as Record<string, unknown>
  } catch {
    return null
  }
}

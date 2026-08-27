import "server-only"
import { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import { createSessionToken } from "./security"

const COOKIE_MAX_AGE_SECONDS = 12 * 60 * 60

export function camdenSessionCookieName(): string {
  return process.env.NODE_ENV === "production" ? "__Host-camden-session" : "camden-session"
}

export async function readCamdenSessionToken(): Promise<string | null> {
  const token = (await cookies()).get(camdenSessionCookieName())?.value
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null
}

export function issueCamdenSessionToken(response: NextResponse): string {
  const token = createSessionToken()
  response.cookies.set(camdenSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    priority: "high",
  })
  return token
}

export function setCamdenSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(camdenSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    priority: "high",
  })
}

export function clearCamdenSessionCookie(response: NextResponse): void {
  response.cookies.set(camdenSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
}

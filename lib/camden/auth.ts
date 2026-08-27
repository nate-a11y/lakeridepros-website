import "server-only"
import { redirect } from "next/navigation"
import { ServerCamdenPortalService } from "./server/service"
import { readCamdenSessionToken } from "./server/session"
import type { CamdenRole } from "./types"

export async function requireCamdenSession(allowedRoles?: CamdenRole[]) {
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_CAMDEN_DEMO_MODE !== "false") return null
  const token = await readCamdenSessionToken()
  if (!token) redirect("/camden-county/login")
  try {
    const context = await new ServerCamdenPortalService(token).getContext()
    if (context.accessStatus !== "active" || (allowedRoles && !allowedRoles.includes(context.role))) redirect("/camden-county/login")
    return context
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error
    redirect("/camden-county/login")
  }
}

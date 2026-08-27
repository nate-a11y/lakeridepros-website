import "server-only"
import { getCamdenServerConfig } from "./config"

export async function sendCamdenLoginCode(to: string, code: string): Promise<boolean> {
  const config = getCamdenServerConfig()
  const url = `${config.supabaseUrl.replace(/\/$/, "")}/functions/v1/camden-send-otp`
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
        apikey: config.supabaseServiceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, code }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
    return response.ok
  } catch {
    return false
  }
}

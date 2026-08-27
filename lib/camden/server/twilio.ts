import "server-only"
import { getCamdenServerConfig } from "./config"

export async function sendCamdenLoginCode(to: string, code: string): Promise<boolean> {
  const config = getCamdenServerConfig()
  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(config.twilioAccountSid)}/Messages.json`
  const body = new URLSearchParams({
    To: to,
    From: config.twilioFromNumber,
    Body: `Your Lake Ride Pros Treatment Court sign-in code is ${code}. It expires in 10 minutes. Do not share it.`,
  })
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })
    return response.ok
  } catch {
    return false
  }
}

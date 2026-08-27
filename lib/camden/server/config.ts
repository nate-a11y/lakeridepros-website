import "server-only"

function required(name: string, fallbackName?: string): string {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) throw new Error(`Missing server configuration: ${name}`)
  return value
}

export function getCamdenServerConfig() {
  return {
    supabaseUrl: required("CAMDEN_SUPABASE_URL", "SUPABASE_URL"),
    supabaseServiceRoleKey: required("CAMDEN_SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"),
    otpPepper: required("CAMDEN_OTP_PEPPER"),
    sessionHashPepper: required("CAMDEN_SESSION_HASH_PEPPER", "CAMDEN_OTP_PEPPER"),
    twilioAccountSid: required("CAMDEN_TWILIO_ACCOUNT_SID", "TWILIO_ACCOUNT_SID"),
    twilioAuthToken: required("CAMDEN_TWILIO_AUTH_TOKEN", "TWILIO_AUTH_TOKEN"),
    twilioFromNumber: process.env.CAMDEN_TWILIO_FROM_NUMBER || process.env.TWILIO_FROM || required("TWILIO_FROM_NUMBER"),
    turnstileSecret: required("TURNSTILE_SECRET_KEY"),
  }
}

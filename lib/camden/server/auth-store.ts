import "server-only"
import { createCamdenServiceClient } from "./service-client"

type IssueResult = { accepted?: boolean }
type VerifyResult = { verified?: boolean; role?: string; policy_accepted?: boolean; policyAccepted?: boolean }

export async function issuePortalChallenge(input: {
  challengeId: string
  normalizedPhone: string
  codeHash: string
  ipHash: string
  userAgent: string | null
  expiresAt: string
}): Promise<boolean> {
  const { data, error } = await createCamdenServiceClient().rpc("camden_issue_portal_challenge", {
    p_challenge_id: input.challengeId,
    p_normalized_phone: input.normalizedPhone,
    p_code_hash: input.codeHash,
    p_ip_hash: input.ipHash,
    p_user_agent: input.userAgent,
    p_expires_at: input.expiresAt,
  })
  if (error) return false
  if (typeof data === "boolean") return data
  return Boolean((data as IssueResult | null)?.accepted)
}

export async function recordPortalChallengeDelivery(challengeId: string, delivered: boolean): Promise<void> {
  await createCamdenServiceClient().rpc("camden_record_portal_challenge_delivery", {
    p_challenge_id: challengeId,
    p_delivered: delivered,
  })
}

export async function verifyPortalChallenge(input: {
  challengeId: string
  codeHash: string
  sessionToken: string
  ipHash: string
  userAgent: string | null
}): Promise<{ role: "rider" | "coordinator"; policyAccepted: boolean } | null> {
  const { data, error } = await createCamdenServiceClient().rpc("camden_verify_portal_challenge", {
    p_challenge_id: input.challengeId,
    p_code_hash: input.codeHash,
    p_session_token: input.sessionToken,
    p_ip_hash: input.ipHash,
    p_user_agent: input.userAgent,
  })
  if (error || !data) return null
  const result = data as VerifyResult
  if (result.verified !== true || (result.role !== "rider" && result.role !== "coordinator")) return null
  return { role: result.role, policyAccepted: Boolean(result.policy_accepted ?? result.policyAccepted) }
}

export async function revokePortalSession(sessionToken: string): Promise<void> {
  await createCamdenServiceClient().rpc("camden_revoke_portal_session", { p_session_token: sessionToken })
}

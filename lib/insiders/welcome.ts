import type {
  InsiderMembershipType,
  InsiderTier,
} from '@/lib/insiders/types'
import { INSIDER_TIERS } from '@/lib/insiders/constants'

export interface InsiderWelcomeProfile {
  memberId: string
  name: string
  email: string
  membershipType: InsiderMembershipType
  tier: InsiderTier
  joinedAt: string | null
  approvedRiders: string[]
  complimentaryMembership?: boolean
  lifetimeTier?: InsiderTier | null
}

interface MemberRow {
  id: string
  name: string
  email: string | null
  membership_type: InsiderMembershipType
  joined_at: string | null
  lifetime_tier: InsiderTier | null
  complimentary_membership: boolean | null
}

interface RiderRow {
  name: string
  is_account_owner: boolean
}

export interface InsiderWelcomeProfileClient {
  from(table: 'insider_members'): {
    select(columns: string): {
      eq(column: string, value: unknown): {
        eq(column: string, value: unknown): {
          maybeSingle(): Promise<{
            data: MemberRow | null
            error: { message?: string } | null
          }>
        }
      }
    }
  }
  from(table: 'insider_riders'): {
    select(columns: string): {
      eq(column: string, value: unknown): {
        eq(column: string, value: unknown): {
          order(column: string, options: { ascending: boolean }): Promise<{
            data: RiderRow[] | null
            error: { message?: string } | null
          }>
        }
      }
    }
  }
  rpc(
    functionName: 'insider_effective_tier',
    args: { target_member_id: string },
  ): Promise<{ data: InsiderTier | null; error: { message?: string } | null }>
}

export const INSIDER_MEMBERSHIP_DETAILS: Record<
  InsiderMembershipType,
  { label: string; summary: string; riderLimit: number }
> = {
  individual: {
    label: 'Individual Membership',
    summary: 'Your personal access to Insider savings and rewards.',
    riderLimit: 1,
  },
  family: {
    label: 'Family Membership',
    summary: 'Insider access for your household and approved riders.',
    riderLimit: 5,
  },
  business: {
    label: 'Business Membership',
    summary: 'Insider access for your organization and approved riders.',
    riderLimit: 10,
  },
}

export async function getInsiderWelcomeProfileFromClient(
  supabase: InsiderWelcomeProfileClient,
  memberId: string,
): Promise<InsiderWelcomeProfile | null> {
  const { data: member, error: memberError } = await supabase
    .from('insider_members')
    .select(
      'id,name,email,membership_type,joined_at,lifetime_tier,complimentary_membership',
    )
    .eq('id', memberId)
    .eq('is_active', true)
    .maybeSingle()

  if (memberError) {
    throw new Error(
      `Unable to load Insider welcome profile: ${memberError.message || 'unknown error'}`,
    )
  }
  if (!member?.email) return null

  const [{ data: effectiveTier, error: tierError }, ridersResult] =
    await Promise.all([
      supabase.rpc('insider_effective_tier', {
        target_member_id: memberId,
      }),
      supabase
        .from('insider_riders')
        .select('name,is_account_owner')
        .eq('member_id', memberId)
        .eq('is_active', true)
        .order('created_at', { ascending: true }),
    ])

  if (tierError || !effectiveTier) {
    throw new Error(
      `Unable to load Insider welcome tier: ${tierError?.message || 'missing tier'}`,
    )
  }
  if (ridersResult.error) {
    throw new Error(
      `Unable to load Insider welcome riders: ${ridersResult.error.message || 'unknown error'}`,
    )
  }

  return {
    memberId: member.id,
    name: member.name,
    email: member.email,
    membershipType: member.membership_type,
    tier: effectiveTier,
    joinedAt: member.joined_at,
    approvedRiders: (ridersResult.data ?? [])
      .filter((rider) => !rider.is_account_owner)
      .map((rider) => rider.name),
    complimentaryMembership: Boolean(member.complimentary_membership),
    lifetimeTier: member.lifetime_tier,
  }
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'Insider'
}

export function buildInsiderWelcomeEmail(
  profile: InsiderWelcomeProfile,
  welcomeUrl: string,
) {
  const tier = INSIDER_TIERS[profile.tier]
  const membership = INSIDER_MEMBERSHIP_DETAILS[profile.membershipType]
  const safeName = escapeHtml(profile.name)
  const safeFirstName = escapeHtml(firstName(profile.name))
  const safeUrl = escapeHtml(welcomeUrl)
  const lifetimeMessage = profile.lifetimeTier
    ? `<p style="margin:12px 0 0;color:#cffafe;font-size:14px;font-weight:700;">${escapeHtml(INSIDER_TIERS[profile.lifetimeTier].label)} for life</p>`
    : ''

  const text = [
    `Welcome to Insider Rewards, ${profile.name}!`,
    '',
    `Your ${membership.label} is ready. You currently have ${tier.label} status and receive ${tier.discount}% savings on eligible rides.`,
    '',
    'Open your personalized welcome packet:',
    welcomeUrl,
    '',
    'Inside, you can review your membership, benefits, approved riders, vehicle options, and secure member access.',
    '',
    'Questions? Call or text (573) 206-9499 or email contactus@lakeridepros.com.',
  ].join('\n')

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Welcome to Insider Rewards</title>
  </head>
  <body style="margin:0;background:#050505;color:#ffffff;font-family:Montserrat,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border:1px solid #4cbb17;border-radius:24px;overflow:hidden;background:#111111;">
            <tr>
              <td style="padding:36px 32px 24px;text-align:center;background:radial-gradient(circle at top,#173d0b 0,#080808 58%);">
                <p style="margin:0;color:#7ee442;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;">Lake Ride Pros</p>
                <h1 style="margin:10px 0 0;color:#ffffff;font-size:34px;line-height:1.15;">Insider Rewards</h1>
                <p style="margin:18px 0 0;color:#d4d4d8;font-size:18px;line-height:1.55;">Welcome, <strong style="color:#7ee442;">${safeFirstName}</strong>. Your membership is ready.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #3f3f46;border-radius:18px;background:#090909;">
                  <tr>
                    <td style="padding:24px;">
                      <p style="margin:0;color:#a1a1aa;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">Insider member</p>
                      <p style="margin:8px 0 0;color:#ffffff;font-size:25px;font-weight:800;">${safeName}</p>
                      <p style="margin:8px 0 0;color:#d4d4d8;font-size:15px;">${escapeHtml(membership.label)}</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;">
                        <tr>
                          <td style="color:#7ee442;font-size:22px;font-weight:800;">${escapeHtml(tier.label)}</td>
                          <td align="right" style="color:#ffffff;font-size:22px;font-weight:800;">${tier.discount}% savings</td>
                        </tr>
                      </table>
                      ${lifetimeMessage}
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;color:#d4d4d8;font-size:15px;line-height:1.7;">Your personalized packet includes your membership details, tier benefits, approved riders, vehicle options, and the fastest way to access your Insider account.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto 0;">
                  <tr>
                    <td style="border-radius:12px;background:#4cbb17;">
                      <a href="${safeUrl}" style="display:inline-block;padding:15px 24px;color:#050505;font-size:16px;font-weight:800;text-decoration:none;">View my welcome packet</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;color:#71717a;font-size:12px;line-height:1.6;text-align:center;">This secure link expires. If it does, you can still access your membership at <a href="https://www.lakeridepros.com/insiders/login" style="color:#7ee442;">lakeridepros.com/insiders/login</a>.</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #27272a;padding:22px 32px;color:#a1a1aa;font-size:12px;line-height:1.6;text-align:center;">
                Call or text <a href="tel:+15732069499" style="color:#7ee442;">(573) 206-9499</a> · <a href="mailto:contactus@lakeridepros.com" style="color:#7ee442;">contactus@lakeridepros.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return {
    subject: `Welcome to Insider Rewards, ${firstName(profile.name)}!`,
    text,
    html,
  }
}

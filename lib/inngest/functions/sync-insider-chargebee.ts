import { inngest } from '../client'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import {
  processInsiderChargebeeSync,
  type ChargebeeSyncRpcClient,
  type InsiderChargebeeSyncEvent,
} from '@/lib/chargebee/insider-sync'
import { Resend } from 'resend'
import { buildInsiderWelcomeEmail } from '@/lib/insiders/welcome'
import { createInsiderWelcomeToken } from '@/lib/insiders/welcome-link'
import { getInsiderWelcomeProfile } from '@/lib/insiders/welcome-server'

function createdMemberId(result: unknown) {
  if (!result || typeof result !== 'object') return null
  const record = result as Record<string, unknown>
  return record.memberCreated === true && typeof record.memberId === 'string'
    ? record.memberId
    : null
}

export const syncInsiderChargebeeSubscription = inngest.createFunction(
  {
    id: 'sync-insider-chargebee-subscription',
    name: 'Sync Insider Chargebee Subscription',
    retries: 5,
    concurrency: {
      limit: 1,
      key: 'event.data.subscriptionId',
    },
    triggers: [
      { event: 'chargebee/insider.subscription.sync.requested' },
    ],
    onFailure: async ({ event, step, error }) => {
      const originalEvent = event.data
        .event as unknown as {
          data: InsiderChargebeeSyncEvent
        }
      const data = originalEvent.data

      await step.run('record-chargebee-sync-issue', async () => {
        const supabase =
          getSupabaseServerClient() as unknown as ChargebeeSyncRpcClient
        const { error: issueError } = await supabase.rpc(
          'record_insider_sync_issue',
          {
            target_issue_key: `chargebee-subscription:${data.subscriptionId}`,
            target_issue_type: 'billing_sync',
            target_source: 'chargebee',
            target_subscription_id: data.subscriptionId,
            target_summary: 'Chargebee subscription synchronization failed',
            target_metadata: {
              chargebeeEventId: data.chargebeeEventId,
              eventType: data.eventType,
              error: error.message.slice(0, 500),
            },
          },
        )

        if (issueError) {
          throw new Error(
            `Unable to record Chargebee sync issue: ${issueError.message || 'unknown error'}`,
          )
        }
      })
    },
  },
  async ({ event, step }) => {
    const data = event.data as InsiderChargebeeSyncEvent

    const syncResult = await step.run(
      'fetch-and-sync-authoritative-subscription',
      async () => {
      return processInsiderChargebeeSync(data, {
        supabase:
          getSupabaseServerClient() as unknown as ChargebeeSyncRpcClient,
      })
      },
    )

    const memberId = createdMemberId(syncResult)
    const welcomeMode = process.env.INSIDERS_WELCOME_EMAIL_MODE || 'off'
    if (!memberId || welcomeMode !== 'send') {
      return {
        sync: syncResult,
        welcomeEmail: {
          enabled: welcomeMode === 'send',
          sent: false,
          reason: memberId ? 'delivery_disabled' : 'not_a_new_member',
        },
      }
    }

    const welcomeEmail = await step.run('send-insider-welcome-email', async () => {
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is required for Insider welcome email')
      }

      const profile = await getInsiderWelcomeProfile(memberId)
      if (!profile) {
        throw new Error('New Insider welcome profile is unavailable')
      }

      const token = createInsiderWelcomeToken(memberId, {
        expiresAt: new Date((data.occurredAt + 30 * 24 * 60 * 60) * 1000),
      })
      const siteUrl = (
        process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lakeridepros.com'
      ).replace(/\/$/, '')
      const message = buildInsiderWelcomeEmail(
        profile,
        `${siteUrl}/insiders/welcome/${token}`,
      )
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data: sent, error } = await resend.emails.send(
        {
          from:
            process.env.INSIDERS_EMAIL_FROM ||
            'Lake Ride Pros Insider Rewards <contactus@updates.lakeridepros.com>',
          replyTo: 'contactus@lakeridepros.com',
          to: profile.email,
          subject: message.subject,
          text: message.text,
          html: message.html,
          tags: [
            { name: 'audience', value: 'insider_rewards' },
            { name: 'message', value: 'welcome' },
          ],
        },
        { idempotencyKey: `insider-welcome/${memberId}` },
      )

      if (error) throw new Error(`Welcome email failed: ${error.message}`)
      return { sent: true, emailId: sent?.id || null }
    })

    return { sync: syncResult, welcomeEmail }
  },
)

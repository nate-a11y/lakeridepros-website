import { inngest } from '../client'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import {
  processInsiderChargebeeSync,
  type ChargebeeSyncRpcClient,
  type InsiderChargebeeSyncEvent,
} from '@/lib/chargebee/insider-sync'

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

    return step.run('fetch-and-sync-authoritative-subscription', async () => {
      return processInsiderChargebeeSync(data, {
        supabase:
          getSupabaseServerClient() as unknown as ChargebeeSyncRpcClient,
      })
    })
  },
)

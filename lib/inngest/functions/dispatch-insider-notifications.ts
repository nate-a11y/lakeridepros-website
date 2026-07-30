import { Resend } from 'resend'
import { getSupabaseServerClient } from '@/lib/supabase/client'
import {
  claimInsiderNotificationDeliveries,
  completeInsiderNotificationDelivery,
  previewInsiderNotificationDeliveries,
  readInsiderNotificationDeliverySettings,
  sendInsiderNotificationDelivery,
  type InsiderNotificationRpcClient,
} from '@/lib/insiders/notification-delivery'
import { inngest } from '../client'

export const dispatchInsiderNotifications = inngest.createFunction(
  {
    id: 'dispatch-insider-notifications',
    name: 'Dispatch Insider Notifications',
    retries: 3,
    concurrency: { limit: 1 },
    triggers: [{ cron: '*/5 * * * *' }],
  },
  async ({ step }) => {
    const settings = readInsiderNotificationDeliverySettings()
    if (settings.mode === 'off') {
      return { enabled: false, mode: 'off' }
    }

    const supabase =
      getSupabaseServerClient() as unknown as InsiderNotificationRpcClient

    if (settings.mode === 'dry-run') {
      const preview = await step.run('preview-insider-notifications', () =>
        previewInsiderNotificationDeliveries(supabase, settings),
      )
      return {
        enabled: true,
        mode: 'dry-run',
        smsDeliveryEnabled: settings.smsEnabled,
        ...preview,
      }
    }

    const deliveries = await step.run('claim-insider-notifications', () =>
      claimInsiderNotificationDeliveries(supabase, settings),
    )
    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null
    const completed = []

    for (const delivery of deliveries) {
      const result = await step.run(
        `send-insider-notification-${delivery.delivery_id}`,
        () =>
          sendInsiderNotificationDelivery(delivery, {
            sendEmail: resend
              ? async (message) => {
                  const { data, error } = await resend.emails.send(message)
                  return {
                    id: data?.id,
                    error: error?.message,
                  }
                }
              : undefined,
          }),
      )

      const status = await step.run(
        `complete-insider-notification-${delivery.delivery_id}`,
        () =>
          completeInsiderNotificationDelivery(
            supabase,
            delivery.delivery_id,
            result,
          ),
      )
      completed.push({
        deliveryId: delivery.delivery_id,
        channel: delivery.channel,
        status,
      })
    }

    return {
      enabled: true,
      mode: 'send',
      claimed: deliveries.length,
      completed,
    }
  },
)

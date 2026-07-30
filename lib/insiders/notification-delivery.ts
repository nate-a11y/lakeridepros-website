export type InsiderNotificationDeliveryMode = 'off' | 'dry-run' | 'send'
export type InsiderNotificationChannel = 'email' | 'push' | 'sms'

export interface InsiderNotificationDelivery {
  delivery_id: string
  notification_id: string
  member_id: string
  user_id: string
  channel: InsiderNotificationChannel
  recipient: string | null
  title: string
  body: string
  notification_type: string
  action_label: string | null
  action_url: string | null
}

export interface InsiderNotificationDeliverySettings {
  mode: InsiderNotificationDeliveryMode
  batchSize: number
  smsEnabled: boolean
  channels: InsiderNotificationChannel[]
}

export interface InsiderNotificationRpcClient {
  rpc(
    functionName: string,
    args: Record<string, unknown>,
  ): Promise<{ data: unknown; error: { message?: string } | null }>
}

export interface DeliveryResult {
  success: boolean
  providerMessageId?: string
  error?: string
  retryable: boolean
}

interface EmailInput {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

interface DeliveryDependencies {
  env?: Record<string, string | undefined>
  fetcher?: typeof fetch
  sendEmail?: (
    input: EmailInput,
  ) => Promise<{ id?: string | null; error?: string | null }>
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function readInsiderNotificationDeliverySettings(
  env: Record<string, string | undefined> = process.env,
): InsiderNotificationDeliverySettings {
  const mode = (env.INSIDERS_NOTIFICATION_DELIVERY_MODE ||
    'off') as InsiderNotificationDeliveryMode
  if (!['off', 'dry-run', 'send'].includes(mode)) {
    throw new Error(
      'INSIDERS_NOTIFICATION_DELIVERY_MODE must be off, dry-run, or send',
    )
  }

  const smsEnabled =
    env.INSIDERS_SMS_DELIVERY_ENABLED?.toLowerCase() === 'true'

  return {
    mode,
    batchSize: Math.min(
      positiveInteger(env.INSIDERS_NOTIFICATION_BATCH_SIZE, 50),
      100,
    ),
    smsEnabled,
    channels: smsEnabled ? ['email', 'push', 'sms'] : ['email', 'push'],
  }
}

function cleanError(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Notification delivery failed'
  return message.replace(/\s+/g, ' ').slice(0, 500)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function actionUrl(
  delivery: InsiderNotificationDelivery,
  siteUrl: string,
) {
  if (!delivery.action_url) return null
  try {
    return new URL(delivery.action_url, siteUrl).toString()
  } catch {
    return null
  }
}

function emailContent(
  delivery: InsiderNotificationDelivery,
  siteUrl: string,
) {
  const url = actionUrl(delivery, siteUrl)
  const label = delivery.action_label || 'View in your Insider account'
  const text = [
    delivery.title,
    '',
    delivery.body,
    '',
    url ? `${label}: ${url}` : null,
    '',
    'You can update notification settings in your Insider account.',
  ]
    .filter((line) => line !== null)
    .join('\n')

  const html = `
    <div style="background:#090909;color:#f8fafc;font-family:Arial,sans-serif;padding:32px">
      <div style="max-width:620px;margin:0 auto;background:#18181b;border:1px solid #303033;border-radius:20px;padding:32px">
        <p style="color:#4cbb17;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 12px">Lake Ride Pros Insider Rewards</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">${escapeHtml(delivery.title)}</h1>
        <p style="color:#d4d4d8;font-size:16px;line-height:1.65;white-space:pre-line;margin:0">${escapeHtml(delivery.body)}</p>
        ${
          url
            ? `<p style="margin:28px 0 0"><a href="${escapeHtml(url)}" style="display:inline-block;background:#4cbb17;color:#050505;font-weight:700;text-decoration:none;border-radius:10px;padding:13px 18px">${escapeHtml(label)}</a></p>`
            : ''
        }
        <p style="color:#71717a;font-size:12px;line-height:1.5;margin:28px 0 0">You can update notification settings in your Insider account.</p>
      </div>
    </div>
  `.trim()

  return { text, html }
}

async function parseResponse(response: Response) {
  return (await response.json().catch(() => null)) as
    | Record<string, unknown>
    | null
}

export async function sendInsiderNotificationDelivery(
  delivery: InsiderNotificationDelivery,
  dependencies: DeliveryDependencies = {},
): Promise<DeliveryResult> {
  const env = dependencies.env || process.env
  const fetcher = dependencies.fetcher || fetch
  const supabaseUrl =
    env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || ''
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://lakeridepros.com'

  try {
    if (delivery.channel === 'email') {
      if (!delivery.recipient) {
        return {
          success: false,
          error: 'Email recipient is missing',
          retryable: false,
        }
      }
      if (!dependencies.sendEmail) {
        return {
          success: false,
          error: 'Email delivery is not configured',
          retryable: true,
        }
      }

      const content = emailContent(delivery, siteUrl)
      const result = await dependencies.sendEmail({
        from:
          env.INSIDERS_EMAIL_FROM ||
          'Lake Ride Pros Insider Rewards <contactus@updates.lakeridepros.com>',
        to: delivery.recipient,
        subject: delivery.title,
        text: content.text,
        html: content.html,
      })
      if (result.error) {
        return {
          success: false,
          error: result.error.slice(0, 500),
          retryable: true,
        }
      }
      return {
        success: true,
        providerMessageId: result.id || undefined,
        retryable: false,
      }
    }

    if (!supabaseUrl || !serviceKey) {
      return {
        success: false,
        error: 'Supabase notification delivery is not configured',
        retryable: true,
      }
    }

    if (delivery.channel === 'push') {
      const url = actionUrl(delivery, siteUrl) || '/insiders/events'
      const response = await fetcher(
        `${supabaseUrl}/functions/v1/send-web-push`,
        {
          method: 'POST',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: delivery.user_id,
            payload: {
              title: delivery.title,
              body: delivery.body,
              tag: `insider-${delivery.notification_id}`,
              data: {
                url,
                notificationId: delivery.notification_id,
                audience: 'insider-rewards',
              },
            },
          }),
        },
      )
      const responseBody = await parseResponse(response)
      if (!response.ok || responseBody?.success !== true) {
        return {
          success: false,
          error: `Push delivery failed (${response.status})`,
          retryable: response.status === 429 || response.status >= 500,
        }
      }
      return {
        success: true,
        providerMessageId:
          typeof responseBody.sent === 'number'
            ? `sent:${responseBody.sent}`
            : undefined,
        retryable: false,
      }
    }

    if (
      env.INSIDERS_SMS_DELIVERY_ENABLED?.toLowerCase() !== 'true'
    ) {
      return {
        success: false,
        error: 'Insider text delivery is disabled',
        retryable: true,
      }
    }
    if (!delivery.recipient) {
      return {
        success: false,
        error: 'Text message recipient is missing',
        retryable: false,
      }
    }

    const url = actionUrl(delivery, siteUrl)
    const smsBody = [
      `Lake Ride Pros Insider Rewards: ${delivery.title}`,
      delivery.body,
      url,
      'Reply STOP to opt out.',
    ]
      .filter(Boolean)
      .join('\n')
      .slice(0, 1500)
    const response = await fetcher(`${supabaseUrl}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'sendSms',
        params: {
          to: delivery.recipient,
          body: smsBody,
          context: {
            source: 'insider-rewards',
            notificationId: delivery.notification_id,
            deliveryId: delivery.delivery_id,
          },
        },
      }),
    })
    const responseBody = await parseResponse(response)
    if (!response.ok || responseBody?.ok !== true) {
      return {
        success: false,
        error: `Text delivery failed (${response.status})`,
        retryable: response.status === 429 || response.status >= 500,
      }
    }
    return {
      success: true,
      providerMessageId:
        typeof responseBody.sid === 'string' ? responseBody.sid : undefined,
      retryable: false,
    }
  } catch (error) {
    return {
      success: false,
      error: cleanError(error),
      retryable: true,
    }
  }
}

export async function previewInsiderNotificationDeliveries(
  supabase: InsiderNotificationRpcClient,
  settings: InsiderNotificationDeliverySettings,
) {
  const { data, error } = await supabase.rpc(
    'preview_insider_notification_deliveries',
    {
      target_channels: settings.channels,
      page_limit: settings.batchSize,
    },
  )
  if (error) {
    throw new Error(
      `Unable to preview Insider notifications: ${error.message || 'unknown error'}`,
    )
  }

  const rows = Array.isArray(data) ? data : []
  return {
    due: rows.length,
    byChannel: settings.channels.reduce<Record<string, number>>(
      (summary, channel) => {
        summary[channel] = rows.filter(
          (row) =>
            typeof row === 'object' &&
            row !== null &&
            'channel' in row &&
            row.channel === channel,
        ).length
        return summary
      },
      {},
    ),
  }
}

export async function claimInsiderNotificationDeliveries(
  supabase: InsiderNotificationRpcClient,
  settings: InsiderNotificationDeliverySettings,
) {
  const { data, error } = await supabase.rpc(
    'claim_insider_notification_deliveries',
    {
      target_channels: settings.channels,
      page_limit: settings.batchSize,
    },
  )
  if (error) {
    throw new Error(
      `Unable to claim Insider notifications: ${error.message || 'unknown error'}`,
    )
  }
  return (Array.isArray(data) ? data : []) as InsiderNotificationDelivery[]
}

export async function completeInsiderNotificationDelivery(
  supabase: InsiderNotificationRpcClient,
  deliveryId: string,
  result: DeliveryResult,
) {
  const { data, error } = await supabase.rpc(
    'complete_insider_notification_delivery',
    {
      target_delivery_id: deliveryId,
      target_success: result.success,
      target_provider_message_id: result.providerMessageId || null,
      target_error: result.error || null,
      target_retryable: result.retryable,
    },
  )
  if (error) {
    throw new Error(
      `Unable to complete Insider notification: ${error.message || 'unknown error'}`,
    )
  }
  return data
}

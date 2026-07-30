import { describe, expect, it, vi } from 'vitest'
import {
  claimInsiderNotificationDeliveries,
  readInsiderNotificationDeliverySettings,
  sendInsiderNotificationDelivery,
  type InsiderNotificationDelivery,
} from '../notification-delivery'

const DELIVERY: InsiderNotificationDelivery = {
  delivery_id: '00000000-0000-4000-8000-000000000001',
  notification_id: '00000000-0000-4000-8000-000000000002',
  member_id: '00000000-0000-4000-8000-000000000003',
  user_id: '00000000-0000-4000-8000-000000000004',
  channel: 'email',
  recipient: 'member@example.com',
  title: 'Your Insider update',
  body: 'A new benefit is ready.',
  notification_type: 'program',
  action_label: 'View benefit',
  action_url: '/insiders/rewards',
}

describe('Insider notification delivery', () => {
  it('keeps all delivery disabled by default', () => {
    expect(readInsiderNotificationDeliverySettings({})).toEqual({
      mode: 'off',
      batchSize: 50,
      smsEnabled: false,
      channels: ['email', 'push'],
    })
  })

  it('only includes SMS claims after the explicit feature gate is enabled', () => {
    expect(
      readInsiderNotificationDeliverySettings({
        INSIDERS_NOTIFICATION_DELIVERY_MODE: 'send',
        INSIDERS_SMS_DELIVERY_ENABLED: 'true',
      }).channels,
    ).toEqual(['email', 'push', 'sms'])
  })

  it('sends member email with escaped content and an account link', async () => {
    const sendEmail = vi.fn().mockResolvedValue({ id: 'email-1' })
    const result = await sendInsiderNotificationDelivery(DELIVERY, {
      env: {
        NEXT_PUBLIC_SITE_URL: 'https://lakeridepros.com',
        INSIDERS_EMAIL_FROM: 'Insiders <insiders@example.com>',
      },
      sendEmail,
    })

    expect(result).toEqual({
      success: true,
      providerMessageId: 'email-1',
      retryable: false,
    })
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'member@example.com',
        subject: 'Your Insider update',
        html: expect.stringContaining(
          'https://lakeridepros.com/insiders/rewards',
        ),
      }),
    )
  })

  it('reuses the LRP Bolt web-push edge function with service credentials', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, sent: 1 }), {
        status: 200,
      }),
    )
    const result = await sendInsiderNotificationDelivery(
      { ...DELIVERY, channel: 'push', recipient: DELIVERY.user_id },
      {
        env: {
          SUPABASE_URL: 'https://example.supabase.co',
          SUPABASE_SERVICE_ROLE_KEY: 'service-key',
          NEXT_PUBLIC_SITE_URL: 'https://lakeridepros.com',
        },
        fetcher,
      },
    )

    expect(result.success).toBe(true)
    expect(fetcher).toHaveBeenCalledWith(
      'https://example.supabase.co/functions/v1/send-web-push',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer service-key',
        }),
      }),
    )
  })

  it('never sends text messages while the SMS gate is off', async () => {
    const fetcher = vi.fn()
    const result = await sendInsiderNotificationDelivery(
      { ...DELIVERY, channel: 'sms', recipient: '+15735550199' },
      {
        env: {
          SUPABASE_URL: 'https://example.supabase.co',
          SUPABASE_SERVICE_ROLE_KEY: 'service-key',
          INSIDERS_SMS_DELIVERY_ENABLED: 'false',
        },
        fetcher,
      },
    )

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        error: 'Insider text delivery is disabled',
      }),
    )
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('claims only the enabled channels and configured batch size', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [DELIVERY], error: null })
    const settings = readInsiderNotificationDeliverySettings({
      INSIDERS_NOTIFICATION_DELIVERY_MODE: 'send',
      INSIDERS_NOTIFICATION_BATCH_SIZE: '25',
    })

    const rows = await claimInsiderNotificationDeliveries({ rpc }, settings)

    expect(rows).toEqual([DELIVERY])
    expect(rpc).toHaveBeenCalledWith(
      'claim_insider_notification_deliveries',
      {
        target_channels: ['email', 'push'],
        page_limit: 25,
      },
    )
  })
})

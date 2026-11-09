import { expect, it, vi } from 'vitest'
import { claimInsiderNotificationDeliveries, completeInsiderNotificationDelivery, previewInsiderNotificationDeliveries, readInsiderNotificationDeliverySettings, sendInsiderNotificationDelivery, type InsiderNotificationDelivery } from '../notification-delivery'

const delivery: InsiderNotificationDelivery = { delivery_id: 'delivery-1', notification_id: 'notice-1', member_id: 'member-1', user_id: 'user-1', channel: 'email', recipient: 'member@example.com', title: 'Update <&>', body: 'A "benefit" is ready.', notification_type: 'program', action_label: null, action_url: null }
const env = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-only', INSIDERS_SMS_DELIVERY_ENABLED: 'true' }

it.each([['0', 50], ['invalid', 50], ['101', 100], ['2', 2]])('bounds batch size %s to %i', (value, expected) => {
  expect(readInsiderNotificationDeliverySettings({ INSIDERS_NOTIFICATION_BATCH_SIZE: value }).batchSize).toBe(expected)
})
it('rejects invalid delivery modes', () => { expect(() => readInsiderNotificationDeliverySettings({ INSIDERS_NOTIFICATION_DELIVERY_MODE: 'other' })).toThrow('must be off, dry-run, or send') })

it('fails closed for missing email recipients, senders, or provider configuration', async () => {
  const sendEmail = vi.fn()
  expect(await sendInsiderNotificationDelivery({ ...delivery, recipient: null }, { env: {}, sendEmail })).toMatchObject({ success: false, retryable: false })
  expect(await sendInsiderNotificationDelivery(delivery, { env: {} })).toMatchObject({ success: false, retryable: true })
  expect(await sendInsiderNotificationDelivery({ ...delivery, channel: 'push' }, { env: {}, fetcher: vi.fn() })).toMatchObject({ error: 'Supabase notification delivery is not configured' })
  expect(sendEmail).not.toHaveBeenCalled()
})

it('escapes email fields, handles malformed URLs, and propagates bounded provider errors', async () => {
  const sendEmail = vi.fn().mockResolvedValue({})
  expect(await sendInsiderNotificationDelivery(delivery, { env: {}, sendEmail })).toEqual({ success: true, providerMessageId: undefined, retryable: false })
  expect(sendEmail.mock.calls[0][0].html).toContain('Update &lt;&amp;&gt;')
  expect(sendEmail.mock.calls[0][0].html).toContain('A &quot;benefit&quot; is ready.')
  expect(sendEmail.mock.calls[0][0].html).not.toContain('<a href=')
  await sendInsiderNotificationDelivery({ ...delivery, action_url: '/insiders' }, { env: {}, sendEmail })
  expect(sendEmail.mock.calls[1][0].html).toContain('View in your Insider account')
  await sendInsiderNotificationDelivery({ ...delivery, action_url: 'http://[' }, { env: {}, sendEmail })
  expect(sendEmail.mock.calls[2][0].html).not.toContain('<a href=')
  sendEmail.mockResolvedValue({ error: 'x'.repeat(1000) })
  expect((await sendInsiderNotificationDelivery(delivery, { env: {}, sendEmail })).error).toHaveLength(500)
})

it.each([new Error('network\n failure'), 'offline'])('normalizes thrown delivery failures', async error => {
  const result = await sendInsiderNotificationDelivery(delivery, { env: {}, sendEmail: vi.fn().mockRejectedValue(error) })
  expect(result).toMatchObject({ success: false, retryable: true })
  expect(result.error).toBe(error instanceof Error ? 'network failure' : 'Notification delivery failed')
})

it.each(['push', 'sms'] as const)('classifies %s response failures and retry policy', async channel => {
  for (const status of [400, 429, 503]) {
    const fetcher = vi.fn().mockResolvedValue(new Response('not JSON', { status }))
    expect(await sendInsiderNotificationDelivery({ ...delivery, channel }, { env, fetcher })).toMatchObject({ success: false, retryable: status === 429 || status >= 500 })
  }
  const fetcher = vi.fn().mockResolvedValue(Response.json({}))
  expect(await sendInsiderNotificationDelivery({ ...delivery, channel }, { env, fetcher })).toMatchObject({ success: false, retryable: false })
})

it('sends only through the injected SMS transport and preserves identifiers and bounded content', async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({ ok: true, sid: 'sms-1' }))
  expect(await sendInsiderNotificationDelivery({ ...delivery, channel: 'sms', action_url: '/insiders', action_label: 'Open' }, { env, fetcher })).toEqual({ success: true, providerMessageId: 'sms-1', retryable: false })
  const body = JSON.parse(fetcher.mock.calls[0][1].body)
  expect(body.params.to).toBe('member@example.com')
  expect(body.params.body).toContain('Reply STOP to opt out.')
  expect(body.params.context).toEqual({ source: 'insider-rewards', notificationId: 'notice-1', deliveryId: 'delivery-1' })
  fetcher.mockResolvedValue(Response.json({ ok: true }))
  expect((await sendInsiderNotificationDelivery({ ...delivery, channel: 'sms', body: 'x'.repeat(2000) }, { env, fetcher })).providerMessageId).toBeUndefined()
  expect(JSON.parse(fetcher.mock.calls[1][1].body).params.body.length).toBeLessThanOrEqual(1500)
  expect(await sendInsiderNotificationDelivery({ ...delivery, channel: 'sms', recipient: null }, { env, fetcher })).toMatchObject({ success: false, retryable: false })
})

it('supports push success without a provider id and supplies its default action URL', async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({ success: true }))
  expect(await sendInsiderNotificationDelivery({ ...delivery, channel: 'push' }, { env, fetcher })).toEqual({ success: true, providerMessageId: undefined, retryable: false })
  expect(JSON.parse(fetcher.mock.calls[0][1].body).payload.data.url).toBe('/insiders/events')
})

it('previews per-channel counts without claiming any delivery', async () => {
  const rpc = vi.fn().mockResolvedValue({ data: [{ channel: 'email' }, { channel: 'sms' }, null, 'invalid', {}], error: null })
  const settings = readInsiderNotificationDeliverySettings({ INSIDERS_SMS_DELIVERY_ENABLED: 'true' })
  expect(await previewInsiderNotificationDeliveries({ rpc }, settings)).toEqual({ due: 5, byChannel: { email: 1, push: 0, sms: 1 } })
  expect(rpc).toHaveBeenCalledWith('preview_insider_notification_deliveries', { target_channels: ['email', 'push', 'sms'], page_limit: 50 })
  rpc.mockResolvedValue({ data: null, error: null })
  expect((await previewInsiderNotificationDeliveries({ rpc }, settings)).due).toBe(0)
  expect(await claimInsiderNotificationDeliveries({ rpc }, settings)).toEqual([])
})

it.each(['preview', 'claim', 'complete'] as const)('surfaces %s RPC failures without falling through to a send', async operation => {
  const rpc = vi.fn().mockResolvedValue({ data: null, error: {} })
  const settings = readInsiderNotificationDeliverySettings({})
  const run = () => operation === 'preview' ? previewInsiderNotificationDeliveries({ rpc }, settings) : operation === 'claim' ? claimInsiderNotificationDeliveries({ rpc }, settings) : completeInsiderNotificationDelivery({ rpc }, 'delivery-1', { success: false, retryable: false })
  await expect(run()).rejects.toThrow('unknown error')
  rpc.mockResolvedValue({ data: null, error: { message: 'unavailable' } })
  await expect(run()).rejects.toThrow('unavailable')
})

it('records completion with explicit provider fields and safe null defaults', async () => {
  const rpc = vi.fn().mockResolvedValue({ data: { saved: true }, error: null })
  expect(await completeInsiderNotificationDelivery({ rpc }, 'delivery-1', { success: true, providerMessageId: 'provider-1', retryable: false })).toEqual({ saved: true })
  expect(rpc.mock.calls[0][1]).toEqual({ target_delivery_id: 'delivery-1', target_success: true, target_provider_message_id: 'provider-1', target_error: null, target_retryable: false })
  await completeInsiderNotificationDelivery({ rpc }, 'delivery-1', { success: false, error: 'offline', retryable: true })
  expect(rpc.mock.calls[1][1]).toMatchObject({ target_provider_message_id: null, target_error: 'offline' })
})

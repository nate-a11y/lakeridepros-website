import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '../route'

const { mockRevalidatePath } = vi.hoisted(() => ({
  mockRevalidatePath: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

function webhookRequest(payload: string, secret = 'test-fourthwall-secret') {
  const signature = createHmac('sha256', secret).update(payload).digest('base64')
  return new NextRequest('http://localhost/api/fourthwall/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Fourthwall-Hmac-SHA256': signature,
    },
    body: payload,
  })
}

describe('Fourthwall webhook', () => {
  beforeEach(() => {
    mockRevalidatePath.mockReset()
    vi.stubEnv('FOURTHWALL_WEBHOOK_SECRET', 'test-fourthwall-secret')
    vi.stubEnv('FOURTHWALL_WEBHOOK_ID', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('reports whether webhook verification is configured', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      service: 'fourthwall-webhook',
      configured: true,
      webhookIdConfigured: false,
    })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('accepts a valid product event and revalidates the shop', async () => {
    const payload = JSON.stringify({ id: 'event-1', type: 'PRODUCT_UPDATED' })
    const response = await POST(webhookRequest(payload))

    expect(response.status).toBe(200)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/shop', 'layout')
  })

  it('rejects an invalid signature', async () => {
    const payload = JSON.stringify({ id: 'event-2', type: 'ORDER_PLACED' })
    const response = await POST(webhookRequest(payload, 'wrong-secret'))

    expect(response.status).toBe(401)
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('ignores accidental surrounding whitespace in the configured secret', async () => {
    vi.stubEnv('FOURTHWALL_WEBHOOK_SECRET', '  test-fourthwall-secret\n')
    const payload = JSON.stringify({ id: 'event-trimmed-secret', type: 'PRODUCT_UPDATED' })

    const response = await POST(webhookRequest(payload))

    expect(response.status).toBe(200)
    expect(mockRevalidatePath).toHaveBeenCalledWith('/shop', 'layout')
  })

  it('rejects signed payloads that are not valid webhook events', async () => {
    const response = await POST(webhookRequest(JSON.stringify({ type: 'PRODUCT_UPDATED' })))

    expect(response.status).toBe(400)
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('accepts duplicate deliveries without repeating the side effect', async () => {
    const payload = JSON.stringify({ id: 'event-duplicate', type: 'PRODUCT_UPDATED' })

    const firstResponse = await POST(webhookRequest(payload))
    const duplicateResponse = await POST(webhookRequest(payload))

    expect(firstResponse.status).toBe(200)
    expect(duplicateResponse.status).toBe(200)
    await expect(duplicateResponse.json()).resolves.toEqual({
      received: true,
      duplicate: true,
    })
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1)
  })

  it('does not mark an event processed when its side effect fails', async () => {
    const payload = JSON.stringify({ id: 'event-retry-after-failure', type: 'PRODUCT_UPDATED' })
    mockRevalidatePath.mockImplementationOnce(() => {
      throw new Error('cache unavailable')
    })

    await expect(POST(webhookRequest(payload))).rejects.toThrow('cache unavailable')

    const retryResponse = await POST(webhookRequest(payload))
    expect(retryResponse.status).toBe(200)
    expect(mockRevalidatePath).toHaveBeenCalledTimes(2)
  })

  it('rejects events from a different configured webhook', async () => {
    vi.stubEnv('FOURTHWALL_WEBHOOK_ID', 'expected-webhook')
    const payload = JSON.stringify({
      id: 'event-webhook-mismatch',
      webhookId: 'different-webhook',
      type: 'PRODUCT_UPDATED',
    })

    const response = await POST(webhookRequest(payload))

    expect(response.status).toBe(401)
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })

  it('fails closed when the webhook secret is missing', async () => {
    vi.stubEnv('FOURTHWALL_WEBHOOK_SECRET', '')
    const payload = JSON.stringify({ id: 'event-no-secret', type: 'PRODUCT_UPDATED' })

    const response = await POST(webhookRequest(payload))

    expect(response.status).toBe(503)
    expect(mockRevalidatePath).not.toHaveBeenCalled()
  })
})

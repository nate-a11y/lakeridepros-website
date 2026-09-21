import { createHmac } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
    vi.clearAllMocks()
    process.env.FOURTHWALL_WEBHOOK_SECRET = 'test-fourthwall-secret'
  })

  it('reports whether webhook verification is configured', async () => {
    const response = await GET()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      service: 'fourthwall-webhook',
      configured: true,
    })
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
})

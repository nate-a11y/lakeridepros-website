import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import {
  createCustomerPhotoSessionToken,
  type CustomerPhotoSession,
} from '@/lib/customer-photo-upload'

const {
  mockCreateSignedUploadUrl,
  mockList,
  mockStorageFrom,
  mockTableFrom,
  mockUpsert,
} = vi.hoisted(() => ({
  mockCreateSignedUploadUrl: vi.fn(),
  mockList: vi.fn(),
  mockStorageFrom: vi.fn(),
  mockTableFrom: vi.fn(),
  mockUpsert: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: { from: mockStorageFrom },
    from: mockTableFrom,
  })),
}))

import { POST } from '../route'

function request(body: Record<string, unknown>) {
  return new NextRequest('https://www.lakeridepros.com/api/customer-photo-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('customer photo upload API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    process.env.CUSTOMER_PHOTO_UPLOAD_SECRET = 'upload-secret'
    process.env.TURNSTILE_SECRET_KEY = 'turnstile-secret'
    mockCreateSignedUploadUrl.mockResolvedValue({
      data: { token: 'signed-upload-token' },
      error: null,
    })
    mockList.mockResolvedValue({ data: [], error: null })
    mockUpsert.mockResolvedValue({ error: null })
    mockStorageFrom.mockReturnValue({
      createSignedUploadUrl: mockCreateSignedUploadUrl,
      list: mockList,
    })
    mockTableFrom.mockReturnValue({ upsert: mockUpsert })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    ))
  })

  it('requires consent before issuing signed upload tokens', async () => {
    const response = await POST(request({
      action: 'prepare',
      customerName: 'Guest Rider',
      consent: false,
      turnstileToken: 'token',
      files: [{ name: 'ride.jpg', type: 'image/jpeg', size: 1024 }],
    }))

    expect(response.status).toBe(400)
    expect(mockCreateSignedUploadUrl).not.toHaveBeenCalled()
  })

  it('verifies Turnstile and prepares private signed uploads', async () => {
    const response = await POST(request({
      action: 'prepare',
      customerName: 'Guest Rider',
      caption: 'Wedding ride',
      consent: true,
      turnstileToken: 'token',
      files: [{ name: 'ride.jpg', type: 'image/jpeg', size: 1024 }],
    }))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.sessionToken).toEqual(expect.any(String))
    expect(data.uploads).toEqual([expect.objectContaining({
      uploadToken: 'signed-upload-token',
      mimeType: 'image/jpeg',
    })])
    expect(mockCreateSignedUploadUrl).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('finalizes only uploaded objects from a valid signed session', async () => {
    const session: CustomerPhotoSession = {
      version: 1,
      expiresAt: Date.now() + 60_000,
      sessionId: 'session-id',
      customerName: 'Guest Rider',
      caption: 'Wedding ride',
      files: [{
        path: 'customer/2026-08/session-id/photo.jpg',
        filename: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      }],
    }
    mockList.mockResolvedValueOnce({
      data: [{ name: 'photo.jpg' }],
      error: null,
    })
    const response = await POST(request({
      action: 'finalize',
      sessionToken: createCustomerPhotoSessionToken(session, 'upload-secret'),
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true, count: 1 })
    expect(mockUpsert).toHaveBeenCalledWith([
      expect.objectContaining({
        author_name: 'Guest Rider',
        upload_source: 'customer_link',
        storage_path: session.files[0].path,
      }),
    ], expect.objectContaining({ ignoreDuplicates: true }))
  })
})

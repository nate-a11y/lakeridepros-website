import { describe, expect, it } from 'vitest'
import {
  createCustomerPhotoSessionToken,
  sanitizeCustomerPhotoFilename,
  validateCustomerPhotoFiles,
  verifyCustomerPhotoSessionToken,
  type CustomerPhotoSession,
} from '../customer-photo-upload'

const secret = 'test-photo-upload-secret'

function session(overrides: Partial<CustomerPhotoSession> = {}): CustomerPhotoSession {
  return {
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
    ...overrides,
  }
}

describe('customer photo uploads', () => {
  it('sanitizes filenames without losing supported extensions', () => {
    expect(sanitizeCustomerPhotoFilename('Lake Ride! Photo 01.HEIC'))
      .toBe('Lake-Ride-Photo-01.HEIC')
  })

  it('validates images and infers HEIC when browsers omit the MIME type', () => {
    expect(validateCustomerPhotoFiles([
      { name: 'IMG_1001.HEIC', type: '', size: 2048 },
    ])).toEqual([{
      filename: 'IMG_1001.HEIC',
      mimeType: 'image/heic',
      size: 2048,
    }])
  })

  it('rejects unsupported or oversized files', () => {
    expect(() => validateCustomerPhotoFiles([
      { name: 'vector.svg', type: 'image/svg+xml', size: 100 },
    ])).toThrow('not a supported photo')
    expect(() => validateCustomerPhotoFiles([
      { name: 'huge.jpg', type: 'image/jpeg', size: 21 * 1024 * 1024 },
    ])).toThrow('larger than 20 MB')
  })

  it('signs and verifies a short-lived upload session', () => {
    const value = session()
    const token = createCustomerPhotoSessionToken(value, secret)
    expect(verifyCustomerPhotoSessionToken(token, secret)).toEqual(value)
  })

  it('rejects tampered and expired upload sessions', () => {
    const token = createCustomerPhotoSessionToken(session(), secret)
    expect(() => verifyCustomerPhotoSessionToken(`${token}x`, secret))
      .toThrow('Invalid upload session')

    const expired = createCustomerPhotoSessionToken(
      session({ expiresAt: Date.now() - 1 }),
      secret,
    )
    expect(() => verifyCustomerPhotoSessionToken(expired, secret))
      .toThrow('Upload session expired')
  })
})

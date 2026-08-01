import { createHmac, timingSafeEqual } from 'node:crypto'

export const CUSTOMER_PHOTO_BUCKET = 'photo-board'
export const CUSTOMER_PHOTO_MAX_FILES = 10
export const CUSTOMER_PHOTO_MAX_FILE_SIZE = 20 * 1024 * 1024
export const CUSTOMER_PHOTO_SESSION_TTL_SECONDS = 15 * 60

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
])

const EXTENSION_MIME_TYPES: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

export interface CustomerPhotoFileInput {
  name: string
  type?: string
  size: number
}

export interface CustomerPhotoSessionFile {
  path: string
  filename: string
  mimeType: string
  size: number
}

export interface CustomerPhotoSession {
  version: 1
  expiresAt: number
  sessionId: string
  customerName: string
  caption: string | null
  files: CustomerPhotoSessionFile[]
}

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function sign(encodedPayload: string, secret: string) {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url')
}

export function sanitizeCustomerPhotoFilename(name = 'photo') {
  return String(name)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'photo'
}

export function normalizeCustomerPhotoMimeType(name: string, type?: string) {
  const normalizedType = String(type || '').trim().toLowerCase()
  if (ALLOWED_MIME_TYPES.has(normalizedType)) return normalizedType

  const extension = String(name).split('.').pop()?.toLowerCase() || ''
  return EXTENSION_MIME_TYPES[extension] || null
}

export function validateCustomerPhotoFiles(files: CustomerPhotoFileInput[]) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('Choose at least one photo.')
  }
  if (files.length > CUSTOMER_PHOTO_MAX_FILES) {
    throw new Error(`Choose up to ${CUSTOMER_PHOTO_MAX_FILES} photos at a time.`)
  }

  return files.map((file) => {
    const filename = String(file?.name || '').trim()
    const size = Number(file?.size)
    const mimeType = normalizeCustomerPhotoMimeType(filename, file?.type)

    if (!filename || !mimeType) {
      throw new Error(`${filename || 'That file'} is not a supported photo.`)
    }
    if (!Number.isFinite(size) || size <= 0) {
      throw new Error(`${filename} is empty or invalid.`)
    }
    if (size > CUSTOMER_PHOTO_MAX_FILE_SIZE) {
      throw new Error(`${filename} is larger than 20 MB.`)
    }

    return { filename, mimeType, size }
  })
}

export function createCustomerPhotoSessionToken(
  session: CustomerPhotoSession,
  secret: string,
) {
  if (!secret) throw new Error('Customer photo upload secret is not configured')
  const encodedPayload = encode(JSON.stringify(session))
  return `${encodedPayload}.${sign(encodedPayload, secret)}`
}

export function verifyCustomerPhotoSessionToken(token: string, secret: string) {
  if (!secret) throw new Error('Customer photo upload secret is not configured')
  const [encodedPayload, providedSignature, extra] = String(token || '').split('.')
  if (!encodedPayload || !providedSignature || extra) {
    throw new Error('Invalid upload session')
  }

  const expectedSignature = sign(encodedPayload, secret)
  const providedBuffer = Buffer.from(providedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (
    providedBuffer.length !== expectedBuffer.length
    || !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid upload session')
  }

  let session: CustomerPhotoSession
  try {
    session = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
  } catch {
    throw new Error('Invalid upload session')
  }

  if (
    session.version !== 1
    || !session.sessionId
    || !Array.isArray(session.files)
    || session.files.length === 0
  ) {
    throw new Error('Invalid upload session')
  }
  if (!Number.isFinite(session.expiresAt) || session.expiresAt < Date.now()) {
    throw new Error('Upload session expired. Please start again.')
  }

  return session
}

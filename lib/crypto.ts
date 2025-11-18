/**
 * Cryptographic utilities for sensitive data encryption
 * Used for encrypting SSN before transmission to server
 */

/**
 * Encrypts sensitive data using AES-GCM
 * @param data - The plaintext data to encrypt
 * @param passphrase - The encryption passphrase (should be from environment variable)
 * @returns Base64-encoded encrypted data with IV prepended
 */
export async function encryptData(data: string, passphrase: string): Promise<string> {
  try {
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Convert passphrase to key using PBKDF2
    const encoder = new TextEncoder()
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )

    // Derive AES key from passphrase
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('driver-application-salt'), // In production, use a random salt
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(data)
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    // Convert to base64
    return arrayBufferToBase64(combined)
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt sensitive data')
  }
}

/**
 * Decrypts data encrypted with encryptData
 * @param encryptedData - Base64-encoded encrypted data with IV prepended
 * @param passphrase - The encryption passphrase
 * @returns The decrypted plaintext
 */
export async function decryptData(encryptedData: string, passphrase: string): Promise<string> {
  try {
    // Convert from base64
    const combined = base64ToArrayBuffer(encryptedData)

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12)
    const data = combined.slice(12)

    // Convert passphrase to key using PBKDF2
    const encoder = new TextEncoder()
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )

    // Derive AES key from passphrase
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('driver-application-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    )

    // Convert to string
    const decoder = new TextDecoder()
    return decoder.decode(decryptedData)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Converts ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Converts Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * Validates SSN format (XXX-XX-XXXX or XXXXXXXXX)
 */
export function validateSSN(ssn: string): boolean {
  const ssnPattern = /^(\d{3}-?\d{2}-?\d{4})$/
  return ssnPattern.test(ssn)
}

/**
 * Formats SSN with dashes
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '')
  if (cleaned.length !== 9) return ssn
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`
}

/**
 * Masks SSN for display (shows only last 4 digits)
 */
export function maskSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '')
  if (cleaned.length !== 9) return '***-**-****'
  return `***-**-${cleaned.slice(5)}`
}

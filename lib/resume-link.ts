/**
 * Resume Link Utilities
 * Creates secure, time-limited links for resuming draft applications
 */

/**
 * Encode application ID and email into a secure token
 * @param applicationId - The application ID
 * @param email - The applicant's email
 * @returns Base64-encoded token
 */
export function encodeResumeToken(applicationId: string, email: string): string {
  const timestamp = Date.now()
  const data = JSON.stringify({ applicationId, email, timestamp })
  return Buffer.from(data).toString('base64url')
}

/**
 * Decode and validate resume token
 * @param token - The base64-encoded token
 * @param maxAgeHours - Maximum age of token in hours (default: 72 hours = 3 days)
 * @returns Decoded data or null if invalid/expired
 */
export function decodeResumeToken(
  token: string,
  maxAgeHours: number = 72
): { applicationId: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const data = JSON.parse(decoded) as { applicationId: string; email: string; timestamp: number }

    // Check if token is expired
    const maxAge = maxAgeHours * 60 * 60 * 1000 // Convert to milliseconds
    const now = Date.now()

    if (now - data.timestamp > maxAge) {
      console.log('Resume token expired')
      return null
    }

    return {
      applicationId: data.applicationId,
      email: data.email
    }
  } catch (error) {
    console.error('Error decoding resume token:', error)
    return null
  }
}

/**
 * Generate a complete resume URL
 * @param applicationId - The application ID
 * @param email - The applicant's email
 * @param baseUrl - The base URL of the application (e.g., https://lakeridepros.com)
 * @returns Complete resume URL
 */
export function generateResumeUrl(applicationId: string, email: string, baseUrl: string): string {
  const token = encodeResumeToken(applicationId, email)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  return `${cleanBaseUrl}/careers/driver-application?resume=${token}`
}

/**
 * Validate if resume token matches email (for security)
 * @param token - The resume token
 * @param email - The email to validate against
 * @returns true if token is valid and email matches
 */
export function validateResumeToken(token: string, email: string): boolean {
  const decoded = decodeResumeToken(token)
  if (!decoded) return false

  return decoded.email.toLowerCase() === email.toLowerCase()
}

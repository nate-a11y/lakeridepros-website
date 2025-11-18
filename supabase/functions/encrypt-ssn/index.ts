/**
 * Supabase Edge Function: Encrypt SSN
 *
 * COMPLIANCE: 49 CFR 391.21 - Protects sensitive SSN data
 * SECURITY: AES-256-GCM encryption with key from Supabase Vault
 * RATE LIMIT: 10 requests/minute per IP to prevent abuse
 *
 * This function encrypts Social Security Numbers before storage.
 * The encryption key is stored securely in Supabase Vault and never
 * exposed to the client or logged.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10

interface EncryptRequest {
  ssn: string
  applicationId?: string
}

interface EncryptResponse {
  encrypted: string
  error?: string
}

/**
 * Validate SSN format
 */
function validateSSN(ssn: string): boolean {
  // SSN must be 9 digits (with or without dashes)
  const cleaned = ssn.replace(/\D/g, '')
  if (cleaned.length !== 9) return false

  // Basic validation: no all zeros, no 666, no 900-999
  const area = parseInt(cleaned.substring(0, 3))
  if (area === 0 || area === 666 || area >= 900) return false

  return true
}

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []

  // Remove requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW)

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false
  }

  // Add current request
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)

  return true
}

/**
 * Encrypt SSN using Web Crypto API with AES-256-GCM
 */
async function encryptSSN(ssn: string, encryptionKey: string): Promise<string> {
  try {
    // Convert encryption key to CryptoKey
    const encoder = new TextEncoder()
    const keyData = encoder.encode(encryptionKey.padEnd(32, '0').substring(0, 32))

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    )

    // Generate random IV (12 bytes for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt the SSN
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(ssn)
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encryptedData), iv.length)

    // Convert to base64
    return btoa(String.fromCharCode(...combined))
  } catch (error) {
    console.error('Encryption error (details hidden for security)')
    throw new Error('Encryption failed')
  }
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // In production, set to your domain
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown'

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const { ssn, applicationId }: EncryptRequest = await req.json()

    // Validate input
    if (!ssn || typeof ssn !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: SSN is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate SSN format
    if (!validateSSN(ssn)) {
      return new Response(
        JSON.stringify({ error: 'Invalid SSN format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get encryption key from Supabase Vault
    // In production, use: const encryptionKey = Deno.env.get('SSN_ENCRYPTION_KEY')!
    const encryptionKey = Deno.env.get('SSN_ENCRYPTION_KEY') || 'default-dev-key-change-in-production'

    if (!encryptionKey || encryptionKey === 'default-dev-key-change-in-production') {
      console.warn('WARNING: Using default encryption key. Set SSN_ENCRYPTION_KEY in Supabase Vault!')
    }

    // Encrypt SSN
    const encrypted = await encryptSSN(ssn, encryptionKey)

    // Log encryption event (without sensitive data) for audit
    if (applicationId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabaseClient.from('audit_log').insert({
        event_type: 'ssn_encrypted',
        application_id: applicationId,
        ip_address: clientIP,
        metadata: { timestamp: new Date().toISOString() }
      }).catch(err => console.error('Audit log failed:', err.message))
    }

    const response: EncryptResponse = { encrypted }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Function error:', error.message)

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

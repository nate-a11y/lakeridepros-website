import { NextRequest, NextResponse } from 'next/server'

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 400 }
      )
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      console.error('Turnstile secret key not configured')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify the token with Cloudflare
    const formData = new FormData()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    )

    const data: TurnstileResponse = await response.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error('Turnstile verification failed:', data['error-codes'])
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification error' },
      { status: 500 }
    )
  }
}

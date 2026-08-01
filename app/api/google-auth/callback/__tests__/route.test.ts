import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../route'

describe('Google OAuth callback relay', () => {
  it('requires OAuth state', () => {
    const response = GET(new NextRequest('https://example.com/api/google-auth/callback?code=test'))
    expect(response.status).toBe(400)
  })

  it('relays only OAuth callback fields to localhost', () => {
    const response = GET(new NextRequest(
      'https://example.com/api/google-auth/callback?code=test-code&state=test-state&ignored=secret',
    ))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/?code=test-code&state=test-state',
    )
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('referrer-policy')).toBe('no-referrer')
  })
})

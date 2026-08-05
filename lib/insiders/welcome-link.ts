import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_VERSION = 1
const MAX_TOKEN_LIFETIME_SECONDS = 60 * 60 * 24 * 45

interface WelcomeTokenPayload {
  exp: number
  memberId: string
  v: number
}

function welcomeSecret(
  env: Record<string, string | undefined> = process.env,
) {
  const secret = env.INSIDERS_WELCOME_LINK_SECRET?.trim()
  if (!secret || secret.length < 32) {
    throw new Error(
      'INSIDERS_WELCOME_LINK_SECRET must contain at least 32 characters',
    )
  }
  return secret
}

function signature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createInsiderWelcomeToken(
  memberId: string,
  options: {
    expiresAt?: Date
    now?: Date
    env?: Record<string, string | undefined>
  } = {},
) {
  const now = options.now ?? new Date()
  const expiresAt =
    options.expiresAt ??
    new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const lifetimeSeconds = Math.floor(
    (expiresAt.getTime() - now.getTime()) / 1000,
  )

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      memberId,
    )
  ) {
    throw new Error('A valid Insider member ID is required')
  }
  if (lifetimeSeconds <= 0 || lifetimeSeconds > MAX_TOKEN_LIFETIME_SECONDS) {
    throw new Error('Insider welcome links must expire within 45 days')
  }

  const encodedPayload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(expiresAt.getTime() / 1000),
      memberId,
      v: TOKEN_VERSION,
    } satisfies WelcomeTokenPayload),
  ).toString('base64url')

  return `${encodedPayload}.${signature(encodedPayload, welcomeSecret(options.env))}`
}

export function readInsiderWelcomeToken(
  token: string,
  options: {
    now?: Date
    env?: Record<string, string | undefined>
  } = {},
): WelcomeTokenPayload | null {
  const [encodedPayload, encodedSignature, extra] = token.split('.')
  if (!encodedPayload || !encodedSignature || extra) return null

  let expectedSignature: string
  try {
    expectedSignature = signature(
      encodedPayload,
      welcomeSecret(options.env),
    )
  } catch {
    return null
  }

  const actualBuffer = Buffer.from(encodedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as WelcomeTokenPayload
    const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1000)

    if (
      payload.v !== TOKEN_VERSION ||
      !Number.isInteger(payload.exp) ||
      payload.exp <= nowSeconds ||
      payload.exp > nowSeconds + MAX_TOKEN_LIFETIME_SECONDS ||
      !/^[0-9a-f-]{36}$/i.test(payload.memberId)
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

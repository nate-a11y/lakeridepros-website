/**
 * Normalize CMS-managed website values into safe absolute HTTP(S) URLs.
 * Editors commonly paste domains without a protocol, which browsers otherwise
 * interpret as relative links on lakeridepros.com.
 */
export function normalizeExternalWebsiteUrl(value?: string | null): string | null {
  const trimmed = value?.trim()

  if (!trimmed) {
    return null
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/\//, '')}`

  try {
    const url = new URL(candidate)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

const PRODUCTION_SITE_HOSTS = new Set([
  'lakeridepros.com',
  'www.lakeridepros.com',
])

type SiteOriginEnvironment = Record<string, string | undefined>

function isLocalHostname(hostname: string) {
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  )
}

export function getTrustedSiteOrigin(
  request: Request,
  env: SiteOriginEnvironment = process.env,
) {
  const requestUrl = new URL(request.url)
  const configuredSiteUrl = env.NEXT_PUBLIC_SITE_URL?.trim()

  if (env.VERCEL_ENV !== 'production' && isLocalHostname(requestUrl.hostname)) {
    return requestUrl.origin
  }

  if (env.VERCEL_ENV === 'preview') {
    const vercelHostname = env.VERCEL_URL?.trim()
    if (
      vercelHostname &&
      (vercelHostname.endsWith('.vercel.app') ||
        vercelHostname === 'vercel.app')
    ) {
      return new URL(`https://${vercelHostname}`).origin
    }
  }

  if (
    requestUrl.protocol === 'https:' &&
    PRODUCTION_SITE_HOSTS.has(requestUrl.hostname)
  ) {
    return requestUrl.origin
  }

  const siteUrl = new URL(configuredSiteUrl || requestUrl)

  if (
    env.VERCEL_ENV === 'production' &&
    (!configuredSiteUrl ||
      siteUrl.protocol !== 'https:' ||
      !PRODUCTION_SITE_HOSTS.has(siteUrl.hostname))
  ) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a trusted production URL')
  }

  return siteUrl.origin
}

export function externalWebsiteUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined
  try {
    const input = value.trim()
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input.replace(/^\/\//, '')}`)
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.') ? url.href : undefined
  } catch {
    return undefined
  }
}

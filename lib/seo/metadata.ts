const ELLIPSIS = '…'

export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
}

export function normalizeMetaText(input: string): string {
  return stripHtml(input)
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\.{2,}/g, '.')
    .trim()
}

export function truncateMeta(input: string, maxLength: number): string {
  const text = normalizeMetaText(input)
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, Math.max(0, maxLength - ELLIPSIS.length))
  const lastSpace = truncated.lastIndexOf(' ')
  const clean = lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated
  return `${clean.replace(/[\s,.;:!?-]+$/g, '')}${ELLIPSIS}`
}

export function metaTitle(primary: string, suffix = 'Lake Ride Pros', maxLength = 60): string {
  const cleanPrimary = normalizeMetaText(primary)
  const cleanSuffix = normalizeMetaText(suffix)
  const separator = ' | '
  const full = `${cleanPrimary}${separator}${cleanSuffix}`

  if (full.length <= maxLength) return full

  const primaryBudget = maxLength - separator.length - cleanSuffix.length
  if (primaryBudget < 24) return truncateMeta(full, maxLength)

  return `${truncateMeta(cleanPrimary, primaryBudget)}${separator}${cleanSuffix}`
}

export function metaDescription(input: string, fallback: string, maxLength = 155): string {
  const source = normalizeMetaText(input || fallback)
  return truncateMeta(source, maxLength)
}

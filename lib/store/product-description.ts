interface PortableTextChild {
  text?: unknown
}

interface PortableTextBlock {
  _type?: unknown
  children?: PortableTextChild[]
}

export type ProductDescriptionSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

  return value
    .replace(/&#(\d+);/g, (_match, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&#x([\da-f]+);/gi, (_match, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (match, name: string) =>
      namedEntities[name.toLowerCase()] ?? match
    )
}

export function productDescriptionToPlainText(value: unknown) {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  return value
    .filter(
      (block): block is PortableTextBlock =>
        Boolean(block) &&
        typeof block === 'object' &&
        (block as PortableTextBlock)._type === 'block'
    )
    .map((block) =>
      Array.isArray(block.children)
        ? block.children
            .map((child) =>
              typeof child?.text === 'string' ? child.text : ''
            )
            .join('')
        : ''
    )
    .join('\n')
}

function normalizePrintifyDescription(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<\/(?:li|p|h[1-6]|div)>/gi, '\n')
      .replace(/<(?:p|h[1-6]|div)[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function parseProductDescription(
  value: unknown
): ProductDescriptionSection[] {
  const normalized = normalizePrintifyDescription(
    productDescriptionToPlainText(value)
  )
  if (!normalized) return []

  const sections: ProductDescriptionSection[] = []
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      sections.push({ type: 'list', items: listItems })
      listItems = []
    }
  }

  for (const line of normalized.split('\n')) {
    const text = line.trim()
    if (!text) {
      flushList()
      continue
    }

    const listMatch = text.match(/^(?:-|\.:)\s*(.+)$/)
    if (listMatch) {
      listItems.push(listMatch[1].trim())
      continue
    }

    flushList()

    if (/^(?:product features|care instructions)$/i.test(text)) {
      sections.push({ type: 'heading', text })
    } else {
      sections.push({ type: 'paragraph', text })
    }
  }

  flushList()
  return sections
}

export function createProductExcerpt(value: unknown, maxLength: number) {
  const text = normalizePrintifyDescription(
    productDescriptionToPlainText(value)
  ).replace(/\s+/g, ' ')

  if (text.length <= maxLength) return text

  const candidate = text.slice(0, maxLength + 1)
  const lastSpace = candidate.lastIndexOf(' ')
  const cutoff = lastSpace > Math.floor(maxLength * 0.6) ? lastSpace : maxLength
  return `${candidate.slice(0, cutoff).trimEnd()}…`
}

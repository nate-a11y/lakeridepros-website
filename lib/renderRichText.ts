// Lexical rich text to HTML renderer
// Handles paragraphs, headings, lists, links, and inline formatting

interface LexicalTextNode {
  type: 'text'
  text: string
  format?: number
  detail?: number
}

interface LexicalLinkNode {
  type: 'link' | 'autolink'
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  url?: string
  children?: LexicalNode[]
}

interface LexicalListItemNode {
  type: 'listitem'
  children?: LexicalNode[]
  checked?: boolean
  value?: number
}

interface LexicalElementNode {
  type: string
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  children?: LexicalNode[]
  direction?: string
  format?: string | number
  indent?: number
}

type LexicalNode = LexicalTextNode | LexicalLinkNode | LexicalListItemNode | LexicalElementNode

interface LexicalContent {
  root: {
    children: LexicalNode[]
    direction?: string
    format?: string
    indent?: number
    type: string
    version: number
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Lexical format flags (bitmask)
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16

function renderInlineFormatting(text: string, format: number): string {
  let html = escapeHtml(text)
  if (format & IS_CODE) html = `<code>${html}</code>`
  if (format & IS_BOLD) html = `<strong>${html}</strong>`
  if (format & IS_ITALIC) html = `<em>${html}</em>`
  if (format & IS_UNDERLINE) html = `<u>${html}</u>`
  if (format & IS_STRIKETHROUGH) html = `<s>${html}</s>`
  return html
}

function renderNode(node: LexicalNode): string {
  if (node.type === 'text') {
    const textNode = node as LexicalTextNode
    return renderInlineFormatting(textNode.text || '', textNode.format || 0)
  }

  if (node.type === 'linebreak') {
    return '<br />'
  }

  if (node.type === 'link' || node.type === 'autolink') {
    const linkNode = node as LexicalLinkNode
    const url = linkNode.fields?.url || linkNode.url || '#'
    const newTab = linkNode.fields?.newTab
    const children = (linkNode.children || []).map(renderNode).join('')
    const target = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${escapeHtml(url)}"${target}>${children}</a>`
  }

  if (node.type === 'listitem') {
    const children = ((node as LexicalElementNode).children || []).map(renderNode).join('')
    return `<li>${children}</li>`
  }

  if (node.type === 'list') {
    const listNode = node as LexicalElementNode
    const tag = listNode.listType === 'number' ? 'ol' : 'ul'
    const children = (listNode.children || []).map(renderNode).join('')
    return `<${tag}>${children}</${tag}>`
  }

  if (node.type === 'heading') {
    const el = node as LexicalElementNode
    const tag = `h${el.tag || '2'}`
    const children = (el.children || []).map(renderNode).join('')
    return `<${tag}>${children}</${tag}>`
  }

  if (node.type === 'paragraph') {
    const children = ((node as LexicalElementNode).children || []).map(renderNode).join('')
    if (!children) return ''
    return `<p>${children}</p>`
  }

  if (node.type === 'quote') {
    const children = ((node as LexicalElementNode).children || []).map(renderNode).join('')
    return `<blockquote>${children}</blockquote>`
  }

  // Fallback: render children if any
  const el = node as LexicalElementNode
  if (el.children) {
    return el.children.map(renderNode).join('')
  }

  return ''
}

export function renderRichText(content: LexicalContent | string | undefined | null): string {
  if (!content) return ''

  if (typeof content === 'string') return content

  if (typeof content === 'object' && content.root?.children) {
    return content.root.children.map(renderNode).join('')
  }

  return ''
}

/**
 * Lexical JSON to Portable Text transformer.
 *
 * Converts Payload CMS Lexical rich-text JSON into Sanity Portable Text blocks
 * so that content can be migrated between the two systems.
 *
 * Lexical format bitmasks:
 *   BOLD           = 1
 *   ITALIC         = 2
 *   STRIKETHROUGH  = 4
 *   UNDERLINE      = 8
 *   CODE           = 16
 *
 * Portable Text mark equivalents:
 *   "strong", "em", "strike-through", "underline", "code"
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single mark definition attached to a Portable Text block (e.g. a link). */
export interface PortableTextMarkDef {
  _type: string
  _key: string
  href?: string
  blank?: boolean
  [key: string]: unknown
}

/** A span (text run) inside a Portable Text block. */
export interface PortableTextSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

/** A hard-break inside a Portable Text block's children array. */
export interface PortableTextBreak {
  _type: 'break'
  _key: string
}

/** A Portable Text block (paragraph, heading, list item, blockquote, etc.). */
export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: string
  markDefs: PortableTextMarkDef[]
  children: (PortableTextSpan | PortableTextBreak)[]
  listItem?: 'bullet' | 'number'
  level?: number
}

// ---------------------------------------------------------------------------
// Lexical node shapes (loosely typed – we only care about the fields we read)
// ---------------------------------------------------------------------------

interface LexicalTextNode {
  type: 'text'
  text: string
  format?: number
  detail?: number
  [key: string]: unknown
}

interface LexicalLinkNode {
  type: 'link' | 'autolink'
  url?: string
  newTab?: boolean
  fields?: { url?: string; newTab?: boolean; linkType?: string }
  children?: LexicalNode[]
  [key: string]: unknown
}

interface LexicalElementNode {
  type: string
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  children?: LexicalNode[]
  indent?: number
  direction?: string
  format?: string | number
  checked?: boolean
  value?: number
  [key: string]: unknown
}

type LexicalNode = LexicalTextNode | LexicalLinkNode | LexicalElementNode

interface LexicalContent {
  root: {
    type: string
    children: LexicalNode[]
    [key: string]: unknown
  }
}

// ---------------------------------------------------------------------------
// Format bitmask constants
// ---------------------------------------------------------------------------

const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4

/** Map from bitmask flag to Portable Text decorator mark name. */
const FORMAT_TO_MARK: [number, string][] = [
  [IS_BOLD, 'strong'],
  [IS_ITALIC, 'em'],
  [IS_STRIKETHROUGH, 'strike-through'],
  [IS_UNDERLINE, 'underline'],
  [IS_CODE, 'code'],
]

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

let keyCounter = 0

function generateKey(): string {
  keyCounter += 1
  const random = Math.random().toString(36).substring(2, 8)
  return `${random}${keyCounter}`
}

/** Reset the counter – useful for deterministic testing. */
export function resetKeyCounter(): void {
  keyCounter = 0
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text' && 'text' in node
}

function isLinkNode(node: LexicalNode): node is LexicalLinkNode {
  return node.type === 'link' || node.type === 'autolink'
}

function isElementNode(node: LexicalNode): node is LexicalElementNode {
  return 'children' in node || node.type === 'linebreak'
}

/** Convert a Lexical format bitmask to an array of Portable Text mark names. */
function formatToMarks(format: number | undefined): string[] {
  if (!format) return []
  const marks: string[] = []
  for (const [flag, mark] of FORMAT_TO_MARK) {
    if (format & flag) marks.push(mark)
  }
  return marks
}

// ---------------------------------------------------------------------------
// Inline-level conversion
// ---------------------------------------------------------------------------

/**
 * Context accumulated while walking the inline children of a block-level node.
 * We need to collect markDefs (for links) and children (spans / breaks).
 */
interface InlineContext {
  children: (PortableTextSpan | PortableTextBreak)[]
  markDefs: PortableTextMarkDef[]
}

/**
 * Walk through inline-level Lexical nodes (text, link, linebreak) and append
 * the corresponding Portable Text spans/breaks to `ctx`.
 *
 * @param nodes  Children of a block-level Lexical node
 * @param ctx    Accumulator for spans, breaks, and markDefs
 * @param extraMarks  Marks inherited from an ancestor (e.g. a link mark key)
 */
function convertInlineNodes(
  nodes: LexicalNode[],
  ctx: InlineContext,
  extraMarks: string[] = [],
): void {
  for (const node of nodes) {
    if (isTextNode(node)) {
      const marks = [...extraMarks, ...formatToMarks(node.format)]
      ctx.children.push({
        _type: 'span',
        _key: generateKey(),
        text: node.text,
        marks,
      })
    } else if (node.type === 'linebreak') {
      ctx.children.push({
        _type: 'break',
        _key: generateKey(),
      })
    } else if (isLinkNode(node)) {
      // Create a markDef for this link
      const markKey = generateKey()
      const url =
        (node as LexicalLinkNode).fields?.url ??
        (node as LexicalLinkNode).url ??
        '#'
      const newTab =
        (node as LexicalLinkNode).fields?.newTab ??
        (node as LexicalLinkNode).newTab ??
        false

      const markDef: PortableTextMarkDef = {
        _type: 'link',
        _key: markKey,
        href: url,
      }
      if (newTab) {
        markDef.blank = true
      }
      ctx.markDefs.push(markDef)

      // Recurse into the link's children, passing the mark key down
      if ((node as LexicalLinkNode).children) {
        convertInlineNodes(
          (node as LexicalLinkNode).children!,
          ctx,
          [...extraMarks, markKey],
        )
      }
    } else if (isElementNode(node) && (node as LexicalElementNode).children) {
      // Unknown inline element – just recurse into its children
      convertInlineNodes(
        (node as LexicalElementNode).children!,
        ctx,
        extraMarks,
      )
    }
  }
}

// ---------------------------------------------------------------------------
// Block-level conversion
// ---------------------------------------------------------------------------

/**
 * Convert a single block-level Lexical node into one or more Portable Text blocks.
 *
 * List items may themselves contain nested lists, so a single Lexical node can
 * produce multiple PT blocks.
 */
function convertBlockNode(
  node: LexicalNode,
  level: number = 0,
): PortableTextBlock[] {
  // Text node at the block level (shouldn't normally happen, but handle gracefully)
  if (isTextNode(node)) {
    const ctx: InlineContext = { children: [], markDefs: [] }
    convertInlineNodes([node], ctx)
    return [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: ctx.markDefs,
        children: ctx.children.length > 0
          ? ctx.children
          : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
      },
    ]
  }

  if (!isElementNode(node) && !isLinkNode(node)) {
    return []
  }

  const elNode = node as LexicalElementNode
  const children = elNode.children ?? []

  switch (node.type) {
    // ----- Paragraph -----
    case 'paragraph': {
      const ctx: InlineContext = { children: [], markDefs: [] }
      convertInlineNodes(children, ctx)
      return [
        {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          markDefs: ctx.markDefs,
          children: ctx.children.length > 0
            ? ctx.children
            : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
        },
      ]
    }

    // ----- Heading -----
    case 'heading': {
      const tag = elNode.tag ?? 'h2'
      const style =
        tag === 'h1' || tag === 'h2' || tag === 'h3' ||
        tag === 'h4' || tag === 'h5' || tag === 'h6'
          ? tag
          : 'h2'

      const ctx: InlineContext = { children: [], markDefs: [] }
      convertInlineNodes(children, ctx)
      return [
        {
          _type: 'block',
          _key: generateKey(),
          style,
          markDefs: ctx.markDefs,
          children: ctx.children.length > 0
            ? ctx.children
            : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
        },
      ]
    }

    // ----- Blockquote -----
    case 'quote': {
      const ctx: InlineContext = { children: [], markDefs: [] }
      convertInlineNodes(children, ctx)
      return [
        {
          _type: 'block',
          _key: generateKey(),
          style: 'blockquote',
          markDefs: ctx.markDefs,
          children: ctx.children.length > 0
            ? ctx.children
            : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
        },
      ]
    }

    // ----- List -----
    case 'list': {
      const listType: 'bullet' | 'number' =
        elNode.listType === 'number' ? 'number' : 'bullet'
      const blocks: PortableTextBlock[] = []

      for (const child of children) {
        if (child.type === 'listitem') {
          const listItemBlocks = convertListItem(
            child as LexicalElementNode,
            listType,
            level + 1,
          )
          blocks.push(...listItemBlocks)
        } else {
          // Unexpected child of list – convert as a normal block
          blocks.push(...convertBlockNode(child, level))
        }
      }

      return blocks
    }

    // ----- List item (top-level, not inside a list – unusual but handle it) -----
    case 'listitem': {
      return convertListItem(elNode, 'bullet', level + 1)
    }

    // ----- Link at block level (unusual – wrap in a normal block) -----
    case 'link':
    case 'autolink': {
      const ctx: InlineContext = { children: [], markDefs: [] }
      convertInlineNodes([node], ctx)
      return [
        {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          markDefs: ctx.markDefs,
          children: ctx.children.length > 0
            ? ctx.children
            : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
        },
      ]
    }

    // ----- Linebreak at block level -----
    case 'linebreak': {
      return [
        {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'break', _key: generateKey() }],
        },
      ]
    }

    // ----- Root or unknown wrapper -----
    default: {
      // If it has children, recurse into them (like root, or an unknown wrapper)
      if (children.length > 0) {
        const blocks: PortableTextBlock[] = []
        for (const child of children) {
          blocks.push(...convertBlockNode(child, level))
        }
        return blocks
      }
      return []
    }
  }
}

/**
 * Convert a Lexical list item node into one or more Portable Text blocks.
 *
 * A list item's children may contain both inline content (text, links) and
 * nested lists. Inline content becomes the main block; nested lists are
 * recursively expanded with an increased `level`.
 */
function convertListItem(
  node: LexicalElementNode,
  listType: 'bullet' | 'number',
  level: number,
): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  const inlineNodes: LexicalNode[] = []
  const nestedLists: LexicalNode[] = []

  // Separate inline content from nested lists
  for (const child of node.children ?? []) {
    if (child.type === 'list') {
      nestedLists.push(child)
    } else {
      inlineNodes.push(child)
    }
  }

  // Build the main list item block from inline content
  const ctx: InlineContext = { children: [], markDefs: [] }
  if (inlineNodes.length > 0) {
    convertInlineNodes(inlineNodes, ctx)
  }

  const block: PortableTextBlock = {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    listItem: listType,
    level,
    markDefs: ctx.markDefs,
    children: ctx.children.length > 0
      ? ctx.children
      : [{ _type: 'span', _key: generateKey(), text: '', marks: [] }],
  }
  blocks.push(block)

  // Process nested lists at an increased level
  for (const nestedList of nestedLists) {
    const nestedBlocks = convertBlockNode(nestedList, level)
    blocks.push(...nestedBlocks)
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a Payload CMS Lexical rich-text JSON value to an array of Sanity
 * Portable Text blocks.
 *
 * @param lexicalContent  The raw Lexical JSON object (typically `{ root: { ... } }`)
 * @returns An array of Portable Text blocks ready for Sanity
 *
 * @example
 * ```ts
 * const blocks = lexicalToPortableText(doc.content)
 * // blocks is PortableTextBlock[]
 * ```
 */
export function lexicalToPortableText(
  lexicalContent: unknown,
): PortableTextBlock[] {
  // Guard against null / undefined / non-object input
  if (!lexicalContent || typeof lexicalContent !== 'object') {
    return []
  }

  const content = lexicalContent as LexicalContent

  // Guard against missing root or children
  if (!content.root || !Array.isArray(content.root.children)) {
    return []
  }

  const blocks: PortableTextBlock[] = []

  for (const node of content.root.children) {
    try {
      blocks.push(...convertBlockNode(node))
    } catch (err) {
      // Silently skip nodes that fail to convert so we don't lose everything
      console.error('[lexicalToPortableText] Error converting node:', err)
    }
  }

  return blocks
}

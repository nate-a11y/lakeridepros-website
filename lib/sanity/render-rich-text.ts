/**
 * Portable Text to HTML renderer.
 *
 * Used for contexts where React rendering is not available – email templates,
 * RSS feeds, open-graph meta descriptions, etc.
 *
 * Uses the `@portabletext/to-html` package (already installed) so that list
 * grouping, mark nesting, and all other Portable Text edge cases are handled
 * correctly.
 */

import { toHTML, type PortableTextComponents } from '@portabletext/to-html'
import type { PortableTextBlock } from './lexical-to-portable-text'

// ---------------------------------------------------------------------------
// Custom HTML components – mirror the tag/class structure from the React
// renderer in serialize-portable-text.tsx.
// ---------------------------------------------------------------------------

const components: PortableTextComponents = {
  // ------------------------------------------------------------------
  // Block styles
  // ------------------------------------------------------------------
  block: {
    normal: ({ children }) => `<p class="mb-4">${children}</p>`,
    h1: ({ children }) =>
      `<h1 class="text-4xl font-bold mb-6 mt-8">${children}</h1>`,
    h2: ({ children }) =>
      `<h2 class="text-3xl font-bold mb-5 mt-7">${children}</h2>`,
    h3: ({ children }) =>
      `<h3 class="text-2xl font-bold mb-4 mt-6">${children}</h3>`,
    h4: ({ children }) =>
      `<h4 class="text-xl font-bold mb-3 mt-5">${children}</h4>`,
    h5: ({ children }) =>
      `<h5 class="text-lg font-bold mb-2 mt-4">${children}</h5>`,
    h6: ({ children }) =>
      `<h6 class="text-base font-bold mb-2 mt-3">${children}</h6>`,
    blockquote: ({ children }) =>
      `<blockquote class="border-l-4 border-primary pl-4 italic my-4">${children}</blockquote>`,
  },

  // ------------------------------------------------------------------
  // Lists
  // ------------------------------------------------------------------
  list: {
    bullet: ({ children }) =>
      `<ul class="list-disc list-inside mb-4 ml-4">${children}</ul>`,
    number: ({ children }) =>
      `<ol class="list-decimal list-inside mb-4 ml-4">${children}</ol>`,
  },

  listItem: {
    bullet: ({ children }) => `<li class="mb-2">${children}</li>`,
    number: ({ children }) => `<li class="mb-2">${children}</li>`,
  },

  // ------------------------------------------------------------------
  // Marks / decorators
  // ------------------------------------------------------------------
  marks: {
    strong: ({ children }) => `<strong>${children}</strong>`,
    em: ({ children }) => `<em>${children}</em>`,
    underline: ({ children }) => `<u>${children}</u>`,
    'strike-through': ({ children }) => `<s>${children}</s>`,
    code: ({ children }) => `<code>${children}</code>`,
    link: ({ value, children }) => {
      const href = value?.href ?? '#'
      const target = value?.blank ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeAttr(href)}" class="text-primary hover:text-primary-dark underline"${target}>${children}</a>`
    },
  },
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Escape a string for safe use inside an HTML attribute value. */
function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Render an array of Portable Text blocks to an HTML string.
 *
 * @param blocks  Portable Text block array (as returned by `lexicalToPortableText` or fetched from Sanity).
 * @returns  An HTML string. Returns an empty string for falsy / empty input.
 *
 * @example
 * ```ts
 * import { renderPortableTextToHtml } from '@/lib/sanity/render-rich-text'
 *
 * const html = renderPortableTextToHtml(doc.body)
 * ```
 */
export function renderPortableTextToHtml(
  blocks: PortableTextBlock[] | null | undefined,
): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  return toHTML(blocks as Parameters<typeof toHTML>[0], {
    components,
    onMissingComponent: false, // suppress console warnings for unknown types
  })
}

/**
 * Render Portable Text to plain HTML without any CSS classes.
 * Useful for email templates where Tailwind classes are not applicable.
 */
export function renderPortableTextToPlainHtml(
  blocks: PortableTextBlock[] | null | undefined,
): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  const plainComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => `<p>${children}</p>`,
      h1: ({ children }) => `<h1>${children}</h1>`,
      h2: ({ children }) => `<h2>${children}</h2>`,
      h3: ({ children }) => `<h3>${children}</h3>`,
      h4: ({ children }) => `<h4>${children}</h4>`,
      h5: ({ children }) => `<h5>${children}</h5>`,
      h6: ({ children }) => `<h6>${children}</h6>`,
      blockquote: ({ children }) =>
        `<blockquote>${children}</blockquote>`,
    },
    list: {
      bullet: ({ children }) => `<ul>${children}</ul>`,
      number: ({ children }) => `<ol>${children}</ol>`,
    },
    listItem: {
      bullet: ({ children }) => `<li>${children}</li>`,
      number: ({ children }) => `<li>${children}</li>`,
    },
    marks: {
      strong: ({ children }) => `<strong>${children}</strong>`,
      em: ({ children }) => `<em>${children}</em>`,
      underline: ({ children }) => `<u>${children}</u>`,
      'strike-through': ({ children }) => `<s>${children}</s>`,
      code: ({ children }) => `<code>${children}</code>`,
      link: ({ value, children }) => {
        const href = value?.href ?? '#'
        const target = value?.blank
          ? ' target="_blank" rel="noopener noreferrer"'
          : ''
        return `<a href="${escapeAttr(href)}"${target}>${children}</a>`
      },
    },
  }

  return toHTML(blocks as Parameters<typeof toHTML>[0], {
    components: plainComponents,
    onMissingComponent: false,
  })
}

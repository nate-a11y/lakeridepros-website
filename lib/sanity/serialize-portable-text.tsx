/**
 * React component for rendering Sanity Portable Text content.
 *
 * Drop-in replacement for the Lexical-based `serializeLexical.tsx`, preserving
 * the same Tailwind CSS class names used throughout the site.
 */

import React from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'

/**
 * Custom component map that mirrors the styling previously provided by
 * `serializeLexical.tsx` (Tailwind utility classes, heading sizes, list
 * indentation, etc.).
 */
const components: PortableTextComponents = {
  // ------------------------------------------------------------------
  // Block-level styles
  // ------------------------------------------------------------------
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mb-5 mt-7">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mb-4 mt-6">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mb-3 mt-5">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold mb-2 mt-4">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold mb-2 mt-3">{children}</h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },

  // ------------------------------------------------------------------
  // Lists
  // ------------------------------------------------------------------
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 ml-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 ml-4">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },

  // ------------------------------------------------------------------
  // Inline marks / decorators
  // ------------------------------------------------------------------
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    'strike-through': ({ children }) => <s>{children}</s>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ value, children }) => {
      const target = value?.blank ? '_blank' : undefined
      const rel = value?.blank ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-primary hover:text-primary-dark underline"
        >
          {children}
        </a>
      )
    },
  },
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface RichTextProps {
  /** Portable Text block array (as stored in Sanity). */
  content: unknown
  /** Optional component overrides. */
  overrides?: PortableTextComponents
}

/**
 * Render Sanity Portable Text content as React elements.
 *
 * @example
 * ```tsx
 * import { RichText } from '@/lib/sanity/serialize-portable-text'
 *
 * export default function Page({ body }: { body: PortableTextBlock[] }) {
 *   return <RichText content={body} />
 * }
 * ```
 */
export function RichText({ content, overrides }: RichTextProps) {
  if (!content) return null

  // Merge caller-provided overrides with the defaults when supplied
  const mergedComponents = overrides
    ? { ...components, ...overrides }
    : components

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableText value={content as any} components={mergedComponents} />
}

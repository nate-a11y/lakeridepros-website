import React, { Fragment } from 'react';

type LexicalNode = {
  type: string;
  version?: number;
  [key: string]: unknown;
};

type TextNode = LexicalNode & {
  text: string;
  format?: number;
};

type ElementNode = LexicalNode & {
  children?: SerializedNode[];
  tag?: string;
  listType?: 'bullet' | 'number';
  indent?: number;
  direction?: string;
};

type LinkNode = ElementNode & {
  url?: string;
  newTab?: boolean;
};

type SerializedNode = TextNode | ElementNode;

type LexicalContent = {
  root: {
    type: string;
    children: SerializedNode[];
    direction: string | null;
    format: string;
    indent: number;
    version: number;
  };
};

const IS_BOLD = 1;
const IS_ITALIC = 1 << 1;
const IS_STRIKETHROUGH = 1 << 2;
const IS_UNDERLINE = 1 << 3;
const IS_CODE = 1 << 4;

function isTextNode(node: SerializedNode): node is TextNode {
  return 'text' in node;
}

function isElementNode(node: SerializedNode): node is ElementNode {
  return 'children' in node;
}

function serializeText(node: TextNode, key: string | number): React.ReactNode {
  let text: React.ReactNode = node.text;

  if (node.format) {
    if (node.format & IS_BOLD) {
      text = <strong key={`${key}-bold`}>{text}</strong>;
    }
    if (node.format & IS_ITALIC) {
      text = <em key={`${key}-italic`}>{text}</em>;
    }
    if (node.format & IS_STRIKETHROUGH) {
      text = <s key={`${key}-strikethrough`}>{text}</s>;
    }
    if (node.format & IS_UNDERLINE) {
      text = <u key={`${key}-underline`}>{text}</u>;
    }
    if (node.format & IS_CODE) {
      text = <code key={`${key}-code`}>{text}</code>;
    }
  }

  return <Fragment key={key}>{text}</Fragment>;
}

function serializeNode(node: SerializedNode, index: number): React.ReactNode {
  if (isTextNode(node)) {
    return serializeText(node, index);
  }

  if (!isElementNode(node) || !node.children) {
    return null;
  }

  const children = node.children.map((child, i) => serializeNode(child, i));

  switch (node.type) {
    case 'root':
      return <Fragment key={index}>{children}</Fragment>;

    case 'paragraph':
      return <p key={index} className="mb-4">{children}</p>;

    case 'heading': {
      const tag = node.tag || 'h2';
      const HeadingTag = (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6' ? tag : 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses: Record<string, string> = {
        h1: 'text-4xl font-bold mb-6 mt-8',
        h2: 'text-3xl font-bold mb-5 mt-7',
        h3: 'text-2xl font-bold mb-4 mt-6',
        h4: 'text-xl font-bold mb-3 mt-5',
        h5: 'text-lg font-bold mb-2 mt-4',
        h6: 'text-base font-bold mb-2 mt-3',
      };
      return (
        <HeadingTag key={index} className={headingClasses[HeadingTag] || ''}>
          {children}
        </HeadingTag>
      );
    }

    case 'list':
      if (node.listType === 'bullet') {
        return <ul key={index} className="list-disc list-inside mb-4 ml-4">{children}</ul>;
      }
      return <ol key={index} className="list-decimal list-inside mb-4 ml-4">{children}</ol>;

    case 'listitem':
      return <li key={index} className="mb-2">{children}</li>;

    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4">
          {children}
        </blockquote>
      );

    case 'link':
      const linkNode = node as LinkNode;
      const url = linkNode.url || '#';
      return (
        <a
          key={index}
          href={url}
          className="text-primary hover:text-primary-dark underline"
          target={linkNode.newTab ? '_blank' : undefined}
          rel={linkNode.newTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );

    case 'linebreak':
      return <br key={index} />;

    default:
      return <Fragment key={index}>{children}</Fragment>;
  }
}

export function serializeLexical(content: unknown): React.ReactNode {
  if (!content || typeof content !== 'object') {
    console.warn('serializeLexical: Invalid content type:', typeof content);
    return null;
  }

  const lexicalContent = content as LexicalContent;

  if (!lexicalContent.root || !lexicalContent.root.children) {
    console.warn('serializeLexical: Missing root or children');
    return null;
  }

  try {
    const children = lexicalContent.root.children;
    console.log('serializeLexical: Processing', children.length, 'nodes');
    const result = children.map((node, index) => {
      try {
        return serializeNode(node, index);
      } catch (nodeError) {
        console.error('serializeLexical: Error processing node', index, nodeError);
        return null; // Continue processing other nodes
      }
    });
    console.log('serializeLexical: Successfully serialized content');
    return result;
  } catch (error) {
    console.error('serializeLexical: Fatal error:', error);
    return null;
  }
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug, getMediaUrl } from '@/lib/api/payload';
import Image from 'next/image';
import type { Page, Media } from '@/src/payload-types';

interface LexicalNode {
  type: string;
  children?: Array<{
    type?: string;
    text?: string;
  }>;
  tag?: string;
}

interface LexicalContent {
  root?: {
    children?: LexicalNode[];
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug) as unknown as Page | null;

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  // SEO plugin adds meta as a group field with title, description, image
  const meta = page.meta as { title?: string; description?: string } | undefined;

  return {
    title: meta?.title || page.title,
    description: meta?.description || '',
    openGraph: {
      title: meta?.title || page.title,
      description: meta?.description || '',
      type: 'website',
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug) as unknown as Page | null;

  if (!page) {
    notFound();
  }

  const featuredImage = typeof page.featuredImage === 'object' ? page.featuredImage as Media : null;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      {featuredImage && (
        <div className="relative h-[400px] w-full">
          <Image
            src={getMediaUrl(featuredImage.url as string)}
            alt={featuredImage.alt || page.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white text-center px-4">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {!featuredImage && (
          <h1 className="text-4xl md:text-5xl font-bold text-lrp-black dark:text-white mb-8">
            {page.title}
          </h1>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Rich Text Content */}
          <div
            dangerouslySetInnerHTML={{ __html: renderRichText(page.content) }}
            className="text-lrp-text dark:text-dark-text-primary"
          />
        </div>
      </div>
    </div>
  );
}

// Simple rich text renderer
// For a production app, you'd use @payloadcms/richtext-lexical serializer
function renderRichText(content: LexicalContent | string | undefined): string {
  if (!content) return '';

  // If it's already HTML string
  if (typeof content === 'string') {
    return content;
  }

  // If it's Lexical JSON format, convert to HTML
  // This is a basic implementation - for production use Payload's lexical serializer
  if (typeof content === 'object' && content.root && content.root.children) {
    return content.root.children
      .map((node: LexicalNode) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((child) => child.text || '').join('') || '';
          return `<p>${text}</p>`;
        }
        if (node.type === 'heading') {
          const text = node.children?.map((child) => child.text || '').join('') || '';
          const tag = `h${node.tag || '1'}`;
          return `<${tag}>${text}</${tag}>`;
        }
        return '';
      })
      .join('');
  }

  return '';
}

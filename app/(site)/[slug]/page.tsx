import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug, getMediaUrl } from '@/lib/api/payload';
import Image from 'next/image';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || '',
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || '',
      type: 'website',
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      {page.featuredImage && (
        <div className="relative h-[400px] w-full">
          <Image
            src={getMediaUrl(page.featuredImage.url)}
            alt={page.featuredImage.alt || page.title}
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
        {!page.featuredImage && (
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
function renderRichText(content: any): string {
  if (!content) return '';

  // If it's already HTML string
  if (typeof content === 'string') {
    return content;
  }

  // If it's Lexical JSON format, convert to HTML
  // This is a basic implementation - for production use Payload's lexical serializer
  if (content.root && content.root.children) {
    return content.root.children
      .map((node: any) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((child: any) => child.text || '').join('') || '';
          return `<p>${text}</p>`;
        }
        if (node.type === 'heading') {
          const text = node.children?.map((child: any) => child.text || '').join('') || '';
          const tag = `h${node.tag || '1'}`;
          return `<${tag}>${text}</${tag}>`;
        }
        return '';
      })
      .join('');
  }

  return '';
}

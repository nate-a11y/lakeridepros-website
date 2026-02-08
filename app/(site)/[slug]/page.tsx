import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageBySlug, getMediaUrl } from '@/lib/api/sanity';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { Page, SanityImage } from '@/types/sanity';

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

  const featuredImage = typeof page.featuredImage === 'object' ? page.featuredImage as SanityImage : null;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      {/* Hero Section */}
      {featuredImage && (
        <div className="relative h-[400px] w-full">
          <Image
            src={getMediaUrl(featuredImage)}
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

        <div className="prose prose-lg max-w-none dark:prose-invert text-lrp-text dark:text-dark-text-primary">
          {page.content && <PortableText value={page.content} />}
        </div>
      </div>
    </div>
  );
}


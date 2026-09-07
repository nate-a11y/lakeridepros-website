import styles from '@/components/support-editorial/SupportEditorial.module.css'
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
    <div className={styles.page}>
      {/* Hero Section */}
      {featuredImage && (
        <div className={styles.cmsHero}>
          <div className={styles.cmsHeroImage}>
            <Image
              src={getMediaUrl(featuredImage)}
              alt={featuredImage.alt || page.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-center">
            <h1 className="text-5xl font-bold text-white text-center px-4">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={styles.reading}>
        {!featuredImage && (
          <h1 className="text-4xl md:text-5xl font-bold text-lrp-black mb-8">
            {page.title}
          </h1>
        )}

        <div className="prose prose-lg max-w-none text-lrp-text">
          {page.content && <PortableText value={page.content} />}
        </div>
      </div>
    </div>
  );
}


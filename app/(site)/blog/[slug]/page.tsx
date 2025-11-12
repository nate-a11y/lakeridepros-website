import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getMediaUrl } from '@/lib/api/payload';
import { formatDate } from '@/lib/utils';
import { serializeLexical } from '@/lib/serializeLexical';
import type { Author } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Helper function to get category display name
const getCategoryLabel = (categoryValue: string): string => {
  const categoryMap: Record<string, string> = {
    'news': 'Company News',
    'guides': 'Tips & Guides',
    'events': 'Events',
    'fleet': 'Fleet Updates',
  };
  return categoryMap[categoryValue] || categoryValue;
};

// Helper function to get author name from either string or object
const getAuthorName = (author: Author | string | undefined): string => {
  if (!author) {
    return 'Lake Ride Pros';
  }
  if (typeof author === 'string') {
    // If it's just an email, return "Lake Ride Pros" as fallback
    return 'Lake Ride Pros';
  }
  // If it's an Author object, return the name or fallback
  return author.name || 'Lake Ride Pros';
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    return {
      title: 'Post Not Found | Lake Ride Pros Blog',
    };
  }

  return {
    title: `${post.title} | Lake Ride Pros Blog`,
    description: post.excerpt || post.title,
    openGraph: post.featuredImage ? {
      images: [getMediaUrl(post.featuredImage.url)],
    } : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
          >
            <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {post.featuredImage && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={getMediaUrl(post.featuredImage.url)}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center text-sm text-lrp-text-secondary mb-4">
            {post.publishedDate && (
              <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            )}
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <span className="text-primary">
                  {typeof post.categories[0] === 'string'
                    ? getCategoryLabel(post.categories[0])
                    : post.categories[0]?.name || ''}
                </span>
              </>
            )}
            <span className="mx-2">•</span>
            <span>By {getAuthorName(post.author)}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-lrp-text-secondary dark:text-dark-text-secondary mb-8">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
            {post.content ? (
              typeof post.content === 'string' ? (
                // Legacy HTML content from older posts
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                // New Lexical rich text content
                serializeLexical(post.content)
              )
            ) : post.excerpt ? (
              <p>{post.excerpt}</p>
            ) : (
              <p>No content available.</p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

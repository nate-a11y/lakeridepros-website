import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMediaUrl } from '@/lib/api/payload';
import { getBlogPostBySlugLocal, getAdjacentBlogPostsLocal } from '@/lib/api/payload-local';
import { formatDate } from '@/lib/utils';
import { serializeLexical } from '@/lib/serializeLexical';
import type { User } from '@/src/payload-types';
import BlogPostNavigation from '@/components/BlogPostNavigation';

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
const getAuthorName = (author: User | string | undefined): string => {
  if (!author) {
    return 'Lake Ride Pros';
  }
  if (typeof author === 'string') {
    // If it's just an email, return "Lake Ride Pros" as fallback
    return 'Lake Ride Pros';
  }
  // If it's a User object, return the name or fallback
  return author.name || 'Lake Ride Pros';
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugLocal(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Lake Ride Pros Blog',
    };
  }

  const description = post.excerpt
    ? post.excerpt.substring(0, 155)
    : post.title.substring(0, 155);
  const imageUrl = post.featuredImage
    ? getMediaUrl(post.featuredImage.url)
    : 'https://www.lakeridepros.com/og-image.jpg';

  return {
    title: `${post.title} | Lake Ozarks Transportation Blog`,
    description: `${description}. Expert tips from Lake Ride Pros.`,
    keywords: post.tags ? `${post.tags.join(', ')}, Lake of the Ozarks, transportation tips` : 'Lake of the Ozarks, transportation, travel tips',
    alternates: {
      canonical: `https://www.lakeridepros.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: `https://www.lakeridepros.com/blog/${slug}`,
      siteName: 'Lake Ride Pros',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedAt,
      authors: [getAuthorName(post.author)],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugLocal(slug);

  if (!post) {
    notFound();
  }

  // Get adjacent posts for navigation
  const adjacentPosts = await getAdjacentBlogPostsLocal(slug);

  // Article Schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage
      ? getMediaUrl(post.featuredImage.url)
      : 'https://www.lakeridepros.com/og-image.jpg',
    author: {
      '@type': typeof post.author === 'string' || !post.author ? 'Organization' : 'Person',
      name: getAuthorName(post.author),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lake Ride Pros',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lakeridepros.com/Color%20logo%20-%20no%20background.png',
      },
    },
    datePublished: post.publishedDate || post.createdAt,
    dateModified: post.updatedAt || post.publishedDate || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.lakeridepros.com/blog/${slug}`,
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lakeridepros.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.lakeridepros.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.lakeridepros.com/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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

      {/* Next/Previous Navigation */}
      <BlogPostNavigation
        previous={adjacentPosts.previous}
        next={adjacentPosts.next}
      />
    </>
  );
}

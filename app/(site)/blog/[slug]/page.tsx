import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMediaUrl, getBlogPostBySlugLocal, getAdjacentBlogPostsLocal } from '@/lib/api/sanity';
import { formatDate } from '@/lib/utils';
import { RichText } from '@/lib/sanity/serialize-portable-text';
import BlogArticleNavigation from '@/components/blog-editorial/BlogArticleNavigation';
import styles from '@/components/blog-editorial/BlogEditorial.module.css';
import { metaDescription, metaTitle } from '@/lib/seo/metadata';

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

// Helper function to get author name from either ID, string, or object
const getAuthorName = (author: { name?: string } | string | number | null | undefined): string => {
  if (!author || typeof author === 'number') {
    return 'Lake Ride Pros';
  }
  if (typeof author === 'string') {
    // If it's just an email or ID, return "Lake Ride Pros" as fallback
    return 'Lake Ride Pros';
  }
  // If it's a User object (Sanity reference), return the name or fallback
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

  const description = metaDescription(
    post.excerpt || '',
    `${post.title}. Expert transportation tips from Lake Ride Pros.`
  );
  const imageUrl = post.featuredImage && typeof post.featuredImage === 'object'
    ? getMediaUrl(post.featuredImage)
    : 'https://www.lakeridepros.com/og-image.jpg';

  return {
    title: metaTitle(post.title),
    description,
    keywords: post.categories?.length ? `${post.categories.join(', ')}, Lake of the Ozarks, transportation tips` : 'Lake of the Ozarks, transportation, travel tips',
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
      modifiedTime: post._updatedAt,
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
    permanentRedirect('/blog');
  }

  // Get adjacent posts for navigation
  const adjacentPosts = await getAdjacentBlogPostsLocal(slug);

  // Article Schema for SEO
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage && typeof post.featuredImage === 'object'
      ? getMediaUrl(post.featuredImage)
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
    <div className={styles.page}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className={styles.postHeader}>
        <div className={styles.wrap}>
          <Link href="/blog" className="mb-6 inline-flex min-h-11 items-center font-semibold text-[#2f730e] underline underline-offset-4 hover:text-lrp-black">Back to Blog</Link>
          <div className={`${styles.meta} mb-6`}>
            {post.publishedDate && <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>}
            {post.categories?.[0] && <span className={styles.category}>{getCategoryLabel(post.categories[0])}</span>}
            <span>By {getAuthorName(post.author)}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
          {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}
          {post.featuredImage && typeof post.featuredImage === 'object' && (
            <div className={styles.postImage}>
              <Image src={getMediaUrl(post.featuredImage)} alt={post.featuredImage.alt || post.title} fill sizes="(min-width: 1100px) 1050px, 100vw" quality={85} loading="eager" fetchPriority="high" />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <article className={styles.prose}>
        <div>
          <div>
            {post.content ? (
              typeof post.content === 'string' ? (
                // Legacy HTML content from older posts
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                // Sanity Portable Text content
                <RichText content={post.content} />
              )
            ) : post.excerpt ? (
              <p>{post.excerpt}</p>
            ) : (
              <p>No content available.</p>
            )}
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="!mt-0 !text-lg">Categories:</h2>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="border-b-2 border-primary py-1 text-sm font-semibold"
                  >
                    {getCategoryLabel(category)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Next/Previous Navigation */}
      <BlogArticleNavigation
        previous={adjacentPosts.previous}
        next={adjacentPosts.next}
      />
    </div>
  );
}

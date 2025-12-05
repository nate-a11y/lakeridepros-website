import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BlogPostsGrid from '@/components/BlogPostsGrid';
import { getBlogPostsLocal } from '@/lib/api/payload-local';
import { getMediaUrl } from '@/lib/api/payload';
import { formatDate } from '@/lib/utils';
import { FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Lake Ride Pros',
  description: 'Read the latest news, tips, and updates from Lake Ride Pros. Stay informed about luxury transportation at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/blog',
  },
  openGraph: {
    title: 'Blog | Lake Ride Pros',
    description: 'Read the latest news, tips, and updates from Lake Ride Pros. Stay informed about luxury transportation at Lake of the Ozarks.',
    url: 'https://www.lakeridepros.com/blog',
    siteName: 'Lake Ride Pros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Lake Ride Pros Blog' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Lake Ride Pros',
    description: 'Read the latest news, tips, and updates from Lake Ride Pros.',
    images: ['/og-image.jpg'],
  },
};

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

export default async function BlogPage() {
  const blogData = await getBlogPostsLocal({ limit: 12 });

  const posts = blogData.docs;
  const hasNextPage = blogData.hasNextPage;
  const currentPage = blogData.page;

  // Get featured post (first post) and remaining posts
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);
  const featuredImageUrl = featuredPost?.featuredImage && typeof featuredPost.featuredImage === 'object'
    ? getMediaUrl(featuredPost.featuredImage.url)
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm font-medium mb-4">
            Lake Ride Pros Blog
          </span>
          <h1 className="font-boardson text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            News & Insights
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Stay updated with the latest from Lake Ride Pros - transportation tips, local events, and behind-the-scenes stories
          </p>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-12 bg-lrp-gray dark:bg-dark-bg-secondary transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-sm font-semibold text-primary dark:text-primary-light uppercase tracking-wider mb-6">
              Featured Article
            </h2>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block bg-white dark:bg-dark-bg-tertiary rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full min-h-[300px] overflow-hidden">
                  {featuredImageUrl ? (
                    <Image
                      src={featuredImageUrl}
                      alt={(featuredPost.featuredImage && typeof featuredPost.featuredImage === 'object' ? featuredPost.featuredImage.alt : null) || featuredPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-dark-bg-primary">
                      <FileText className="w-24 h-24 text-neutral-300 dark:text-neutral-500" />
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm mb-4">
                    {featuredPost.categories && featuredPost.categories.length > 0 && (
                      <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full font-medium">
                        {getCategoryLabel(featuredPost.categories[0])}
                      </span>
                    )}
                    {featuredPost.publishedDate && (
                      <time dateTime={featuredPost.publishedDate} className="text-neutral-500 dark:text-neutral-400">
                        {formatDate(featuredPost.publishedDate)}
                      </time>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="text-neutral-600 dark:text-neutral-300 text-lg mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 text-primary dark:text-primary-light font-semibold group-hover:gap-3 transition-all">
                    Read Full Article
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {remainingPosts.length > 0 && (
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8">
              More Articles
            </h2>
          )}
          <BlogPostsGrid
            initialPosts={remainingPosts}
            initialHasNextPage={hasNextPage}
            initialPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}

'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';
import { formatDate } from '@/lib/utils';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedBlogSectionProps {
  posts: BlogPost[];
  title?: string;
  subtitle?: string;
}

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

export default function FeaturedBlogSection({
  posts,
  title = 'Latest News & Updates',
  subtitle = 'Stay informed with our latest articles and company news',
}: FeaturedBlogSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) {
    return null;
  }

  const [featuredPost, ...otherPosts] = posts;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const featuredImageUrl = featuredPost.featuredImage && typeof featuredPost.featuredImage === 'object'
    ? getMediaUrl(featuredPost.featuredImage.url)
    : null;

  return (
    <section
      aria-labelledby="blog-section-heading"
      className="py-16 bg-white dark:bg-dark-bg-primary transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="blog-section-heading"
            className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            {title}
          </h2>
          <p className="text-lg text-lrp-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Featured Post - Hero Style */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block w-full relative rounded-2xl overflow-hidden mb-8 shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={`Read featured article: ${featuredPost.title}`}
        >
          <div className="relative w-full h-[400px] md:h-[500px]">
            {featuredImageUrl ? (
              <Image
                src={featuredImageUrl}
                alt={(featuredPost.featuredImage && typeof featuredPost.featuredImage === 'object' ? featuredPost.featuredImage.alt : null) || featuredPost.title}
                fill
                sizes="100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-dark-bg-secondary">
                <FileText className="w-24 h-24 text-primary/30" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                {featuredPost.categories && featuredPost.categories.length > 0 && (
                  <span className="bg-primary-dark text-lrp-black text-xs font-semibold px-3 py-1 rounded-full">
                    {getCategoryLabel(featuredPost.categories[0])}
                  </span>
                )}
                {featuredPost.publishedDate && (
                  <time
                    dateTime={featuredPost.publishedDate}
                    className="text-white/80 text-sm"
                  >
                    {formatDate(featuredPost.publishedDate)}
                  </time>
                )}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-primary-light transition-colors">
                {featuredPost.title}
              </h3>
              {featuredPost.excerpt && (
                <p className="text-white/90 text-base md:text-lg line-clamp-2 max-w-3xl">
                  {featuredPost.excerpt}
                </p>
              )}
              <div className="mt-4 inline-flex items-center text-primary-light font-semibold group-hover:gap-3 gap-2 transition-all">
                Read Article
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* Other Posts - Horizontal Scroll */}
        {otherPosts.length > 0 && (
          <div className="relative">
            {/* Scroll buttons */}
            {otherPosts.length > 2 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-dark-bg-tertiary shadow-lg rounded-full p-2 hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary hidden md:flex"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-dark-bg-tertiary shadow-lg rounded-full p-2 hover:bg-neutral-50 dark:hover:bg-dark-bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary hidden md:flex"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
                </button>
              </>
            )}

            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              role="list"
              aria-label="More articles"
            >
              {otherPosts.map((post) => {
                const imageUrl = post.featuredImage && typeof post.featuredImage === 'object'
                  ? getMediaUrl(post.featuredImage.url)
                  : null;

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex-shrink-0 snap-start bg-white dark:bg-dark-bg-tertiary rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    style={{ display: 'flex', flexDirection: 'column', width: '320px' }}
                    role="listitem"
                  >
                    <div style={{ display: 'block', position: 'relative', height: '10rem', width: '100%', overflow: 'hidden' }}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={(post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage.alt : null) || post.title}
                          fill
                          sizes="320px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-dark-bg-secondary">
                          <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-500" />
                        </div>
                      )}
                      {post.categories && post.categories.length > 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary/90 backdrop-blur-sm text-lrp-black text-xs font-semibold px-2 py-1 rounded">
                            {getCategoryLabel(post.categories[0])}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {post.publishedDate && (
                        <time
                          dateTime={post.publishedDate}
                          className="text-xs text-neutral-500 dark:text-neutral-400"
                        >
                          {formatDate(post.publishedDate)}
                        </time>
                      )}
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-1 mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center text-primary dark:text-primary-light text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                        Read more
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Scroll indicator dots for mobile */}
            {otherPosts.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 md:hidden">
                {otherPosts.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600"
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary-dark hover:bg-primary text-lrp-black font-semibold px-8 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="View all blog articles"
          >
            View All Articles
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

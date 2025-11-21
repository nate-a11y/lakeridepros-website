'use client';

import { useState } from 'react';
import BlogPostCard from '@/components/BlogPostCard';
import type { BlogPost } from '@/src/payload-types';

interface BlogPostsGridProps {
  initialPosts: BlogPost[];
  initialHasNextPage: boolean;
  initialPage: number;
}

export default function BlogPostsGrid({
  initialPosts,
  initialHasNextPage,
  initialPage
}: BlogPostsGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const response = await fetch(
        `/api/blog-posts?limit=12&page=${nextPage}&where=${JSON.stringify({ published: { equals: true } })}&sort=-publishedDate&depth=2`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch more posts');
      }

      const data = await response.json();

      setPosts(prevPosts => [...prevPosts, ...data.docs]);
      setHasNextPage(data.hasNextPage);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark:text-lrp-text-muted">
          Blog posts will be available soon. Check back later for updates!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {hasNextPage && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={isLoading ? 'Loading more blog posts' : 'Load more blog posts'}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}

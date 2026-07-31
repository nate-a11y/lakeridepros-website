import Link from 'next/link';
import BlogPostCard from '@/components/BlogPostCard';
import type { BlogPost } from '@/types/sanity';

interface BlogPostsGridProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
}

export default function BlogPostsGrid({
  posts,
  currentPage,
  totalPages,
}: BlogPostsGridProps) {
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
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {currentPage > 1 && (
            <Link
              href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`}
              rel="prev"
              className="!inline-flex min-h-11 items-center rounded-lg border border-primary px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-lrp-black"
            >
              Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Link
              key={page}
              href={page === 1 ? '/blog' : `/blog?page=${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Blog page ${page}`}
              className={`!inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 py-2 font-semibold transition-colors ${
                page === currentPage
                  ? 'border-primary bg-primary text-lrp-black'
                  : 'border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary dark:border-neutral-600 dark:text-neutral-200'
              }`}
            >
              {page}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}`}
              rel="next"
              className="!inline-flex min-h-11 items-center rounded-lg border border-primary px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-lrp-black"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

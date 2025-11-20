import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/src/payload-types';
import { getMediaUrl } from '@/lib/api/payload';

interface BlogPostNavigationProps {
  previous: BlogPost | null;
  next: BlogPost | null;
}

export default function BlogPostNavigation({ previous, next }: BlogPostNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="border-t border-neutral-200 dark:border-neutral-700 mt-12 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Previous Post */}
          <div className={`${!previous ? 'invisible' : ''}`}>
            {previous && (
              <Link
                href={`/blog/${previous.slug}`}
                className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-colors"
              >
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous Post
                </div>
                <div className="flex gap-4">
                  {previous.featuredImage && (
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={getMediaUrl(previous.featuredImage.url)}
                        alt={previous.featuredImage.alt || previous.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {previous.title}
                    </h3>
                    {previous.excerpt && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {previous.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Next Post */}
          <div className={`${!next ? 'invisible' : ''}`}>
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-end text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  Next Post
                  <svg
                    className="h-4 w-4 ml-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {next.title}
                    </h3>
                    {next.excerpt && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {next.excerpt}
                      </p>
                    )}
                  </div>
                  {next.featuredImage && (
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={getMediaUrl(next.featuredImage.url)}
                        alt={next.featuredImage.alt || next.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

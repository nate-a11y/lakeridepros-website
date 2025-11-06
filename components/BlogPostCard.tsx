import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';
import { getMediaUrl } from '@/lib/api/payload';
import { formatDate } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const imageUrl = post.featuredImage
    ? getMediaUrl(post.featuredImage.url)
    : '/placeholder-blog.jpg';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.featuredImage?.alt || post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          {post.publishedDate && (
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
          )}
          {post.categories && post.categories.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span className="text-primary dark:text-primary-light">{post.categories[0].name}</span>
            </>
          )}
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 text-primary dark:text-primary-light font-medium text-sm group-hover:text-secondary dark:group-hover:text-primary transition-colors">
          Read more →
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link'
import type { BlogPost } from '@/types/sanity'
import { resolveSlug } from '@/types/sanity'
import { formatDate } from '@/lib/utils'
import styles from './BlogEditorial.module.css'

export function getCategoryLabel(value: string): string {
  return ({ news: 'Company News', guides: 'Tips & Guides', events: 'Events', fleet: 'Fleet Updates' } as Record<string, string>)[value] || value
}

export default function BlogArticleList({ posts, currentPage, totalPages }: {
  posts: BlogPost[]; currentPage: number; totalPages: number
}) {
  if (posts.length === 0) return <p className="py-12 text-[#444]">Blog posts will be available soon. Check back later for updates!</p>
  return (
    <>
      <div className={styles.articleList}>
        {posts.map((post) => (
          <article key={post._id} className={styles.articleRow}>
            <Link href={`/blog/${resolveSlug(post.slug)}`} className={styles.articleLink} aria-label={`Read article: ${post.title}`}>
              <div className={styles.meta}>
                {post.publishedDate && <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>}
                {post.categories?.[0] && <span className={styles.category}>{getCategoryLabel(post.categories[0])}</span>}
              </div>
              <h3>{post.title}</h3>
              {post.excerpt && <p>{post.excerpt}</p>}
              <span className={styles.read}>Read more</span>
            </Link>
          </article>
        ))}
      </div>
      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className={styles.pagination}>
          {currentPage > 1 && <Link href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`} rel="prev">Previous</Link>}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <Link key={page} href={page === 1 ? '/blog' : `/blog?page=${page}`} aria-current={page === currentPage ? 'page' : undefined} aria-label={`Blog page ${page}`}>{page}</Link>)}
          {currentPage < totalPages && <Link href={`/blog?page=${currentPage + 1}`} rel="next">Next</Link>}
        </nav>
      )}
    </>
  )
}

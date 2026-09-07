import Image from 'next/image'
import Link from 'next/link'
import { getMediaUrl } from '@/lib/api/sanity'
import type { BlogPost } from '@/types/sanity'
import { resolveSlug } from '@/types/sanity'
import styles from './BlogEditorial.module.css'

export default function BlogArticleNavigation({ previous, next }: { previous: BlogPost | null; next: BlogPost | null }) {
  if (!previous && !next) return null
  return (
    <nav aria-label="More from the Lake Ride Pros blog" className={styles.postNavigation}>
      <div className={styles.wrap}>
        <h2>Keep exploring the Lake</h2>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {[{ post: previous, label: 'Previous Post' }, { post: next, label: 'Next Post' }].map(({ post, label }) => post && (
            <Link key={label} href={`/blog/${resolveSlug(post.slug)}`} className={`${styles.articleLink} min-w-0 border-t border-[#999] pt-6`}>
              <span className="mb-5 block text-sm font-bold text-[#2f730e]">{label}</span>
              <div className="flex flex-col gap-5 sm:flex-row">
                {post.featuredImage && typeof post.featuredImage === 'object' && <div className="relative aspect-video w-44 shrink-0"><Image src={getMediaUrl(post.featuredImage)} alt={post.featuredImage.alt || post.title} fill sizes="176px" className="object-contain" /></div>}
                <div className="min-w-0">
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

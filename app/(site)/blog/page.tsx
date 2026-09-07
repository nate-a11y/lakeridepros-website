import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BlogArticleList from '@/components/blog-editorial/BlogArticleList';
import styles from '@/components/blog-editorial/BlogEditorial.module.css';
import { getBlogPostsLocal, getMediaUrl } from '@/lib/api/sanity';
import { formatDate } from '@/lib/utils';

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

type BlogPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

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

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number.parseInt(pageValue || '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const blogData = await getBlogPostsLocal({ limit: 12, page });

  const posts = blogData.docs;
  const currentPage = blogData.page;
  const totalPages = blogData.totalPages;
  const isFirstPage = currentPage === 1;

  // Preserve the large featured treatment on page one. Subsequent pages show
  // all 12 posts in the crawlable article grid.
  const featuredPost = isFirstPage ? posts[0] : undefined;
  const remainingPosts = isFirstPage ? posts.slice(1) : posts;
  const featuredImageUrl = featuredPost?.featuredImage && typeof featuredPost.featuredImage === 'object'
    ? getMediaUrl(featuredPost.featuredImage)
    : null;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <p className="mb-5 font-boardson text-3xl text-[#2f730e]">Lake Ride Pros Blog</p>
          <h1>News & Insights</h1>
          <p className="mt-6 text-lg leading-relaxed text-[#444]">Stay updated with the latest from Lake Ride Pros - transportation tips, local events, and behind-the-scenes stories</p>
        </div>
      </header>
      {featuredPost && (
        <section className="pb-16 sm:pb-20">
          <div className={styles.wrap}>
            <h2 className="mb-6 border-t border-[#999] pt-5 text-lg font-bold">Featured Article</h2>
            <Link href={`/blog/${featuredPost.slug}`} className={`${styles.articleLink} ${styles.featured}`}>
              {featuredImageUrl && (
                <div className={styles.featuredImage}>
                  <Image src={featuredImageUrl} alt={(featuredPost.featuredImage && typeof featuredPost.featuredImage === 'object' ? featuredPost.featuredImage.alt : null) || featuredPost.title} fill sizes="(min-width: 1024px) 55vw, 100vw" quality={85} loading="eager" fetchPriority="high" />
                </div>
              )}
              <div className="min-w-0">
                <div className={`${styles.meta} mb-5`}>
                  {featuredPost.categories?.[0] && <span className={styles.category}>{getCategoryLabel(featuredPost.categories[0])}</span>}
                  {featuredPost.publishedDate && <time dateTime={featuredPost.publishedDate}>{formatDate(featuredPost.publishedDate)}</time>}
                </div>
                <h3>{featuredPost.title}</h3>
                {featuredPost.excerpt && <p className="text-lg text-[#444]">{featuredPost.excerpt}</p>}
                <span className={styles.read}>Read Full Article</span>
              </div>
            </Link>
          </div>
        </section>
      )}
      <section className="bg-lrp-gray py-12 sm:py-16">
        <div className={styles.wrap}>
          {remainingPosts.length > 0 && <h2 className="mb-8 text-3xl tracking-[-0.02em] sm:text-4xl">{isFirstPage ? 'More Articles' : `Articles — Page ${currentPage}`}</h2>}
          <BlogArticleList posts={remainingPosts} currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </div>
  );
}

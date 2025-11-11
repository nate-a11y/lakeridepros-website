import { Metadata } from 'next';
import BlogPostCard from '@/components/BlogPostCard';
import { getBlogPosts } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Blog | Lake Ride Pros',
  description: 'Read the latest news, tips, and updates from Lake Ride Pros. Stay informed about luxury transportation at Lake of the Ozarks.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/blog',
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const blogData = await getBlogPosts({ limit: 12 }).catch(() => ({ docs: [], hasNextPage: false }));
  const posts = blogData.docs || [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-white/90 dark:text-neutral-200 max-w-2xl mx-auto">
            News, tips, and insights from the Lake Ride Pros team
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              {'hasNextPage' in blogData && blogData.hasNextPage && (
                <div className="text-center mt-12">
                  <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-lrp-text-muted">
                Blog posts will be available soon. Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

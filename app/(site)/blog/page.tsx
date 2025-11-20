import { Metadata } from 'next';
import BlogPostsGrid from '@/components/BlogPostsGrid';
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
  const blogData = await getBlogPosts({ limit: 12 }).catch(() => ({
    docs: [],
    hasNextPage: false,
    page: 1
  }));

  const posts = blogData.docs || [];
  const hasNextPage = 'hasNextPage' in blogData ? blogData.hasNextPage : false;
  const currentPage = 'page' in blogData ? blogData.page : 1;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-boardson text-4xl sm:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-white/90 dark:text-neutral-200 max-w-2xl mx-auto">
            News, tips, and insights from the Lake Ride Pros team
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostsGrid
            initialPosts={posts}
            initialHasNextPage={hasNextPage}
            initialPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}

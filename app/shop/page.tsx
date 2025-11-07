import { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api/payload';

export const metadata: Metadata = {
  title: 'Shop | Lake Ride Pros',
  description: 'Browse Lake Ride Pros merchandise and accessories. Shop branded apparel, accessories, and more.',
  alternates: {
    canonical: 'https://www.lakeridepros.com/shop',
  },
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const productsData = await getProducts({ limit: 12 }).catch(() => ({ docs: [], hasNextPage: false }));
  const products = productsData.docs || [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl text-blue-100 dark:text-neutral-200 max-w-2xl mx-auto">
            Browse our collection of premium merchandise and accessories
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {'hasNextPage' in productsData && productsData.hasNextPage && (
                <div className="text-center mt-12">
                  <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-lrp-text-muted">
                Products will be available soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

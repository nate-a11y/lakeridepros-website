import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getMediaUrl } from '@/lib/api/payload';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.featuredImage
    ? getMediaUrl(product.featuredImage.url)
    : product.images?.[0]
    ? getMediaUrl(product.images[0].url)
    : '/placeholder-product.jpg';

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      className="group block bg-white dark:bg-dark-bg-tertiary rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden bg-neutral-100 dark:bg-dark-bg-secondary">
        <Image
          src={imageUrl}
          alt={product.featuredImage?.alt || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Sale
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white dark:bg-dark-bg-tertiary text-neutral-900 dark:text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
          {typeof product.name === 'string' ? product.name : 'Product'}
        </h3>
        {product.shortDescription && typeof product.shortDescription === 'string' && (
          <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-primary dark:text-primary-light">
              {typeof product.price === 'number' ? formatPrice(product.price) : '$0.00'}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 line-through">
                {typeof product.compareAtPrice === 'number' ? formatPrice(product.compareAtPrice!) : '$0.00'}
              </span>
            )}
          </div>
          {product.inStock && (
            <button className="text-sm text-secondary dark:text-primary hover:text-secondary-dark dark:hover:text-primary-light font-medium transition-colors">
              View Details
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

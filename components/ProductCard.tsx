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
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 overflow-hidden bg-neutral-100">
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
            <span className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-neutral-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
          {product.inStock && (
            <button className="text-sm text-secondary hover:text-secondary-dark font-medium transition-colors">
              View Details
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

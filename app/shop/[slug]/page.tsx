'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { getProductBySlug, getMediaUrl } from '@/lib/api/payload';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug)
        .then((data) => {
          if (data) {
            setProduct(data);
          } else {
            notFound();
          }
        })
        .catch(() => notFound())
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lrp-text-secondary dark:text-dark-text-secondary">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const images = product.images || [];
  const allImages = product.featuredImage ? [product.featuredImage, ...images] : images;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-neutral-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-primary hover:text-primary-dark"
          >
            <svg className="h-5 w-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {allImages.length > 0 && (
                <>
                  <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 bg-neutral-100">
                    <Image
                      src={getMediaUrl(allImages[selectedImage].url)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-24 rounded-lg overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <Image
                            src={getMediaUrl(image.url)}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="ml-3 text-xl text-lrp-text-secondary line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              </div>

              {product.inStock ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                      >
                        <span className="text-lg">−</span>
                      </button>
                      <span className="text-lg font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-100 text-neutral-700 py-4 px-6 rounded-lg text-center font-semibold">
                  Out of Stock
                </div>
              )}

              {product.sku && (
                <p className="mt-6 text-sm text-lrp-text-secondary">SKU: {product.sku}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

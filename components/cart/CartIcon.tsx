'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/cart'

export default function CartIcon() {
  const itemCount = useCart((state) => state.getItemCount())

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6 text-lrp-green" />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-lrp-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}

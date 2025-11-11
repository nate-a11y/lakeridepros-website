import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

// This route redirects to the correct product detail page
// to avoid 404 errors and maintain a single source of truth
export default function ShopSlugRedirect({ params }: PageProps) {
  // Redirect /shop/[slug] to /shop/products/[slug]
  redirect(`/shop/products/${params.slug}`)
}

import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// This route redirects to the correct product detail page
// to avoid 404 errors and maintain a single source of truth
export default async function ShopSlugRedirect(props: PageProps) {
  const params = await props.params
  // Redirect /shop/[slug] to /shop/products/[slug]
  redirect(`/shop/products/${params.slug}`)
}

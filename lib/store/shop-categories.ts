export const SHOP_CATEGORIES = [
  { name: 'All Products', value: 'all' },
  { name: 'Apparel', value: 'apparel' },
  { name: 'Accessories', value: 'accessories' },
  { name: 'Drinkware', value: 'drinkware' },
  { name: 'Home & Living', value: 'home' },
  { name: 'Limited Edition', value: 'limited' },
  { name: 'Seasonal', value: 'seasonal' },
] as const

export function normalizeShopCategory(value?: string | null) {
  return SHOP_CATEGORIES.some((category) => category.value === value)
    ? value as (typeof SHOP_CATEGORIES)[number]['value']
    : 'all'
}

export function getShopCategoryHref(category: string) {
  return category === 'all'
    ? '/shop'
    : `/shop?category=${encodeURIComponent(category)}`
}

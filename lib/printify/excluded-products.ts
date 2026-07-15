// Products that remain visible through the Printify API even after being
// removed/unpublished in the Printify UI. Keeping this list in the sync layer
// prevents those orphaned products from being reactivated in the storefront.
const EXCLUDED_PRINTIFY_PRODUCT_IDS = new Set([
  '67879ed58ab6dd644b07f5cf', // Generic Velveteen Plush Blanket
])

export function isExcludedPrintifyProduct(productId: string): boolean {
  return EXCLUDED_PRINTIFY_PRODUCT_IDS.has(productId)
}

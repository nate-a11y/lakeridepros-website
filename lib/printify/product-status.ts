interface PrintifyPublicationFields {
  visible?: boolean
  external?: {
    handle?: string | null
  } | null
}

export function isPrintifyProductPublished(product: PrintifyPublicationFields) {
  return product.visible === true || Boolean(product.external?.handle)
}

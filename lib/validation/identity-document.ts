/** Identity photos are private application documents, not driving eligibility. */
export const IDENTITY_DOCUMENT_TYPES = ['image/jpeg', 'image/png'] as const
export const MAX_IDENTITY_DOCUMENT_BYTES = 5 * 1024 * 1024

export function identityDocumentError(file: File | null): string | null {
  if (!file || file.size === 0) return 'Please upload a photo of your ID.'
  if (!IDENTITY_DOCUMENT_TYPES.includes(file.type as typeof IDENTITY_DOCUMENT_TYPES[number])) {
    return 'Please upload a JPG or PNG photo.'
  }
  if (file.size > MAX_IDENTITY_DOCUMENT_BYTES) return 'Each ID photo must be 5MB or smaller.'
  return null
}

export function identityDocumentMatchesType(bytes: Uint8Array, type: string): boolean {
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  return type === 'image/png' && png.every((byte, index) => bytes[index] === byte)
}

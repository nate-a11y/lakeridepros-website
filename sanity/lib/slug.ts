const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 96)
    .replace(/-+$/g, '')
}

export function validateSlug(slug?: {current?: string}): true | string {
  const current = slug?.current
  if (!current) return true

  return SAFE_SLUG_PATTERN.test(current)
    ? true
    : 'Slug must use lowercase letters, numbers, and single hyphens only.'
}

export const DIRECTORY_PAGE_SIZE = 24

export function getPageNumber(value?: string): number | null {
  if (value === undefined) return 1
  if (!/^[1-9]\d*$/.test(value)) return null
  const page = Number(value)
  return Number.isSafeInteger(page) ? page : null
}

import Link from 'next/link'

export default function DirectoryPagination({ page, totalPages, path }: { page: number; totalPages: number; path: string }) {
  if (totalPages <= 1) return null
  const href = (value: number) => value === 1 ? path : `${path}?page=${value}`
  const linkClass = 'inline-flex min-h-11 items-center font-bold text-lrp-black underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'
  return (
    <nav aria-label="Reviews pagination" className="mt-10 flex flex-wrap items-center justify-center gap-6 text-lrp-black">
      {page > 1 && <Link href={href(page - 1)} className={linkClass}>Previous reviews</Link>}
      <span>Page {page} of {totalPages}</span>
      {page < totalPages && <Link href={href(page + 1)} className={linkClass}>Next reviews</Link>}
    </nav>
  )
}

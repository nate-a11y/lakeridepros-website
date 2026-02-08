export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-16">
        {/* Hero skeleton */}
        <div className="h-8 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-4" />
        <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-8" />
        {/* Image skeleton */}
        <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse mb-8" />
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

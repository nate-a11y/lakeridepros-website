export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse" />
          {/* Details skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="space-y-2 mt-6">
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
            <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse mt-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

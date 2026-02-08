export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 py-16">
        {/* Title skeleton */}
        <div className="h-10 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-8 mx-auto" />
        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="aspect-square bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

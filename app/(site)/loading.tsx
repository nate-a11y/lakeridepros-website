export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#4cbb17]" />
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

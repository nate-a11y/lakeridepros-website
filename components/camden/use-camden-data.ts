"use client"

import { useCallback, useEffect, useState } from "react"

export function useCamdenData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await loader())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => { void load() }, [load])
  return { data, error, loading, reload: load }
}

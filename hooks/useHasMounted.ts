import { useSyncExternalStore } from 'react'

/**
 * Hook to detect if component has mounted (client-side hydration complete).
 * Uses useSyncExternalStore for React Compiler compatibility.
 *
 * This replaces the pattern of:
 *   const [mounted, setMounted] = useState(false)
 *   useEffect(() => { setMounted(true) }, [])
 *
 * Which triggers React Compiler's "set-state-in-effect" warning.
 */

// Simple store that always returns true on client, false on server
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

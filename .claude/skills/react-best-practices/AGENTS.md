# React Best Practices

**Version 1.0.0**
Vercel Engineering
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring React and Next.js codebases. Humans may also
> find it useful, but guidance here is optimized for automation and
> consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for React and Next.js applications, designed for AI agents and LLMs. Contains 40+ rules across 8 categories, prioritized by impact from critical (eliminating waterfalls, reducing bundle size) to incremental (advanced patterns). Each rule includes detailed explanations, real-world examples comparing incorrect vs. correct implementations, and specific impact metrics to guide automated refactoring and code generation.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) - **CRITICAL**
2. [Bundle Size Optimization](#2-bundle-size-optimization) - **CRITICAL**
3. [Server-Side Performance](#3-server-side-performance) - **HIGH**
4. [Client-Side Data Fetching](#4-client-side-data-fetching) - **MEDIUM-HIGH**
5. [Re-render Optimization](#5-re-render-optimization) - **MEDIUM**
6. [Rendering Performance](#6-rendering-performance) - **MEDIUM**
7. [JavaScript Performance](#7-javascript-performance) - **LOW-MEDIUM**
8. [Advanced Patterns](#8-advanced-patterns) - **LOW**

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Eliminating them yields the largest gains.

### 1.1 Defer Await Until Needed

**Impact: HIGH (avoids blocking unused code paths)**

Move `await` operations into the branches where they're actually used.

**Incorrect:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    return { skipped: true }
  }

  return processUserData(userData)
}
```

**Correct:**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true }
  }

  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

### 1.2 Dependency-Based Parallelization

**Impact: CRITICAL (2-10x improvement)**

For operations with partial dependencies, use `better-all` to maximize parallelism.

**Incorrect:**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
const profile = await fetchProfile(user.id)
```

**Correct:**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

### 1.3 Prevent Waterfall Chains in API Routes

**Impact: CRITICAL (2-10x improvement)**

Start independent operations immediately, even if you don't await them yet.

**Incorrect:**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correct:**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

### 1.4 Promise.all() for Independent Operations

**Impact: CRITICAL (2-10x improvement)**

**Incorrect:**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correct:**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

### 1.5 Strategic Suspense Boundaries

**Impact: HIGH (faster initial paint)**

**Incorrect:**

```tsx
async function Page() {
  const data = await fetchData()

  return (
    <div>
      <Sidebar />
      <Header />
      <DataDisplay data={data} />
      <Footer />
    </div>
  )
}
```

**Correct:**

```tsx
function Page() {
  return (
    <div>
      <Sidebar />
      <Header />
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <Footer />
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

---

## 2. Bundle Size Optimization

**Impact: CRITICAL**

### 2.1 Avoid Barrel File Imports

**Impact: CRITICAL (200-800ms import cost)**

**Incorrect:**

```tsx
import { Check, X, Menu } from 'lucide-react'
```

**Correct:**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
```

**Alternative (Next.js 13.5+):**

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}
```

### 2.2 Conditional Module Loading

**Impact: HIGH**

```tsx
function AnimationPlayer({ enabled, setEnabled }) {
  const [frames, setFrames] = useState(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

### 2.3 Defer Non-Critical Third-Party Libraries

**Impact: MEDIUM**

**Incorrect:**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Correct:**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2.4 Dynamic Imports for Heavy Components

**Impact: CRITICAL**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)
```

### 2.5 Preload Based on User Intent

**Impact: MEDIUM**

```tsx
function EditorButton({ onClick }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  )
}
```

---

## 3. Server-Side Performance

**Impact: HIGH**

### 3.1 Cross-Request LRU Caching

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}
```

### 3.2 Minimize Serialization at RSC Boundaries

**Impact: HIGH**

**Incorrect:**

```tsx
async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}
```

**Correct:**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}
```

### 3.3 Parallel Data Fetching with Component Composition

**Impact: CRITICAL**

**Incorrect:**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}
```

**Correct:**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

### 3.4 Per-Request Deduplication with React.cache()

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

### 3.5 Use after() for Non-Blocking Operations

```tsx
import { after } from 'next/server'

export async function POST(request: Request) {
  await updateDatabase(request)

  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    logUserAction({ userAgent })
  })

  return Response.json({ status: 'success' })
}
```

---

## 4. Client-Side Data Fetching

**Impact: MEDIUM-HIGH**

### 4.1 Deduplicate Global Event Listeners

Use `useSWRSubscription()` to share global event listeners.

### 4.2 Use Passive Event Listeners for Scrolling

```typescript
document.addEventListener('touchstart', handleTouch, { passive: true })
document.addEventListener('wheel', handleWheel, { passive: true })
```

### 4.3 Use SWR for Automatic Deduplication

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

### 4.4 Version and Minimize localStorage Data

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {}
}
```

---

## 5. Re-render Optimization

**Impact: MEDIUM**

### 5.1 Defer State Reads to Usage Point

**Incorrect:**

```tsx
function ShareButton({ chatId }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**Correct:**

```tsx
function ShareButton({ chatId }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

### 5.2 Extract to Memoized Components

```tsx
const UserAvatar = memo(function UserAvatar({ user }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }) {
  if (loading) return <Skeleton />
  return <UserAvatar user={user} />
}
```

### 5.3 Narrow Effect Dependencies

**Incorrect:**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**Correct:**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

### 5.4 Subscribe to Derived State

**Incorrect:**

```tsx
const width = useWindowWidth()
const isMobile = width < 768
```

**Correct:**

```tsx
const isMobile = useMediaQuery('(max-width: 767px)')
```

### 5.5 Use Functional setState Updates

```tsx
// Stable callback, no stale closures
const addItems = useCallback((newItems) => {
  setItems(curr => [...curr, ...newItems])
}, [])
```

### 5.6 Use Lazy State Initialization

**Incorrect:**

```tsx
const [searchIndex] = useState(buildSearchIndex(items))
```

**Correct:**

```tsx
const [searchIndex] = useState(() => buildSearchIndex(items))
```

### 5.7 Use Transitions for Non-Urgent Updates

```tsx
import { startTransition } from 'react'

const handler = () => {
  startTransition(() => setScrollY(window.scrollY))
}
```

---

## 6. Rendering Performance

**Impact: MEDIUM**

### 6.1 Animate SVG Wrapper Instead of SVG Element

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

### 6.2 CSS content-visibility for Long Lists

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

### 6.3 Hoist Static JSX Elements

```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return <div>{loading && loadingSkeleton}</div>
}
```

### 6.4 Optimize SVG Precision

```bash
npx svgo --precision=1 --multipass icon.svg
```

### 6.5 Prevent Hydration Mismatch Without Flickering

Use inline scripts that execute before React hydrates.

### 6.6 Use Activity Component for Show/Hide

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

### 6.7 Use Explicit Conditional Rendering

**Incorrect:**

```tsx
{count && <span className="badge">{count}</span>}
```

**Correct:**

```tsx
{count > 0 ? <span className="badge">{count}</span> : null}
```

---

## 7. JavaScript Performance

**Impact: LOW-MEDIUM**

### 7.1 Batch DOM CSS Changes

Use classes or `cssText` instead of changing styles one property at a time.

### 7.2 Build Index Maps for Repeated Lookups

```typescript
const userById = new Map(users.map(u => [u.id, u]))
orders.map(order => ({ ...order, user: userById.get(order.userId) }))
```

### 7.3 Cache Property Access in Loops

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

### 7.4 Cache Repeated Function Calls

```typescript
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) return slugifyCache.get(text)!
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}
```

### 7.5 Cache Storage API Calls

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}
```

### 7.6 Combine Multiple Array Iterations

```typescript
const admins: User[] = []
const testers: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
}
```

### 7.7 Early Length Check for Array Comparisons

```typescript
function hasChanges(current: string[], original: string[]) {
  if (current.length !== original.length) return true
  // ... continue comparison
}
```

### 7.8 Early Return from Functions

Return immediately when result is determined.

### 7.9 Hoist RegExp Creation

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
}
```

### 7.10 Use Loop for Min/Max Instead of Sort

```typescript
function getLatestProject(projects: Project[]) {
  let latest = projects[0]
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }
  return latest
}
```

### 7.11 Use Set/Map for O(1) Lookups

```typescript
const allowedIds = new Set(['a', 'b', 'c'])
items.filter(item => allowedIds.has(item.id))
```

### 7.12 Use toSorted() Instead of sort()

```typescript
const sorted = users.toSorted((a, b) => a.name.localeCompare(b.name))
```

---

## 8. Advanced Patterns

**Impact: LOW**

### 8.1 Store Event Handlers in Refs

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: () => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

### 8.2 useLatest for Stable Callback Refs

```typescript
function useLatest<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
```

---

## References

1. https://react.dev
2. https://nextjs.org
3. https://swr.vercel.app
4. https://github.com/shuding/better-all
5. https://github.com/isaacs/node-lru-cache
6. https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
7. https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast

---
description: React and Next.js performance optimization guidelines from Vercel Engineering
argument-hint: <file-or-pattern>
---

# React Best Practices

Apply these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## How to Use

Reference the complete guidelines in `AGENTS.md` for detailed rules organized by priority:

1. **Eliminating Waterfalls** (CRITICAL) - async/await patterns, parallelization
2. **Bundle Size Optimization** (CRITICAL) - code-splitting, lazy loading
3. **Server-Side Performance** (HIGH) - caching, data fetching
4. **Client-Side Data Fetching** (MEDIUM-HIGH) - deduplication
5. **Re-render Optimization** (MEDIUM) - minimize unnecessary updates
6. **Rendering Performance** (MEDIUM) - DOM and SVG optimization
7. **JavaScript Performance** (LOW-MEDIUM) - algorithm efficiency
8. **Advanced Patterns** (LOW) - specialized React patterns

## Quick Reference

### Critical Rules (Always Apply)

```typescript
// Parallel async operations
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])

// Direct imports (avoid barrel files)
import Check from 'lucide-react/dist/esm/icons/check'

// Dynamic imports for heavy components
const Monaco = dynamic(() => import('./monaco-editor'), { ssr: false })

// Suspense for streaming
<Suspense fallback={<Skeleton />}>
  <DataDisplay />
</Suspense>
```

### Project-Specific Notes

This project uses:
- **Next.js 16** with App Router - leverage Server Components
- **Zustand** for state - prefer selectors over full store subscription
- **SWR** pattern applies for client-side data fetching
- **React 19** - can use newer APIs like `use()` and Activity

See `AGENTS.md` for the complete 45-rule guide with examples.

# Lake Ride Pros Website - Agent Guidelines

## Project Overview

Lake Ride Pros is a premium luxury transportation service website built with:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Sanity CMS** (headless CMS)
- **Tailwind CSS 4** + SCSS
- **Zustand** (state management)

## Architecture

```
app/                    # Next.js App Router pages
├── (site)/             # Public website routes
├── (sanity)/           # Sanity Studio admin
└── api/                # API routes

sanity/                 # Sanity CMS schemas and config
components/             # React components
contexts/               # React contexts
hooks/                  # Custom React hooks
lib/                    # Utilities and services
├── api/                # API clients (sanity.ts)
├── store/              # Zustand stores
├── supabase/           # Database queries
├── inngest/            # Background jobs
└── validation/         # Zod schemas

e2e/                    # Playwright E2E tests
scripts/                # Build and utility scripts
```

## Key Integrations

- **Stripe** - Payment processing
- **Resend** - Email service
- **Inngest** - Background job queue
- **Printify** - Print-on-demand products
- **Google Reviews** - Review sync
- **Moovs** - Booking system
- **Sanity CMS** - Content management

## Development Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run test             # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
npm run lint             # ESLint
npm run lint:a11y        # Accessibility linting
npm run lint:colors      # Color consistency audit
npm run lint:all         # All linters
```

## Testing Requirements

- Unit test coverage threshold: **80%** (lines, functions, branches, statements)
- E2E tests cover: homepage, gift cards, cart functionality
- All accessibility rules enforced as errors

## Code Standards

### Accessibility (CRITICAL)

This project enforces WCAG 2.1 AA compliance:

- All interactive elements must have visible focus states
- Form controls require labels or aria-labels
- Images require alt text
- Use semantic HTML before ARIA
- Icon-only buttons need `aria-label`

### Performance

- Prefer Server Components where possible
- Use dynamic imports for heavy components
- Avoid barrel file imports (use direct imports)
- Implement virtualization for lists >50 items

### Styling

- Use Tailwind CSS utilities first
- SCSS for complex custom styling
- Follow existing color system (see `scripts/audit-colors.js`)

## Important Files

- `next.config.mjs` - Next.js configuration
- `sanity/sanity.config.ts` - Sanity CMS configuration
- `eslint.config.mjs` - ESLint with a11y rules
- `vitest.config.ts` - Test configuration
- `vercel.json` - Deployment configuration

# Lake Ride Pros Website Agent Guide

## Project Overview

Lake Ride Pros is the customer-facing marketing, booking, ecommerce, careers, event, giveaway, and CMS website for Lake Ride Pros at Lake of the Ozarks.

Primary stack from the live repo:

- Next.js 16 App Router + React 19 + TypeScript strict mode
- Sanity 6 / `next-sanity` for content and Studio mounted by `app/(sanity)/studio/[[...tool]]/page.tsx` at the /studio route
- Tailwind CSS 4 via `app/globals.css` and `@tailwindcss/postcss`
- Zustand + React context for cart/client UI state
- Supabase for operational data, storage, migrations, and edge functions
- Stripe for checkout/gift cards, Resend/Nodemailer for email, Inngest for background work, Printify for merch fulfillment

Treat older docs that mention Payload CMS as historical/stale unless the task is explicitly about the Payload-to-Sanity migration. The current CMS source of truth is Sanity.

## Architecture

Use these real repo paths as the navigation map:

- `app/layout.tsx` — root metadata, Montserrat font imports, Vercel Analytics, Google Analytics, and `app/globals.css`.
- `app/globals.css` — Tailwind 4 theme tokens, color variables, accessibility focus/skip-link styles, and global utilities.
- `app/(site)/layout.tsx` — public site shell with ThemeProvider, CartProvider, Header, Footer, cart drawer, phone modal, music banner, scroll progress, back-to-top, and floating CTA.
- `app/(site)/page.tsx` — homepage Server Component; parallel Sanity/API fetches, JSON-LD, dynamic below-fold sections.
- `app/(site)/services/[slug]/page.tsx` — Sanity-backed service detail route.
- `app/(site)/fleet/[slug]/page.tsx` — Sanity-backed vehicle detail route.
- `app/(site)/events/page.tsx`, `app/(site)/events/[slug]/page.tsx`, and `app/(site)/events/waitlist/page.tsx` — Sanity event content plus Supabase event waitlist UX.
- `app/(site)/shop/page.tsx`, `app/(site)/shop/ShopClient.tsx`, and `app/(site)/shop/products/[slug]/page.tsx` — Sanity product catalog, cart, Printify, and Stripe checkout surfaces.
- `app/(site)/careers/driver-application/page.tsx` and `app/(site)/careers/general-application/page.tsx` — driver and general application flows.
- `app/(site)/giveaways/[slug]/page.tsx` and `app/(site)/giveaways-admin/page.tsx` — Supabase-backed giveaway entry/admin flows.
- `app/(sanity)/studio/[[...tool]]/page.tsx` and `sanity/sanity.config.ts` — Sanity Studio at the /studio route.
- `app/api/` — Next route handlers for forms, Stripe, email, SEO generation, revalidation, uploads, syncs, and Inngest.
- `components/` and `components/ui/` — shared UI; only use Client Components when browser APIs/state/effects are required.
- `components/cart/`, `contexts/CartContext.tsx`, and `lib/store/cart.ts` — current/legacy cart state and UI.
- `lib/api/sanity.ts` and `sanity/lib/queries.ts` — canonical Sanity fetch layer and GROQ query definitions.
- `lib/supabase/` — Supabase clients and typed operational queries for applications, giveaways, events, storage, and drivers.
- `lib/inngest/` — Inngest client and functions for Printify sync, winner video generation, and social posting.
- `lib/validation/` — Zod schemas for public form/API payload validation.
- `sanity/schemas/` — Sanity document schemas for services, vehicles, products, orders, gift cards, partners, testimonials, pages, events, venues, analytics, driver profiles, and member logos.
- `supabase/migrations/` and `supabase/functions/` — SQL migrations and Deno edge functions for reviews sync, abandoned drafts, email, and sensitive driver-application handling.
- `e2e/` — Playwright coverage for homepage, cart, gift cards, and accessibility.
- `scripts/audit-colors.js` — project color-system audit used by `npm run lint:colors` and `npm run build:full`.

## Build & Run

Use npm; this repo has `package-lock.json`, packageManager set to npm 11.17.0, and Node >=20.9.0 <27.

```bash
npm install                  # install/update dependencies from package-lock
npm run dev                  # Next dev server with Turbopack at http://localhost:3000
npm run build                # production Next build
npm run build:full           # color audit, then production build
npm run start                # serve the last production build locally
npm run verify               # standard local gate: lint + color audit + unit tests + build
```

Environment variables are documented in `.env.example`. Never commit dotenv files, Supabase service-role keys, Stripe secrets, Sanity tokens, Resend keys, or webhook secrets.

## Testing Philosophy

Run the smallest useful check first, then the relevant gate before reporting success.

```bash
npm run lint                 # ESLint with Next + TypeScript + jsx-a11y config
npm run lint:colors          # project color-system audit (`scripts/audit-colors.js`)
npm run lint:a11y           # strict zero-warning accessibility lint
npm run lint:all             # lint + color audit
npm run test:run             # Vitest unit/component tests once
npm run test:coverage        # coverage with 80% thresholds from `vitest.config.ts`
npm run test:e2e             # Playwright; config builds and starts Next automatically
npm run test:a11y            # Playwright accessibility spec only
npm run test:all             # unit tests + Playwright E2E
```

Notes:

- Vitest uses `happy-dom`, React Testing Library, `vitest.setup.ts`, and excludes `e2e`, `supabase`, `.next`, and `scripts` from coverage.
- Playwright runs Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari against `http://localhost:3000` using `npm run build && npm run start` as its web server.
- For API route changes, add/adjust tests near existing route tests such as `app/api/stripe/webhook/__tests__/route.test.ts`, `app/api/gift-cards/check-balance/__tests__/route.test.ts`, and `app/api/analytics/track/__tests__/route.test.ts`.
- For cart changes, check both `lib/store/__tests__/cart.test.ts` and `components/cart/__tests__/CartIcon.test.tsx` when relevant.

## Verification Gate

Before claiming implementation is done:

1. Run `npm run verify` for normal code changes.
2. Also run `npm run test:e2e` when changing checkout, cart, gift cards, navigation, homepage CTAs, booking/contact flows, or any route covered by Playwright.
3. Also run `npm run test:a11y` or `npm run lint:a11y` for UI, form, modal, drawer, navigation, or interactive-state changes.
4. If a full gate is impractical, state exactly which command was run and why the remaining gate was skipped.

## File Size Limit

Keep files intentionally small so agents do not make existing large files worse.

- Target new files: under 300 lines.
- Hard limit for new/rewritten React components and route handlers: 500 lines unless Nate explicitly approves.
- Do not add bulk to existing oversized files. Current hotspots include:
  - `app/(site)/giveaways-admin/page.tsx` (~1100 lines)
  - `app/(site)/pricing/page.tsx` (~1100 lines)
  - `lib/api/sanity.ts` (~950 lines)
  - `sanity/lib/queries.ts` (~850 lines)
  - `lib/email.ts` and `lib/inngest/functions/sync-printify.ts` (~800 lines)
  - `app/(site)/gift-cards/page.tsx`, `app/(site)/shop/ShopClient.tsx`, `components/HeaderClient.tsx`
- When touching those files, prefer extracting focused helpers/components next to the feature instead of appending more sections.

## Code Conventions

- Prefer Server Components in `app/(site)` pages; add `use client` only for browser APIs, state, effects, forms, animations, or event handlers.
- Fetch Sanity content through `lib/api/sanity.ts` and query definitions in `sanity/lib/queries.ts`; keep slug/media normalization consistent with existing helpers.
- Use `@/` imports for app-local code. Avoid new barrel files; import implementation files directly unless a barrel already exists for that feature.
- Keep TypeScript strict-compatible. Do not loosen `tsconfig.json`; it is intentionally `strict: true` with `moduleResolution: bundler`.
- Use Zod schemas under `lib/validation/` for form/API validation where a schema already exists or data crosses trust boundaries.
- Route handlers should return `NextResponse.json`, validate method/body, rate-limit public form endpoints when appropriate, and avoid leaking internal email/payment errors to customers.
- Preserve Lake Ride Pros brand voice: premium, professional, Lake of the Ozarks specific. Avoid generic city/transportation filler copy.

## Accessibility and UI Standards

Accessibility is a release blocker in this repo.

- Preserve the skip link in `app/(site)/layout.tsx`, semantic landmarks, heading hierarchy, labels, and visible focus states.
- Icon-only buttons need `aria-label`; decorative icons need `aria-hidden="true"`.
- Prefer native elements (`button`, `a`/`Link`, `label`) over ARIA workarounds.
- Keep modals/drawers keyboard accessible and focus-managed.
- Respect reduced motion for animations; avoid `transition: all` and avoid layout-thrashing reads in render.
- Use Tailwind utilities and existing CSS variables/classes from `app/globals.css` before adding new global CSS.
- Run `npm run lint:a11y` for interactive UI changes.

## Data, Integrations, and Safety

- Stripe routes live under `app/api/stripe/`; webhook behavior is tested. Never log raw webhook secrets or payment credentials.
- Resend/Nodemailer email helpers live in `lib/email.ts` and notification helpers in `lib/notifications/`; verified sender defaults are documented in `.env.example`.
- Supabase service-role operations must stay server-side only. Do not expose service keys to client components or public responses.
- Sanity write operations use `SANITY_API_WRITE_TOKEN` through server-side code only.
- Inngest functions should stay idempotent around Printify sync, social posting, and winner video generation.
- Moovs booking integration is configured by `NEXT_PUBLIC_MOOVS_EMBED_URL`; keep booking CTAs customer-safe and test mobile behavior.

## Minimal Changes and Git Discipline

- Make the narrowest project-specific change that solves the request; do not rewrite stale docs or large pages opportunistically.
- Do not reformat unrelated files or reorder large GROQ/schema blocks unless needed for the task.
- Keep generated outputs (`.next`, `coverage`, Playwright reports, media exports, `supabase/.temp`) out of commits.
- Use commit email `nate@lakeridepros.com` for this nate-a11y/lakeridepros-website repo when committing.

<!-- crystl-cli:begin v2.202.0 -->
@AGENTS.md
<!-- crystl-cli:end -->

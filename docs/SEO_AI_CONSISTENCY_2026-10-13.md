# SEO / AI-search consistency fixes — 2026-10-13

## Scope and release boundary

- Feature branch: `fix/seo-ai-consistency-20261013`, based on remote `main` at `4fa1cee`.
- Original dirty checkout preserved. No Sanity content, production database, payment, payroll, booking, or customer-message writes.
- Preview only. Production promotion requires Nate's approval.

## Changes

- Pricing page remains authoritative. Service fee/cost answers share its copy; fleet pages link to current pricing instead of showing stale CMS prices. Cancellation answers match published terms.
- Pricing regression tests compare rendered cards, visible FAQ answers, and JSON-LD. Service consistency tests protect shared policy/fee answers.
- Sitemap resolves the live Fourthwall catalog at request time, paginates collections, excludes retired Sanity products, follows the upcoming calendar, includes venue pages, deduplicates URLs, and uses genuine modification dates.
- Shop catalog webhooks also invalidate the sitemap. An upstream storefront outage fails the sitemap request rather than successfully advertising a partial product catalog; an intentionally disabled/unconfigured shop omits products.
- Homepage/testimonials use the same full synced Google review summary, not the filtered testimonial subset or a hardcoded count. Testimonials have crawlable 24-review pagination.
- Correct schema logo and stable business identity; remove misleading/self-serving aggregate-rating claims. Product markup uses actual purchasable variants/prices.
- Align crawler exclusions, normalize external event links, label the three audited 2026 seasonal guides historical, and link commercial pages to first-party transportation insights.
- Remove route-wide loading shells for no-JS readability; defer offscreen partner rendering; fix contrast on new links, product text, and the existing chat launcher.

## Verification

- Node 24.21.0: `lint:all`, 106 unit-test files / **785 tests**, TypeScript `--noEmit`, Next production build, and `git diff --check` pass.
- Local sitemap: **254 unique URLs**, current tee included, retired Sanity merch and expired Clint Black event excluded. Every entry crawled: no HTTP/canonical/JSON-LD syntax issues.
- Representative desktop/mobile axe scans pass. Responsive checks at 375/390/768/1024/1440 px show no document overflow in the sampled changed route families.
- Actual remote widget script tested locally with a browser-only localhost allowlist fixture: launcher text is black and axe reports no violations. The real widget origin allowlist remains unchanged.
- Browser submissions blocked. No checkout, payment, booking, chat submission, or database acceptance testing.
- Crystl pattern secret scan passed; stored Crystl-key coverage was unavailable.

## Follow-up / limits

- Verify Preview configuration before shop acceptance: a Preview with storefront disabled or no token cannot validate product inclusion. Do not copy secrets into this document or Git.
- Full multi-browser E2E/accessibility suite, real-device/screen-reader QA, Google-selected canonicals/indexing, authenticated GSC/GA4/GBP, and field Core Web Vitals were not verified. Public PageSpeed was quota-limited; Ahrefs probes lacked plan access.
- Existing dependency install reported 16 advisories (1 moderate, 15 high); no unrelated dependency changes are included.
- Remaining CMS fetch helpers retain their existing empty-data fallback on outages. The storefront checks do not guarantee every upstream system is healthy; monitor sitemap/feeds after release.
- Crawling and truthful content improve readiness, not guaranteed rankings or AI citations. `llms.txt` is an optional directory, not a ranking feature.

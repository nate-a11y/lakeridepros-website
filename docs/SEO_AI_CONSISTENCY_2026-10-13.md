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

- Node 24.21.0: `lint:all`, 106 unit-test files / **786 tests**, TypeScript `--noEmit`, Next production build, and `git diff --check` pass.
- Local sitemap: **254 unique URLs**, current tee included, retired Sanity merch and expired Clint Black event excluded. Every entry crawled: no HTTP/canonical/JSON-LD syntax issues.
- Representative desktop/mobile axe scans pass. Responsive checks at 375/390/768/1024/1440 px show no document overflow in the sampled changed route families.
- Actual remote widget script tested locally with a browser-only localhost allowlist fixture: launcher text is black and axe reports no violations. The real widget origin allowlist remains unchanged.
- Pushed application commit `fb9d9cd`; its automatic Vercel Preview `dpl_9znCbkcTrvuoU2HHW8SZFu8ybeva` is READY. Authenticated GET readback confirms Black $120/hr, 5% fuel surcharge, and 3% card processing disclosures. Preview sitemap has 253 URLs, no expired Clint entry, and no products because Preview storefront configuration is inactive/missing. Local real-catalog sitemap has 254 URLs, including the current tee. Production remains on `4fa1cee`.
- Browser submissions blocked. No checkout, payment, booking, chat submission, or database acceptance testing.
- Crystl pattern secret scan passed; stored Crystl-key coverage was unavailable.

## Follow-up / limits

- Preview shop acceptance remains gated on storefront configuration. Do not copy secrets into this document or Git; no cloud environment or production configuration changes were made.
- Full multi-browser E2E/accessibility suite, real-device/screen-reader QA, Google-selected canonicals/indexing, authenticated GSC/GA4/GBP, and field Core Web Vitals were not verified. Public PageSpeed was quota-limited; Ahrefs probes lacked plan access.
- Existing dependency install reported 16 advisories (1 moderate, 15 high); no unrelated dependency changes are included.
- Remaining CMS fetch helpers retain their existing empty-data fallback on outages. The storefront checks do not guarantee every upstream system is healthy; monitor sitemap/feeds after release.
- Crawling and truthful content improve readiness, not guaranteed rankings or AI citations. `llms.txt` is an optional directory, not a ranking feature.

## Airport geography correction

- Nate flagged the Kansas City route's incorrect closest-airport claim. Commercial airport order for typical Osage Beach/Lake Ozark trips is **COU, SGF, STL, MCI**, with distances/timing dependent on the final Lake address, route, and traffic. Removed claims that MCI is closest/shortest and its unsupported fixed 2–2.5-hour estimate.
- Airport hub and pricing coverage use one ordered airport list; COU is now included in both. Homepage/service coverage and visible/schema airport answers share source copy. Local private airports are explicitly separate from scheduled commercial options.
- Corrected the hub's conflation of Lee C. Fine Memorial (AIZ) with Grand Glaize (K15). These are separate airports, not aliases; removed KOZS from Grand Glaize metadata/copy.
- Regression tests exercise actual rendered pages, ordering, local identities, and visible/schema equality. Sources: [Margaritaville airport location guide](https://www.margaritavilleresortlakeoftheozarks.com/location), [resort airport FAQ](https://www.margaritavilleresortlakeoftheozarks.com/faqs), [City of Osage Beach airport authority](https://www.osagebeach-mo.gov/86/Airports).
- No CMS/production content writes. Destination-specific routing must still be checked when quoting a trip; the ordering is not guaranteed for every address around the Lake.
- Follow-up gates: **107 test files / 790 tests**, lint, typecheck, build, and whitespace checks pass. Pricing, airport hub, and MCI route each pass axe WCAG A/AA at 375 and 1440 px, with no document overflow. Full multi-browser E2E remains unrun.

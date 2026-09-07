# Workbench — lakeridepros-website

## To Do
- [x] Run Crystl Project Optimizer and export/copy the analysis for the agent
  Focus on SEO, content structure, deployment commands, and accessibility checks.
- [~] Audit local SEO and conversion basics
  Check page titles, descriptions, structured data, service areas, CTAs, and trust signals.
- [x] Add a launch QA checklist ⧗2026-09-06T18:46:23-05:00
  Include mobile, accessibility, contact/booking links, analytics, and performance basics.
  > Added docs/LRP_WEBSITE_RELEASE_CHECKLIST.md covering brand/content, SEO/GEO/AEO, mobile/accessibility, GTM/analytics, performance, testing, preview-only deployment, and explicit stop-before-production. ⧗2026-09-06T18:46:24-05:00
- [x] Implement GEO readiness fixes and first-party trip insights ⧗2026-09-03T02:24:58-05:00 #a7c1ff29
  Redirect alternate .store host, reconcile public entity facts, build verified anonymized trip insights, strengthen measurement/content plan, test, and release.
  > 2026-09-03: Built first-party trip insights, published approved local review attribution and operational stories, added AI referral attribution, reconciled public facts/pricing/fleet URLs, and passed lint, 372 unit tests, build, redirect checks, and Chromium Axe. ⧗2026-09-03T02:24:58-05:00

## In Progress
- [x] Build and launch personalized Insider welcome packet ⧗2026-08-04T22:32:49-05:00 #3f4a9a9a
  > 2026-08-04: Deployed personalized welcome page and email to production; sent Sherry proof to nate@lakeridepros.com with contactus CC. Automated new-member delivery remains gated off pending proof approval. ⧗2026-08-04T22:32:49-05:00

## Done
- [x] Updated Sanity packages to v6.2.0 / next-sanity v13.1.1 and verified lint, tests, color audit, and build on 2026-06-29
- [x] Added Crystl local heroes and starter Workbench on 2026-06-22
- [x] Restore Meta Page API and build Facebook-to-GBP draft queue ⧗2026-09-03T03:00:47-05:00 #f40cf605
  Refresh the expired Facebook Page access token, move integration to the current Graph API version, fetch recent Lake Ride Pros posts read-only, deduplicate and date-check them, and prepare Google Business Profile Updates with UTM-tagged CTAs. Require review before publishing.
  > 2026-09-03: Read 100 recent published Facebook posts and created a 10-item GBP draft queue. Durable Meta token/app credential repair remains. ⧗2026-09-03T02:52:18-05:00
  > 2026-09-03: Repaired Website Link app ID/secret pairing, generated a validated long-lived Lake Ride Pros Page token with no reported expiration, updated Vercel Production/Preview/Development secrets, upgraded Graph API calls to v26.0, and verified Page post reads. ⧗2026-09-03T03:00:47-05:00
- [x] Finish homepage SEO, accessibility, performance, and interaction gauntlet ⧗2026-09-06T19:47:03-05:00 #3033c419
  > Homepage and sitewide gauntlet complete: clean production build, 485 unit tests, Chromium accessibility and responsive QA, cached sitemap/fleet prerender fixes, and Webpack Studio regression verification. ⧗2026-09-06T19:47:03-05:00
- [x] Propagate approved editorial system across public route families ⧗2026-09-06T19:47:03-05:00 #15269b5a
- [x] Deploy verified feature branch to Vercel Preview and stop before production ⧗2026-09-06T20:03:52-05:00 #340af571
  > Non-production Vercel Preview dpl_HVQEutNNGVBofsKQzSG2WG3hSEKT is READY. Protected base URL verified; 14-day deployment-scoped shareable link created. Preview route/GTM/mobile/desktop QA passed. No production promotion. ⧗2026-09-06T20:03:52-05:00
- [x] Mobile-first QA across homepage and representative route families ⧗2026-09-06T19:47:03-05:00 #db9de6ed
  Test 375/390/768 widths, touch navigation, sticky/overlay behavior, tap targets, text wrapping, image crops, no horizontal overflow, accessibility, and Core Web Vitals risk before final Vercel preview.
  > Responsive audits covered 320/375/390/768/1024/1440 route families; final homepage desktop + Mobile Chrome suite passed with no overflow or failed images. ⧗2026-09-06T19:47:03-05:00
- [x] Verify GTM coverage across every rendered page ⧗2026-09-06T19:47:03-05:00 #8f396b33
  Keep one GTM container in the root layout; test representative marketing, commerce, events, location, partner, portal, and non-site routes in local production and Vercel preview without duplicate container loads.
  > Local production audit passed on 320/320 rendered routes with one root GTM component; hydrated representative-route checks passed without duplicates. ⧗2026-09-06T19:47:04-05:00

# Workbench — lakeridepros-website

## To Do
- [x] Run Crystl Project Optimizer and export/copy the analysis for the agent
  Focus on SEO, content structure, deployment commands, and accessibility checks.
- [~] Audit local SEO and conversion basics
  Check page titles, descriptions, structured data, service areas, CTAs, and trust signals.
- [ ] Add a launch QA checklist
  Include mobile, accessibility, contact/booking links, analytics, and performance basics.
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

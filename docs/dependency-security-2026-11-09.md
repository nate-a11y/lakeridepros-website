# Dependency security and coverage — 2026-11-09

## Local remediation

- Added a scoped `gcp-metadata → gaxios ^7.3.1` override. This removes the vulnerable `rimraf → glob` chain without downgrading `gcp-metadata` or overriding every consumer of `glob`.
- Upgraded only minimatch's affected v10 consumers to v11.0.5. The named CommonJS API used by Oclif and typescript-eslint remains compatible on Node 24. ESLint's older callable minimatch v3 API is deliberately untouched. Regression tests exercise both interfaces.
- Full npm audit: **28 → 2 affected nodes**, both high, representing the same Inngest/legacy-Zod advisory. No moderate or critical findings remain. This is not a zero-vulnerability or production-acceptance claim.
- Added mocked tests for CMS normalization/failure handling, coordinator/rider privacy, exact optimistic-concurrency payloads, fulfillment retries, notification failures, email escaping, gift-card amounts/shipping/scheduling, billing reconciliation guards, and canonical sitemap URLs. They do not send messages, charge cards, create provider orders, or mutate hosted databases.
- `npm run verify` now executes V8 coverage before the production build. The existing **80% statements/branches/functions/lines thresholds and all coverage exclusions are unchanged**.

## Repo-owned mitigation: Inngest's Zod v3 parser

Inngest 4.26.2 imports `zod/v3` from Zod 3.25.76. The published size-gate fix is in Zod's **v4** parser, not its v3 compatibility layer. A bounded local reproduction with a 100-element array and `.max(2)` visits all 100 element refinements using either legacy v3 implementation; patched v4 visits zero. All three reject the input, but only v4 rejects it before walking the elements.

Therefore, forcing Inngest onto Zod 4.6.7 while retaining its `zod/v3` imports would clear version-based audit output without fixing the demonstrated behavior. No such override, audit suppression, or forced SDK downgrade was applied. Nate selected the repo-owned patch option on 2026-11-09. Initial implementation was local and paused. Nate subsequently authorized shipping and reconciliation on 2026-11-09; see release status below.

### Patch scope and maintenance

- `scripts/patch-inngest-zod.mjs` patches only Inngest **4.26.2**'s private Zod **3.25.76**: ESM `v3/types.js`, CommonJS `v3/types.cjs`, and the `@zod/source` export `src/v3/types.ts`. Root Zod 4 is untouched. No new patching dependency or platform-specific executable is required.
- Backports early upper-bound rejection for arrays (`max`/`length`) and sets (`max`/`size`). Too-large inputs reject before element parsing or outer refinements. Lower-bound behavior remains intact.
- Inngest itself uses **unbounded arrays**, so size gates alone do not fix its observed error amplification. Array parsing now stops on the first invalid element, including refinement failures, while retaining the input snapshot and successful transformed values. Async array parsing is sequential rather than eager/concurrent. This deliberately changes invalid error aggregation and async scheduling; it does not introduce arbitrary event-count limits.
- Exact pristine and patched SHA-256 hashes are checked before any writes. Unknown bytes, package versions, or dependency layouts fail installation/build. Already-patched files are accepted idempotently. `postinstall` reapplies after `npm ci`; `prebuild` repeats the guard before bundling. Inngest is pinned to its tested version. Do not bypass failed hooks or regenerate hashes merely to allow an upgrade.
- **Raw npm audit still reports two high entries** because installed package versions remain truthful. This is a targeted local mitigation, not an upstream fix, scanner suppression, or general resource-exhaustion guarantee. Very large valid inputs/input snapshots and failures inside a single complex element still consume resources; normal body-size/rate controls remain necessary.
- Remove the installer, hooks, and exact SDK pin only after an upstream supported implementation passes the same behavioral/SDK tests. Any SDK or private-Zod update requires explicit patch review, not a blind dependency bump.

### Behavioral evidence

- Before the patch: **12 of 15** behavioral tests fail. The SDK's real `parseFnData` produces a **182,144-character** error for 1,000 malformed events. A 100-element `.max(2)` array still runs every child refinement.
- After the patch: both runtime formats reject oversized arrays/sets without walking elements and stop malformed unbounded arrays at the first error. The SDK parser preserves ordinary execution payloads; its malformed-event error stays below 3,000 characters. Valid 5,000-item arrays, transforms, sparse optional arrays, lower bounds, input snapshots, and successful async parsing are covered.
- SDK event-send contract is tested with a mocked transport only. Installer tests cover idempotence, package-version drift, hoisted dependencies, byte drift in all three files, and nonzero CLI failure. No real event, email, payment, order, or hosted database mutation is made by these tests.

## Release reconciliation

The approved release branch is based on fetched remote main **`1f2abb323aa80d9341c7bb8aaf00f6e1211a65f2`**, preserving the SEO changes from **`a6527d0`**, merged in [PR #477](https://github.com/nate-a11y/lakeridepros-website/pull/477). The old shared dirty checkout remains untouched. Reconciliation retains the SEO tree, Fourthwall storefront/cart/invoices, deployed Stripe `2026-09-30.endive` requests with card-only `allowed_payment_method_types`, and every prior security override floor. The new Stripe SDK type-date mismatch is documented without changing requests. Duplicate/superseded old-checkout fixes were not reapplied.

## Initial pre-reconciliation verification

- Local coverage: **85.50% statements, 80.07% branches, 83.62% functions, 88.40% lines**; **97 files / 827 tests** pass. The 24 new patch/installer tests include the source-condition export.
- Clean `npm ci` applied all three patched files; a repeat applied zero. Complete dependency tree, install-script review, strict accessibility lint, project TypeScript, standalone strict compilation of the patched Zod source, and `npm run verify` (coverage plus production build) pass. Built server source maps contain the exact hash-verified patched ESM source.
- Post-patch guarded browser matrix: **290 passed / 15 existing full-audit skips / zero failures**, across Chromium, Firefox, WebKit, Mobile Chrome and Mobile Safari (2.5 minutes). Live payment/provider jobs and physical-device acceptance remain separate.

## Upstream evidence

- [Zod advisory GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)
- [Upstream v4 size-gate fix](https://github.com/colinhacks/zod/commit/a0ebf970f2d752e5f58527cd2942ff48be4f46bd)
- [minimatch advisory GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
- [glob advisory GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)

## Reconciled release gate

- Release branch `release/dependencies-zod-20261109`, isolated worktree `/Users/natebullock/Projects/lrp-dependencies-release-20261109`, based on SEO main `1f2abb3`. Nate authorized production shipping after reconciliation; no unrelated dirty checkout files are included.
- Additional mocked tests cover Camden CSRF/origin, OTP/HMAC/rate/Turnstile boundaries, HTML email/feed rendering, fleet/venue media and redirects, mobile header/gallery controls, welcome-profile reads, billing identity guards, and bounded Fourthwall pagination/failures. No real provider sends, billing writes, or hosted database mutations. Existing Stripe/Fourthwall/invoice contracts are preserved.
- Full gate passes **138 files / 1,191 tests**. Coverage: **86.36% statements, 80.11% branches, 84.08% functions, 88.82% lines**; unchanged 80% gates/exclusions. Clean install, complete dependency tree, lint, strict accessibility lint, TypeScript and production build pass.
- Full npm audit remains **two high entries from one private-Zod advisory**, zero moderate/critical. The scoped local mitigation and maintenance limits above remain in force. Guarded reconciled browser suite: **285 passed / 15 existing full-audit skips / zero failures**, across all five browser/mobile projects. Preview/production readbacks are recorded separately after deployment.

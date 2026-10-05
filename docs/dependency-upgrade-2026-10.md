# Website dependency upgrade — 2026-10-04

## Scope

- Local upgrade based on production-source commit `62c5e91`; no production deployment, database writes, payment requests, email sends, or provider-account configuration changes.
- npm 12.2.0 and repository-pinned Node 24.16.0; runtime engines unchanged.
- Refreshed all direct packages with available compatible releases, including supported major upgrades. Keep Remotion, React/React DOM, Next/Next ESLint config, and Vitest/coverage packages aligned.
- Updated the OpenTelemetry override family coherently; retained Babel 7 and other major-version compatibility overrides instead of forcing consumers onto incompatible transitive APIs. Added patched adm-zip 0.6.1 override.

## Direct upgrades

| Package | Before | After |
|---|---|---|
| `@remotion/bundler` | ^4.0.520 | ^4.0.532 |
| `@remotion/renderer` | ^4.0.520 | ^4.0.532 |
| `@sanity/client` | ^8.4.0 | ^8.9.0 |
| `@sanity/vision` | ^6.12.0 | ^6.17.0 |
| `@supabase/ssr` | ^0.12.5 | ^0.12.7 |
| `@supabase/supabase-js` | ^2.114.0 | ^2.117.2 |
| `framer-motion` | ^13.2.0 | ^14.0.0 |
| `googleapis` | ^178.0.0 | ^183.0.0 |
| `inngest` | ^4.19.0 | ^4.21.1 |
| `lucide-react` | ^1.39.0 | ^1.52.0 |
| `next` | ^16.3.4 | ^16.3.8 |
| `nodemailer` | ^9.1.1 | ^10.0.14 |
| `react` | ^19.2.8 | ^19.3.0 |
| `react-dom` | ^19.2.8 | ^19.3.0 |
| `react-hook-form` | ^7.87.0 | ^7.89.0 |
| `remotion` | ^4.0.520 | ^4.0.532 |
| `resend` | ^6.25.0 | ^6.32.0 |
| `sanity` | ^6.12.0 | ^6.17.0 |
| `sharp` | ^0.35.4 | ^0.35.5 |
| `stripe` | ^22.6.1 | ^23.0.0 |
| `zod` | ^4.5.4 | ^4.6.5 |
| `@playwright/test` | ^1.62.1 | ^1.63.0 |
| `@testing-library/dom` | ^10.4.1 | ^10.4.2 |
| `@types/node` | ^26.4.1 | ^26.6.4 |
| `@types/react` | ^19.2.18 | ^19.3.0 |
| `@types/react-dom` | ^19.2.5 | ^19.3.0 |
| `@vitest/coverage-v8` | ^4.1.11 | ^5.0.3 |
| `eslint-config-next` | ^16.3.4 | ^16.3.8 |
| `happy-dom` | ^20.13.2 | ^20.14.5 |
| `msw` | ^2.15.0 | ^3.0.2 |
| `tsx` | ^4.23.13 | ^4.23.15 |
| `vite` | ^8.2.2 | ^8.3.2 |
| `vitest` | ^4.1.11 | ^5.0.3 |

## Compatibility fixes

- Register the existing Next ESLint plugin instances for globally configured rules. Fixes the missing accessibility-plugin error for config/script files without redefining Next's wrapped plugins or relaxing rules. Regression tests verify TSX/MJS/CJS config loading and rejection of an image without alt text.
- Vitest 5: use jest-dom's Vitest entrypoint and augment `@vitest/expect`'s generic assertion interface for matcher types. Existing test isolation/coverage thresholds remain unchanged.
- Stripe 23: pin request API version `2026-09-30.endive`; card-only Checkout now uses `allowed_payment_method_types`. Retrieve only expandable line-item fields; read Endive `collected_information.shipping_details` with legacy `shipping_details` fallback. Mocked tests cover digital gift-card amounts, merch card restrictions, and both shipping response shapes.
- The local API-version change does not update the Stripe account or webhook endpoint configuration. Real sandbox checkout/fulfillment and webhook replay remain separate release validation, not proved by mocked tests.
- Browser QA exposed a Safari dropdown activation bug: a null-target blur could unmount the destination link before its click. Preserve the menu through that blur; real external focus changes, clicks, mouse-leave, and Escape still close it. Unit regressions cover both blur shapes and Escape; real browser tests cover navigation/focus restoration. Use macOS WebKit's Option-Tab to navigate links, with an explicit focus assertion rather than assuming plain Tab includes links.
- Updated stale browser expectations to match the deliberate hidden-empty-cart behavior and explicitly verify the supported empty-catalogue shop state. Populated catalogue/product detail is still tested when available; this credential-free run does not cover live product detail or provider checkout. No accessibility assertions were removed.

## Intentional holds

- ESLint 9.39.5: latest `eslint-plugin-jsx-a11y` 6.10.2 declares support only through ESLint 9. Do not use peer-ignore/force to hide that mismatch.
- TypeScript 6.0.3: current typescript-eslint 8.71.0 requires TypeScript `<6.1`. TypeScript 7 remains unsupported by this lint chain.
- A fresh `npm outdated` reports only those two direct packages; all other direct packages match the registry's latest tags.

## Verification

- Clean `npm ci` and `npm ls --depth=0` passed; no invalid direct dependency tree. npm reports no unreviewed install scripts.
- All unit tests passed: 726 across 99 files (including new regression coverage).
- TypeScript check, all repository lint/copy/color audits, and strict accessibility lint passed.
- Production build passed locally using public CMS reads, internal demo flags, and a loopback synthetic Supabase auth configuration. No production credentials were used; this is not production-auth proof.
- Coverage run passed the tests but failed the unchanged 80% thresholds: statements 71.47%, branches 65.26%, functions 69.96%, lines 73.76%. Historical coverage debt remains; thresholds were not lowered.
- Full browser matrix passed: 285 tests and 15 pre-existing intentional skips across Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. Uses isolated local port 3108 and a task-specific browser cache because another installer holds the shared cache lock. Sandbox launch failures were retried outside the sandbox, not treated as app failures. The temporary port/config is QA-only and is not committed.

## Remaining security risk

- Fresh lockfile audit improved from 26 affected package nodes (including one critical) to 14 high-severity affected nodes; production dependency audit still reports 12 high-severity nodes. These are dependency-chain findings, not evidence of exploitation or 14 distinct vulnerabilities.
- All remaining findings trace to [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) in `braces` through 3.0.3. The reviewed advisory lists no patched release. Sanity/glob/Next ESLint chains inherit it.
- Do not use audit `--force`: npm proposes unrelated Next/Sanity downgrades rather than an upstream braces patch. Recheck the advisory and registry before publication; evaluate reachability/mitigation separately if no patch is available.

## Sources

- [Next upgrade guide](https://nextjs.org/docs/app/getting-started/upgrading)
- [Vitest 5 migration](https://vitest.dev/guide/migration)
- [Stripe SDK changelog](https://github.com/stripe/stripe-node/blob/master/CHANGELOG.md)
- [Motion upgrade guide](https://motion.dev/docs/upgrade-guide)
- [Apple Safari keyboard navigation](https://help.apple.com/safari/mac/8.0/en.lproj/cpsh003.html)
- Live npm package metadata and lockfile audits on 2026-10-04.

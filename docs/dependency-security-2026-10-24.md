# Targeted dependency security updates — 2026-10-24

## Scope

- Based on current main `ee4d65e789fc9e82766c6db348b8fc13b119f83a`, isolated in `fix/dependency-security-20261024`.
- Dependency manifest/lock updates only; no application behavior, auth schema, service/provider settings, CMS content or production data changes. Initially prepared for local review only; Nate separately authorized publication with “ship it” on 2026-10-25. Final deployment evidence is recorded in Nate OS.
- Preserve the dirty primary checkout. No `npm audit fix --force`, forced major downgrade, broad latest-version sweep, new direct dependency, or install-script policy relaxation.

## Changes

| Package | Before | After |
|---|---|---|
| Next.js / eslint-config-next | 16.3.8 | 16.4.3 |
| DOMPurify override | 3.4.16 | 3.4.17 |
| Zod v4 | 4.6.5 root / 4.5.4 Remotion copies | 4.6.7 throughout v4 consumers |
| Undici v7 override | 7.30.0 | 7.30.1 |
| fast-uri v3 | 3.1.8 | 3.1.9 |
| Nodemailer | 10.0.14 | 10.2.1 |
| Happy DOM | 20.14.5 | 21.0.4 |
| Vite | 8.3.2 | 8.3.5 |

- `zod@^4.0.0: $zod` applies the patched root v4 version only to v4 consumers, including exact older Remotion pins. It does not force v3 consumers across a major version.
- `fast-uri@^3.0.0` keeps the existing v3 consumers on the patched v3 line rather than upgrading to v4.
- Vite's required Rolldown/OXC/native binding updates and Next's matching SWC/plugin/env package updates are the only other version changes; five obsolete nested v4 Zod copies were deduplicated. `npm ls` reports no invalid selected dependencies.
- Retain the existing sharp 0.35.5 image-optimization workaround. No unrelated React, Stripe, Sanity, ESLint-major or TypeScript-major updates.

## Audit outcome

Fresh full and production dependency audits: **23 affected dependency names → 2 high**, with **0 critical, 0 moderate** remaining. Counts represent dependency names/parents, not independent exploitable website vulnerabilities.

### Residual SEC-003: Inngest requires Zod v3

- Remaining findings are **one underlying Zod advisory**, propagated to `inngest` and its nested `zod@3.25.76`.
- Current Inngest 4.21.1 imports `zod/v3` internally (`components/InngestCommHandler.js:23`, `helpers/functions.js:6`). The registry manifest for the newer 4.26.0 release still declares `zod: ^3.25.0`; upgrading that parent alone does not eliminate the advisory.
- The advisory currently lists affected versions below 4.6.6 and provides no supported patched v3 line. Do not override this dependency to v4 merely to make audit output green, suppress the advisory, or accept npm's proposed Inngest 0.3.0 downgrade.
- Inngest remains unchanged in this patch. Follow up when upstream ships a compatible fix, or separately approve a reviewed SDK replacement/migration. The retained dependency is a documented unresolved risk, not proof of exploitation or a fully remediated audit.
- [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [Inngest 4.26.0 manifest](https://registry.npmjs.org/inngest/4.26.0).

## Verification

- Node 24.16.0 / npm 12.2.0. Initial dependency resolution used `npm install --ignore-scripts`; clean normal `npm ci` passed using the unchanged reviewed allowScripts policy.
- Patched-version assertions checked every resolved selected package and every v4 Zod copy; independently asserted that the single Inngest Zod v3 copy remains v3. `npm ls` passed with no invalid selected dependency versions.
- Final full `npm run verify` passed (exit 0): all linters/copy/color audits, **111 unit-test files / 795 tests**, Next production build and TypeScript. Tests use Happy DOM 21.0.4 and Vite 8.3.5.
- Next 16.4.3 production build/TypeScript passed using only public read-only Sanity content, local synthetic Supabase configuration, and existing Insider internal/demo flags. An initial no-Supabase-config build failed before using the required local placeholders; no production credentials were copied or supplied for this local validation.
- Synthetic driver-application PDF generation passed: PDF signature, nonzero bytes and multiple pages verified using fake data.
- Browser regressions: **285 distinct tests passed across Chromium, Firefox, WebKit, Mobile Chrome and Mobile Safari**. The initial full matrix passed 228 tests outside Firefox; Firefox initially could not launch because its pinned revision was missing. Installed the exact required Firefox 1543 revision and reran its full project: 57 passed. The existing 15 intentional full-page axe scan skips (3 per project) remain unchanged; ordinary accessibility/keyboard/contrast checks ran. No app/test code or assertions were changed.
- Coverage and real-provider/payment/webhook/OTP/physical-device validation were not run; all provider-action checks used existing local mocks/demo flows. Existing coverage thresholds were not changed.
- No real SMS/OTP, email, billing transaction, webhook, database or CMS mutation attempted. No incident investigation, malicious live vulnerability probe or penetration test.

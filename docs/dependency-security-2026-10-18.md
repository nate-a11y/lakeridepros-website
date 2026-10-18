# Targeted dependency security patches — 2026-10-18

## Changes

- `source-map-js`: **1.2.1 → 1.2.2**, fixing indexed source-map offset denial of service ([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)).
- `postcss-selector-parser`: **7.1.4 → 7.1.6**, fixing quadratic selector parsing / CPU exhaustion ([GHSA-rj75-hqrm-r3gf](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf)).
- Only these two package-lock entries changed (versions, registry URLs, integrity hashes). No manifest ranges, install-script permissions, npm security policy, Sanity versions, or application code changed.
- Targeted command: `npm update source-map-js postcss-selector-parser --ignore-scripts`, followed by a clean `npm ci` using the existing reviewed `allowScripts` policy.

## Audit result

- Production dependency audit: **14 affected packages (13 high, 1 moderate) → 12 high**.
- Full dependency audit: **16 affected packages (15 high, 1 moderate) → 14 high**.
- Both fixed advisories are absent from fresh full and production audit reports. All remaining findings propagate from **one** unpatched `braces` advisory, not 12/14 independent issues.

## Residual finding SEC-003 — unpatched braces 3.0.3 (High)

**Impact:** If an attacker-controlled deeply nested glob pattern reaches the affected parser, it can exhaust the stack and terminate that Node.js process. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) currently lists no patched release; registry latest is still 3.0.3.

Evidence and bounded reachability assessment:

- `package.json:77` keeps Sanity 6.17.0. Its CLI dependency pulls in `@sanity/codegen@8.1.1`, `chokidar@3.6.0`, `globby`, and ultimately `braces` (locked near `package-lock.json:14352`). Related parents inherit the audit warning.
- Installed `@sanity/codegen/dist/actions/typegenWatch.js:53-88` takes the watch patterns from the local typegen config and working directory, then invokes chokidar. `dist/typescript/findQueriesInPath.js` uses globby to discover local query files.
- No direct imports of braces, chokidar, globby, micromatch, or Sanity codegen were found in application/API/component/Studio/script source. No project script exposes type generation as a public HTTP action.
- The prior production build's 165 server trace manifests contained no external braces, chokidar, Sanity codegen, or Sanity CLI package files. External trace absence alone cannot prove no bundled code or exploitable path exists.
- This is a focused dependency assessment, not a penetration test, incident investigation, or complete bundle/reachability proof.

Disposition: retain current supported Sanity versions; do not force npm's proposed major downgrades merely to remove inherited warning counts. Keep CLI/type-generation configuration developer-controlled, do not feed untrusted patterns into these tools, and revisit when upstream provides a supported fix. No custom vendor fork or global audit suppression introduced.

## Verification

- Clean install and exact lockfile diff checked; every installed occurrence of the two patched libraries resolves to its patched version.
- Local smoke checks: valid CSS selector round-trip and source-map generation/lookup round-trip.
- Full project gate passed: `npm run verify` (all documented linters, **109 files / 792 tests**, production build).
- No production database, CMS content, payment provider, webhook configuration, or customer messages changed.

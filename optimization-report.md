# Optimization Report: lakeridepros-website

Health: **high** | files: high, content: high, code: medium, setup: high

## High Priority

- **2 files over 1000 lines** — page.tsx, page.tsx
  - Suggested: File Size Limit

## Medium Priority

- **13 files over 500 lines** — page.tsx, page.tsx, ShopClient.tsx
  - Suggested: File Size Limit
- **1 stale path in CLAUDE.md** — Referenced paths that no longer exist confuse agents.

## Low Priority

- **No Claude slash commands in this directory** — Project-local commands (.claude/commands/) give agents repeatable, triggerable shortcuts like /test or /deploy.
- **No .claude/rules/ in this directory** — Rule files keep instructions modular with optional path-scoping for monorepos.
- **No .claude/settings.json in this directory** — Project-local settings.json shares tool allow/deny rules, hooks, and per-gem plugin overrides with everyone who clones the repo.
- **No known issues or gotchas section** — Without documented pitfalls, agents will hit problems by trial and error.
- **supabase project — install plugin** — Supabase docs + project introspection (auth, RLS, edge functions).
- **stripe project — install plugin** — Stripe integration patterns + API selection guidance.
- **resend project — install plugin** — Resend email API — send / receive, DKIM, and integration helpers.
- **sanity project — install plugin** — Sanity content platform — GROQ queries, schemas, and Studio config helpers.

---

Fix these issues in CLAUDE.md (or the relevant agent file) and re-run the optimizer to verify.

# Participant snapshot scope and performance

## Behavior
- The website coordinator view defaults to **Approved for transportation**. **All participants** is an explicit opt-out; date filters retain the selection.
- Scope is applied in the database's eligible-rider query before metrics, locations, or roster enrichment. Missing/pending/suspended/not-needed eligibility is excluded from the approved subset.
- This is independent of portal access and rider account status. No approval or roster records are changed.
- Rider self-history and LRP Bolt's existing two-argument snapshot RPC retain their existing behavior.
- Coordinator request details include the authorized participant's phone below their name. It is omitted from rider-shaped responses and missing/invalid values do not create a phone link.

## Database rollout
- Migration: `supabase/migrations/20260905062855_camden_approved_snapshot_scope.sql` (applied to the shared production database).
- Adds an expression index for normalized trip passenger phones and two private scoped snapshot implementations. Direct execution is revoked from API roles; the existing session-validating gateway is the only exposed path.
- The gateway patch fails closed if its expected snapshot branch has changed. Session/role validation and all other operations are preserved.
- The gateway's approved default also supports older website deployments; the website release adds the explicit all-participant filter.
- Future changes to core snapshots or roster fields must update their scoped equivalents as well. Public LRP Bolt RPC behavior is intentionally unchanged.

## Verification
- Baseline production query: 47 participants, approximately 8.3 seconds. After migration: 9 approved participants in approximately 51 ms; all 47 in approximately 46 ms. These are database round trips, not full-page load benchmarks.
- `supabase/tests/camden_approved_snapshot_scope_test.sql` is a read-only parity/privacy/privilege regression test. Run as migration owner against a seeded database with an approved coordinator and an active rider; no participant PII is printed.
- Isolated PostgreSQL synthetic tests covered every eligibility status plus a missing roster, gateway default/opt-out, exact metrics parity, unchanged pending-rider self-history, and denied direct execution.
- Unit and browser tests cover query validation/forwarding, retained date/scope filters, demo parity, coordinator-only phone display, missing/invalid phones, desktop/mobile layout, and no horizontal overflow.

## Rollback
- Prefer reverting the gateway's participant-snapshot branch to the existing `public.camden_participant_snapshots(date,date)` call, preserving all other branches and session/role checks.
- Leave the harmless expression index and unused private scoped functions in place during rollback. No data restore is needed.
- Revert the website filter UI if rolling back the gateway so the UI does not imply filtering that is no longer applied. The participant-phone change is independent.

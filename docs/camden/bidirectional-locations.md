# Camden request locations and synced Moovs routes

## Behavior
- Both pickup and destination selectors offer the selected rider's approved private locations plus approved shared program locations.
- Coordinator selection changes clear **both** endpoints. Homes are never added to the shared destination catalog.
- Exact name/address duplicates (case/whitespace normalized, ownership scope preserved) collapse within each selector. A previously selected ID wins when duplicating a request. Different units, names, or street suffixes remain distinct.
- Request detail labels the original **Requested route** separately from each linked trip's **Moovs pickup / Moovs drop-off**. Missing synced addresses are explicitly unavailable, never filled from the request. Costs remain hidden from riders.

## Database change
`supabase/migrations/20260909012351_camden_bidirectional_locations.sql`:
- Backfills a private endpoint-ID registry from the two existing location tables. Source rows, IDs, approvals, and existing request rows are preserved.
- Replaces directional request foreign keys with registry foreign keys; source references and deletion protection remain enforced. Insert triggers register future approved/pending locations without publishing them.
- Validates approval, active status, and rider ownership for either endpoint in submit/edit RPCs and a defensive table trigger. Historical routes remain readable when a location is retired.
- Patches the four deployed request projections (portal dashboard, session gateway, coordinator dashboard, Bolt workspace). Authorization, audit/notification logic, and all unrelated gateway operations are preserved. Expected-fragment checks fail closed on function drift.
- Registry/view/helpers have no API-role access. The private view is security-invoker.

## Rollout / rollback
- **Status: migration and duplicate cleanup applied to production on 2026-09-08 (America/Chicago); website deployed to the feature-branch preview, not production.**
- Apply the database migration **before** deploying the form. Old clients continue to submit their original home-to-facility routes.
- Do not restore the old directional foreign keys after reverse-direction requests exist. Prefer a forward fix or roll back the new form while keeping bidirectional database readers and constraints.
- Schema belongs to the shared website / LRP Bolt Supabase project. Existing Camden foundation migrations live in `~/Projects/lrpbolt/supabase/migrations`; newer website migrations must also be present in the isolated test database.

## Verification
- Combined-release verification: 548 tests passed; full ESLint and production build (including TypeScript) passed.
- `supabase/tests/camden_bidirectional_locations_test.sql`: synthetic, rollback-only PostgreSQL regression covering both directions, duplicate/edit/round-trip preservation, gateway/dashboard/coordinator/Bolt routes, coordinator on-behalf submissions, units, unauthorized/unapproved/inactive/nonexistent endpoints, direct-write ownership enforcement, private API permissions, retired-location history, and reference deletion protection.
- Ran against PostgreSQL 17 in a network-isolated OrbStack container using existing Camden migrations and the current deployed request-function definitions (schema/code only, no production participant data).
- Separate seeded-baseline migration check preserved every preexisting request/home/facility JSON row and backfilled every source ID.
- The older Bolt foundation test has a pre-staff-UAT assertion forbidding *any* identity-to-Auth FK; it stops on the later intentional staff link, so it is not a current verification gate for this change.

## Duplicate catalog findings (read-only production check, 2026-09-08)
- Compass Health Camdenton and Eldon each have two identical location records assigned to **TREATMENT** and **APPOINTMENTS**. The former selector omitted category, so these appeared identical.
- Resolved: Nate confirmed **1091 Midway Dr, Linn Creek, MO 65052**. Corrected the one production Linn Creek record with the `Rd` suffix; both category records now have the confirmed address. Verified all other business fields were unchanged. The pending dropdown release will collapse the now-identical choices.
- No source records were deleted, merged, or deactivated. Only the confirmed Linn Creek street suffix was corrected after the initial read-only diagnosis.

## Combined release
- Nate authorized the combined branch push, then explicitly authorized the production migration and deduplication on 2026-09-08. Both database steps are complete. Website production promotion remains separate.
- Approved consolidation: keep the three TREATMENT Compass Health entries as canonical (the participant editor requires that category); retire the identical APPOINTMENTS entries. Locations stay available independently of ride type.
- Production rollback rehearsal passed: three redundant choices retired, one request's destination reference repointed to its identical canonical facility with a version increment and internal audit event, zero participant assignment changes. Every other request/location field was verified unchanged. **Rehearsal rolled back, then committed after fresh guards passed at release.**
- Release script: `scripts/camden/deduplicate-compass-locations.sql`. Defaults to rollback; `apply_changes=true` explicitly commits. Recheck usage at release; guards intentionally stop if reference counts/addresses/assignments changed.
- The earlier user-confirmed Linn Creek `Rd` → `Dr` correction is already live. The duplicate cleanup and bidirectional production migration are now live. Website changes are included in commit `1632159` on `feat/sitewide-lrp-redesign`.

## Production verification — 2026-09-08
- Supabase recorded migration version `20260909012351`; local filename matches remote history. Registry includes all 71 source locations, both endpoint FKs validated, and all six submit/edit/read functions reference the bidirectional view.
- Three duplicate facilities inactive; three approved active Compass Health facilities; zero requests reference the retired IDs. Four existing requests remain. Cleanup transaction checked unrelated request/location fields and preserved all participant assignments; only one canonical destination reference, version/timestamp, and internal audit event changed.
- API roles cannot access the private registry/view or validation trigger. Security advisor reports expected deny-all RLS/no-policy information for the private registry. Unrelated shared-project security findings remain outside this release scope.
- Preview deployment `dpl_F3sxg8kDwYsaHS2NP3vCvcR5kcGH` reached READY for `1632159`. Production website/main not changed.

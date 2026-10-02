# Camden coordinator invoices — website/backend contract

Production website release authorized and deployed on 2026-10-02. Nate explicitly approved both ends with sending enabled; the earlier local-only scope below is historical. Shared backend and staff releases remain owned by lrpbolt Opal. Deployment authorization does not authorize an actual invoice email or customer publication as a test.

## Existing authorization boundary

Use the existing opaque HttpOnly Camden session, not external-user Supabase Auth. Website calls the fixed `camden_portal_gateway` RPC with its server-only transport credential and `p_session_token`. Both new operations must validate unexpired, active coordinator identity and derive Camden program access from that identity; never accept caller-supplied program/rider/storage paths. A transport credential alone must not authorize a statement.

## Proposed gateway reads

1. `p_operation: coordinator_invoices`, `p_payload: { limit: 50, offset: 0 }`
   Response: `{ invoices: PublishedStatement[], has_more: boolean }`. Order by `period_start DESC, sent_at DESC, document_version_id DESC`; page size capped at 50. Include only validated, explicitly published snapshots eligible for coordinator access, with send acceptance recorded. No drafts/unvalidated versions, recipient addresses, staff findings, storage paths, or document URLs. Previous published revisions remain immutable and readable; do not silently substitute the newest PDF for an older version.
2. `p_operation: coordinator_invoice_document`, `p_payload: { invoice_id: UUID, document_version_id: UUID }`
   Response: one `PublishedStatement`. Recheck exact version's publication and scope every time. Missing, draft, unpublished, revoked, or out-of-scope IDs return indistinguishable not-found. No storage location returned.

`PublishedStatement` fields (snake_case):
```ts
{
  id: UUID; // invoice record
  document_version_id: UUID;
  invoice_number: string;
  period_start: "YYYY-MM-01";
  period_end: "YYYY-MM-DD"; // final day of same calendar month
  total_cents: number; // integer, financial authority's snapshot; no UI recalculation
  currency: "USD";
  publication_status: "published";
  validated_at: ISO8601WithTimezone;
  sent_at: ISO8601WithTimezone; // provider send acceptance, not inferred delivery
  published_at: ISO8601WithTimezone;
  content_sha256: string; // lowercase SHA-256 of exact immutable PDF emailed
}
```

## Proposed backend PDF read

`POST /functions/v1/camden-invoice-document` (read-only)
- Server-only website transport: `Authorization: Bearer <existing Camden server credential>`; JSON `{ session_token, invoice_id, document_version_id }`.
- Backend independently validates the opaque session, coordinator/program scope, publication, validation, and exact immutable version; no generic privileged storage proxy. Opal owns private storage/RLS authorization; website must NOT use service-role Storage downloads, public URLs, or caller-supplied paths.
- Return raw `application/pdf` bytes identical to that version's email attachment, maximum 20 MiB, `Cache-Control: private, no-store`. Never redirect or return signed/public URLs. No JSON error diagnostics containing PII or secrets.
- Status 401 invalid/expired session; 403 inactive/non-coordinator; 404 indistinguishable absent/unpublished/out-of-scope version; 503 unavailable.
- Website verifies PDF signature and SHA-256 against authorized gateway metadata before responding. Endpoint is a read: no generating, sending, publishing, or invoice mutations.

## Website routes

- Private page `/camden-county/invoices`, server guard requires coordinator session; nav visible only for coordinator.
- `GET /api/camden/invoices?offset=0` → allowlisted camelCase DTO plus `hasMore` (50 per page).
- `GET /api/camden/invoices/:invoiceId/versions/:versionId/document` → inline PDF; `?download=1` → attachment. Both enforce session+coordinator guard; identical bytes and authorization. All success/error responses private/no-store, no index, nosniff, Cookie vary. No credential/URL/PII logging.

## Publication acceptance prerequisites (Opal-owned)

Send & Publish must retain and expose the exact validated immutable PDF/version used for email; email delivery status is separate from send acceptance and publication. Revised source requires a new validated version, not overwriting an object. Tests must cover drafts, mixed programs, inactive/revoked sessions, IDs/version mismatches, unchanged attachment hashes, and private storage access. This website contract deliberately fails closed until backend reads exist and agree.

## Local compatibility checkpoint — 2026-10-02

Read-only inspected Opal's workflow, actual migration, and document handler. The migration was renamed during this check from the supplied `20261002053000` path to `supabase/migrations/20261002052247_camden_invoice_workflow.sql`; the current workflow doc names the latter. No shared backend/migration edits made.

- Executed the actual migration in a fresh socket-only disposable PostgreSQL cluster using the backend's existing minimal prerequisite/session test harness. Synthetic records only: 52 published versions plus draft/revoked fixtures; no email workflow/provider call.
- Six temporary cross-repo compatibility checks passed: real gateway JSON/timestamps accepted by website schema; 50+2 published history pages without duplicates/private fields; active coordinator plus authenticated server transport through the actual backend PDF handler; exact inline/download bytes and hash; wrong role/expired/suspended sessions denied; draft/revoked/mismatched IDs denied before storage. The final rerun also confirmed the externally updated pagination ceiling (50,000) and deliberately reproduced the remaining suspended-access status difference below.
- Website RPC transport was adapted to local `psql`; backend transport guard and PDF handler were real modules. Storage download was an in-memory synthetic PDF, and the prerequisite harness uses a minimal SQL session fixture rather than the full existing OTP/hash/idle-session implementation. This is authenticated fixture-level integration, **not** full Next.js → Supabase HTTP/Edge JWT/private Storage/real coordinator login acceptance.
- Disposable cluster and temporary repo test were cleaned up. The migration changed externally between the first check and follow-up; the final rerun used a fixed snapshot of the updated migration and both shared hashes were stable across that rerun. Existing focused 39-test suite rerun separately. No source fixes, push, deployment, production operations, or real sends.

### Remaining website status-mapping difference

- Existing website `callCamdenGateway` maps SQLSTATE42501 `Portal access suspended` to `unavailable`, so invoice BFF returns **503**, not **403**. Actual backend PDF handler returns403 correctly. No unauthorized data is returned, but the website should classify suspended coordinator access explicitly. This message also exists in the full original gateway, so the finding is not merely a fixture wording difference. No source fix applied under this check-only task.
- Initial pagination mismatch was corrected externally in the backend during the check. Final migrated SQL accepts offsets10050 and50000; website rejects50050. Both bounds now match **50,000**. The six-test rerun against the updated migration passed.

### Exact remaining release prerequisite

After the website suspended-access error mapping is corrected, exercise an isolated full local/staging stack with synthetic data and sends disabled: real Camden opaque cookie/session issuance and hash/idle/revocation checks; actual Supabase RPC HTTP and Edge JWT/server transport; actual private Storage download and direct anonymous/authenticated Storage denial; exact published-version View/Download hash, older history, draft/revoked/mismatched-ID denial, and session revocation between metadata and PDF fetch. Backend migration must be reviewed against the existing gateway and policies, not only the minimal prerequisite harness. Obtain separate release approval before production migration/function deployment/site release; any real email/send remains separately authorized.

## Alignment follow-up — 2026-10-02

Supersedes the remaining mapping finding above: the existing gateway now maps SQLSTATE42501 `Portal access suspended` and `Coordinator access required` to forbidden, including suspension during `current_context` before invoice reads. Expired/missing sessions remain unauthorized; unrelated database errors remain unavailable. New real-gateway/error-response regressions prove private HTTP403 without diagnostic leakage. No earlier website work was reverted.

- Focused invoice suite: 46 tests passed. Full website suite on the repository-pinned Node24.16.0: 95 files / 686 tests passed. Scoped ESLint and TypeScript check passed. A preliminary full run on the shell's unsupported Node26 failed existing announcement localStorage tests; rerunning on the pinned runtime passed without changing those tests.
- Backend cap remains50,000; disposable SQL regressions now explicitly test10050/50000 success and50050 rejection, plus composed SQL/PDF/mock-email/website-schema integration and concurrent-send gates.
- Both known contract differences are now resolved locally. Remaining acceptance still requires real cookie/hash/idle/revocation + Supabase RPC HTTP/Edge JWT/private Storage with synthetic data and sending disabled. Local OrbStack Docker socket was absent at readiness check; the full Supabase HTTP/Storage stack was not started. No live-stack acceptance claimed.
- No commit, push, deployment, production writes, cron activation or real emails.

## Production website release — 2026-10-02

- Website implementation commit `c503a01662346baf4813cdf0231d5761921aad21` pushed to `main`. Only the22 Camden invoice files were included; unrelated instruction/Crystl changes remain untouched.
- Isolated production candidate `dpl_9uNcmrCUHjonVs31FaJXyc88LCLZ` built successfully and was promoted after backend readiness. Matching Git deployment `dpl_FQzgjGW8G9nQcaLhvX17gRUL9oHp` is READY. Live coordinator path: `https://www.lakeridepros.com/camden-county/invoices`.
- Independently verified shared migration `20261002054902_camden_invoice_workflow`, both invoice Edge functions ACTIVE version2 with JWT checks, private `camden-invoices` bucket, and active15-minute `camden-invoice-sync` job17. Backend owner confirms sending and sync enabled; canonical sync returnedHTTP200 with one invoice and zero issues. Staff UI release evidence is tracked in the owning lrpbolt runbook/readiness receipt.
- Website release gates:686 tests passed on pinned Node24.16.0, scoped lint/TypeScript/color/copy/spec audits pass, cloud production build passes. Full ESLint remains blocked by the pre-existing global jsx-a11y plugin configuration; no unrelated configuration change included.
- Live website smoke: list, inline PDF, and attachment PDF each return private/no-store/noindex401 for both anonymous and correctly shaped invalid opaque sessions. Invoice page redirects to login without invoice controls; public shop returns200.
- No actual invoice email, PDF generation, validation, or publication was triggered as a website deployment test. Authenticated published-PDF production download remains an operational verification on the first legitimately sent/published version; local fixture-level exact-byte/hash integration already passed. No public Storage links or external Supabase Auth bypass added.

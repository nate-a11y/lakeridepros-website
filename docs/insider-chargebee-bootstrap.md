# Insider Chargebee Bootstrap and Backfill

This operator-only command reconciles existing approved Insider subscriptions
from Chargebee into the Insider Rewards database. It is not a deployment step
and must not be run against production without a separate production approval.

## What it does

1. Enumerates subscriptions attached to the six approved Insider item prices
   and skips cancelled subscriptions from launch reconciliation.
2. Resolves each Chargebee customer to exactly one existing `insider_members`
   row using customer ID, normalized email, and conflict-safe normalized phone
   preflight.
3. Requests paid recurring invoices and successful payment transactions using
   the exact approved Insider subscription ID—not the customer ID—and accepts
   only approved plan lines attributed to that same subscription.
4. Builds one deterministic `payment_succeeded` event per paid billing term.
5. Replays payment terms oldest-first through the transaction-safe
   `apply_insider_chargebee_bootstrap_event` wrapper with
   `historical_backfill=true`.
6. Writes the authoritative current subscription snapshot last.
7. Reports only counts, reason codes, and hashed references.

The current snapshot event is keyed by Chargebee subscription resource version
and a fingerprint of the discovered payment history. Historical events are
keyed by Chargebee invoice ID. This ensures newly discovered old terms are
followed by a fresh authoritative snapshot restore. The database's unique
`chargebee_event_id` constraint and the bootstrap RPC make reruns idempotent.
A failed run can be rerun; processed terms and current resource versions are
skipped or reported as duplicates.

## Safety properties

- Default mode is read-only dry-run.
- Before the Insider migration is installed, dry-run treats only the exact
  PostgreSQL missing-relation or PostgREST schema-cache errors for
  `insider_billing_events` and `insider_subscriptions` as empty reconciliation
  indexes. Apply mode and every other database error fail closed.
- If the legacy `insider_members` table does not yet have
  `chargebee_customer_id`, dry-run retries the member index with only
  `id,email,phone,is_active` and synthesizes a null customer ID so existing
  email/phone matching can be preflighted. This fallback is allowed only for
  the exact PostgreSQL undefined-column or PostgREST missing-column
  schema-cache error. Apply mode and every other member-index error fail
  closed.
- Apply requires all of:
  - `--apply`
  - exact `--confirm=APPLY-INSIDERS-CHARGEBEE-BACKFILL`
  - `INSIDERS_CHARGEBEE_BOOTSTRAP_MODE=apply`
  - `INSIDERS_CHARGEBEE_SYNC_MODE=off`
  - `--target-chargebee-site` matching `CHARGEBEE_SITE`
  - `--target-project-ref` matching `NEXT_PUBLIC_SUPABASE_URL`
- Apply is blocked if any subscription is incomplete, unmapped, ambiguous, or
  has unsafe billing history.
- Cancelled subscriptions are counted and skipped before member mapping or
  history reads, so historical cancellations cannot block the current launch.
- A unique normalized phone can resolve a member only when customer-ID/email
  signals do not conflict. A phone match with a different known email is
  reported as `contact_identity_conflict` and remains blocked.
- More than one approved subscription resolving to one member blocks the full
  apply.
- Existing members are preflighted before any write. The bootstrap RPC takes
  `expected_member_id`, locks the subscription/customer binding, validates it
  before side effects, and rolls back if its postconditions fail.
- Historical calls use `historical_backfill=true`, suppressing annual-benefit
  and anniversary-grant side effects. The current snapshot uses `false`.
- Monthly/annual cadence changes on one subscription are blocked because the
  current database anniversary counter does not store cadence per billing
  event.
- Zero-dollar invoices, unpaid invoices, non-recurring invoices, invoices
  without an approved plan line, and invoices without a successful positive
  payment are excluded.
- Invoice and transaction list requests use `subscription_id[is]` for the exact
  approved Insider subscription. The command does not request or inspect the
  customer's non-Insider invoices or transactions.
- Invoice plan lines are attributed at line level. Exactly one canonical
  matching subscription plan term is required; byte-equivalent duplicate
  lines may collapse, but distinct qualifying lines block the subscription.
- Irregular/prorated plan terms are reported as `partial_terms_skipped` and are
  excluded from anniversary counts. Only full monthly (27–32 day) or annual
  (364–367 day) terms are replayed. Ambiguous, conflicting, or overlapping full
  terms still block.
- Multiple invoices for one identical term collapse deterministically to one
  event.
- No PII, raw Chargebee IDs, Supabase row IDs, or secret values are printed.
- No customer notifications are sent by this command.

## Dry-run

Dry-run still reads Chargebee and Supabase, so use credentials for the intended
environment. It performs no RPC writes. It can run before the new billing-event
and subscription tables or the legacy member customer-ID column exist. The
existing `insider_members` directory must still expose
`id,email,phone,is_active` so customer-to-member mapping can be validated.

```bash
npm run bootstrap:insiders-chargebee
```

Review:

- subscriptions enumerated/ready/blocked
- existing members matched
- historical payment terms
- partial terms skipped from anniversary history
- already-applied and pending events
- anniversary trigger terms
- opaque blocker references and reason codes

Any blocked subscription must be resolved before apply.

## Safe operator errors

Fatal operator errors intentionally omit underlying database/API messages,
identifiers, configuration values, and PII. They use one safe stage/code pair:

| Stage                   | Code                           | Meaning                                                                           |
| ----------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| `config`                | `invalid_configuration`        | Arguments, guard variables, or required client configuration are invalid.         |
| `member_index`          | `member_index_read_failed`     | The existing member directory could not be loaded safely.                         |
| `billing_index`         | `billing_index_read_failed`    | Existing event/subscription reconciliation indexes could not be loaded safely.    |
| `chargebee_enumeration` | `chargebee_enumeration_failed` | Chargebee subscription/history enumeration or reconciliation failed unexpectedly. |

Example safe shape:

```text
Chargebee Insider bootstrap failed [stage=member_index] [code=member_index_read_failed]
```

## Apply

Do not copy this example without an approved change window, backup/PITR
confirmation, and explicit production authorization.

Prerequisite: the reviewed RC hardening migration that defines
`public.apply_insider_chargebee_bootstrap_event(...)` must already be installed.

```bash
INSIDERS_CHARGEBEE_BOOTSTRAP_MODE=apply \
INSIDERS_CHARGEBEE_SYNC_MODE=off \
npm run bootstrap:insiders-chargebee -- \
  --apply \
  --confirm=APPLY-INSIDERS-CHARGEBEE-BACKFILL \
  --target-chargebee-site=<expected-chargebee-site> \
  --target-project-ref=<expected-project-ref>
```

Run the dry-run again after apply. Expected reconciliation:

- zero blockers/failures
- all deterministic events reported as already applied
- zero events pending

## Anniversary behavior

Historical `payment_succeeded` terms seed the existing anniversary counter, but
the bootstrap RPC suppresses retroactive benefit grants during replay. Normal
post-launch payment events then use the complete count:

- annual: the second and later paid annual terms
- monthly: every twelfth paid monthly term

The summary reports historical anniversary trigger terms for operator review;
it does not claim those credits were granted.

## Known hard stop

A subscription that changed between monthly and annual cadence is not replayed.
The current billing-event schema does not preserve cadence on each event, so
mixing cadences can produce an incorrect anniversary cycle. Resolve that with a
reviewed database contract change rather than bypassing this guard.

## Verification

```bash
npm run test:insiders-chargebee-bootstrap
npm run lint -- \
  lib/chargebee/insider-bootstrap.ts \
  lib/chargebee/__tests__/insider-bootstrap.test.ts \
  scripts/bootstrap-insiders-chargebee.ts
```

Official Chargebee references:

- [List subscriptions](https://apidocs.chargebee.com/docs/api/subscriptions/list-subscriptions)
- [List invoices](https://apidocs.chargebee.com/docs/api/invoices/list-invoices)
- [List transactions](https://apidocs.chargebee.com/docs/api/transactions/list-transactions)

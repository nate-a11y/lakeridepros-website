# Fourthwall Production Readiness

Status: **local integrated backend ready; production NO-GO**

This runbook keeps checkout disabled and separates local verification, a future approved deployment, production readback, and end-to-end purchase acceptance.

## Current Evidence

- `FOURTHWALL_CHECKOUT_ENABLED` is absent from Vercel production metadata and defaults fail-closed. The local integrated route returns HTTP `503` before parsing the cart or contacting Fourthwall unless the value is exactly `true`.
- The production checkout handoff route is not deployed and currently returns HTTP `404`.
- The existing production webhook endpoint is reachable, but five real Fourthwall catalog deliveries returned HTTP `401` with `Invalid webhook signature`.
- Vercel production metadata shows the webhook secret was updated at `2026-09-21T02:41:44.451Z`, webhook ID at `2026-09-21T02:41:45.892Z`, and the follow-up production deployment was created at `2026-09-21T02:41:48.952Z`.
- The final two failed deliveries reached that follow-up deployment at `02:45:34.567Z` and `02:47:22.461Z`. The mismatch therefore persisted after the environment update and deployment.
- Vercel Secret values are masked and cannot be used for equality readback. The evidence supports a byte mismatch between the active Fourthwall HMAC secret and the production runtime value; it does not reveal whether the value is stale, from the wrong Fourthwall field, or contains accidental whitespace.
- Local credentials and production credentials are not interchangeable evidence.

### Failed delivery inventory

| Fourthwall delivery | Type | Created (UTC) | Endpoint | Result | Production deployment |
|---|---|---:|---|---|---|
| `weve_1kX66lUXQkqQlKsz_yFihQ` | `PRODUCT_CREATED` | `2026-09-21T02:40:57.504664Z` | `/api/fourthwall/webhook` | `401 Invalid webhook signature` | `dpl_EQHiFpVf1jNSR8JMJCE6qFXZQbc3` |
| `weve_ugC96KDrROifi5to7QIk2A` | `COLLECTION_UPDATED` | `2026-09-21T02:40:57.510284Z` | `/api/fourthwall/webhook` | `401 Invalid webhook signature` | `dpl_EQHiFpVf1jNSR8JMJCE6qFXZQbc3` |
| `weve_1_dNTZKiT52ikLioKnJqug` | `PRODUCT_UPDATED` | `2026-09-21T02:40:58.060592Z` | `/api/fourthwall/webhook` | `401 Invalid webhook signature` | `dpl_EQHiFpVf1jNSR8JMJCE6qFXZQbc3` |
| `weve_-3kubJEqS9aZ3CMNoecHwQ` | `PRODUCT_UPDATED` | `2026-09-21T02:45:34.446440Z` | `/api/fourthwall/webhook` | `401 Invalid webhook signature` | `dpl_96azmfAbRXzHBGXa99nYASaqjUPB` |
| `weve_14rbdS5tRCGp-2AAvQYUgA` | `PRODUCT_UPDATED` | `2026-09-21T02:47:22.419219Z` | `/api/fourthwall/webhook` | `401 Invalid webhook signature` | `dpl_96azmfAbRXzHBGXa99nYASaqjUPB` |

Fourthwall exposes these historical events as read-only. The Platform API has no retry operation, and the dashboard offers a new test notification rather than replay by delivery ID. Do not fabricate historical retries. Recovery evidence must use a fresh Fourthwall-signed delivery after secret alignment while retaining this inventory as the root-cause record.

## Integrated Backend Guarantees

- Webhook HMAC uses SHA-256 over the exact raw request body, compared against the canonical base64 header with constant-time equality.
- Surrounding whitespace is trimmed from the configured secret; wrapping quotes are not stripped or silently accepted.
- Invalid signatures log only body size and signature presence/format, never the header, body, secret, or customer data.
- Webhook IDs are recorded only after the cache revalidation side effect succeeds. A failed side effect remains retryable; a repeated successful event is acknowledged without repeating the side effect.
- Checkout requires `application/json`, a bounded body, 1–20 unique UUID variants, quantities of 1–20, and an in-memory abuse limit.
- Checkout revalidates every variant against an uncached `PUBLIC`, `AVAILABLE`, in-stock Storefront catalog response before cart creation. Client names, images, and prices are ignored.
- Fourthwall cart IDs and the configured HTTPS checkout base URL are validated before a redirect URL is returned.
- `FOURTHWALL_STOREFRONT_ENABLED=false` is the documented default. Unless the value is exactly `true`, catalog lists are empty, direct product lookup returns `null`, and no Storefront API request occurs.
- `FOURTHWALL_CHECKOUT_ENABLED=false` is the documented default.

## Preflight Before Any Approved Deployment

1. Preserve Nate's existing 20-item cart. Do not clear, migrate, replace, add to, or remove from it.
2. Confirm the exact integrated Git tree and record its commit/tree evidence. Do not deploy a detached or partially integrated worktree.
3. Run full lint/audits, TypeScript, unit/integration tests, production build, and cart browser coverage.
4. In Fourthwall, confirm the intended webhook URL is exactly `https://www.lakeridepros.com/api/fourthwall/webhook` and the allowed types remain `ORDER_PLACED`, `ORDER_UPDATED`, `PRODUCT_CREATED`, `PRODUCT_UPDATED`, and `COLLECTION_UPDATED`.
5. Copy the shop webhook HMAC secret directly from Fourthwall into Vercel production. Do not use an API password, Storefront token, webhook ID, quoted value, or shell output. Never print or persist the value.
6. Verify only metadata: `FOURTHWALL_WEBHOOK_SECRET`, `FOURTHWALL_WEBHOOK_ID`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FOURTHWALL_SHOP_URL` target production. Secret equality requires runtime behavior, not `vercel env pull`.
7. Confirm `FOURTHWALL_STOREFRONT_ENABLED` and `FOURTHWALL_CHECKOUT_ENABLED` remain absent or `false`. Confirm legacy `MERCH_CHECKOUT_ENABLED` remains absent or `false`.
8. Confirm the temporary integration product is `HIDDEN` before customer exposure. Collection `all` is automatic; do not edit collection membership and do not archive/delete the test product.

## Future Approved Deploy and Readback Sequence

1. Deploy the exact verified tree with Fourthwall checkout still disabled.
2. Read back deployment state and alias routing. Record the deployment ID and immutable source evidence.
3. Probe `GET /api/fourthwall/webhook`; require `configured=true`, `webhookIdConfigured=true`, and `Cache-Control: no-store`. This proves configuration presence only, not secret equality.
4. Probe `POST /api/fourthwall/checkout` with `Content-Type: application/json`; require HTTP `503` and `Fourthwall checkout is not currently available`. Verify no Fourthwall cart request occurred.
5. Send a fresh Fourthwall test notification. Require Fourthwall event state success/non-`FAILED`, a Vercel production POST `2xx`, and one sanitized application log for the event ID/type. Any `401` is NO-GO.
6. Verify idempotency locally with the same correctly signed event twice: first delivery performs one revalidation; the second returns `duplicate=true` without another side effect. Historical Fourthwall delivery IDs cannot be replayed through supported controls.
7. Confirm the Storefront `all` collection has zero public test items and the temporary product slug fails closed for unauthenticated visitors.
8. Capture desktop and mobile holding-page/direct-route evidence.
9. Leave checkout disabled until catalog samples are approved and a separate go-live approval is recorded.

## Rollback

- Application: restore the prior READY production deployment/alias.
- Storefront: remove or set `FOURTHWALL_STOREFRONT_ENABLED=false`; verify `/shop` shows the holding experience and direct product slugs fail closed.
- Checkout: remove or set `FOURTHWALL_CHECKOUT_ENABLED=false`; verify the route returns HTTP `503`.
- Webhook: restore the prior production secret only if it is known-good and evidence-backed. If no known-good value exists, keep storefront/checkout disabled, keep production NO-GO, and correct the secret with Fourthwall/Vercel support; do not remove the registered webhook or weaken HMAC validation.
- Test catalog: change only the temporary product state to `HIDDEN`; never archive/delete it or edit automatic collection membership.
- Re-run production health, disabled-checkout, webhook, catalog, and direct-slug probes after rollback.

## Acceptance Boundary

A successful deployment and fresh signed webhook test still do not constitute purchase acceptance. Enabling checkout, publishing customer catalog items, completing a payment, or exposing the custom shop requires separate explicit approval, approved samples, and post-deploy end-to-end validation.

Official references:

- https://docs.fourthwall.com/webhooks/signature-verification
- https://docs.fourthwall.com/webhooks/retry-policies
- https://docs.fourthwall.com/webhooks/limitations
- https://docs.fourthwall.com/storefront/cart-checkout-tutorial

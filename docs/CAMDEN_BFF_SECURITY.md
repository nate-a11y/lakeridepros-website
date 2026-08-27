# Camden County portal BFF security contract

The public Treatment Court portal uses a same-origin backend-for-frontend (BFF). External riders and coordinators **do not** receive or create Supabase Auth users, JWTs, refresh tokens, anon keys, or service-role credentials.

## Authentication flow

1. `POST /api/camden/auth/request-code`
   - Requires JSON, `X-Camden-CSRF: 1`, an exact configured production origin, and server-verified Cloudflare Turnstile.
   - Normalizes the phone, creates a random challenge UUID and six-digit code, then HMACs `challenge_id:code` with `CAMDEN_OTP_PEPPER`.
   - Calls the service-role-only `camden_issue_portal_challenge` RPC, which resolves approved identities and atomically enforces durable phone/IP limits.
   - Returns the same generic response and minimum response time for known, unknown, limited, or rejected identities. Twilio delivery runs with Next `after()` so network timing does not reveal membership.
2. `POST /api/camden/auth/verify-code`
   - Calls the atomic service-role-only `camden_verify_portal_challenge` RPC.
   - A successful verification creates a random 256-bit opaque session. Only its SHA-256 hash is stored in Postgres.
   - The raw token is stored only in an HttpOnly, SameSite=Strict, production-Secure `__Host-camden-session` cookie.
3. `POST /api/camden/auth/sign-out`
   - Revokes the server session and clears the cookie.

OTP challenges expire in 10 minutes and allow at most five attempts. Sessions have a 12-hour absolute lifetime and a two-hour sliding idle timeout. Every gateway call re-checks identity access and rider status, so suspending access takes effect immediately.

## Data boundary

Browser code calls only named `/api/camden/data/*` routes. The BFF validates strict request schemas and then invokes one service-role-only RPC:

```text
camden_portal_gateway(session_token, operation, payload) -> jsonb
```

There is no arbitrary RPC/table proxy. The browser route allowlist is:

- Reads: `context`, `dashboard`, `coordinator-dashboard`, `request`
- Mutations: `submit-request`, `update-pending-request`, `duplicate-request`, `add-message`, `create-followup`, `transition-request`, `request-location`, `accept-policy`, `update-profile`

External coordinator transitions are limited to `acknowledged`, `needs_information`, and `declined`. Trip confirmation/completion/no-show state remains with LRP/Moovs workflows. Rider responses are cost-stripped again in the server mapper as defense in depth.

## Server-only configuration

- `CAMDEN_SUPABASE_URL` (may fall back to server-only `SUPABASE_URL`)
- `CAMDEN_SUPABASE_SERVICE_ROLE_KEY` (may fall back to `SUPABASE_SERVICE_ROLE_KEY`)
- `CAMDEN_OTP_PEPPER`
- `CAMDEN_SESSION_HASH_PEPPER` (request metadata hashing; may fall back to OTP pepper)
- `CAMDEN_ALLOWED_ORIGIN` (required in production)
- `TURNSTILE_SECRET_KEY`
- `CAMDEN_TWILIO_ACCOUNT_SID`, `CAMDEN_TWILIO_AUTH_TOKEN`, `CAMDEN_TWILIO_FROM_NUMBER`
  - Shared `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM` are supported fallbacks.

Never prefix Supabase service credentials, Twilio credentials, or peppers with `NEXT_PUBLIC_`.

Development fixtures are served only by the server-side BFF when both `NODE_ENV=development` and `NEXT_PUBLIC_CAMDEN_DEMO_MODE` is not `false`. Fixture records are absent from production client chunks; the demo persona header is ignored in production.

## Release checks

- Run `npx tsc --noEmit` and focused ESLint.
- Run Camden unit/security tests, including route/status allowlisting and browser bundle isolation.
- Run `npm run build` and verify Camden client chunks contain no Supabase/JWT/service-role/gateway markers.
- Verify unknown operations return 404, missing sessions return 401, and cross-origin/misconfigured-origin mutations return 403.
- Configure secrets in the deployment platform and apply the matching non-destructive Supabase migration before disabling local demo mode.

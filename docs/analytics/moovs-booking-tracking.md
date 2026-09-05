# Lake Ride Pros: website → Moovs measurement

## Configuration
- Website: `https://www.lakeridepros.com`
- Booking destination: `https://customer.moovs.app/lake-ride-pros/`
- GTM: `GTM-KKNTGMB7`
- GA4: `G-PN7MJLRQ3T`, property `317623330`, stream `3608417151` (LakeRidePro Web)
- Import file: `~/Downloads/GTM-KKNTGMB7_lrp-booking-tracking.json`
- Original `GTM-KKNTGMB7_workspace2.json` is preserved. It contained no tags, triggers, or custom variables.
- Personal factory's analytics plan is for Moovs corporate marketing, not LRP. Its IDs and corporate events are intentionally not copied.

## Published status
- GTM **Version 3** published 2026-09-05 as `nate@lakeridepros.com`: 22 tags, 22 triggers, 8 variables.
- Tag Assistant preview verified `view_service` and `moovs_page_view_info` each fired once using native GA4 tags. No recursive data-layer event traffic.
- Website deployment is live. Full reservation/value/GA4 DebugView and domain-admin verification remain pending.

## Import and activate (future rebuilds; deployment alone does not publish GTM)
1. Open the **Lake Ride Pros GTM container**, Admin → Import Container. Select the generated JSON and a new workspace.
2. Choose **Merge**, review the preview, and confirm **22 tags / 22 triggers / 8 variables**: 9 Moovs event tags, 12 website event tags, 1 portal-only GA4 initializer. Do not overwrite unrelated workspace changes. If existing equivalent GA4/event tags have since been added, resolve duplicates before publishing.
3. Event delivery uses **21 native GA4 Event tags**, not Custom HTML `gtag('event')` forwarding (which re-enters GTM and can loop). One portal-only Custom HTML initializer is sequenced before Moovs event tags and guarded to configure GA4 once per page. Eight read-only Custom JavaScript variables extract only current-event context/value; they never push events.
4. Confirm Moovs Conversion Tracking is enabled and the operator's configured container is `GTM-KKNTGMB7`.
5. In GA4 → Admin → Data streams → LakeRidePro Web → Configure tag settings → Configure your domains, include `lakeridepros.com` (including www) and `customer.moovs.app`. The code also supplies linker settings before GA configuration.
6. Preview both domains using Tag Assistant. Check GA4 DebugView and the checklist below, then **Submit / Publish** the GTM workspace.
7. Review consent/privacy settings before release. No customer form values, arbitrary query fields, customer phone/email, or private account identifiers are added by these custom events. Existing GA4 automatic collection settings remain unchanged.

The website already has its Google tag in code. **Do not add another all-pages GA4 configuration tag on the website.** The export configures GA4 only at `customer.moovs.app/lake-ride-pros/…`, never other Moovs operators. GTM installation alone does not activate unpublished tags.

## Event inventory

### Moovs portal: nine documented events
| Event | Meaning |
|---|---|
| `moovs_create_quote` | Quote successfully created |
| `moovs_create_reservation` | Direct reservation created |
| `moovs_confirm_reservation` | Existing quote converted to reservation |
| `moovs_page_view_info` | Booking information step |
| `moovs_page_view_vehicle` | Vehicle selection step |
| `moovs_page_view_quote_summary` | Quote summary step |
| `moovs_page_view_reservation_summary` | Priced reservation summary |
| `moovs_page_view_reservation_request_summary` | Reservation request summary |
| `moovs_page_view_confirm_quote` | Existing quote confirmation step |

Each has an individually named tag and exact-name trigger. Page-step events are separate from GA4 automatic `page_view`; do not turn every step into a conversion.

Only the two reservation events forward `value`, and only if the current event contains a finite nonnegative number. `currency: USD` is LRP's configured reporting currency, **not** a Moovs-supplied field. Values mean booking totals, **not paid revenue**. No `purchase`, transaction ID, cancellation/payment status, Google Ads conversion ID, or conversion label is invented. No automatic conversion imports or value-based bidding changes are made.

### Website: twelve intentional events
| Event | Trigger / context |
|---|---|
| `booking_portal_click` | Actual portal link click, including middle/modifier clicks; placement + optional service slug |
| `booking_intent` | Click toward internal `/book`, including Next.js client navigation; not a completed booking |
| `phone_click` | Click to LRP's main business phone only |
| `sms_click` | Text link to LRP's main business phone only |
| `email_click` | Email link to `contactus@lakeridepros.com` only |
| `view_service` | Public `/services/<slug>` view, once per navigation |
| `view_vehicle` | Public `/fleet/<slug>` view, once per navigation |
| `contact_form_start` | First edit in the contact form per mount |
| `contact_form_submit` | Contact API accepted the inquiry; not proof an email was delivered |
| `contact_form_error` | Validation/security/server/network category only; never raw error or entered text |
| `newsletter_signup` | Newsletter API accepted submission; existing subscribers can also receive success |
| `event_waitlist_join` | Waitlist API accepted submission; not a paid booking or unique new rider |

Contact clicks count intent, not connected calls/messages. Service/fleet views do not fire on index pages. Custom website events exclude private/admin/account/application/checkout routes. Partner contact links and participant contact information are excluded. The site keeps its existing GA4 automatic page views/engagement and AI referral tracking; this export does not duplicate them.

Recommended primary key events **after testing**: the two reservation events. Track quote creation and accepted inquiries as secondary lead outcomes; calls/texts/book clicks are intent signals. Do not combine quote creation and reservation completion as equivalent sales. Mark key events manually in GA4 only after confirming their semantics. Add event-scoped custom dimensions for `booking_location`, `service_slug`, `vehicle_slug`, `contact_location`, `form_id`, and `error_type` if needed for reports.

Shop/gift-card payment completion is deliberately not inferred from a button or success-page view. A separate verified Stripe transaction + deduplication implementation is needed before relying on ecommerce revenue or Ads bidding.

## Attribution behavior
- Real anchors replace Moovs iframes and booking modals across home, header/mobile, services, fleet CTAs, book page, and floating quote CTA.
- Carry all `utm_*` fields plus Google/Microsoft/Meta/TikTok/X/LinkedIn/Snap/Pinterest click IDs and `moovs_source`.
- Keep allowed attribution through internal navigation in **tab-scoped sessionStorage**, with a 30-minute idle expiry. New tagged campaigns replace prior attribution rather than mixing old click IDs.
- Blocked storage falls back to memory. Attribution and analytics failures never prevent native booking navigation.
- No copying email, phone, authentication parameters, GTM preview credentials, arbitrary URL params, or browser cookies.
- Google generates fresh `_gl` values at click time. Already decorated portal anchors retain them; stale inbound `_gl` values are never cached/replayed.
- Cross-domain continuity requires the same GA4 destination on both domains, Google's scripts/consent being available, and the destination retaining the linker during redirects. It cannot be guaranteed by UTM forwarding alone.

## Verification checklist
- [x] GTM import accepted and Version 3 published; correct container observed loading in Moovs.
- [ ] Website landing with test UTMs → internal service/book navigation → portal retains UTMs and supported click IDs; no test email/token forwarded.
- [ ] With analytics allowed, real outbound click has a fresh `_gl`; destination and subsequent portal navigation retain GA client/session continuity.
- [ ] Exactly one website GA4 page view per normal page/navigation, not duplicate config from this export.
- [ ] Each website event fires once for its real action. Failed forms do not produce success events.
- [ ] Each of the nine Moovs events appears in Tag Assistant and GA4 DebugView; test direct reservation and quote confirmation separately with an approved test booking.
- [ ] Reservation numeric value is correct; quote/page-step events have no inherited reservation value.
- [ ] Other Moovs operators and private LRP routes do not produce these custom events.
- [ ] Confirm currency and key-event settings before relying on value or advertising conversions.

Automated checks exercise attribution, clicks, routing, accepted/rejected inquiries, scoped triggers, native tag schema, no recursive event forwarding, and numeric-value handling. They **do not replace a real GTM import, publish, or end-to-end Moovs booking test**.

## Regenerate
`node scripts/build-moovs-gtm-export.mjs ORIGINAL.json NEW-OUTPUT.json`

The generator refuses a wrong container, a nonempty input workspace, or overwriting an existing output file. Export a fresh workspace and review/merge if live GTM configuration changes.

## Sources
- [Moovs documented events](https://intercom.help/moovs-05c940f1970e/en/articles/8466983-what-types-of-events-can-you-track-with-gtm-in-your-customer-portal)
- [Google cross-domain linker](https://developers.google.com/tag-platform/devguides/cross-domain)

## Rollout correction (2026-09-05)
An initial Version 2 used Custom HTML to forward same-name events through `gtag`. The live smoke test caught recursive GTM triggering. Version 1 (empty baseline) was immediately republished while all 21 event tags were replaced with native GA4 Event tags. Do not restore Version 2. QA event counts during this brief test may be inflated; no test reservation or payment was submitted. Regression tests now require native `gaawe` tags and prohibit Custom HTML `gtag('event')` forwarding.

The corrected Version 3 passed GTM validation and was published under `nate@lakeridepros.com`. Preview confirmed a single native website `view_service` and a single native Moovs `moovs_page_view_info`; portal configuration runs only once despite being invoked as both page tag and setup tag. All 429 current unit tests pass.

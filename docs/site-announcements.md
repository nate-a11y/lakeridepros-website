# Site announcements

Status: implemented locally; held for Nate's combined website push/deployment. No announcement or asset has been written to Sanity.

## Manage in Studio
1. Open **Site announcement** at the top of Studio's Content menu.
2. Choose **Scrolling banner** or **Popup**; enter a headline and message.
3. Optionally upload **one image**, with a required image description/alt text. The popup displays the full image; the banner displays a compact, non-scrolling thumbnail. Essential information should also appear in the message.
4. Set the required **Expiration date and time**, checking the Studio date picker's time zone.
5. Optionally supply a link label plus a site-relative path or HTTPS URL.
6. Enable and publish. To remove early, disable and publish, or unpublish.

There is one announcement slot, not a list of concurrent announcements. The Studio hides create/duplicate/delete controls for this singleton. The public endpoint only reads the exact published `siteAnnouncement` document, so extra documents created outside Studio cannot become live announcements.

## Visitor behavior
- Popup or scrolling banner appears on public marketing pages; private portals, checkout/cart, admin, and application flows are excluded.
- Close button in both modes; Escape also dismisses the native modal. Popup manages focus and restores it on close.
- Dismissal is remembered in that browser until expiration. Publishing a new revision lets the updated announcement appear again.
- The banner includes pause/resume, pauses on hover/focus, and becomes static/wrapped for reduced-motion users. Its duplicate scrolling copy is hidden from screen readers.
- Required expiry is validated in Studio, on the server, and again in the browser. A client timer removes expired content even on an open page, with timer chunking for dates more than 24.8 days away.
- The public API bypasses Sanity CDN/Next/HTTP caching. Active tabs refresh every 60 seconds and when returning to the tab; disabled/unpublished announcements disappear on the next refresh. CMS failures hide the optional announcement without blocking the site.
- Browser storage contains only the dismissed revision and expiry, not visitor identity or applicant/customer data. Blocked storage still permits dismissal in the mounted session.

## Files / checks
- Schema/config: `sanity/schemas/siteAnnouncement.ts`, `sanity/sanity.config.ts`.
- Public endpoint: `app/api/announcement/route.ts`.
- Shared safety/expiry checks: `lib/announcements/announcement.ts`.
- UI: `components/announcements/SiteAnnouncement.tsx` and scoped CSS, mounted in the public site layout only.
- 42 announcement regressions; full website suite: **548 tests passed**. Full ESLint and production build (including TypeScript) passed.
- Local HTTP smoke checks: homepage, announcement API, and Studio returned 200; unpublished/absent content returned `announcement: null`.
- Browser visual QA is still pending: no connected browser was available. Combined feature-branch preview deployed successfully at commit `1632159`; production website not promoted.

## References
- [Sanity singleton configuration](https://www.sanity.io/guides/singleton-document)
- [Sanity Studio validation](https://www.sanity.io/docs/studio/validation)
- [Studio validation vs direct API writes](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake)

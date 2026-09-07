# Lake Ride Pros website release checklist

Use this before promoting any preview to production. A preview passing is not approval to promote.

## Content and brand

- [ ] Lake of the Ozarks is clear as the home base; Missouri-wide service is also clear.
- [ ] Private/Flex/SUV rides for 1–7 passengers are prominent alongside buses and shuttles.
- [ ] Fleet claim uses `20+ vehicles`; vehicle capacity claims match the published vehicle type.
- [ ] Powered by Legacy appears near the top of the homepage.
- [ ] Award names and years match the approved source.
- [ ] Partner and membership logos use their original colors and meaningful names.
- [ ] Phone, email, social, profile-management, booking, and contact destinations are correct.

## Search, GEO, and answer readiness

- [ ] Every indexable page has one useful H1, a distinct title/description, and its intended canonical.
- [ ] Existing crawlable copy, FAQs, internal links, and page-specific JSON-LD remain present.
- [ ] Visible FAQ answers exactly match FAQPage structured data.
- [ ] LocalBusiness/Organization facts match visible Lake/Missouri language.
- [ ] Sitemap contains all indexable static, CMS, service, fleet, partner, blog, driver, and upcoming event pages.
- [ ] Robots/noindex behavior remains correct for portals, admin routes, checkout states, and private flows.
- [ ] Representative internal links return 200 without unexpected redirects.

## Mobile and accessibility

- [ ] Review at 375, 390, 768, 1024, and 1440 pixels.
- [ ] No unintended horizontal page overflow; intentional rails remain keyboard/touch accessible.
- [ ] Mobile navigation opens, closes, scrolls, and responds to Escape; focus returns to its trigger.
- [ ] Tap targets, sticky controls, floating controls, dialogs, forms, and carousels do not overlap.
- [ ] Text wraps without clipping; real vehicle and partner images retain useful crops.
- [ ] Keyboard focus is visible on both black and white surfaces.
- [ ] Axe WCAG A/AA scans pass on representative pages from every route family.
- [ ] Reduced-motion and native disclosure behavior remain usable.

## Analytics and performance

- [ ] Exactly one `GTM-KKNTGMB7` container loads from the root layout on every rendered route family.
- [ ] GTM/Google tag network requests succeed on the Vercel preview after privacy tools are disabled.
- [ ] Booking, service, fleet, phone, SMS, and contact events contain no personal data.
- [ ] Initial hero mounts only the active three-image collage; inactive collages load on request.
- [ ] No broken images, browser errors, hydration errors, or failed first-party requests.
- [ ] Production build passes and preview field checks show no material LCP, CLS, or INP regression.

## Engineering and deployment

- [ ] `npm run lint:all`
- [ ] `npm run test:run`
- [ ] `npm run test:a11y`
- [ ] `npm run build`
- [ ] `git diff --check`
- [ ] `crystl keys scan`
- [ ] Feature branch is committed with `nate@lakeridepros.com` and pushed without force.
- [ ] Deploy to Vercel **Preview only** and verify its deployment status, representative routes, GTM, and mobile behavior.
- [ ] Stop for Nate's approval. Do not promote or deploy to production.

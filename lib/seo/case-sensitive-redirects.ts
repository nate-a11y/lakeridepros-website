/**
 * Next.js redirect rules match paths case-insensitively. A redirect whose only
 * change is letter casing therefore also matches its own destination and loops.
 * Keep those legacy redirects here so proxy.ts can compare exact path casing.
 */
const CASE_SENSITIVE_LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/our-drivers/LRP17': '/our-drivers/lrp17',
  '/our-drivers/LRP19': '/our-drivers/lrp19',
  '/our-drivers/LRP7': '/our-drivers/lrp7',
  '/our-drivers/LRP9': '/our-drivers/lrp9',
  '/events/Avenged-Sevenfold-and-Good-Charlotte':
    '/events/avenged-sevenfold-and-good-charlotte',
  '/events/Brandon-Lake-with-Franni-Cash-and-Pat-Barrett':
    '/events/brandon-lake-with-franni-cash-and-pat-barrett',
  '/events/Eric-Church-with-special-guest-49-winchester':
    '/events/eric-church-with-special-guest-49-winchester',
  '/events/Guns-and-Roses-World-Tour-2026':
    '/events/guns-and-roses-world-tour-2026',
  '/events/Kolby-copper': '/events/kolby-copper',
  '/events/MC4D': '/events/mc4d',
  '/events/Monster-Energy-SMX-World-Championship-Final':
    '/events/monster-energy-smx-world-championship-final',
  '/events/New-Edition-Way-Tour-Featuring-New-Edition-Boyz-II-Men-and-Toni-Braxton':
    '/events/new-edition-way-tour-featuring-new-edition-boyz-ii-men-and-toni-braxton',
  '/events/Nine-Inch-Nails': '/events/nine-inch-nails',
  '/events/The-Queens-4-Legends-1-Stage':
    '/events/the-queens-4-legends-1-stage',
  '/local-premier-partners/AED-EMPIRE':
    '/local-premier-partners/aed-empire',
  '/partners/Citywide-home-mortgage':
    '/partners/citywide-home-mortgage',
  '/partners/I-Gotta-Captain': '/partners/i-gotta-captain',
  '/wedding-partners/In-your-element-event-planning':
    '/wedding-partners/in-your-element-event-planning',
  '/wedding-partners/Lawson-Vacation-Experts':
    '/wedding-partners/lawson-vacation-experts',
  '/partners/Quick-Tees-Scree-Printing-and-Embroidery':
    '/partners/quick-tees-scree-printing-and-embroidery',
  '/partners/Taboo-Burger-and-Ice-Cream':
    '/partners/taboo-burger-and-ice-cream',
  '/wedding-partners/The-Hedge-Haus-at-Loz':
    '/wedding-partners/the-hedge-haus-at-loz',
  '/wedding-partners/The-Rustic-Canteen':
    '/wedding-partners/the-rustic-canteen',
  '/partners/Timeless-Bakers-Pub': '/partners/timeless-bakers-pub',
  '/local-premier-partners/Woodward-photo-video-marketing':
    '/local-premier-partners/woodward-photo-video-marketing',
  '/fleet/LRP1': '/fleet/lrp1',
  '/fleet/LRP2': '/fleet/lrp2',
  '/fleet/LRP3': '/fleet/lrp3',
  '/fleet/LRP5': '/fleet/lrp5',
  '/events/venues/Enterprise-Center':
    '/events/venues/enterprise-center',
  '/events/venues/Lazy-gators': '/events/venues/lazy-gators',
  '/events/venues/T-Mobile-Center':
    '/events/venues/t-mobile-center',
}

export function getCaseSensitiveLegacyRedirect(
  pathname: string,
): string | null {
  return CASE_SENSITIVE_LEGACY_REDIRECTS[pathname] ?? null
}

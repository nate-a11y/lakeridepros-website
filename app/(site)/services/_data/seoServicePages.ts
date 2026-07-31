import type { Metadata } from 'next';
import { metaDescription, metaTitle } from '@/lib/seo/metadata';

export interface SeoServicePageData {
  slug: string;
  title: string;
  metadataTitle: string;
  metadataDescription: string;
  keywords: string[];
  icon: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  priceNote: string;
  introHeading: string;
  intro: string[];
  highlights: Array<{ title: string; description: string }>;
  bestFor: string[];
  popularStopsTitle: string;
  popularStops: Array<{ name: string; description: string }>;
  planningTitle: string;
  planningTips: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ title: string; href: string; description: string }>;
}

const baseUrl = 'https://www.lakeridepros.com';
const ogImage = `${baseUrl}/og-image.jpg`;

export function makeSeoServiceMetadata(page: SeoServicePageData): Metadata {
  const title = metaTitle(page.metadataTitle);
  const description = metaDescription(page.metadataDescription, page.heroDescription);
  const canonical = `${baseUrl}/services/${page.slug}`;

  return {
    title,
    description,
    keywords: page.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lake Ride Pros',
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const seoServicePages: Record<string, SeoServicePageData> = {
  'restaurant-shuttle': {
    slug: 'restaurant-shuttle',
    title: 'Restaurant Shuttle Service',
    metadataTitle: 'Restaurant Shuttle Lake Ozarks',
    metadataDescription: 'Private dinner, waterfront restaurant, and bar shuttle service at Lake of the Ozarks. Door-to-door group transportation with professional drivers.',
    keywords: [
      'restaurant shuttle Lake of the Ozarks',
      'dinner transportation Lake Ozarks',
      'waterfront restaurant shuttle',
      'Lake Ozark dinner shuttle',
      'Osage Beach restaurant transportation',
      'bar shuttle Lake of the Ozarks',
      'group dinner transportation Lake Ozarks',
    ],
    icon: 'Beer',
    heroKicker: 'Dinner, drinks, and lake nights',
    heroTitle: 'Restaurant Shuttle Service at Lake of the Ozarks',
    heroDescription: 'Skip parking, keep the group together, and enjoy dinner or waterfront bars with a professional Lake Ride Pros driver handling the route.',
    primaryCta: 'Book Restaurant Transportation',
    priceNote: 'Custom hourly and point-to-point pricing based on vehicle, group size, route, and timing.',
    introHeading: 'Private transportation for Lake Ozarks restaurants and waterfront bars',
    intro: [
      'A dinner reservation at the Lake often turns into multiple stops: waterfront drinks, live music, dessert, and a safe ride back to the condo, hotel, or vacation rental. Lake Ride Pros gives your group one reliable vehicle and one professional driver for the whole night.',
      'This page is for groups searching for restaurant shuttle service, dinner transportation, or a safe bar shuttle around Lake of the Ozarks. We can handle simple round trips, multi-stop dinner routes, and flexible evening charters throughout Osage Beach, Lake Ozark, Camdenton, Sunrise Beach, and Laurie.',
    ],
    highlights: [
      { title: 'Door-to-door pickup', description: 'Pickup from hotels, condos, lake houses, docks, wedding venues, and vacation rentals.' },
      { title: 'Multi-stop friendly', description: 'Plan dinner, cocktails, live music, and a late-night return without coordinating multiple cars.' },
      { title: 'Local route knowledge', description: 'Drivers understand Lake-area traffic, parking pinch points, venue entrances, and busy weekend timing.' },
    ],
    bestFor: [
      'Birthday dinners and milestone celebrations',
      'Bachelor and bachelorette dinner routes',
      'Corporate dinners and client entertainment',
      'Wedding welcome dinners and rehearsal dinners',
      'Waterfront bar hopping without driving',
      'Groups staying at rentals, resorts, or condos',
    ],
    popularStopsTitle: 'Popular restaurant and nightlife stops',
    popularStops: [
      { name: 'Bagnell Dam Strip', description: 'A natural fit for groups combining dinner, drinks, and nightlife in Lake Ozark.' },
      { name: 'Waterfront restaurants', description: 'Use a shuttle when your group wants the lakefront experience without parking or driving after drinks.' },
      { name: 'Osage Beach restaurants', description: 'Reliable rides for groups staying near resorts, condos, shopping, and entertainment.' },
      { name: 'Sunrise Beach and west-side stops', description: 'Great for lake houses, rentals, and groups moving between quieter west-side destinations.' },
      { name: 'Partner restaurants and bars', description: 'Connect dinner plans with local Lake Ride Pros referral and premier partners when available.' },
      { name: 'Private event venues', description: 'Transportation for rehearsal dinners, welcome parties, company dinners, and group celebrations.' },
    ],
    planningTitle: 'How to plan a smoother dinner shuttle',
    planningTips: [
      { title: 'Book around your reservation', description: 'Share your reservation time, group size, and pickup address so we can recommend the right pickup window.' },
      { title: 'Tell us every possible stop', description: 'Even if the last stop is tentative, listing it early helps us plan timing and vehicle availability.' },
      { title: 'Choose a return strategy', description: 'Groups can set a firm return time or book enough hourly coverage to stay flexible.' },
      { title: 'Match the vehicle to the group', description: 'SUVs, Sprinters, limo buses, and shuttle buses each fit different group sizes and evening styles.' },
    ],
    faqs: [
      { question: 'Do you provide restaurant shuttle service at Lake of the Ozarks?', answer: 'Yes. Lake Ride Pros provides private restaurant shuttle service throughout Lake of the Ozarks, including Osage Beach, Lake Ozark, Camdenton, Sunrise Beach, Laurie, and Bagnell Dam Strip.' },
      { question: 'Can we make multiple dinner and bar stops?', answer: 'Yes. Multi-stop routes are common. Share your preferred stops when booking so we can plan timing, vehicle type, and pickup details.' },
      { question: 'Can you pick us up from a vacation rental or condo?', answer: 'Yes. We regularly pick up from hotels, condos, lake houses, resorts, and vacation rentals. Clear addresses and gate codes help keep the pickup smooth.' },
      { question: 'Is this a shared shuttle?', answer: 'No. Restaurant shuttle service is private for your group, so the schedule and route are built around your plans.' },
      { question: 'How far ahead should we book dinner transportation?', answer: 'For weekends, holidays, and summer dates, book as early as possible. For smaller weeknight rides, we can often help on shorter notice if vehicles are available.' },
      { question: 'Do you offer late-night return transportation?', answer: 'Yes. Late-night returns can be included in the reservation. Tell us your expected return time when booking so the vehicle and driver are reserved.' },
    ],
    related: [
      { title: 'Bagnell Dam Strip Transportation', href: '/bagnell-dam-strip-transportation', description: 'Party bus and bar hopping transportation for Lake Ozarks nightlife.' },
      { title: 'Party Bus & Nightlife', href: '/services/party-bus-nightlife', description: 'Premium group transportation for celebrations and late-night plans.' },
      { title: 'Vacation Rental Transportation', href: '/services/vacation-rental-transportation', description: 'Door-to-door service from lake houses, condos, Airbnbs, and VRBOs.' },
    ],
  },
  'boat-dock-pickup': {
    slug: 'boat-dock-pickup',
    title: 'Boat Dock Pickup & Marina Shuttle',
    metadataTitle: 'Boat Dock Pickup Lake Ozarks',
    metadataDescription: 'Boat dock pickup, marina shuttle, and boat slip transportation at Lake of the Ozarks. Connect docks, rentals, restaurants, resorts, and nightlife.',
    keywords: [
      'boat dock pickup Lake of the Ozarks',
      'marina shuttle Lake Ozarks',
      'boat slip transportation',
      'dock pickup Lake Ozark',
      'waterfront pickup service Lake of the Ozarks',
      'marina to restaurant shuttle',
      'Lake Ozarks dock transportation',
    ],
    icon: 'Navigation',
    heroKicker: 'Dock-to-door transportation',
    heroTitle: 'Boat Dock Pickup & Marina Shuttle at Lake of the Ozarks',
    heroDescription: 'Connect your dock, marina, vacation rental, restaurant, or nightlife stop with private ground transportation built for lake-day logistics.',
    primaryCta: 'Plan a Dock Pickup',
    priceNote: 'Pricing depends on pickup access, route complexity, group size, and vehicle type.',
    introHeading: 'Ground transportation that understands lake access points',
    intro: [
      'At Lake of the Ozarks, the closest road pickup is not always obvious. A group might be at a private dock, boat slip, marina, waterfront bar, or rental home with limited parking. Lake Ride Pros helps bridge the gap between lake plans and safe ground transportation.',
      'Use this service for dock pickup, marina transfers, dinner connections, late-night returns, wedding guest movements, or airport rides for guests arriving at a lake house. The key is planning the exact access point before the driver arrives.',
    ],
    highlights: [
      { title: 'Waterfront pickup planning', description: 'We help confirm the practical road pickup point when the dock itself is not vehicle-accessible.' },
      { title: 'Great after boating', description: 'A smart option when guests spend the day on the water and need a safe evening ride.' },
      { title: 'Private group service', description: 'Your group gets a dedicated route instead of relying on multiple rideshares or last-minute pickups.' },
    ],
    bestFor: [
      'Boat slip and marina pickups',
      'Dock-to-restaurant transportation',
      'Waterfront vacation rental guests',
      'Lake-day groups going to nightlife',
      'Wedding guests staying at lake houses',
      'Airport guests arriving to private docks or marinas',
    ],
    popularStopsTitle: 'Common dock and marina transportation scenarios',
    popularStops: [
      { name: 'Private docks and lake homes', description: 'Coordinate a nearby road-access pickup for guests staying on the water.' },
      { name: 'Marinas and boat rental locations', description: 'Easy transfers after boat rentals, charters, or lake days.' },
      { name: 'Waterfront restaurants', description: 'Move from dock or marina to dinner without moving every personal vehicle.' },
      { name: 'Resorts and condos', description: 'Connect resort docks, condo complexes, and group transportation schedules.' },
      { name: 'Bagnell Dam Strip', description: 'After a lake day, keep the night going with safe nightlife transportation.' },
      { name: 'Airport and private aviation transfers', description: 'Bring guests from regional airports to lake-area docks and rentals.' },
    ],
    planningTitle: 'Dock pickup details we need',
    planningTips: [
      { title: 'Send the road address', description: 'A dock pin is helpful, but drivers need the best legal road pickup point.' },
      { title: 'Share gate codes or community names', description: 'Condos and private communities can slow pickups if access details are missing.' },
      { title: 'Confirm group mobility', description: 'Let us know if guests need extra time walking from dock to vehicle.' },
      { title: 'Build in lake-day buffer', description: 'Boat days often run late. Reserve enough time to keep the evening relaxed.' },
    ],
    faqs: [
      { question: 'Can Lake Ride Pros pick up directly at a boat dock?', answer: 'If the dock has safe legal vehicle access, yes. If not, we coordinate the closest practical road pickup point, marina entrance, condo lobby, or community pickup area.' },
      { question: 'Do you provide marina shuttle service?', answer: 'Yes. We provide private marina shuttle service for groups going between marinas, rentals, restaurants, hotels, vacation rentals, events, and nightlife.' },
      { question: 'Can you pick up after a boat rental or charter?', answer: 'Yes. Share the marina or rental location, expected return time, and passenger count so we can plan the pickup.' },
      { question: 'Do you need GPS coordinates?', answer: 'Coordinates can help, but the most important detail is the road-accessible pickup location where the vehicle can safely stop.' },
      { question: 'Can this connect with airport transportation?', answer: 'Yes. We can bring guests from STL, MCI, SGF, COU, or private aviation arrivals to lake houses, marinas, resorts, and dock-access properties.' },
      { question: 'Is this available late night?', answer: 'Late-night dock or marina returns can be arranged when booked in advance. Summer weekends and holiday dates should be reserved early.' },
    ],
    related: [
      { title: 'Airport Transfers', href: '/services/airport-transfers', description: 'Regional airport rides to lake houses, condos, marinas, and resorts.' },
      { title: 'Restaurant Shuttle', href: '/services/restaurant-shuttle', description: 'Dinner and waterfront bar transportation for private groups.' },
      { title: 'Lake Tours & Sightseeing', href: '/services/lake-tours-sightseeing', description: 'Private transportation for Lake Ozarks sightseeing days.' },
    ],
  },
  'lodge-of-four-seasons-transportation': {
    slug: 'lodge-of-four-seasons-transportation',
    title: 'Lodge of Four Seasons Transportation',
    metadataTitle: 'Lodge of Four Seasons Transportation',
    metadataDescription: 'Private shuttle and car service for The Lodge of Four Seasons in Lake Ozark. Wedding, golf, conference, airport, and group transportation.',
    keywords: [
      'Lodge of Four Seasons transportation',
      'The Lodge of Four Seasons shuttle',
      'Lake Ozark resort transportation',
      'Lodge of Four Seasons wedding shuttle',
      'Lodge of Four Seasons airport transfer',
      'Lake Ozark conference transportation',
    ],
    icon: 'Building2',
    heroKicker: 'Resort, wedding, golf, and conference rides',
    heroTitle: 'Lodge of Four Seasons Transportation in Lake Ozark',
    heroDescription: 'Private transportation for guests, wedding parties, conference groups, golf outings, and airport arrivals connected to The Lodge of Four Seasons.',
    primaryCta: 'Book Lodge Transportation',
    priceNote: 'Custom pricing for resort transfers, hourly charters, wedding blocks, and airport routes.',
    introHeading: 'A polished transportation plan for one of Lake Ozark’s anchor resorts',
    intro: [
      'The Lodge of Four Seasons brings together resort guests, wedding parties, golfers, corporate groups, and families. Lake Ride Pros supports those trips with professional transportation designed around arrival times, event timelines, and group movement across the Lake.',
      'Whether your guests are flying into STL or MCI, staying off-property, moving between ceremony and reception locations, or heading out for dinner after a conference, a private shuttle keeps the schedule simpler and the experience more premium.',
    ],
    highlights: [
      { title: 'Wedding guest movement', description: 'Ceremony, reception, rehearsal dinner, welcome party, and late-night return transportation.' },
      { title: 'Airport and resort transfers', description: 'Door-to-door service between The Lodge, regional airports, private aviation, and nearby rentals.' },
      { title: 'Conference-ready service', description: 'Professional drivers and scheduled pickups for meetings, dinners, golf, and group events.' },
    ],
    bestFor: [
      'Wedding guest shuttles',
      'Corporate retreats and conferences',
      'Golf outings and client entertainment',
      'Airport transfers from STL, MCI, SGF, or COU',
      'Dinner and nightlife transportation',
      'Overflow lodging and vacation rental transfers',
    ],
    popularStopsTitle: 'Popular Lodge transportation routes',
    popularStops: [
      { name: 'Regional airports', description: 'Private transfers from STL, MCI, SGF, COU, and private aviation arrivals.' },
      { name: 'Wedding venues and photo locations', description: 'Move guests and wedding parties between resort, ceremony, reception, and lakefront stops.' },
      { name: 'Golf and client outings', description: 'Professional transportation for foursomes, teams, and larger corporate groups.' },
      { name: 'Bagnell Dam Strip', description: 'Nightlife transportation from the resort to the Strip and back.' },
      { name: 'Lake Ozark restaurants', description: 'Dinner transportation when your group wants to leave resort parking behind.' },
      { name: 'Vacation rentals and overflow lodging', description: 'Shuttle guests staying off-property back to The Lodge for events.' },
    ],
    planningTitle: 'Planning tips for Lodge groups',
    planningTips: [
      { title: 'Map lodging groups early', description: 'Tell us which guests are on-property and which are staying elsewhere.' },
      { title: 'Plan return waves', description: 'Weddings and conferences often need early and late return options.' },
      { title: 'Account for formalwear and luggage', description: 'Vehicle choice matters when guests have dresses, suits, clubs, or bags.' },
      { title: 'Book airport routes separately', description: 'Airport arrivals often need dedicated timing outside the main event shuttle.' },
    ],
    faqs: [
      { question: 'Do you provide transportation to The Lodge of Four Seasons?', answer: 'Yes. Lake Ride Pros provides private transportation to and from The Lodge of Four Seasons for weddings, resort stays, conferences, golf outings, dinners, and airport transfers.' },
      { question: 'Can you run a wedding shuttle for Lodge guests?', answer: 'Yes. We can create scheduled shuttle loops for ceremony, reception, rehearsal dinner, after-party, and guest returns.' },
      { question: 'Do you pick up from STL or MCI for Lodge guests?', answer: 'Yes. We provide private airport transfers from St. Louis Lambert, Kansas City International, Springfield-Branson, Columbia Regional, and private aviation locations.' },
      { question: 'Can you transport golf groups?', answer: 'Yes. We can move golf groups, clients, and clubs between lodging, courses, dinners, and events. Share bag count so we match the right vehicle.' },
      { question: 'Is this affiliated with The Lodge of Four Seasons?', answer: 'No. Lake Ride Pros is an independent transportation provider serving Lake of the Ozarks and Lake Ozark-area guests.' },
      { question: 'How early should conference groups book?', answer: 'For conferences, retreats, and weddings, book as early as possible once dates and rough headcount are known. Vehicle availability tightens during peak season.' },
    ],
    related: [
      { title: 'Lake Ozark Transportation', href: '/transportation-lake-ozark', description: 'Local transportation throughout Lake Ozark and nearby waterfront areas.' },
      { title: 'Wedding Transportation', href: '/services/wedding-transportation', description: 'Guest shuttles and wedding-day transportation plans.' },
      { title: 'Corporate Executive Travel', href: '/services/corporate-executive-travel', description: 'Professional transportation for meetings, retreats, and client events.' },
    ],
  },
  'executive-black-car-service': {
    slug: 'executive-black-car-service',
    title: 'Executive Black Car Service',
    metadataTitle: 'Executive Black Car Service Lake Ozarks',
    metadataDescription: 'Executive black car, chauffeur, and private driver service at Lake of the Ozarks. Professional airport, meeting, resort, and client transportation.',
    keywords: [
      'executive black car service Lake of the Ozarks',
      'black car service Lake Ozark',
      'chauffeur service Lake of the Ozarks',
      'private driver Lake Ozarks',
      'executive car service Osage Beach',
      'VIP transportation Lake of the Ozarks',
    ],
    icon: 'Briefcase',
    heroKicker: 'Professional, private, and discreet',
    heroTitle: 'Executive Black Car Service at Lake of the Ozarks',
    heroDescription: 'Premium chauffeur-style transportation for executives, VIP guests, private aviation arrivals, client dinners, meetings, and resort travel.',
    primaryCta: 'Request Executive Service',
    priceNote: 'Executive service is quoted by route, vehicle, wait time, and itinerary requirements.',
    introHeading: 'A better option than hoping rideshare is available',
    intro: [
      'Executives and VIP guests need transportation that feels prepared, private, and on time. Lake Ride Pros provides professional black car and private driver service for airport transfers, business meetings, resort arrivals, client dinners, and confidential travel around Lake of the Ozarks.',
      'This page targets the searches people actually use when they need a higher standard: executive car service, black car service, chauffeur service, private driver, and VIP transportation. The service can be simple point-to-point or reserved hourly for changing schedules.',
    ],
    highlights: [
      { title: 'Professional presentation', description: 'Clean vehicles, professional drivers, and a polished experience for clients and leaders.' },
      { title: 'Airport and private aviation ready', description: 'Ideal for STL, MCI, SGF, COU, Grand Glaize, and private aviation arrivals.' },
      { title: 'Hourly flexibility', description: 'Reserve coverage for meetings, dinners, site visits, golf, and changing executive schedules.' },
    ],
    bestFor: [
      'Executive airport transfers',
      'Private aviation arrivals',
      'Client dinners and entertainment',
      'Conference speakers and VIP guests',
      'Real estate, investor, and site visits',
      'Resort and vacation property arrivals',
    ],
    popularStopsTitle: 'Common executive transportation routes',
    popularStops: [
      { name: 'Airports and FBOs', description: 'Reliable transfers from commercial airports and private aviation access points.' },
      { name: 'Resorts and hotels', description: 'Professional arrivals for The Lodge, Margaritaville, Tan-Tar-A, and other Lake-area stays.' },
      { name: 'Corporate dinners', description: 'Client entertainment transportation without parking or driving concerns.' },
      { name: 'Golf courses', description: 'Premium rides for executives, partners, and client golf outings.' },
      { name: 'Lakefront properties', description: 'Private driver service for showings, owner visits, and VIP guest arrivals.' },
      { name: 'Meetings and events', description: 'Point-to-point or hourly coverage for agendas that may shift.' },
    ],
    planningTitle: 'Executive service expectations',
    planningTips: [
      { title: 'Share itinerary sensitivity', description: 'Let us know if timing, discretion, or waiting coverage is especially important.' },
      { title: 'Include luggage and passenger count', description: 'SUV, Sprinter, and shuttle needs vary based on passengers, bags, clubs, and gear.' },
      { title: 'Book wait time when needed', description: 'Hourly coverage is better for changing meetings than separate one-way rides.' },
      { title: 'Send pickup contacts', description: 'For assistants and group coordinators, provide the day-of contact and passenger phone if possible.' },
    ],
    faqs: [
      { question: 'Does Lake Ride Pros offer black car service?', answer: 'Yes. We provide executive black car and chauffeur-style transportation at Lake of the Ozarks using professional drivers and premium vehicles matched to the group size.' },
      { question: 'Can you handle private aviation transfers?', answer: 'Yes. We provide private aviation and airport transfer service for executives and VIP guests. Share arrival details and luggage needs when booking.' },
      { question: 'Can I book a private driver by the hour?', answer: 'Yes. Hourly coverage is available and recommended for meetings, dinners, golf outings, site visits, and schedules that may change.' },
      { question: 'Is executive service available for client entertainment?', answer: 'Yes. We frequently support client dinners, golf outings, resort transfers, and corporate entertainment throughout Lake of the Ozarks.' },
      { question: 'Do you provide receipts or company billing?', answer: 'Lake Ride Pros can provide booking confirmations and receipts. For recurring corporate needs, ask about the best setup when requesting a quote.' },
      { question: 'What areas do you serve for black car service?', answer: 'We serve Lake Ozark, Osage Beach, Camdenton, Sunrise Beach, Laurie, surrounding Lake communities, regional airports, resorts, and private properties.' },
    ],
    related: [
      { title: 'Corporate Executive Travel', href: '/services/corporate-executive-travel', description: 'Business transportation for meetings, conferences, and client events.' },
      { title: 'Private Aviation Transfers', href: '/services/private-aviation-transfers', description: 'Premium ground transportation for private flight arrivals.' },
      { title: 'Airport Transfers', href: '/services/airport-transfers', description: 'Door-to-door airport service from major regional airports.' },
    ],
  },
  'vacation-rental-transportation': {
    slug: 'vacation-rental-transportation',
    title: 'Vacation Rental Transportation',
    metadataTitle: 'Vacation Rental Transportation Lake Ozarks',
    metadataDescription: 'Transportation for Lake of the Ozarks vacation rentals, Airbnbs, VRBOs, condos, cabins, and lake houses. Airport, dinner, nightlife, and event rides.',
    keywords: [
      'vacation rental transportation Lake of the Ozarks',
      'Airbnb transportation Lake Ozarks',
      'VRBO transportation Lake of the Ozarks',
      'lake house shuttle Lake Ozarks',
      'condo transportation Osage Beach',
      'vacation rental airport transfer Lake Ozarks',
    ],
    icon: 'Home',
    heroKicker: 'For lake houses, condos, Airbnbs, and VRBOs',
    heroTitle: 'Vacation Rental Transportation at Lake of the Ozarks',
    heroDescription: 'Private rides for groups staying in lake houses, condos, Airbnbs, VRBOs, cabins, and waterfront rentals across the Lake.',
    primaryCta: 'Book Rental Pickup',
    priceNote: 'Quoted by pickup location, route, group size, vehicle type, and schedule.',
    introHeading: 'Make the rental house part of the transportation plan',
    intro: [
      'Vacation rentals are one of the best ways to experience Lake of the Ozarks, but they can complicate transportation. Addresses may be tucked into coves, gated communities, steep driveways, condo complexes, or private roads. Lake Ride Pros helps groups plan reliable pickup and return service from the actual place they are staying.',
      'Use this service for airport arrivals, grocery or dinner runs, wedding guest pickups, nightlife transportation, golf outings, lake-day transfers, and safe rides home after events. It is especially useful when a group has one rental house but several different arrival times or plans.',
    ],
    highlights: [
      { title: 'Door-to-door rental pickup', description: 'Service from condos, cabins, lake houses, Airbnbs, VRBOs, resorts, and private homes.' },
      { title: 'Airport arrival friendly', description: 'Bring guests from STL, MCI, SGF, COU, or private aviation directly to the rental.' },
      { title: 'Group logistics support', description: 'One vehicle plan is easier than coordinating multiple cars in unfamiliar Lake roads.' },
    ],
    bestFor: [
      'Bachelor and bachelorette weekends',
      'Family reunions and multi-family trips',
      'Wedding guests staying off-property',
      'Airport arrivals to lake houses',
      'Dinner, bar, and concert transportation',
      'Golf, boating, and activity days',
    ],
    popularStopsTitle: 'Vacation rental transportation routes',
    popularStops: [
      { name: 'Airport to vacation rental', description: 'Door-to-door transfers from regional airports to Lake-area stays.' },
      { name: 'Rental to Bagnell Dam Strip', description: 'Nightlife transportation that gets the whole group home safely.' },
      { name: 'Rental to wedding venue', description: 'Guest shuttles for people staying outside the main hotel block.' },
      { name: 'Rental to waterfront restaurants', description: 'Dinner transportation without assigning a designated driver.' },
      { name: 'Rental to marinas and docks', description: 'Connect lake houses with boat rentals, docks, charters, and marina pickups.' },
      { name: 'Rental to concerts and events', description: 'Group rides to Ozarks Amphitheater, festivals, and seasonal events.' },
    ],
    planningTitle: 'Vacation rental pickup checklist',
    planningTips: [
      { title: 'Send the exact rental address', description: 'Include community name, unit number, building, gate code, and driveway notes.' },
      { title: 'Tell us road conditions', description: 'Steep, narrow, gravel, or limited-turnaround roads may affect vehicle choice.' },
      { title: 'Choose one group contact', description: 'A single day-of contact keeps pickup communication clean.' },
      { title: 'Plan the late return now', description: 'It is easier to reserve a safe return before the group leaves for the night.' },
    ],
    faqs: [
      { question: 'Do you pick up from Airbnbs and VRBOs at Lake of the Ozarks?', answer: 'Yes. Lake Ride Pros picks up from Airbnbs, VRBOs, lake houses, condos, cabins, resorts, and private vacation rentals throughout the Lake area.' },
      { question: 'What information do you need for a vacation rental pickup?', answer: 'We need the exact address, community or building name, gate code if applicable, passenger count, luggage count if relevant, and any driveway or pickup instructions.' },
      { question: 'Can you take our group from a rental to Bagnell Dam Strip?', answer: 'Yes. Vacation rental to Bagnell Dam Strip transportation is a common route for bachelor parties, bachelorette parties, birthdays, and weekend groups.' },
      { question: 'Can you pick up different guests at different times?', answer: 'Yes, depending on schedule and vehicle availability. For multiple arrivals or split groups, share all flight and pickup details so we can quote the right plan.' },
      { question: 'Do you service gated communities and condos?', answer: 'Yes. Please provide gate codes, building numbers, pickup zones, and any security instructions before the trip.' },
      { question: 'Can you bring airport guests directly to a lake house?', answer: 'Yes. We provide airport transfers from STL, MCI, SGF, COU, and private aviation arrivals directly to Lake-area vacation rentals.' },
    ],
    related: [
      { title: 'Airport Transfers', href: '/services/airport-transfers', description: 'Regional airport transportation to Lake-area stays.' },
      { title: 'Boat Dock Pickup', href: '/services/boat-dock-pickup', description: 'Dock, marina, and waterfront access transportation.' },
      { title: 'Bachelor Party Transportation', href: '/services/bachelor-party-transportation', description: 'Private party transportation for Lake weekend groups.' },
    ],
  },
  'hotel-shuttle-service': {
    slug: 'hotel-shuttle-service',
    title: 'Hotel Shuttle Service',
    metadataTitle: 'Hotel Shuttle Service Lake Ozarks',
    metadataDescription: 'Private hotel and resort shuttle service at Lake of the Ozarks. Guest transportation for weddings, events, restaurants, airports, nightlife, and groups.',
    keywords: [
      'hotel shuttle Lake of the Ozarks',
      'resort shuttle Lake Ozarks',
      'Osage Beach hotel transportation',
      'Lake Ozark hotel shuttle',
      'wedding hotel shuttle Lake of the Ozarks',
      'hotel airport shuttle Lake Ozarks',
    ],
    icon: 'Bus',
    heroKicker: 'Hotels, resorts, guest blocks, and group stays',
    heroTitle: 'Hotel Shuttle Service at Lake of the Ozarks',
    heroDescription: 'Private hotel and resort shuttle service for wedding guests, event groups, airport arrivals, dinner plans, nightlife, and Lake-area activities.',
    primaryCta: 'Book Hotel Shuttle',
    priceNote: 'Hotel shuttle pricing depends on route, passenger count, vehicle size, and whether service is one-time, round-trip, or looped.',
    introHeading: 'Reliable hotel transportation for groups that need to move together',
    intro: [
      'Lake of the Ozarks groups often stay across multiple hotels, resorts, condos, and rentals. Lake Ride Pros helps simplify the movement between lodging, venues, restaurants, airports, and events with private hotel shuttle service.',
      'This service is designed for wedding room blocks, corporate groups, family reunions, bachelor and bachelorette weekends, golf groups, and event organizers who need a professional shuttle instead of scattered rideshare plans.',
    ],
    highlights: [
      { title: 'Guest-block friendly', description: 'Move wedding, conference, and event guests from one or more hotels to the right place on time.' },
      { title: 'Loop or point-to-point', description: 'Set a simple round trip, scheduled loops, or hourly coverage for flexible group movement.' },
      { title: 'Airport connection', description: 'Add airport transfers for guests arriving from STL, MCI, SGF, COU, or private aviation.' },
    ],
    bestFor: [
      'Wedding hotel blocks',
      'Corporate meetings and conferences',
      'Youth, church, and sports groups',
      'Family reunions and group vacations',
      'Restaurant and nightlife transportation',
      'Event and concert transportation',
    ],
    popularStopsTitle: 'Hotel shuttle routes we can support',
    popularStops: [
      { name: 'Hotels to wedding venues', description: 'Scheduled guest shuttles for ceremony, reception, and return trips.' },
      { name: 'Hotels to restaurants', description: 'Dinner transportation for groups that do not want to split into separate cars.' },
      { name: 'Hotels to Bagnell Dam Strip', description: 'Nightlife shuttle service with a safe return plan.' },
      { name: 'Hotels to airports', description: 'Airport transfers for out-of-town guests and business travelers.' },
      { name: 'Hotels to concerts and events', description: 'Group transportation to Ozarks Amphitheater and seasonal Lake events.' },
      { name: 'Hotels to golf and activities', description: 'Move groups to tee times, lake activities, tours, and partner stops.' },
    ],
    planningTitle: 'Hotel shuttle planning decisions',
    planningTips: [
      { title: 'Decide between loop and charter', description: 'Loop service works for steady guest flow; hourly charter works better for flexible plans.' },
      { title: 'Confirm pickup zones with lodging', description: 'Some hotels have specific shuttle or bus pickup areas.' },
      { title: 'Use visible schedule language', description: 'Wedding and event guests respond best to simple pickup windows and clear return times.' },
      { title: 'Plan overflow lodging', description: 'If guests are split across hotels and rentals, include every pickup point in the quote.' },
    ],
    faqs: [
      { question: 'Do you provide hotel shuttle service at Lake of the Ozarks?', answer: 'Yes. Lake Ride Pros provides private hotel and resort shuttle service throughout Lake of the Ozarks for weddings, events, restaurants, airports, nightlife, and group activities.' },
      { question: 'Can you shuttle guests between multiple hotels?', answer: 'Yes. We can build a multi-stop hotel route for guest blocks, conferences, weddings, and group trips.' },
      { question: 'Can hotel shuttle service run on a loop?', answer: 'Yes. Scheduled loops are available when a group needs repeated movement between hotels, venues, and event locations.' },
      { question: 'Do you provide hotel airport transfers?', answer: 'Yes. We can transfer guests between Lake-area hotels and STL, MCI, SGF, COU, and private aviation access points.' },
      { question: 'Can this be used for wedding guests?', answer: 'Yes. Hotel shuttles are one of the most common wedding transportation needs. We can move guests from hotels to the ceremony, reception, after-party, and back.' },
      { question: 'How early should we book a hotel shuttle?', answer: 'For weddings, conferences, holidays, and peak summer weekends, book as early as possible. Vehicle availability is limited during high-demand dates.' },
    ],
    related: [
      { title: 'Wedding Transportation', href: '/services/wedding-transportation', description: 'Guest shuttles and full wedding-day transportation planning.' },
      { title: 'Group Shuttle Services', href: '/services/group-shuttle-services', description: 'Private shuttles for larger groups and event logistics.' },
      { title: 'Vacation Rental Transportation', href: '/services/vacation-rental-transportation', description: 'Transportation for guests staying outside hotel blocks.' },
    ],
  },
};

export function getSeoServicePage(slug: string): SeoServicePageData {
  return seoServicePages[slug];
}

export const seoServicePageList = Object.values(seoServicePages);

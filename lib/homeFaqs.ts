export interface HomeFaq {
  question: string
  answer: string
  link?: { href: string; label: string }
}

/** Shared by the visible accordion and homepage FAQ schema. */
export const homeFaqs: HomeFaq[] = [
  {
    question: 'What areas does Lake Ride Pros serve?',
    answer: 'Lake Ride Pros provides transportation throughout Missouri with a focus on Lake of the Ozarks, including Osage Beach, Camdenton, Lake Ozark, and surrounding communities. We also serve Columbia, Jefferson City, Kansas City, St. Louis, and statewide destinations.',
  },
  {
    question: 'How far in advance should I book?',
    answer: 'Lead time depends on the trip. Based on completed trips with usable booking timestamps, the observed median was 2 days for nightlife, 6 days for airport transportation, 25 days for bachelor and bachelorette trips, and 89 days for weddings. For peak summer weekends, reserve earlier whenever possible.',
    link: { href: '/lake-ozarks-transportation-insights', label: 'See the transportation planning data' },
  },
  {
    question: 'What vehicle sizes are available?',
    answer: 'Our published fleet includes 4-passenger Flex vehicles, 7-passenger Elite SUVs, a 13-passenger Executive Sprinter, 14-passenger Limo Bus and Rescue Squad options, the 23-passenger Pink Patrol, and a 37-passenger Executive Shuttle Bus. Luggage and equipment can reduce usable passenger space, so confirm your needs when booking.',
  },
  {
    question: 'How much does transportation cost at Lake of the Ozarks?',
    answer: 'Rates vary by service tier, vehicle, distance, timing, duration, passenger count, and trip requirements. Review the current pricing page or contact Lake Ride Pros at (573) 206-9499 for an exact quote.',
    link: { href: '/pricing', label: 'Review current pricing' },
  },
  {
    question: 'Can you coordinate transportation for a large group?',
    answer: 'Yes. A single Lake Ride Pros vehicle carries up to 37 passengers, and our team can coordinate multiple vehicles for groups of 200 or more. We build transportation plans for weddings, corporate events, conferences, and other large gatherings throughout Missouri.',
    link: { href: '/services/group-shuttle-services', label: 'Explore group shuttle services' },
  },
  {
    question: 'Do you provide wedding transportation?',
    answer: 'Yes. We coordinate guest shuttles between hotels, ceremony locations, reception venues, and after-parties throughout Lake of the Ozarks, including major resorts and venues such as Margaritaville, Old Kinderhook, and Lodge of Four Seasons.',
  },
  {
    question: 'Which airports do you serve?',
    answer: 'We provide airport transportation to and from Kansas City International Airport (MCI), St. Louis Lambert International Airport (STL), Springfield-Branson National Airport (SGF), Columbia Regional Airport (COU), and private aviation terminals. Flight-aware coordination helps us adjust pickup timing when schedules change.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made at least 48 hours before service receive a full refund minus the processing fee. Cancellations made 24 to 48 hours before service receive a 50% refund. Cancellations less than 24 hours before service are non-refundable. Weather exceptions apply; review the Terms of Service for complete details.',
    link: { href: '/terms-of-service', label: 'Read the Terms of Service' },
  },
  {
    question: 'Are your drivers licensed and insured?',
    answer: 'Yes. Lake Ride Pros drivers are professionally trained, fully licensed, and background-checked. We maintain commercial liability insurance and the permits and licenses required for our transportation services in Missouri.',
  },
  {
    question: 'Can you transport a group around Bagnell Dam Strip?',
    answer: 'Yes. Our party buses and shuttles provide group transportation around Bagnell Dam Strip and Lake of the Ozarks nightlife destinations, helping your group travel together with a professional driver for bachelor and bachelorette parties, birthdays, concerts, and nights out.',
  },
]

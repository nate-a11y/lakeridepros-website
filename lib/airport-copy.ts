// Typical Osage Beach/Lake Ozark order, not a distance guarantee for every Lake address.
export const commercialAirports = [
  { code: 'COU', city: 'Columbia', name: 'Columbia Regional Airport', href: '/columbia-to-lake-ozarks' },
  { code: 'SGF', city: 'Springfield', name: 'Springfield-Branson National Airport', href: '/springfield-to-lake-ozarks' },
  { code: 'STL', city: 'St. Louis', name: 'St. Louis Lambert International Airport', href: '/st-louis-to-lake-ozarks' },
  { code: 'MCI', city: 'Kansas City', name: 'Kansas City International Airport', href: '/kansas-city-to-lake-ozarks' },
] as const

export const commercialAirportOrderAnswer = `For typical trips to Osage Beach and Lake Ozark, commercial airports generally run from closest to farthest: ${commercialAirports.map(airport => `${airport.name} (${airport.code})`).join(', ')}. Exact distances and driving times depend on your Lake destination, route, and traffic.`
export const nearestAirportAnswer = `For scheduled commercial flights, Columbia Regional Airport (COU) is generally the closest option to Osage Beach and Lake Ozark. ${commercialAirportOrderAnswer} For private aviation, local options include Lee C. Fine Memorial Airport (AIZ), Grand Glaize Airport (K15), and Camdenton Memorial-Lake Regional Airport; these are separate airports.`
export const servedAirportsAnswer = `We provide airport transportation to and from ${commercialAirports.map(airport => `${airport.name} (${airport.code})`).join(', ')}, plus local private aviation airports. Flight-aware coordination helps us adjust pickup timing when schedules change.`

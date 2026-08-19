export interface DestinationLanding {
  slug: string;
  city: string;
  country: string;
  countryCode: string;
  airportCode: string;
  bestFor: string;
  image: string;
  intro: string;
  familyFriendly: string;
  octoberAdvice: string;
  visaFromAustralia: string;
  itinerary: string[];
  highlights: string[];
}

export const destinationLandings: DestinationLanding[] = [
  {
    slug: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    airportCode: 'TYO',
    bestFor: 'family travel, food, culture, and theme parks',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&auto=format&fit=crop',
    intro: 'Tokyo combines easy public transport, memorable family attractions, extraordinary food, and neighborhoods that reward curious travelers.',
    familyFriendly: 'Yes. Tokyo is highly family friendly, with reliable transport, spacious parks, interactive museums, Tokyo Disneyland nearby, and food options for different ages.',
    octoberAdvice: 'October is one of Tokyo’s most comfortable months: warm days, cooler evenings, autumn color beginning in some parks, and generally good conditions for walking.',
    visaFromAustralia: 'Australian passport holders can generally visit Japan visa-free for short tourist stays, subject to current entry rules. Verify the latest requirements before departure.',
    itinerary: ['Asakusa, Senso-ji, and Tokyo Skytree', 'Shibuya, Meiji Jingu, and Harajuku', 'Odaiba, teamLab-style digital art, or Tokyo Disneyland'],
    highlights: ['Senso-ji and Asakusa', 'Shibuya Crossing', 'Tokyo Disneyland', 'Meiji Jingu', 'Tsukiji Outer Market'],
  },
  {
    slug: 'bali',
    city: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    airportCode: 'DPS',
    bestFor: 'beaches, wellness, culture, and relaxed family escapes',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&auto=format&fit=crop',
    intro: 'Bali offers a flexible mix of beaches, temples, rice terraces, wellness stays, and family-friendly experiences across a compact island.',
    familyFriendly: 'Yes, especially around Sanur, Nusa Dua, and Ubud. Choose accommodation with a pool, plan transfers between areas, and keep outdoor activities flexible.',
    octoberAdvice: 'October is a shoulder-season month with warm temperatures and a mix of sunny and wet periods. It can be a good value window before the busier holiday season.',
    visaFromAustralia: 'Australian travelers may need an Indonesian visitor visa or visa on arrival depending on passport and current rules. Check Indonesia’s official immigration guidance before booking.',
    itinerary: ['Sanur or Nusa Dua beach day and sunset', 'Ubud rice terraces, a temple, and a cooking experience', 'Nusa Dua water activity or a relaxed beach and spa day'],
    highlights: ['Ubud rice terraces', 'Uluwatu Temple', 'Sanur Beach', 'Nusa Dua', 'Ubud markets'],
  },
  {
    slug: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    airportCode: 'KIX',
    bestFor: 'temples, traditional culture, food, and slow travel',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&auto=format&fit=crop',
    intro: 'Kyoto is a strong choice for travelers who want a concentrated introduction to Japanese history, gardens, temples, craft, and seasonal food.',
    familyFriendly: 'Yes. Kyoto works well for families who balance temple visits with parks, hands-on cultural activities, and short day trips.',
    octoberAdvice: 'October is a popular month with pleasant walking weather. Book accommodation early, especially around weekends and autumn travel periods.',
    visaFromAustralia: 'Australian passport holders can generally visit Japan visa-free for short tourist stays, subject to current entry rules. Verify requirements before departure.',
    itinerary: ['Fushimi Inari early, Gion lanes, and a tea experience', 'Arashiyama bamboo grove, river area, and Tenryu-ji', 'Kiyomizu-dera, Nishiki Market, and a quiet garden'],
    highlights: ['Fushimi Inari Taisha', 'Arashiyama', 'Kiyomizu-dera', 'Gion', 'Nishiki Market'],
  },
  {
    slug: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    airportCode: 'SIN',
    bestFor: 'short breaks, food, family attractions, and city convenience',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&auto=format&fit=crop',
    intro: 'Singapore is an easy short-haul destination with efficient transport, excellent food, modern attractions, and a polished family travel experience.',
    familyFriendly: 'Yes. Sentosa, Gardens by the Bay, the Singapore Zoo, and short travel times make Singapore particularly practical with children.',
    octoberAdvice: 'October is hot and humid with a chance of showers. Plan outdoor attractions early and keep indoor food, museum, or shopping options as backups.',
    visaFromAustralia: 'Australian passport holders generally do not need a visa for short tourist visits to Singapore, but entry requirements can change. Confirm with official sources.',
    itinerary: ['Marina Bay, Gardens by the Bay, and an evening light show', 'Singapore Zoo or Sentosa', 'Chinatown, Little India, and a hawker-center food trail'],
    highlights: ['Gardens by the Bay', 'Sentosa Island', 'Singapore Zoo', 'Marina Bay', 'Maxwell Food Centre'],
  },
  {
    slug: 'paris',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    airportCode: 'PAR',
    bestFor: 'art, food, architecture, romance, and family city breaks',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&auto=format&fit=crop',
    intro: 'Paris layers iconic landmarks with neighborhood cafés, museums, gardens, markets, and easy day trips for a first European city break.',
    familyFriendly: 'Yes, when the itinerary mixes major sights with parks, boat rides, interactive museums, and regular breaks.',
    octoberAdvice: 'October brings cool, changeable weather and fewer crowds than peak summer. Pack layers and reserve major attractions ahead of time.',
    visaFromAustralia: 'Australians can generally visit the Schengen Area visa-free for short tourist stays, subject to current rules and any new travel authorization requirements.',
    itinerary: ['Eiffel Tower area, Seine cruise, and Trocadéro', 'Louvre or Musée d’Orsay, Tuileries, and a Left Bank walk', 'Montmartre, Sacré-Cœur, and a food market'],
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River', 'Luxembourg Gardens'],
  },
  {
    slug: 'queenstown',
    city: 'Queenstown',
    country: 'New Zealand',
    countryCode: 'NZ',
    airportCode: 'ZQN',
    bestFor: 'adventure, mountains, scenery, and compact outdoor trips',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1400&auto=format&fit=crop',
    intro: 'Queenstown is a compact base for dramatic lake and mountain scenery, outdoor adventures, scenic drives, and memorable food and wine.',
    familyFriendly: 'Yes. Families can choose gondola rides, lake cruises, gentle walks, farms, and scenic day trips alongside more intense adventure activities.',
    octoberAdvice: 'October is spring in New Zealand. Expect variable weather, fresh mountain conditions, and a good mix of hiking, sightseeing, and shoulder-season value.',
    visaFromAustralia: 'Australian citizens generally have special entry arrangements for New Zealand. Check the latest New Zealand immigration guidance for your passport and circumstances.',
    itinerary: ['Queenstown Gardens, lakefront, and Skyline gondola', 'Arrowtown and a scenic winery or farm visit', 'Lake Wakatipu cruise or a Milford Sound day trip'],
    highlights: ['Lake Wakatipu', 'Skyline Queenstown', 'Milford Sound', 'Arrowtown', 'The Remarkables'],
  },
];

export function getDestinationLanding(slug: string) {
  return destinationLandings.find((destination) => destination.slug === slug);
}

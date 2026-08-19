export interface EditorialDestination {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  weatherContext: string;
  bestTime: string;
  highlights: string[];
  relatedCities: Array<{ name: string; slug: string; country: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const editorialDestinations: EditorialDestination[] = [
  {
    slug: 'beach',
    name: 'Best Beach Destinations',
    eyebrow: 'Beach travel inspiration',
    description: 'Find warm-water escapes, island stays, and relaxed coastal towns for couples, families, and slow travelers.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop',
    weatherContext: 'Beach weather varies by hemisphere and monsoon season. Tropical destinations can stay warm year-round, but shoulder seasons often bring better value and fewer crowds.',
    bestTime: 'For the best beach conditions, match your destination to its dry season and check regional weather before booking.',
    highlights: ['Maldives for overwater stays', 'Bali for beaches, culture, and wellness', 'Seychelles for quiet island scenery', 'Cancun for beaches and family resorts'],
    relatedCities: [
      { name: 'Bali', slug: 'bali', country: 'Indonesia' },
      { name: 'Singapore', slug: 'singapore', country: 'Singapore' },
    ],
    faqs: [
      { question: 'Which beach destination is best for families?', answer: 'Bali, Singapore, and resort areas with calm water and convenient transfers are strong choices. Your best fit depends on budget, season, and preferred activity level.' },
      { question: 'What should I check before booking a beach trip?', answer: 'Check the destination dry season, water conditions, transfer times, family facilities, cancellation policies, and current entry requirements.' },
      { question: 'Can WanderLink find a beach destination for my budget?', answer: 'Yes. Complete the WanderLink questionnaire and include your budget, preferred climate, group, and activities for a personalized shortlist.' },
    ],
  },
  {
    slug: 'mountains',
    name: 'Best Mountain Destinations',
    eyebrow: 'Mountain travel inspiration',
    description: 'Explore alpine villages, dramatic peaks, scenic railways, and mountain escapes for hiking, snow, and fresh-air adventures.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop',
    weatherContext: 'Mountain weather changes quickly with altitude. Summer is ideal for many hiking regions, while winter brings skiing but requires seasonal gear and transport planning.',
    bestTime: 'Choose your season based on your goal: hiking and scenic drives in warmer months, or snow sports during the local winter season.',
    highlights: ['Swiss Alps for villages and rail journeys', 'Banff for turquoise lakes and hiking', 'Patagonia for wilderness scenery', 'Queenstown for lake and mountain adventures'],
    relatedCities: [
      { name: 'Queenstown', slug: 'queenstown', country: 'New Zealand' },
      { name: 'Kyoto', slug: 'kyoto', country: 'Japan' },
    ],
    faqs: [
      { question: 'Are mountain destinations suitable for children?', answer: 'Many are. Look for gondolas, scenic trains, easy trails, family accommodation, and short transfers instead of planning every day around strenuous hikes.' },
      { question: 'Do I need special travel insurance for mountain trips?', answer: 'Adventure activities may require additional coverage. Review exclusions for hiking, skiing, climbing, and evacuation before purchasing a policy.' },
      { question: 'How do I choose between a ski trip and a hiking trip?', answer: 'Start with the travel month, then compare snow conditions, trail access, equipment costs, and the experience your group wants.' },
    ],
  },
  {
    slug: 'wildlife',
    name: 'Best Wildlife Destinations',
    eyebrow: 'Wildlife travel inspiration',
    description: 'Plan responsible wildlife encounters, safari journeys, rainforest adventures, and marine experiences around the world.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&auto=format&fit=crop',
    weatherContext: 'Wildlife viewing depends on migration, rainfall, breeding seasons, and animal behavior. Dry seasons can improve visibility, but green seasons may offer fewer crowds and lush scenery.',
    bestTime: 'Choose travel dates around the species and experience you care about, not only around general destination weather.',
    highlights: ['Serengeti for migration and safari', 'Galapagos for endemic species', 'Great Barrier Reef for marine life', 'Amazon rainforest for biodiversity'],
    relatedCities: [
      { name: 'Queenstown', slug: 'queenstown', country: 'New Zealand' },
      { name: 'Bali', slug: 'bali', country: 'Indonesia' },
    ],
    faqs: [
      { question: 'What makes a wildlife trip responsible?', answer: 'Choose licensed guides and operators, keep a respectful distance, avoid feeding animals, follow park rules, and support conservation-focused tourism.' },
      { question: 'Is a safari suitable for first-time travelers?', answer: 'Yes. A reputable lodge or guide can handle transport, safety, and timing while you focus on the experience.' },
      { question: 'How far ahead should I plan a wildlife trip?', answer: 'Popular lodges, permits, and small-group tours can sell out months ahead, especially during migration or school holiday periods.' },
    ],
  },
  {
    slug: 'japan',
    name: 'Japan Travel Guide',
    eyebrow: 'Japan travel inspiration',
    description: 'Compare Tokyo, Kyoto, Osaka, and Japan\'s regional escapes for food, culture, technology, nature, and family travel.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&auto=format&fit=crop',
    weatherContext: 'Japan has distinct seasons and regional differences. Spring and autumn are popular for comfortable sightseeing, summer is lively but humid, and winter is excellent for snow destinations.',
    bestTime: 'Choose spring for blossoms, autumn for foliage, winter for skiing and seasonal food, or summer for festivals and northern escapes.',
    highlights: ['Tokyo for neighborhoods and modern culture', 'Kyoto for temples and traditional experiences', 'Osaka for food and nightlife', 'Hokkaido for nature and winter sports'],
    relatedCities: [
      { name: 'Tokyo', slug: 'tokyo', country: 'Japan' },
      { name: 'Kyoto', slug: 'kyoto', country: 'Japan' },
    ],
    faqs: [
      { question: 'Is Japan family friendly?', answer: 'Yes. Japan offers excellent public transport, clean facilities, interactive museums, parks, theme parks, and food options for different ages.' },
      { question: 'How many days do I need for a first Japan trip?', answer: 'Seven to fourteen days allows a comfortable Tokyo and Kyoto itinerary, with extra time for Osaka, day trips, or a regional extension.' },
      { question: 'Do Australians need a visa for Japan?', answer: 'Australian passport holders can generally visit Japan visa-free for short tourist stays, subject to current entry rules. Verify requirements before departure.' },
    ],
  },
  {
    slug: 'australia',
    name: 'Australia Travel Guide',
    eyebrow: 'Australia travel inspiration',
    description: 'Discover city breaks, reef escapes, wildlife, beaches, and outback journeys across Australia.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d2?w=1600&auto=format&fit=crop',
    weatherContext: 'Australia\'s seasons vary significantly by region. Tropical north, temperate southern cities, and the arid interior can have completely different conditions at the same time.',
    bestTime: 'Match the region to your month: southern cities are often best in spring and autumn, while northern tropical areas are commonly planned around the dry season.',
    highlights: ['Sydney for beaches and city culture', 'Great Barrier Reef for marine life', 'Melbourne for food and arts', 'Uluru for desert landscapes and Indigenous culture'],
    relatedCities: [
      { name: 'Queenstown', slug: 'queenstown', country: 'New Zealand' },
      { name: 'Singapore', slug: 'singapore', country: 'Singapore' },
    ],
    faqs: [
      { question: 'What is the best month to travel around Australia?', answer: 'There is no single best month for the whole country. Choose the region first, then match your dates to its weather and school holiday calendar.' },
      { question: 'Is Australia suitable for a short trip?', answer: 'Yes, if you focus on one city or region. Distances are large, so avoid trying to cover the entire country in a few days.' },
      { question: 'How can WanderLink personalize an Australia trip?', answer: 'The questionnaire matches your source city, budget, group, climate preferences, and activities to suitable domestic and international destinations.' },
    ],
  },
];

export function getEditorialDestination(slug: string) {
  return editorialDestinations.find((destination) => destination.slug === slug);
}

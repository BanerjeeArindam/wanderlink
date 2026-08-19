'use client';

import { useState, useEffect } from 'react';

interface Destination {
  name: string;
  country: string;
  image: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  destinations: Destination[];
}

const DESTINATION_CATEGORIES: Category[] = [
  {
    id: 'beach',
    name: 'Beach',
    emoji: '🏖️',
    destinations: [
      {
        name: 'Maldives',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
        description: 'Tropical paradise with crystal-clear waters and overwater bungalows',
      },
      {
        name: 'Bora Bora',
        country: 'French Polynesia',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        description: 'Stunning lagoon surrounded by lush green mountains',
      },
      {
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
        description: 'White cliffs overlooking the Aegean Sea with breathtaking sunsets',
      },
      {
        name: 'Seychelles',
        country: 'Seychelles',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
        description: 'Pristine islands with granite boulders and untouched beaches',
      },
      {
        name: 'Cancun',
        country: 'Mexico',
        image: 'https://images.unsplash.com/photo-1548932268-21ddf3a973e0?w=800&h=600&fit=crop',
        description: 'Vibrant beach resort with turquoise waters and ancient ruins nearby',
      },
    ],
  },
  {
    id: 'mountain',
    name: 'Mountain',
    emoji: '⛰️',
    destinations: [
      {
        name: 'Swiss Alps',
        country: 'Switzerland',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Majestic peaks with charming alpine villages and hiking trails',
      },
      {
        name: 'Mount Everest',
        country: 'Nepal',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'World\'s highest peak with dramatic mountain landscape',
      },
      {
        name: 'Banff National Park',
        country: 'Canada',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Turquoise lakes surrounded by towering Rocky Mountains',
      },
      {
        name: 'Patagonia',
        country: 'Argentina',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Dramatic peaks and glaciers in South America\'s wilderness',
      },
      {
        name: 'Dolomites',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'UNESCO World Heritage mountain range with stunning scenery',
      },
    ],
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    emoji: '🦁',
    destinations: [
      {
        name: 'Serengeti',
        country: 'Tanzania',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop',
        description: 'Epic safari experience with great wildebeest migration',
      },
      {
        name: 'Amazon Rainforest',
        country: 'Brazil',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe3e?w=800&h=600&fit=crop',
        description: 'World\'s largest rainforest teeming with exotic wildlife',
      },
      {
        name: 'Galapagos Islands',
        country: 'Ecuador',
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=600&fit=crop',
        description: 'Unique wildlife sanctuary with endemic species',
      },
      {
        name: 'Masai Mara',
        country: 'Kenya',
        image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop',
        description: 'Premium safari destination with diverse African wildlife',
      },
      {
        name: 'Great Barrier Reef',
        country: 'Australia',
        image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=600&fit=crop',
        description: 'World\'s largest coral reef system with incredible marine life',
      },
    ],
  },
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '🧗',
    destinations: [
      {
        name: 'Moab',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Rock climbing and mountain biking paradise in red rock country',
      },
      {
        name: 'Queenstown',
        country: 'New Zealand',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
        description: 'Adventure capital with bungee jumping, skydiving, and hiking',
      },
      {
        name: 'Iceland',
        country: 'Iceland',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
        description: 'Geothermal wonders, waterfalls, and glacier trekking',
      },
      {
        name: 'Chamonix',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Alpine mountaineering and world-class hiking in Mont Blanc region',
      },
      {
        name: 'Interlaken',
        country: 'Switzerland',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        description: 'Paragliding, skydiving, and water sports hub in the Alps',
      },
    ],
  },
  {
    id: 'culture',
    name: 'Culture',
    emoji: '🏛️',
    destinations: [
      {
        name: 'Rome',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1552832860-cfbc67d27c44?w=800&h=600&fit=crop',
        description: 'Ancient ruins, Renaissance art, and world-class cuisine',
      },
      {
        name: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1480921596336-be6ded4de5d4?w=800&h=600&fit=crop',
        description: 'Traditional temples, gardens, and geisha culture',
      },
      {
        name: 'Istanbul',
        country: 'Turkey',
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
        description: 'Historic crossroads with Byzantine and Ottoman architecture',
      },
      {
        name: 'Cusco',
        country: 'Peru',
        image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=600&fit=crop',
        description: 'Incan heritage and gateway to Machu Picchu',
      },
      {
        name: 'Cairo',
        country: 'Egypt',
        image: 'https://images.unsplash.com/photo-1586299235733-3451be7b6517?w=800&h=600&fit=crop',
        description: 'Ancient Egyptian treasures including the Great Pyramids',
      },
    ],
  },
  {
    id: 'theme-parks',
    name: 'Theme Parks',
    emoji: '🎢',
    destinations: [
      {
        name: 'Orlando',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1508738773917-c7edf96bea21?w=800&h=600&fit=crop',
        description: 'Disney World, Universal Studios, and thrilling attractions',
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1480921596336-be6ded4de5d4?w=800&h=600&fit=crop',
        description: 'Tokyo Disneyland and DisneySea with unique Japanese flair',
      },
      {
        name: 'Gold Coast',
        country: 'Australia',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
        description: 'Multiple theme parks and beautiful beaches',
      },
      {
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
        description: 'Disneyland Paris and iconic landmarks',
      },
      {
        name: 'Singapore',
        country: 'Singapore',
        image: 'https://images.unsplash.com/photo-1525048456521-6c0ee64f1860?w=800&h=600&fit=crop',
        description: 'Universal Studios and futuristic attractions',
      },
    ],
  },
];

export default function DestinationSlideshow() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const currentCategory = DESTINATION_CATEGORIES[activeCategory];
  const currentDestination = currentCategory.destinations[activeSlide];

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % currentCategory.destinations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, currentCategory.destinations.length]);

  const handlePrevious = () => {
    setActiveSlide((prev) => (prev - 1 + currentCategory.destinations.length) % currentCategory.destinations.length);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % currentCategory.destinations.length);
    setAutoPlay(false);
  };

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index);
    setActiveSlide(0);
    setAutoPlay(true);
  };

  return (
    <section id="destinations" className="py-24 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400 inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
            ✈️ Explore The World
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Top Destinations by Category
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Discover the world's most amazing destinations across different travel styles and experiences.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {DESTINATION_CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                activeCategory === index
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-teal-500/50'
              }`}
            >
              <span className="text-lg mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Main Slideshow */}
        <div className="relative group bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
          {/* Image Container */}
          <div className="relative h-96 md:h-[500px] overflow-hidden bg-slate-950">
            <img
              src={currentDestination.image}
              alt={currentDestination.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {currentDestination.name}
            </h3>
            <p className="text-teal-300 text-sm font-semibold mb-4">{currentDestination.country}</p>
            <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-lg">
              {currentDestination.description}
            </p>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 group-hover:opacity-100 opacity-70"
            aria-label="Previous destination"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 group-hover:opacity-100 opacity-70"
            aria-label="Next destination"
          >
            →
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="absolute bottom-6 right-6 z-20 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-semibold transition-all hover:scale-105"
          >
            {autoPlay ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {currentCategory.destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSlide(index);
                setAutoPlay(false);
              }}
              className={`h-2 rounded-full transition-all ${
                index === activeSlide
                  ? 'w-8 bg-teal-500'
                  : 'w-2 bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Destination Counter */}
        <div className="text-center mt-6 text-slate-400 text-sm font-semibold">
          {activeSlide + 1} / {currentCategory.destinations.length}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">Love this destination? Let's find your perfect match!</p>
          <a
            href="/questionnaire"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
          >
            Discover Similar Destinations ✈️
          </a>
        </div>
      </div>
    </section>
  );
}

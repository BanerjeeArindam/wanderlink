'use client';

import React, { useEffect, useState } from 'react';

// Smooth interpolation function (similar to Remotion)
const interpolate = (
  frame: number,
  inputRange: number[],
  outputRange: number[],
  options?: { extrapolateRight?: string }
): number => {
  let result = outputRange[0];
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (frame >= inputRange[i] && frame <= inputRange[i + 1]) {
      const progress = (frame - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      result = outputRange[i] + (outputRange[i + 1] - outputRange[i]) * progress;
      break;
    }
  }
  if (options?.extrapolateRight === 'clamp' && frame > inputRange[inputRange.length - 1]) {
    result = outputRange[outputRange.length - 1];
  }
  return result;
};

// Spring animation function (similar to Remotion)
const spring = (frame: number, fps: number = 30, damping: number = 12): number => {
  const stiffness = 100;
  const mass = 1;
  const t = frame / fps;
  
  if (frame <= 0) return 0;
  
  const omega = Math.sqrt(stiffness / mass);
  const decay = Math.exp(-damping * t);
  const oscillation = Math.sin(omega * t + Math.PI / 2);
  
  return 1 - decay * oscillation;
};

export const WanderLinkHowItWorks: React.FC<{ autoPlay?: boolean }> = ({ autoPlay = true }) => {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const fps = 30;
  const totalFrames = 700;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isPlaying, fps, totalFrames]);

  // Scene 1: Quiz & Preferences (frames 0-95)
  const scene1Opacity = interpolate(frame, [0, 15, 80, 95], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const scene1Scale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' });

  // Scene 2: AI Analysis (frames 100-195)
  const scene2Opacity = interpolate(frame, [100, 115, 180, 195], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const scene2Scale = interpolate(frame, [100, 120], [0.8, 1], { extrapolateRight: 'clamp' });

  // Scene 3: Destination Details (frames 200-295)
  const scene3Opacity = interpolate(frame, [200, 215, 280, 295], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const cardScale = spring(Math.max(0, frame - 200), fps, 12);

  // Scene 4: Trip Plan (frames 300-395)
  const scene4Opacity = interpolate(frame, [300, 315, 380, 395], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const itineraryScale = interpolate(frame, [300, 320], [0.8, 1], { extrapolateRight: 'clamp' });

  // Scene 5: Booking & Hotels (frames 400-495)
  const scene5Opacity = interpolate(frame, [400, 415, 480, 495], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const bookingScale = interpolate(frame, [400, 420], [0.8, 1], { extrapolateRight: 'clamp' });

  // Scene 6: Email Results (frames 500-595)
  const scene6Opacity = interpolate(frame, [500, 515, 580, 595], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });
  const emailScale = interpolate(frame, [500, 520], [0.8, 1], { extrapolateRight: 'clamp' });

  // Scene 7: Historical Searches (frames 600-695)
  const scene7Opacity = interpolate(frame, [600, 615, 680, 695], [0, 1, 1, 1], {
    extrapolateRight: 'clamp',
  });
  const historyScale = interpolate(frame, [600, 620], [0.8, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center font-sans overflow-hidden"
      style={{ minHeight: '600px' }}
      onClick={() => setIsPlaying(!isPlaying)}
      role="button"
      tabIndex={0}
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* SCENE 1: Quiz & Preferences */}
      <div
        className="absolute text-center space-y-4 px-6 transition-all duration-300"
        style={{
          opacity: scene1Opacity,
          transform: `scale(${scene1Scale})`,
          pointerEvents: scene1Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 01
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">Answer Your Travel Quiz</h1>
        <p className="text-slate-300 text-xl sm:text-2xl max-w-xl mx-auto">
          Tell us about your budget, travel dates, group type & climate preference.
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">💰 Budget</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">📅 Month</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">👥 Group Type</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">🌍 Domestic/International</span>
        </div>
      </div>

      {/* SCENE 2: AI Analysis */}
      <div
        className="absolute text-center space-y-4 px-6 transition-all duration-300"
        style={{
          opacity: scene2Opacity,
          transform: `scale(${scene2Scale})`,
          pointerEvents: scene2Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 02
          </span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">AI Analyzes Your Preferences</h1>
        <p className="text-slate-300 text-xl sm:text-2xl max-w-xl mx-auto">
          GPT-4o processes your preferences with live destination context.
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">🧠 GPT-4o Engine</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">⛅ Weather Data</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">🗺️ Visa Status</span>
          <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">📸 Real Photos</span>
        </div>
      </div>

      {/* SCENE 3: Destination Details */}
      <div
        className="absolute flex flex-col items-center space-y-6 px-6 transition-all duration-300"
        style={{
          opacity: scene3Opacity,
          pointerEvents: scene3Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 03
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-teal-500/50 p-8 rounded-3xl shadow-2xl text-center max-w-lg transition-all"
          style={{
            transform: `scale(${Math.min(1, cardScale * 1.2)})`,
          }}
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=200&h=200&fit=crop"
              alt="Tokyo"
              className="w-24 h-24 rounded-full border-4 border-teal-500/30 object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Tokyo, Japan</h2>
          <span className="inline-block bg-teal-500/20 text-teal-300 font-bold px-4 py-2 rounded-full text-lg border border-teal-500/30 mb-4">
            Personalized match
          </span>
          <p className="text-slate-300 text-lg mb-4">
            Perfect match for your travel DNA with curated highlights, visitor ratings & key attractions.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-500/20">
              ☀️ 22°C
            </span>
            <span className="bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-500/20">
              🛂 Visa-Free
            </span>
            <span className="bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/20">
              💰 JPY
            </span>
          </div>
        </div>
      </div>

      {/* SCENE 4: Trip Plan */}
      <div
        className="absolute flex flex-col items-center space-y-6 px-6 transition-all duration-300"
        style={{
          opacity: scene4Opacity,
          pointerEvents: scene4Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-violet-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 04
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-violet-900/30 to-slate-900 border border-violet-500/30 p-8 rounded-3xl shadow-2xl text-center max-w-lg transition-all"
          style={{
            transform: `scale(${itineraryScale})`,
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">🗓️ Day-by-Day Trip Plan</h2>
          <div className="text-left space-y-2 text-slate-300 text-sm">
            <p><span className="text-violet-400 font-bold">Day 1:</span> Arrive & settle into your base</p>
            <p><span className="text-violet-400 font-bold">Day 2:</span> Explore city highlights & local food scene</p>
            <p><span className="text-violet-400 font-bold">Day 3:</span> Visit major attractions & scenic spots</p>
            <p><span className="text-violet-400 font-bold">Day 4:</span> Guided experience or free day</p>
            <p><span className="text-violet-400 font-bold">Day 5:</span> Final neighborhood walk & departure</p>
          </div>
          <p className="text-violet-300 mt-4 font-semibold">Generated by GPT-4o based on your preferences</p>
        </div>
      </div>

      {/* SCENE 5: Booking & Hotels */}
      <div
        className="absolute flex flex-col items-center space-y-6 px-6 transition-all duration-300"
        style={{
          opacity: scene5Opacity,
          pointerEvents: scene5Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 05
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl max-w-lg transition-all"
          style={{
            transform: `scale(${bookingScale})`,
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">🏨 Book Hotels & Tours</h2>
          <div className="space-y-3">
            <a
              href="#"
              className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center transition-colors"
            >
              🏨 Find Accommodation
            </a>
            <a
              href="#"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-center transition-colors"
            >
              🎫 Book Tours on Viator
            </a>
            <a
              href="#"
              className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-center transition-colors"
            >
              ✈️ Search Flights
            </a>
          </div>
          <p className="text-slate-300 text-sm mt-4 text-center">Direct links with pre-filled search parameters</p>
        </div>
      </div>

      {/* SCENE 6: Email Results */}
      <div
        className="absolute flex flex-col items-center space-y-6 px-6 transition-all duration-300"
        style={{
          opacity: scene6Opacity,
          pointerEvents: scene6Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Step 06
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-500/30 p-8 rounded-3xl shadow-2xl max-w-lg transition-all"
          style={{
            transform: `scale(${emailScale})`,
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4 text-center">📧 Email Your Results</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm text-slate-300 mb-2"><span className="font-bold text-amber-300">To:</span> your@email.com</p>
            <p className="text-sm text-slate-300 mb-2"><span className="font-bold text-amber-300">Subject:</span> Your WanderLink Travel Recommendations</p>
            <p className="text-xs text-slate-400 mt-3">✓ All 3 destination cards</p>
            <p className="text-xs text-slate-400">✓ Trip plans & itineraries</p>
            <p className="text-xs text-slate-400">✓ Hotel & tour booking links</p>
          </div>
          <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">
            📧 Email Results
          </button>
          <p className="text-slate-300 text-sm mt-3 text-center">Sign in to save results & send emails</p>
        </div>
      </div>

      {/* SCENE 7: Historical Searches */}
      <div
        className="absolute flex flex-col items-center space-y-6 px-6 transition-all duration-300"
        style={{
          opacity: scene7Opacity,
          pointerEvents: scene7Opacity === 0 ? 'none' : 'auto',
        }}
      >
        <div className="inline-block">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-xl animate-pulse">
            Bonus
          </span>
        </div>
        <div
          className="bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/30 p-8 rounded-3xl shadow-2xl max-w-lg transition-all"
          style={{
            transform: `scale(${historyScale})`,
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4 text-center">🕘 Search History</h2>
          <p className="text-slate-300 text-center mb-4">
            Logged-in users can access their historical searches and saved recommendations.
          </p>
          <div className="space-y-2">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <p className="text-sm text-blue-300 font-semibold">📍 Tokyo, Japan</p>
              <p className="text-xs text-slate-400">Searched on August 15, 2024</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <p className="text-sm text-blue-300 font-semibold">🏖️ Bali, Indonesia</p>
              <p className="text-xs text-slate-400">Searched on August 10, 2024</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <p className="text-sm text-blue-300 font-semibold">🗼 Paris, France</p>
              <p className="text-xs text-slate-400">Searched on August 8, 2024</p>
            </div>
          </div>
          <p className="text-blue-300 text-sm mt-4 text-center font-semibold">✨ Sign in to unlock your travel history</p>
        </div>
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute bottom-6 left-6 text-xs text-slate-500 flex items-center gap-2 pointer-events-none">
        <span>{isPlaying ? '▶️' : '⏸️'}</span>
        <span>Click to {isPlaying ? 'pause' : 'play'}</span>
      </div>

      {/* Frame counter (dev) */}
      <div className="absolute bottom-6 right-6 text-xs text-slate-600 pointer-events-none">
        Frame {frame} / {totalFrames}
      </div>
    </div>
  );
};

export default WanderLinkHowItWorks;

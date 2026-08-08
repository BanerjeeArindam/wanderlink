'use client';

import React, { useEffect, useState } from 'react';

interface ViatorTour {
  productCode: string;
  title: string;
  productUrl: string;
  priceFrom?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  durationMinutes?: number;
}

interface Destination {
  destination: string;
  countryCode: string;
  matchScore: number;
  heroTagline: string;
  reasonsToVisit: string[];
  keyHighlights: string[];
  affiliateQuery: string;
  imageUrl?: string;
  viatorTours?: ViatorTour[];
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(minutes?: number) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function ResultsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('wanderlink_results');
    if (savedResults) {
      try {
        setDestinations(JSON.parse(savedResults));
      } catch (e) {
        console.error('Failed to parse saved results:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your AI Travel Recommendations ✨
            </h1>
            <p className="mt-2 text-slate-400">
              Tailored destinations matched to your unique Travel DNA.
            </p>
          </div>
          <a
            href="/questionnaire"
            className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Retake Quiz
          </a>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 mb-4">No recommendations found yet.</p>
            <a
              href="/questionnaire"
              className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-500 font-semibold rounded-lg text-white"
            >
              Start Questionnaire
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                {item.imageUrl && (
  			<div className="h-48 w-full overflow-hidden relative">
    				<img
      					src={item.imageUrl}
      					alt={item.destination}
      					className="w-full h-full object-cover"
   				 />
  			</div>
		)}
		<div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-teal-400">{item.destination}</h2>
                    <span className="bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                      {item.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-slate-300 italic text-sm">{item.heroTagline}</p>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Why it matches:
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                      {item.reasonsToVisit?.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      Top Highlights:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.keyHighlights?.map((spot, i) => (
                        <span key={i} className="bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md">
                          📍 {spot}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.viatorTours && item.viatorTours.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                        Top Viator Tours
                      </h4>
                      <div className="space-y-2">
                        {item.viatorTours.map((tour) => (
                          <a
                            key={tour.productCode}
                            href={tour.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 hover:border-teal-500/50 hover:bg-slate-900 transition-colors"
                          >
                            {tour.imageUrl && (
                              <img
                                src={tour.imageUrl}
                                alt={tour.title}
                                className="h-16 w-16 shrink-0 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-100 line-clamp-2">
                                {tour.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                {tour.rating != null && (
                                  <span>⭐ {tour.rating.toFixed(1)}</span>
                                )}
                                {tour.reviewCount != null && (
                                  <span>({tour.reviewCount} reviews)</span>
                                )}
                                {formatDuration(tour.durationMinutes) && (
                                  <span>· {formatDuration(tour.durationMinutes)}</span>
                                )}
                              </div>
                              {tour.priceFrom != null && tour.currency && (
                                <p className="mt-1 text-sm font-bold text-teal-400">
                                  From {formatPrice(tour.priceFrom, tour.currency)}
                                </p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Affiliate Booking Links */}
                <div className="p-6 bg-slate-850 border-t border-slate-700/50 grid grid-cols-2 gap-3">
                  <a
                    href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(item.affiliateQuery || item.destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-center text-sm transition-colors"
                  >
                    Find Hotels
                  </a>
                  <a
                    href={
                      item.viatorTours?.[0]?.productUrl ||
                      `https://www.viator.com/search/${encodeURIComponent(item.affiliateQuery || item.destination)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg text-center text-sm transition-colors"
                  >
                    {item.viatorTours?.length ? 'View All Tours' : 'Book Tours'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

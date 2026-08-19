'use client';

import React, { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

export interface UtilityData {
  currency?: string;
  visaStatus?: string;
  visaApplyUrl?: string;
  weatherForecast?: string;
  plugType?: string;
  safetyRating?: string;
  insuranceUrl?: string;
}

export interface Experience {
  name: string;
  rating: number;
  reviews: number;
}

export interface DestinationCardProps {
  destination: string;
  airportCode?: string;
  sourceCity?: string;
  sourceCountry?: string;
  adults?: number;
  children?: number;
  matchScore: number;
  heroTagline: string;
  imageUrl?: string;
  reasonsToVisit?: string[];
  utilityData?: UtilityData;
  realVisitorExperiences?: Experience[];
  affiliateQuery?: string;
  tripPlan?: string;
}

interface ModalProps {
  item: DestinationCardProps | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DestinationModal({ item, isOpen, onClose }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" role="presentation" onClick={onClose}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="destination-modal-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-48 w-full bg-slate-800">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'}
            alt={item.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-slate-950/60 p-2 text-slate-300 transition hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <h2 id="destination-modal-title" className="text-2xl font-bold text-white">{item.destination}</h2>
              <p className="text-xs text-amber-400 font-medium">Match Score: {item.matchScore}%</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <p className="text-slate-300 italic text-sm">"{item.heroTagline}"</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
              <span className="text-xs text-slate-400 block">☀️ Weather</span>
              <span className="text-sm font-semibold text-teal-300">
                {item.utilityData?.weatherForecast || 'Weather data unavailable'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
              <span className="text-xs text-slate-400 block">🛂 Visa Status</span>
              <span className="text-sm font-semibold text-teal-300">
                {item.utilityData?.visaStatus || 'Visa status varies'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
              <span className="text-xs text-slate-400 block">💰 Currency</span>
              <span className="text-sm font-semibold text-slate-200">
                {item.utilityData?.currency || 'Currency varies'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
              <span className="text-xs text-slate-400 block">🔌 Power Plug</span>
              <span className="text-sm font-semibold text-slate-200">
                {item.utilityData?.plugType || 'Plug type varies'}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 col-span-2 sm:col-span-2">
              <span className="text-xs text-slate-400 block">🛡️ Safety Advisory</span>
              <span className="text-sm font-semibold text-slate-200">
                {item.utilityData?.safetyRating || 'Check local guidance before travel'}
              </span>
            </div>
          </div>

          {/* Top Verified Visitor Experiences */}
          {item.realVisitorExperiences && item.realVisitorExperiences.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">
                🌟 Top Visitor Experiences (Verified Reviews)
              </h3>
              <div className="space-y-2">
                {item.realVisitorExperiences.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-sm text-slate-200">{exp.name}</span>
                    <span className="text-xs text-amber-400 font-medium">
                      ★ {exp.rating} ({exp.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Converting Affiliate Action Links */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`/api/stay22?destination=${encodeURIComponent(item.destination)}&adults=${item.adults || 1}&children=${item.children || 0}`}
              onClick={() => trackEvent('accommodation_link_clicked', { destination: item.destination, source: 'destination_modal' })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
            >
              🏨 Find Accommodation
            </a>

            <a
              href={`/api/aviasales?origin=${encodeURIComponent(item.sourceCity || 'Sydney')}&destination=${encodeURIComponent(item.destination)}&destinationCode=${encodeURIComponent(item.airportCode || '')}&adults=${item.adults || 1}&children=${item.children || 0}`}
              onClick={() => trackEvent('flight_link_clicked', { destination: item.destination, source: 'destination_modal' })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
            >
              ✈️ Search Flights
            </a>

            {item.utilityData?.visaApplyUrl && (
              <a
                href={item.utilityData.visaApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold rounded-xl border border-slate-700 transition"
              >
                🛂 Fast-Track e-Visa
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

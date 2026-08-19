'use client';

import DestinationModal from '@/components/DestinationModal';
import { useRouter } from 'next/navigation';
import RegistrationPrompt from '@/components/RegistrationPrompt';
import AdSlot from '@/components/AdSlot';
import { trackEvent } from '@/lib/analytics';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useRef, useState } from 'react';

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
interface UtilityData {
  currency?: string;
  visaStatus?: string;
  visaApplyUrl?: string;
  weatherForecast?: string;
  plugType?: string;
  safetyRating?: string;
  insuranceUrl?: string;
}
interface Experience {
  name: string;
  rating: number;
  reviews: number;
}
interface Destination {
  destination: string;
  airportCode?: string;
  sourceCity?: string;
  sourceCountry?: string;
  adults?: number;
  children?: number;
  countryCode: string;
  matchScore: number;
  heroTagline: string;
  reasonsToVisit: string[];
  keyHighlights: string[];
  affiliateQuery: string;
  imageUrl?: string;
  viatorTours?: ViatorTour[];
  tripPlan?: string;
   // Enriched real-world fields
   utilityData?: UtilityData;
   realVisitorExperiences?: Experience[];
   weatherPrediction?: string;
   kidFriendlyRating?: string;
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

function encodeResults(results: Destination[]) {
  return btoa(encodeURIComponent(JSON.stringify(results)));
}

function decodeResults(value: string): Destination[] | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(value)));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function ResultsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTripPlan, setSelectedTripPlan] = useState<Destination | null>(null);
  const [isTripPlanModalOpen, setIsTripPlanModalOpen] = useState(false);
  const [emailSending, setEmailSending] = useState<string | null>(null);
  const [emailAllSending, setEmailAllSending] = useState(false);
  const [tripPlanEmailSending, setTripPlanEmailSending] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const tripPlanCloseButtonRef = useRef<HTMLButtonElement>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const sharedValue = window.location.hash.startsWith('#results=')
        ? window.location.hash.slice('#results='.length)
        : '';
      const sharedResults = sharedValue ? decodeResults(sharedValue) : null;
      const rawData = localStorage.getItem('wanderlink_results');

      if (sharedResults?.length) {
        setDestinations(sharedResults);
        localStorage.setItem('wanderlink_results', JSON.stringify(sharedResults));
        trackEvent('recommendation_generated', { destination_count: sharedResults.length, source: 'share_link' });
      } else if (rawData && rawData !== 'undefined' && rawData !== 'null') {
        try {
          const parsed = JSON.parse(rawData);
          setDestinations(parsed);
          trackEvent('recommendation_generated', {
            destination_count: Array.isArray(parsed) ? parsed.length : 0,
          });
        } catch (err) {
          console.error('Corrupted JSON in localStorage:', err);
          localStorage.removeItem('wanderlink_results');
        }
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (isTripPlanModalOpen) tripPlanCloseButtonRef.current?.focus();
  }, [isTripPlanModalOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedDestination(null);
        setIsTripPlanModalOpen(false);
        setSelectedTripPlan(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleStartOver = () => {
    localStorage.removeItem('wanderlink_results');
    localStorage.removeItem('wanderlink_questionnaire_draft');
    window.history.replaceState(null, '', '/results');
    router.push('/questionnaire');
  };

  const handleShareResults = async () => {
    const shareUrl = `${window.location.origin}/results#results=${encodeResults(destinations)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('Share link copied');
    } catch {
      window.prompt('Copy your share link:', shareUrl);
      setShareStatus('Share link ready');
    }
    window.setTimeout(() => setShareStatus(''), 2500);
  };

  const openDestinationModal = (item: Destination) => {
    trackEvent('destination_modal_opened', { destination: item.destination });
    setSelectedDestination(item);
    setIsModalOpen(true);
  };

  const closeDestinationModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };

  const openTripPlanModal = (item: Destination) => {
    setSelectedTripPlan(item);
    setIsTripPlanModalOpen(true);
  };

  const closeTripPlanModal = () => {
    setIsTripPlanModalOpen(false);
    setSelectedTripPlan(null);
  };

  const handleSendEmail = async (item?: Destination) => {
    const itemsForEmail = item ? [item] : destinations;

    if (!itemsForEmail.length) return;

    try {
      trackEvent('email_results_requested', {
        destination_count: itemsForEmail.length,
        destination: item?.destination || 'all',
      });
      if (item) {
        setEmailSending(item.destination);
      } else {
        setEmailAllSending(true);
      }

      const response = await fetch('/api/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: itemsForEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to send email');
      }

      alert(
        item
          ? `${item.destination} details were emailed successfully.`
          : 'All recommendation results were emailed successfully.'
      );
    } catch (error: any) {
      console.error('Email send failed:', error);
      alert(error.message || 'Unable to send email right now. Please sign in first.');
    } finally {
      setEmailSending(null);
      setEmailAllSending(false);
    }
  };

  const handleSendTripPlanEmail = async () => {
    if (!selectedTripPlan) return;

    try {
      setTripPlanEmailSending(true);

      const response = await fetch('/api/email-tripplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedTripPlan.destination,
          tripPlan: selectedTripPlan.tripPlan || 'Default trip plan',
          weatherForecast: selectedTripPlan.utilityData?.weatherForecast,
          durationDays: 7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to send email');
      }

      alert(`Trip plan for ${selectedTripPlan.destination} was emailed successfully!`);
    } catch (error: any) {
      console.error('Trip plan email failed:', error);
      alert(error.message || 'Unable to send trip plan email. Please try again.');
    } finally {
      setTripPlanEmailSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your AI Travel Recommendations ✨
            </h1>
            <p className="mt-2 text-slate-400">
              Tailored destinations matched to your unique Travel DNA.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {!isSignedIn && <RegistrationPrompt compact />}
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              ↺ Start over
            </button>
            {destinations.length > 0 && (
              <button
                type="button"
                onClick={handleShareResults}
                className="text-sm bg-teal-600 hover:bg-teal-500 border border-teal-500 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                🔗 Share results
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSendEmail()}
              disabled={!isSignedIn || emailAllSending || destinations.length === 0}
              className="text-sm bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {emailAllSending ? 'Sending...' : '📧 Email All Results'}
            </button>
            <a
              href={isSignedIn ? '/history' : '#register'}
              onClick={(event) => {
                if (!isSignedIn) {
                  event.preventDefault();
                  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              🕘 Saved Itineraries
            </a>
            <a
              href="/questionnaire"
              className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Retake Quiz
            </a>
          </div>
        </div>

        {shareStatus && <p className="text-right text-sm font-semibold text-emerald-300" role="status">{shareStatus}</p>}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm leading-relaxed text-amber-100">
          <strong>AI-generated recommendations:</strong> verify visa requirements, weather, safety guidance, prices, availability, and booking terms with official or provider sources before you travel.
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-16 px-6 bg-slate-800/50 rounded-2xl border border-slate-800">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-3xl" aria-hidden="true">🧭</div>
            <h2 className="text-2xl font-bold text-white">Your travel shortlist is waiting</h2>
            <p className="mx-auto mt-3 max-w-md text-slate-400">Complete the free Travel DNA quiz to get personalized destinations, weather context, and trip ideas.</p>
            <button
              type="button"
              onClick={handleStartOver}
              className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Start Questionnaire
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((item) => (
              <div
                key={item.destination}
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
                  {/* Micro Badges Indicator Bar */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs bg-slate-800 text-teal-300 px-2.5 py-1 rounded-md border border-slate-700">
                      ☀️ {item.utilityData?.weatherForecast?.split('(')[0] || '22°C'}
                    </span>
                    <span className="text-xs bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700">
                      🛂 {item.utilityData?.visaStatus || 'Visa-Free'}
                    </span>
                    {/* Action Buttons */}
                    <button
                      onClick={() => isSignedIn ? openDestinationModal(item) : document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      📖 Full Destination Guide
                    </button>
                    <button
                      onClick={() => isSignedIn ? openTripPlanModal(item) : document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      🗓️ Trip Plan
                    </button>
                  </div>

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
                            href={isSignedIn ? tour.productUrl : '#register'}
                            onClick={(event) => {
                              if (!isSignedIn) {
                                event.preventDefault();
                                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                                return;
                              }
                              trackEvent('tour_link_clicked', { destination: item.destination, tour: tour.title });
                            }}
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
                    href={`/api/stay22?destination=${encodeURIComponent(item.affiliateQuery || item.destination)}&adults=${item.adults || 1}&children=${item.children || 0}`}
                    onClick={() => trackEvent('accommodation_link_clicked', { destination: item.destination, source: 'results_card' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-center text-sm transition-colors"
                  >
                    Find Accommodation
                  </a>
                  <a
                    href={
                      item.viatorTours?.[0]?.productUrl ||
                      `https://www.viator.com/search/${encodeURIComponent(item.affiliateQuery || item.destination)}`
                    }
                    onClick={() => trackEvent('tour_link_clicked', { destination: item.destination, source: 'results_card' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg text-center text-sm transition-colors"
                  >
                    {item.viatorTours?.length ? 'View All Tours' : 'Book Tours'}
                  </a>
                  <a
                    href={`/api/aviasales?origin=${encodeURIComponent(item.sourceCity || 'Sydney')}&destination=${encodeURIComponent(item.destination)}&destinationCode=${encodeURIComponent(item.airportCode || '')}&adults=${item.adults || 1}&children=${item.children || 0}`}
                    onClick={() => trackEvent('flight_link_clicked', { destination: item.destination, source: 'results_card' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-center text-sm transition-colors"
                  >
                    ✈️ Search Flights
                  </a>
                  <button
                    type="button"
                    onClick={() => handleSendEmail(item)}
                    disabled={!isSignedIn || emailSending === item.destination}
                    className="col-span-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60"
                  >
                    {emailSending === item.destination ? 'Sending...' : '📧 Email Destination Details'}
                  </button>
                  <p className="col-span-2 text-center text-xs leading-relaxed text-slate-500">
                    Provider links open in a new tab. If one is unavailable, try a direct search for{' '}
                    <a href={`https://www.google.com/travel/search?q=${encodeURIComponent(`${item.destination} hotels`)}`} target="_blank" rel="noopener noreferrer" className="text-teal-300 underline hover:text-teal-200">accommodation</a>,{' '}
                    <a href="https://www.aviasales.com/" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline hover:text-amber-200">flights</a>, or{' '}
                    <a href={`https://www.viator.com/search/${encodeURIComponent(`${item.destination} tours`)}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline hover:text-blue-200">tours</a>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_RESULTS_SLOT} />

        {!isSignedIn && (
          <div id="register" className="pt-2">
            <RegistrationPrompt />
          </div>
        )}

        <DestinationModal
          item={selectedDestination}
          isOpen={isModalOpen}
          onClose={closeDestinationModal}
        />

        {selectedTripPlan && (
          <div
            className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 transition-opacity ${isTripPlanModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={closeTripPlanModal}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="trip-plan-modal-title"
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Trip plan</p>
                  <h3 id="trip-plan-modal-title" className="mt-2 text-2xl font-bold text-white">{selectedTripPlan.destination}</h3>
                </div>
                <button
                  ref={tripPlanCloseButtonRef}
                  type="button"
                  onClick={closeTripPlanModal}
                  className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  aria-label="Close trip plan"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-sm text-violet-100">
                <span className="font-semibold">Duration:</span> {selectedTripPlan.tripPlan ? 'Based on your selected trip length' : 'Flexible trip length'}
                {selectedTripPlan.utilityData?.weatherForecast && (
                  <span className="ml-3">• Avg weather: {selectedTripPlan.utilityData.weatherForecast}</span>
                )}
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                <iframe
                  title={`${selectedTripPlan.destination} map`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedTripPlan.destination)}&z=8&output=embed`}
                  className="h-56 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-5 space-y-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                {selectedTripPlan.tripPlan ? (
                  selectedTripPlan.tripPlan
                ) : (
                  `Day 1: Arrive and settle into your base.\nDay 2: Explore the city highlights and local cuisine.\nDay 3: Choose one major attraction and one relaxed afternoon.\nDay 4: Take part in a guided experience or day trip.\nDay 5: Enjoy a local market, scenic walk, and final dinner.`
                )}
              </div>

              {isSignedIn && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={handleSendTripPlanEmail}
                    disabled={tripPlanEmailSending}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    {tripPlanEmailSending ? '📧 Sending...' : '📧 Email This Trip Plan'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

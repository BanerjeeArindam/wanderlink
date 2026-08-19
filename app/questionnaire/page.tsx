'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import RegistrationPrompt from '@/components/RegistrationPrompt';
import { trackEvent } from '@/lib/analytics';

interface QuestionnaireData {
  sourceCountry: string;
  preferredDestinationCountry: string;
  departureCity: string;
  travelType: 'domestic' | 'international' | 'both';
  travelMonth: string;
  durationDays: number;
  budgetUsd: number;
  adults: number;
  children: number;
  travelerType: string;
  vibe: string[];
  style: string;
  weather: string;
  visaFreeOnly: boolean;
  maxFlightHours: number;
  interests: string[];
}

// Country and city data
const countryData: Record<string, string[]> = {
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Gold Coast'],
  US: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Miami', 'Las Vegas', 'Seattle', 'Boston'],
  GB: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Edinburgh', 'Liverpool', 'Bristol'],
  CA: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Quebec City'],
  NZ: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin', 'Queenstown', 'Hamilton', 'Tauranga', 'Rotorua'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux'],
  DE: ['Berlin', 'Munich', 'Cologne', 'Hamburg', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Alicante', 'Palma'],
  IT: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Venice', 'Genoa', 'Bologna'],
  JP: ['Tokyo', 'Osaka', 'Yokohama', 'Kyoto', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki'],
  SG: ['Singapore'],
  TH: ['Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Pattaya', 'Chiang Rai', 'Hat Yai', 'Ubon Ratchathani'],
  IN: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'],
  ZA: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Bloemfontein'],
  AE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah'],
  HK: ['Hong Kong'],
  KR: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Ulsan'],
  MX: ['Mexico City', 'Cancun', 'Playa del Carmen', 'Guadalajara', 'Los Cabos', 'Puerto Vallarta', 'Acapulco', 'Cozumel'],
  BR: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Fortaleza'],
  VN: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Halong Bay', 'Hue', 'Can Tho'],
  PH: ['Manila', 'Cebu', 'Boracay', 'Palawan', 'Davao', 'Iloilo', 'Bacolod'],
  MY: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Kota Kinabalu', 'Kuching', 'Selangor'],
  SE: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro'],
  NO: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Kristiansand', 'Tromsø'],
  CH: ['Zurich', 'Geneva', 'Bern', 'Basel', 'Lucerne', 'Zermatt', 'Interlaken'],
  AT: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Klagenfurt'],
  CZ: ['Prague', 'Brno', 'Ostrava', 'Pilsen', 'Olomouc'],
  PT: ['Lisbon', 'Porto', 'Algarve', 'Cascais', 'Madeira', 'Azores'],
  GR: ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Delphi'],
  TR: ['Istanbul', 'Ankara', 'Izmir', 'Cappadocia', 'Bodrum', 'Antalya'],
  EG: ['Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria', 'Sharm El-Sheikh'],
};

const countryNames: Record<string, string> = {
  AU: 'Australia',
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  NZ: 'New Zealand',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  SG: 'Singapore',
  TH: 'Thailand',
  IN: 'India',
  ZA: 'South Africa',
  AE: 'United Arab Emirates',
  HK: 'Hong Kong',
  KR: 'South Korea',
  MX: 'Mexico',
  BR: 'Brazil',
  VN: 'Vietnam',
  PH: 'Philippines',
  MY: 'Malaysia',
  SE: 'Sweden',
  NO: 'Norway',
  CH: 'Switzerland',
  AT: 'Austria',
  CZ: 'Czech Republic',
  PT: 'Portugal',
  GR: 'Greece',
  TR: 'Turkey',
  EG: 'Egypt',
};

const countryCurrencies: Record<string, string> = {
  AU: 'AUD',
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  NZ: 'NZD',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  JP: 'JPY',
  SG: 'SGD',
  TH: 'THB',
  IN: 'INR',
  ZA: 'ZAR',
  AE: 'AED',
  HK: 'HKD',
  KR: 'KRW',
  MX: 'MXN',
  BR: 'BRL',
  VN: 'VND',
  PH: 'PHP',
  MY: 'MYR',
  SE: 'SEK',
  NO: 'NOK',
  CH: 'CHF',
  AT: 'EUR',
  CZ: 'CZK',
  PT: 'EUR',
  GR: 'EUR',
  TR: 'TRY',
  EG: 'EGP',
};

// Approximate local currency value for one AUD, used only for quiz budgeting.
const audExchangeRates: Record<string, number> = {
  AU: 1,
  US: 0.65,
  GB: 0.51,
  CA: 0.88,
  NZ: 1.08,
  FR: 0.60,
  DE: 0.60,
  ES: 0.60,
  IT: 0.60,
  JP: 96,
  SG: 0.84,
  TH: 23,
  IN: 54,
  ZA: 12,
  AE: 2.39,
  HK: 5.05,
  KR: 890,
  MX: 12,
  BR: 3.55,
  VN: 16_500,
  PH: 37,
  MY: 3.05,
  SE: 6.85,
  NO: 7.05,
  CH: 0.56,
  AT: 0.60,
  CZ: 14.8,
  PT: 0.60,
  GR: 0.60,
  TR: 26,
  EG: 32,
};

const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
const QUESTIONNAIRE_DRAFT_KEY = 'wanderlink_questionnaire_draft';
const GUEST_SEARCH_LIMIT = 3;
const MEMBER_SEARCH_LIMIT = 10;
const destinationCountryOptions = [
  { value: 'ANY', label: 'Any country / anywhere' },
  ...Object.entries(countryNames)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([code, name]) => ({ value: code, label: name })),
];

export default function QuestionnairePage() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const searchLimit = isSignedIn ? MEMBER_SEARCH_LIMIT : GUEST_SEARCH_LIMIT;
  const displayedRemainingSearches = remainingSearches ?? searchLimit;

  const [formData, setFormData] = useState<QuestionnaireData>({
    sourceCountry: 'AU',
    preferredDestinationCountry: 'ANY',
    departureCity: 'Sydney',
    travelType: 'both',
    travelMonth: currentMonth,
    durationDays: 10,
    budgetUsd: 5000,
    adults: 2,
    children: 1,
    travelerType: 'family',
    vibe: [],
    style: 'Mid-range',
    weather: 'Hot',
    visaFreeOnly: true,
    maxFlightHours: 8,
    interests: [],
  });

  useEffect(() => {
    trackEvent('questionnaire_started');
    const hydrationTimer = window.setTimeout(() => {
      try {
        const draft = JSON.parse(localStorage.getItem(QUESTIONNAIRE_DRAFT_KEY) || 'null');
        setHasDraft(Boolean(draft?.formData));
        if (draft?.formData) setFormData((current) => ({ ...current, ...draft.formData }));
        if (typeof draft?.step === 'number') setStep(Math.min(5, Math.max(1, draft.step)));
      } catch {
        localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY);
        setHasDraft(false);
      } finally {
        setDraftLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    localStorage.setItem(QUESTIONNAIRE_DRAFT_KEY, JSON.stringify({ formData, step }));
  }, [draftLoaded, formData, step]);

  useEffect(() => {
    if (authLoaded) setRemainingSearches(null);
  }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (!authLoaded) return;

    const quotaTimer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/quota', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && typeof data.remainingSearches === 'number') {
          setRemainingSearches(Math.max(0, data.remainingSearches));
        }
      } catch (error) {
        console.warn('Unable to refresh search quota:', error);
      }
    }, 0);

    return () => window.clearTimeout(quotaTimer);
  }, [authLoaded, isSignedIn]);

  // Get available cities for selected country
  const availableCities = useMemo(() => {
    return countryData[formData.sourceCountry] || [];
  }, [formData.sourceCountry]);

  const budgetCurrency = countryCurrencies[formData.sourceCountry] || 'AUD';
  const budgetRate = audExchangeRates[formData.sourceCountry] || 1;
  const minimumBudget = Math.round(1000 * budgetRate);
  const maximumBudget = Math.round(20000 * budgetRate);
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: budgetCurrency,
    maximumFractionDigits: 0,
  }).format(formData.budgetUsd);

  // Ensure selected city is valid for the country
  const handleCountryChange = (country: string) => {
    const cities = countryData[country] || [];
    const previousRate = audExchangeRates[formData.sourceCountry] || 1;
    const budgetInAud = formData.budgetUsd / previousRate;
    const nextRate = audExchangeRates[country] || 1;
    const nextBudget = Math.round(
      Math.min(20000, Math.max(1000, budgetInAud)) * nextRate
    );

    setFormData({
      ...formData,
      sourceCountry: country,
      departureCity: cities[0] || '',
      budgetUsd: nextBudget,
    });
  };

  const handlePreferredDestinationChange = (countryCode: string) => {
    setFormData((prev) => {
      const nextState = {
        ...prev,
        preferredDestinationCountry: countryCode,
      } as QuestionnaireData;

      if (countryCode !== 'ANY') {
        nextState.travelType = countryCode === prev.sourceCountry ? 'domestic' : 'international';
      }

      return nextState;
    });
  };

  const totalSteps = 5;

  const toggleArrayItem = (field: 'vibe' | 'interests', value: string) => {
    setFormData((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

const handleSubmit = async () => {
  setLoading(true);
  try {
    const payload = {
      sourceCity: formData.departureCity || 'Sydney',
      sourceCountry: formData.sourceCountry,
      preferredDestinationCountry:
        formData.preferredDestinationCountry === 'ANY' ? 'ANY' : formData.preferredDestinationCountry,
      travelType: formData.preferredDestinationCountry !== 'ANY' ? (formData.sourceCountry === formData.preferredDestinationCountry ? 'domestic' : 'international') : formData.travelType,
      groupType: formData.travelerType || 'couple',
      adults: Number(formData.adults) || 1,
      children: Number(formData.children) || 0,
      budgetLevel: formData.style || 'Mid-range',
      durationDays: Number(formData.durationDays) || 7,
      travelMonth: formData.travelMonth || currentMonth,
      preferredClimate: formData.weather === 'Hot' ? 'Hot and sunny' : 'Cool / cold',
      activityVibe: [
        ...(formData.vibe || []),
        ...(formData.interests || []),
      ].map((item) => item.replace(/\s*[\u2600-\u27BF].*$/, '').trim()).filter(Boolean),
      visaPreference: formData.visaFreeOnly && formData.travelType !== 'domestic' ? 'Visa-free only' : 'Any',
    };

    localStorage.removeItem('wanderlink_results');

    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status === 429) {
      setRemainingSearches(0);
      if (data?.isGuest) setLimitReached(true);
      return;
    }

    if (data?.data) {
      setRemainingSearches(typeof data.remainingSearches === 'number' ? data.remainingSearches : null);
      trackEvent('questionnaire_completed', {
        adults: payload.adults,
        children: payload.children,
        source_country: payload.sourceCountry,
      });
      localStorage.setItem('wanderlink_results', JSON.stringify(data.data));
      localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY);

      const existingHistory = JSON.parse(localStorage.getItem('wanderlink_history') || '[]');
      const newEntry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        filters: payload,
        results: data.data,
      };

      localStorage.setItem(
        'wanderlink_history',
        JSON.stringify([newEntry, ...existingHistory].slice(0, 20))
      );

      router.push('/results');
    } else {
      alert('Error generating recommendations: ' + (data?.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    alert('Something went wrong. Please check your connection and API keys.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-2">
            WanderLink Travel DNA
          </h1>
          <p className="text-slate-300 text-lg">Discover your perfect destination in just 5 steps</p>
          {authLoaded && (
            <p className="mt-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              {displayedRemainingSearches} {isSignedIn ? '' : 'free '} {displayedRemainingSearches === 1 ? 'search' : 'searches'} remaining today
            </p>
          )}
          {draftLoaded && hasDraft && (
            <p className="mt-2 text-xs text-slate-400">Your progress is saved on this device.</p>
          )}
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Progress Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold opacity-90">STEP {step} OF {totalSteps}</span>
              <span className="text-sm font-semibold opacity-90">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-10 space-y-6">
          {limitReached && (
            <RegistrationPrompt />
          )}
            {/* STEP 1: Country & City Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Where are you traveling from?</h2>
                  <p className="text-slate-600 text-sm">Select your home country and departure city</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Home Country</label>
                    <select
                      value={formData.sourceCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none bg-white text-slate-900 font-medium"
                    >
                      {Object.entries(countryNames)
                        .sort((a, b) => a[1].localeCompare(b[1]))
                        .map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Departure City</label>
                    <select
                      value={formData.departureCity}
                      onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none bg-white text-slate-900 font-medium"
                    >
                      {availableCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Choose a destination you love, or leave it as anywhere.</label>
                  <select
                    value={formData.preferredDestinationCountry}
                    onChange={(e) => handlePreferredDestinationChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none bg-white text-slate-900 font-medium"
                  >
                    {destinationCountryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {formData.preferredDestinationCountry === 'ANY' && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                    <label className="block text-sm font-semibold text-slate-900 mb-4">Travel Type Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'domestic' as const, label: '🏠 Domestic', desc: 'Within your country' },
                        { value: 'international' as const, label: '✈️ International', desc: 'Abroad' },
                        { value: 'both' as const, label: '🌍 Both', desc: 'Any destination' },
                      ].map(({ value, label, desc }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData({ ...formData, travelType: value })}
                          className={`p-4 rounded-lg border-2 font-semibold transition-all text-center ${
                            formData.travelType === value
                              ? 'bg-gradient-to-br from-orange-400 to-amber-500 border-orange-600 text-white shadow-lg'
                              : 'bg-white border-amber-300 text-slate-900 hover:bg-amber-50'
                          }`}
                        >
                          <div>{label}</div>
                          <div className="text-xs opacity-75">{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.preferredDestinationCountry !== 'ANY' && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Preferred country:</span>{' '}
                    {countryNames[formData.preferredDestinationCountry] || 'Selected destination'}
                    <span className="block mt-1 text-slate-600">This will be prioritized in the recommendation results.</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Adults (18+)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Travel Group Style</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: 'solo', emoji: '🎒', label: 'Solo' },
                      { value: 'couple', emoji: '💑', label: 'Couple' },
                      { value: 'family', emoji: '👨‍👩‍👧‍👦', label: 'Family' },
                      { value: 'friends', emoji: '👯', label: 'Friends' },
                    ].map(({ value, emoji, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelerType: value })}
                        className={`p-4 text-center rounded-lg border-2 font-semibold transition-all ${
                          formData.travelerType === value
                            ? 'bg-gradient-to-br from-teal-400 to-cyan-500 border-teal-600 text-white shadow-lg'
                            : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="text-xs">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Timing, Duration & Budget */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">When & How Much?</h2>
                  <p className="text-slate-600 text-sm">Tell us about your travel timeline and budget</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Travel Month</label>
                    <select
                      value={formData.travelMonth}
                      onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none bg-white text-slate-900 font-medium"
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Trip Duration (Days)</label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold text-slate-900">Total Budget</label>
                    <span className="text-2xl font-bold text-teal-600">{formattedBudget}</span>
                  </div>
                  <input
                    type="range"
                    min={minimumBudget}
                    max={maximumBudget}
                    step="500"
                    value={formData.budgetUsd}
                    onChange={(e) => setFormData({ ...formData, budgetUsd: parseInt(e.target.value) })}
                    className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    style={{
                      background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((formData.budgetUsd - minimumBudget) / (maximumBudget - minimumBudget)) * 100}%, #e0f2fe ${((formData.budgetUsd - minimumBudget) / (maximumBudget - minimumBudget)) * 100}%, #e0f2fe 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-2">
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: budgetCurrency, maximumFractionDigits: 0 }).format(minimumBudget)}</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: budgetCurrency, maximumFractionDigits: 0 }).format(maximumBudget)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Accommodation Preference</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'Budget', emoji: '💰', desc: '$' },
                      { value: 'Mid-range', emoji: '⭐', desc: '$$' },
                      { value: 'Luxury', emoji: '👑', desc: '$$$' },
                    ].map(({ value, emoji, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, style: value })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all text-center ${
                          formData.style === value
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-600 text-white shadow-lg'
                            : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div>{value}</div>
                        <div className="text-xs opacity-75">{desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Vibes & Scenery */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Scenery & Weather</h2>
                  <p className="text-slate-600 text-sm">What's your ideal destination vibe?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Destination Vibes (Select multiple)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Beach 🏖️', 'City 🏙️', 'Nature 🌿', 'Mountains ⛰️', 'Adventure 🧗', 'Desert 🏜️'].map((vibe) => (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() => toggleArrayItem('vibe', vibe)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all text-center ${
                          formData.vibe.includes(vibe)
                            ? 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-600 text-white shadow-lg'
                            : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Preferred Weather</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Hot', 'Cold'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFormData({ ...formData, weather: w })}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                          formData.weather === w
                            ? 'bg-gradient-to-br from-rose-400 to-pink-500 border-rose-600 text-white shadow-lg'
                            : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {w === 'Hot' ? '☀️ Hot Weather' : '❄️ Cold Weather'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${formData.travelType === 'domestic' ? 'from-gray-50 to-gray-100' : 'from-indigo-50 to-blue-50'} border-2 ${formData.travelType === 'domestic' ? 'border-gray-300' : 'border-indigo-200'} rounded-xl p-5`}>
                  <label className={`flex items-center space-x-3 ${formData.travelType === 'domestic' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={formData.visaFreeOnly}
                      onChange={(e) => setFormData({ ...formData, visaFreeOnly: e.target.checked })}
                      disabled={formData.travelType === 'domestic'}
                      className="h-5 w-5 accent-indigo-600 rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Visa-Free Destinations Only</div>
                      <div className="text-xs text-slate-600">
                        {formData.travelType === 'domestic' ? 'Not applicable for domestic travel' : 'Only recommend countries with easy entry rules'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Activities & Interests */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Activities & Interests</h2>
                  <p className="text-slate-600 text-sm">What do you love to do while traveling?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Select your top priorities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Food & Dining 🍜', 'Wildlife 🐘', 'Shopping 🛍️', 'Culture & History 🏛️', 'Skiing ⛷️', 'Theme Parks 🎢', 'Diving & Snorkeling 🦭', 'Nightlife 🍹'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem('interests', item)}
                        className={`p-4 rounded-lg border-2 font-semibold transition-all text-center ${
                          formData.interests.includes(item)
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600 text-white shadow-lg'
                            : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Confirm */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Ready to Discover?</h2>
                  <p className="text-slate-600 text-sm">Here's your travel profile summary</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75">Origin</div>
                    <div className="text-lg font-bold text-slate-900">{countryNames[formData.sourceCountry]}</div>
                    <div className="text-sm text-slate-600">{formData.departureCity}</div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75">Travel Type</div>
                    <div className="text-lg font-bold text-slate-900 capitalize">{formData.travelType === 'both' ? 'Anywhere' : formData.travelType}</div>
                    <div className="text-sm text-slate-600">
                      {formData.travelType === 'domestic' ? 'Within country' : formData.travelType === 'international' ? 'Abroad' : 'Any destination'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75">Timeline</div>
                    <div className="text-lg font-bold text-slate-900">{formData.travelMonth}</div>
                    <div className="text-sm text-slate-600">{formData.durationDays} days • {formattedBudget}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75">Group</div>
                    <div className="text-lg font-bold text-slate-900 capitalize">{formData.travelerType}</div>
                    <div className="text-sm text-slate-600">{formData.adults} adult{formData.adults !== 1 ? 's' : ''}, {formData.children} child{formData.children !== 1 ? 'ren' : ''}</div>
                  </div>
                </div>

                {formData.vibe.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75 mb-2">Preferred Vibes</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.vibe.map((v) => (
                        <span key={v} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-semibold">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.interests.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="text-xs font-semibold text-slate-700 opacity-75 mb-2">Top Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-sm font-semibold">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg p-5 text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-bold text-slate-900">Ready to explore?</div>
                  <div className="text-sm text-slate-700 mt-1">Click "Get Recommendations" to discover your perfect destinations!</div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-60"
                >
                  {loading ? '🔄 Analyzing...' : '✨ Get Recommendations'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

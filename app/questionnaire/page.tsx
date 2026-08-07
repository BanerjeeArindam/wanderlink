'use client';

import React, { useState } from 'react';

interface QuestionnaireData {
  departureCity: string;
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

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<QuestionnaireData>({
    departureCity: 'Sydney (SYD)',
    travelMonth: 'July',
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

  const totalSteps = 4;

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
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('AI Destination Recommendations:', data);
      alert('Preferences submitted successfully! Check console for AI output.');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header & Progress Bar */}
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold tracking-wide">WanderLink Travel DNA</h1>
            <span className="text-sm text-slate-400">Step {step} of {totalSteps}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Form Content */}
        <div className="p-8">
          {/* STEP 1: Origin & Travel Party */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Where and who is traveling?</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Departure City or Airport</label>
                <input
                  type="text"
                  value={formData.departureCity}
                  onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g. Sydney (SYD)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Adults (18+)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Traveler Group Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {['solo', 'couple', 'family', 'friends'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelerType: type })}
                      className={`p-3 text-sm font-medium capitalize rounded-lg border text-center transition-all ${
                        formData.travelerType === type
                          ? 'bg-teal-50 border-teal-500 text-teal-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Timing, Duration & Budget */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Time frame & Budget</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Travel Month</label>
                  <select
                    value={formData.travelMonth}
                    onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Total Budget: <span className="font-bold text-teal-600">${formData.budgetUsd.toLocaleString()} AUD</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={formData.budgetUsd}
                  onChange={(e) => setFormData({ ...formData, budgetUsd: parseInt(e.target.value) })}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Accommodation Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Budget', 'Mid-range', 'Luxury'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, style: s })}
                      className={`p-3 text-sm font-medium rounded-lg border text-center transition-all ${
                        formData.style === s
                          ? 'bg-teal-50 border-teal-500 text-teal-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Vibe & Climate Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Scenery & Weather Preferences</h2>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Destination Vibes (Select multiple)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beach 🏖️', 'City 🏙️', 'Nature 🌿', 'Mountains ⛰️', 'Adventure 🧗'].map((vibe) => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => toggleArrayItem('vibe', vibe)}
                      className={`p-3 text-sm font-medium rounded-lg border text-center transition-all ${
                        formData.vibe.includes(vibe)
                          ? 'bg-teal-50 border-teal-500 text-teal-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Preferred Weather</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hot', 'Cold'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setFormData({ ...formData, weather: w })}
                      className={`p-3 text-sm font-medium rounded-lg border text-center transition-all ${
                        formData.weather === w
                          ? 'bg-teal-50 border-teal-500 text-teal-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {w === 'Hot' ? '☀️ Hot Weather' : '❄️ Cold Weather'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="font-medium text-slate-800 text-sm">Visa-Free Destinations Only</div>
                  <div className="text-xs text-slate-500">Only recommend countries with easy entry rules</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.visaFreeOnly}
                  onChange={(e) => setFormData({ ...formData, visaFreeOnly: e.target.checked })}
                  className="h-5 w-5 accent-teal-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Specific Interests */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Activities & Interests</h2>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Select your top priorities</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Food & Dining 🍜', 'Wildlife 🐘', 'Shopping 🛍️', 'Culture & History 🏛️', 'Skiing ⛷️', 'Theme Parks 🎢', 'Diving & Snorkeling 🦭'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem('interests', item)}
                      className={`p-3 text-sm font-medium rounded-lg border text-left transition-all ${
                        formData.interests.includes(item)
                          ? 'bg-teal-50 border-teal-500 text-teal-700 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center space-x-2"
              >
                {loading ? 'Analyzing Travel DNA...' : 'Get AI Recommendations ✨'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

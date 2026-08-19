'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import RegistrationPrompt from '@/components/RegistrationPrompt';
import type { TripCostResult } from '@/lib/trip-cost';

const initialForm = {
  origin: 'SYD',
  destination: 'HKG',
  attraction: 'Hong Kong Disneyland',
  travelMonth: 'December',
  durationDays: 5,
  adults: 2,
  children: 1,
  seasonType: 'Peak Christmas',
};

export default function TripCostPage() {
  const { isSignedIn } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<TripCostResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const calculate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/trip-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to calculate trip cost.');
      setResult(data.result);
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'Unable to calculate trip cost.');
    } finally {
      setLoading(false);
    }
  };

  const accommodationUrl = `/api/stay22?destination=${encodeURIComponent(form.destination)}&adults=${form.adults}&children=${form.children}`;
  const flightUrl = `/api/aviasales?origin=${encodeURIComponent(form.origin)}&destination=${encodeURIComponent(form.destination)}&adults=${form.adults}&children=${form.children}`;
  const attractionUrl = `https://www.klook.com/en-AU/search/result/?query=${encodeURIComponent(`${form.destination} ${form.attraction}`)}`;

  return (
    <main className="min-h-screen bg-slate-900 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-semibold text-teal-300 hover:text-teal-200">← Back to WanderLink</Link>
        <div className="mt-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Smart planning tool</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Smart Trip Cost Calculator</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">Build a realistic planning range from flights, accommodation, attractions, food, and local transport. No AI-generated price guesses.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <form onSubmit={calculate} className="h-fit space-y-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Trip details</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm text-slate-300">Origin IATA<input value={form.origin} onChange={(event) => update('origin', event.target.value.toUpperCase())} maxLength={3} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 uppercase text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
              <label className="text-sm text-slate-300">Destination IATA<input value={form.destination} onChange={(event) => update('destination', event.target.value.toUpperCase())} maxLength={3} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 uppercase text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
            </div>
            <label className="block text-sm text-slate-300">Attraction<input value={form.attraction} onChange={(event) => update('attraction', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm text-slate-300">Travel month<select value={form.travelMonth} onChange={(event) => update('travelMonth', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400">{['January', 'March', 'June', 'September', 'October', 'December'].map((month) => <option key={month}>{month}</option>)}</select></label>
              <label className="text-sm text-slate-300">Season<select value={form.seasonType} onChange={(event) => update('seasonType', event.target.value)} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"><option>Shoulder season</option><option>Peak Christmas</option><option>Peak summer</option><option>Low season</option></select></label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm text-slate-300">Days<input type="number" min={1} max={30} value={form.durationDays} onChange={(event) => update('durationDays', Number(event.target.value))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
              <label className="text-sm text-slate-300">Adults<input type="number" min={1} max={9} value={form.adults} onChange={(event) => update('adults', Number(event.target.value))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
              <label className="text-sm text-slate-300">Children<input type="number" min={0} max={9} value={form.children} onChange={(event) => update('children', Number(event.target.value))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400" /></label>
            </div>
            {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 px-5 py-3 font-extrabold text-slate-950 transition hover:brightness-110 disabled:opacity-60">{loading ? 'Calculating...' : 'Calculate trip cost'}</button>
            <p className="text-xs leading-relaxed text-slate-500">Estimates are planning ranges, not quotes. Verify live prices with each provider.</p>
          </form>

          <section className="space-y-6">
            {!result ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-8 text-center">
                <div><div className="text-5xl" aria-hidden="true">🧮</div><h2 className="mt-4 text-2xl font-bold text-white">Your itemized estimate will appear here</h2><p className="mt-2 max-w-md text-slate-400">Enter a route and traveler details to compare the major cost categories.</p></div>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-500/15 to-slate-950/60 p-6">
                  <p className="text-sm font-bold uppercase tracking-widest text-teal-300">Estimated total in AUD</p>
                  <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div className="text-5xl font-black text-white">A${result.total.toLocaleString()}</div><p className="text-sm text-slate-400">Planning range A${result.lowTotal.toLocaleString()}–A${result.highTotal.toLocaleString()}</p></div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row"><a href={flightUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-center font-extrabold text-slate-950 hover:bg-amber-300">{result.primaryCta}</a><a href={accommodationUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-center font-bold text-emerald-200 hover:bg-emerald-400/20">Find accommodation</a></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.lineItems.map((item) => <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-5"><div className="flex justify-between gap-3"><h3 className="font-bold text-white">{item.label}</h3><span className="font-bold text-teal-300">A${item.amount.toLocaleString()}</span></div><p className="mt-2 text-sm text-slate-400">{item.detail}</p></div>)}
                </div>
                <a href={attractionUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-blue-400/30 bg-blue-400/10 p-4 text-center font-bold text-blue-200 hover:bg-blue-400/20">🎟️ Find attraction tickets and packages</a>
                {isSignedIn && result.heatmap ? <div className="rounded-2xl border border-violet-400/30 bg-violet-400/5 p-6"><h2 className="text-xl font-bold text-white">6-month flight price heatmap</h2><p className="mt-2 text-sm text-slate-400">Each month shows four weekly planning estimates. Lower values are relative signals, not live fares. Confirm current prices before booking.</p><div className="mt-5 space-y-4">{result.heatmap.map((month) => <div key={month.month} className="rounded-xl bg-slate-900 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold text-violet-200">{month.month}</h3><a href={flightUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-300 underline hover:text-amber-200">Search this route on Aviasales</a></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{month.weeks.map((week) => <div key={`${month.month}-${week.week}`} className="rounded-lg border border-slate-800 bg-slate-950 p-3"><p className="text-xs text-slate-500">{week.week.replace('-', ' ')}</p><p className="mt-1 font-bold text-white">A${week.estimatedFlight.toLocaleString()}</p></div>)}</div></div>)}</div></div> : <RegistrationPrompt />}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

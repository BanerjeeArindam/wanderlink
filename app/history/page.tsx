'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import RegistrationPrompt from '@/components/RegistrationPrompt';

interface SearchEntry {
  id: number;
  created_at?: string;
  createdAt?: string;
  filters?: Record<string, any>;
  query_params?: Record<string, any>;
  results?: Array<Record<string, any>>;
}

export default function SearchHistoryPage() {
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (isSignedIn) {
          const response = await fetch('/api/history');
          if (!response.ok) {
            throw new Error('Unable to fetch history');
          }
          const data = await response.json();
          setEntries(data.data || []);
          return;
        }

        const raw = localStorage.getItem('wanderlink_history');
        setEntries(raw ? JSON.parse(raw) : []);
      } catch (err) {
        console.error('Failed to load history:', err);
        try {
          const raw = localStorage.getItem('wanderlink_history');
          setEntries(raw ? JSON.parse(raw) : []);
        } catch {
          setEntries([]);
        }
      }
    };

    loadHistory();
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Search History</h1>
            <p className="mt-2 text-slate-400">Your recent destination recommendations and filters.</p>
          </div>
          <a
            href="/results"
            className="text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to results
          </a>
        </div>

        {!isSignedIn ? (
          <div className="mx-auto max-w-xl py-12">
            <RegistrationPrompt />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-12 text-center text-slate-400">
            No search history yet. Complete a recommendation quiz to start tracking your trips.
          </div>
        ) : (
          <div className="space-y-5">
            {entries.map((entry) => {
              const createdAt = entry.created_at || entry.createdAt || new Date().toISOString();
              const filters = entry.filters || entry.query_params || {};
              const results = entry.results || [];
              const isTripCost = filters?.type === 'trip_cost';

              return (
                <div key={entry.id} className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-teal-300">{new Date(createdAt).toLocaleString()}</p>
                      <h2 className="mt-2 text-xl font-bold text-white">{isTripCost ? 'Trip cost estimate' : 'Trip filters'}</h2>
                    </div>
                    <a
                      href={isTripCost ? '/trip-cost' : '/questionnaire'}
                      className="inline-flex items-center rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                    >
                      Run again
                    </a>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(filters || {}).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-slate-700 bg-slate-900 p-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{key}</p>
                        <p className="mt-2 text-sm text-slate-200">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-100 mb-3">Results</h3>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {(results || []).map((result, idx) => (
                        <div key={`${entry.id}-${idx}`} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                          {!isTripCost && (
                            <div className="mb-3 h-28 overflow-hidden rounded-lg">
                              <img
                                src={result.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'}
                                alt={result.destination}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-lg font-bold text-teal-400">{result.destination}</h4>
                              {result.matchScore != null && (
                                <span className="rounded-full bg-teal-500/10 px-2 py-1 text-[10px] font-semibold text-teal-300">
                                  {result.matchScore}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-300 italic">{result.heroTagline}</p>
                            <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                              {(result.reasonsToVisit || []).slice(0, 3).map((reason: string, i: number) => (
                                <li key={i}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

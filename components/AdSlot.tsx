'use client';

import { useEffect } from 'react';

interface AdSlotProps {
  slot?: string;
  label?: string;
}

const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSlot({ slot, label = 'Advertisement' }: AdSlotProps) {
  useEffect(() => {
    if (!publisherId || !slot) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('AdSense slot could not be initialized:', error);
    }
  }, [slot]);

  if (!publisherId || !slot) return null;

  return (
    <section className="mx-auto w-full max-w-5xl py-8" aria-label={label}>
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <ins
        className="adsbygoogle block min-h-[120px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/30"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

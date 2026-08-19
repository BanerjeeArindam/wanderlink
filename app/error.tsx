'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('WanderLink application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-900 px-6 text-slate-100">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/60 p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-2xl" aria-hidden="true">
          !
        </div>
        <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          We could not complete that request. You can try again or return to WanderLink and start over.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-teal-500 px-5 py-3 font-bold text-slate-950 transition-colors hover:bg-teal-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

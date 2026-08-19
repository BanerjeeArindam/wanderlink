export default function Loading() {
  return <LoadingScreen message="Preparing your travel experience" />;
}

export function LoadingScreen({ message }: { message: string }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-900 px-6 text-slate-100">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-400/10 shadow-lg shadow-teal-500/10">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-teal-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-white">{message}</h1>
        <p className="mt-2 text-sm text-slate-400">This may take a moment while we gather the details for you.</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />
        </div>
      </div>
    </main>
  );
}

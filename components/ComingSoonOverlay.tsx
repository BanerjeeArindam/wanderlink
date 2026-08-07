export default function ComingSoonOverlay() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r from-emerald-600/20 via-teal-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative mx-6 w-full max-w-lg rounded-3xl border border-slate-700/80 bg-slate-900/90 p-10 shadow-2xl shadow-teal-500/10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-teal-500/20">
          <img src="/logo.svg" alt="WanderLink Logo" className="h-full w-full object-cover" />
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>In Progress</span>
        </div>

        <h1
          id="coming-soon-title"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug"
        >
          Something Extraordinary Is on the Horizon
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
          We are building the future of travel solutions. Keep an eye out.
        </p>

        <div className="mt-8 space-y-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="coming-soon-progress h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Building your next adventure
          </p>
        </div>

        <p className="mt-8 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
          WanderLink Travel Intelligence
        </p>
      </div>
    </div>
  );
}

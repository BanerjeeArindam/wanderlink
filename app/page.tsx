import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-6 text-center">
      <div className="max-w-3xl space-y-8">
        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm font-semibold px-4 py-1.5 rounded-full inline-block">
          🌎 AI-Powered Travel Matching
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Discover Your Next Escape with <span className="text-teal-400">WanderLink</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Answer a few simple questions about your budget, group, and travel style. Our AI engine builds a tailored travel DNA profile to match you with ideal destinations and live booking options.
        </p>
        <div>
          <Link
            href="/questionnaire"
            className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Find My Destination ✨
          </Link>
        </div>
      </div>
    </main>
  );
}

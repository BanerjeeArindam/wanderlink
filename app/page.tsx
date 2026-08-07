import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">

      {/* 🧭 NAVIGATION BAR WITH LOCAL LOGO */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

          {/* Logo Brand loading local file from public/logo.svg */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="WanderLink Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                Wander<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">Link</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                Travel Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#destinations" className="hover:text-teal-400 transition-colors">Destinations</a>
          </div>

          <Link
            href="/questionnaire"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Start DNA Assessment ✨
          </Link>
        </div>
      </nav>

      {/* 🌟 HERO SECTION WITH ANIMATED BACKDROP & PICTURE CARDS */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">

        {/* Animated Ambient Glow Shapes */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-600/20 via-teal-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI-Powered Travel Recommendation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Tailored Escapes, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
              Matched to Your Travel DNA.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Answer a few quick questions about your group, budget, and climate preferences. WanderLink synthesizes your parameters to surface high-match destinations with live booking links.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/questionnaire"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-lg shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
            >
              Build My Travel DNA 🚀
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-lg border border-slate-700 transition-colors"
            >
              Explore Features
            </a>
          </div>

          {/* 🖼️ ANIMATED VISUAL BANNER AT THE TOP */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'Tropical Paradise', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500', tag: 'Beach' },
              { name: 'Alpine Wilderness', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500', tag: 'Mountains' },
              { name: 'Cultural Capitals', img: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=500', tag: 'Culture' },
              { name: 'Family Adventures', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500', tag: 'Theme Parks' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative h-44 rounded-2xl overflow-hidden border border-slate-700 shadow-md hover:border-amber-400/60 transition-all hover:-translate-y-1"
              >
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-left">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    {item.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🏛️ FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-850 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Intelligent Architecture</span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How WanderLink Simplifies Travel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6">
                🧬
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Travel DNA Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Matches duration, budget constraints, child friendliness, and climate preferences against destination databases.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xl mb-6">
                🖼️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Context</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fetches contextual photos and top attraction highlights dynamically for each generated recommendation card.
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xl mb-6">
                🔗
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Partner Links</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connects directly to top travel providers including Booking.com, Viator, and Airalo with pre-filled search parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Ready to Find Your Destination?</h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Complete our 2-minute assessment to receive AI recommendations customized for your trip.
          </p>
          <div>
            <Link
              href="/questionnaire"
              className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-extrabold text-lg shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
            >
              Start Assessment 🌴
            </Link>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} WanderLink Travel. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/questionnaire" className="hover:text-slate-300">Quiz</Link>
            <a href="#features" className="hover:text-slate-300">Features</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

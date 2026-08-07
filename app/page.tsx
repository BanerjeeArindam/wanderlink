import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-slate-900">
      
      {/* 🧭 NAVIGATION BAR WITH PROFESSIONAL SVG LOGO */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-slate-900 flex items-center justify-center shadow-md text-white group-hover:scale-105 transition-transform">
              {/* Compass / Node Network Logo SVG */}
              <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="9" className="opacity-30" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3m-5.364-6.364l-2.121 2.121m-7.071 7.071l-2.122 2.122m0-11.314l2.122 2.121m7.071 7.071l2.121 2.122" />
                <polygon points="12 8 10 14 16 12 14 10" className="fill-current" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Wander<span className="text-emerald-600">Link</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
                Travel Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#destinations" className="hover:text-emerald-600 transition-colors">Destinations</a>
          </div>

          <Link
            href="/questionnaire"
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
          >
            Start DNA Survey
          </Link>
        </div>
      </nav>

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>✨ AI-Powered Destination Matching</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Precision Travel Planning, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-600">
              Tailored by Intelligence.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Specify your group dynamics, budget thresholds, and preferred climate. WanderLink’s recommendation engine constructs your bespoke <strong className="text-slate-900 font-semibold">Travel DNA</strong> to surface validated destinations with direct booking routes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/questionnaire"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5"
            >
              Get Recommendations
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-lg border border-slate-300 shadow-sm transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/80">
            <div>
              <div className="text-2xl font-bold text-slate-900">8–12</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Smart Signals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">100%</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Personalised Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">Visa-Free</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Filter Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">Instant</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Affiliate Linking</div>
            </div>
          </div>

        </div>
      </section>

      {/* 🏛️ FEATURES GRID */}
      <section id="features" className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Core Architecture</span>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Designed for Effortless Discovery</h2>
            <p className="text-slate-600">WanderLink turns open-ended travel searching into curated, actionable itineraries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-6">
                🧬
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Travel DNA Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates parameters such as duration, budget limits, climate preferences, and traveler composition to pinpoint high-scoring destination candidates.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-6">
                🖼️
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Live Visual Context</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically fetches contextual imagery and attraction highlights directly from real-time API layers for every recommendation.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xl mb-6">
                🔗
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Partner Routing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instantly connect to booking engines including Booking.com, Viator, and Airalo with customized search queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏖️ CURATED DESTINATION SHOWCASE */}
      <section id="destinations" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Curated Categories</span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mt-1">Popular Travel Profiles</h2>
            </div>
            <p className="text-slate-600 max-w-md mt-4 md:mt-0 text-sm">
              Discover how our matching algorithm tailors choices based on distinct trip profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tropical Escapes', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', tag: 'Beaches & Relaxation' },
              { title: 'Alpine Wilderness', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', tag: 'Nature & Hiking' },
              { title: 'Cultural Capitals', img: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=600', tag: 'Food & History' },
              { title: 'Family Expeditions', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600', tag: 'Theme Parks & Wildlife' },
            ].map((card, idx) => (
              <div key={idx} className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-white/90 text-slate-900 backdrop-blur-sm">
                    {card.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Uncover Your Next Destination?</h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Complete our 2-minute Travel DNA assessment to receive immediate AI recommendations.
          </p>
          <div>
            <Link
              href="/questionnaire"
              className="inline-block px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-lg hover:scale-105 transition-all"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} WanderLink Travel. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/questionnaire" className="hover:text-slate-800">Quiz</Link>
            <a href="#features" className="hover:text-slate-800">Features</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

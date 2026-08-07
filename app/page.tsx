import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* 🧭 NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-teal-500/20">
              W
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Wander<span className="text-teal-400">Link</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#styles" className="hover:text-teal-400 transition-colors">Destinations</a>
          </div>

          <Link
            href="/questionnaire"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 transition-all transform hover:-translate-y-0.5"
          >
            Start Travel DNA ✨
          </Link>
        </div>
      </nav>

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden">
        {/* Glowing Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/10 to-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <span>✨ AI-Powered Destination Matching</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Stop Searching. <br />
            Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400">Wandering Intentionally.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Tell us your budget, group dynamics, and preferred vibes. Our AI engine builds your custom <strong className="text-slate-200">Travel DNA</strong> to surface instant match recommendations with live flight and hotel options.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/questionnaire"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-extrabold text-lg shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all"
            >
              Get AI Recommendations ✈️
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-lg border border-slate-800 transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-12 flex justify-center items-center space-x-8 text-slate-500 text-xs font-medium uppercase tracking-wider">
            <span>🏖️ Visa-Free Filters</span>
            <span>•</span>
            <span>🏨 Live Hotel Links</span>
            <span>•</span>
            <span>🎯 Personalised Matches</span>
          </div>
        </div>
      </section>

      {/* 🖼️ FEATURE HIGHLIGHT CARDS */}
      <section id="features" className="py-20 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Built for Modern Explorers</h2>
            <p className="text-slate-400">WanderLink turns broad travel ideas into tailored, ready-to-book itineraries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-2xl mb-6">
                🧬
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Travel DNA Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Answering 8 simple questions creates a personalized preference vector matching your budget, climate preference, and group style.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl mb-6">
                📸
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Visual Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive real imagery, climate overviews, and top highlights sourced on-demand for every AI recommendation card.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-2xl mb-6">
                🔗
              </div>
              <h3 className="text-xl font-bold text-white mb-2">One-Click Booking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Seamlessly jump from match cards into Booking.com, Viator, and eSIM providers with pre-filled search queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌴 DESTINATION STYLES SHOWCASE */}
      <section id="styles" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-teal-400 font-bold text-sm tracking-widest uppercase">Endless Possibilities</span>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl mt-1">Every Vibe, Handled</h2>
            </div>
            <p className="text-slate-400 max-w-md mt-4 md:mt-0 text-sm">
              Whether you need family-friendly beaches, solo mountain escapes, or luxury cultural tours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tropical Beaches', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', tag: 'Relaxation' },
              { title: 'Mountain Adventures', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', tag: 'Nature' },
              { title: 'Cultural Cities', img: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=600', tag: 'Food & Sightseeing' },
              { title: 'Family Theme Parks', img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600', tag: 'Kids & Fun' },
            ].map((card, idx) => (
              <div key={idx} className="group relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {card.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-r from-teal-900/40 via-slate-900 to-indigo-900/40 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">Ready to Find Your Next Destination?</h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Take our 2-minute questionnaire and let our AI match engine do the heavy lifting.
          </p>
          <div>
            <Link
              href="/questionnaire"
              className="inline-block px-8 py-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-lg shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
            >
              Build My Travel DNA Now 🌴
            </Link>
          </div>
        </div>
      </section>

      {/* 🦶 FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} WanderLink Travel. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/questionnaire" className="hover:text-slate-400">Quiz</Link>
            <a href="#features" className="hover:text-slate-400">Features</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

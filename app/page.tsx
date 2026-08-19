import Link from 'next/link';
import WanderLinkHowItWorks from '@/components/WanderLinkHowItWorks';
import DestinationSlideshow from '@/components/DestinationSlideshow';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wanderlinktravel.com';
const faqItems = [
  {
    question: 'How are recommendations generated?',
    answer: 'WanderLink uses the preferences you provide, including budget, travel style, climate, group, and interests, to generate personalized destination ideas and trip plans.',
  },
  {
    question: 'Are flight prices live?',
    answer: 'WanderLink links to flight providers for current search results, but prices and availability can change. Always confirm the final fare, baggage rules, and terms on the provider website before booking.',
  },
  {
    question: 'Do you earn from bookings?',
    answer: 'WanderLink may earn commissions from qualifying accommodation, flight, and activity bookings made through tracked affiliate links. This does not increase the price you pay.',
  },
  {
    question: 'How accurate are visa requirements?',
    answer: 'Visa information is provided as general planning guidance and can change. Verify the current requirements with the destination government, embassy, or official immigration source before traveling.',
  },
  {
    question: 'Do I need an account?',
    answer: 'You can begin the questionnaire as a guest. A free Clerk account unlocks higher daily search limits, saved itineraries, and interactive travel actions.',
  },
  {
    question: 'How is my data stored?',
    answer: 'Guest questionnaire and result data are stored in your browser for convenience. Signed-in search history is stored with your account so it can be retrieved across sessions. See our Privacy Policy for details.',
  },
];

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'WanderLink Travel',
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        sameAs: [
          'https://www.facebook.com/profile.php?id=61593045113415',
          'https://www.instagram.com/travelwanderlink/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'WanderLink Travel',
        url: siteUrl,
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#application`,
        name: 'WanderLink Travel DNA',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        description: 'AI-powered destination recommendations and trip planning based on personal travel preferences.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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

      {/* 📋 HOW IT WORKS SECTION WITH ANIMATED STORYBOARD */}
      <section id="how-it-works" className="py-0 bg-slate-900 border-y border-slate-800">
        <WanderLinkHowItWorks autoPlay={true} />
      </section>

      {/* 🏛️ FEATURES SECTION - ENHANCED */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-850 via-slate-900 to-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              ✨ Powerful Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Everything You Need for Your Perfect Trip
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              WanderLink combines AI intelligence with real-time data to create personalized travel experiences that match your unique preferences.
            </p>
          </div>

          {/* Primary Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Feature 1: AI Recommendations */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🧬
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Matching</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Our GPT-4o engine analyzes your Travel DNA and combines it with destination context to create a personalized shortlist.
                </p>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Budget optimization</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Climate matching</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Family-friendly scoring</li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Real-Time Data */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-slate-700 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  ⛅
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Data Enrichment</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Get real-time weather forecasts, visa requirements, currency rates, and Google ratings updated daily.
                </p>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Weather by month</li>
                  <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Visa automation</li>
                  <li className="flex items-center gap-2"><span className="text-teal-400">✓</span> Live hotel ratings</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Instant Bookings */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-white mb-3">One-Click Booking</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Stay22 accommodation links and direct partner links for tours and flights with your destination pre-filled.
                </p>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Accommodation links</li>
                  <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Flight and activity links</li>
                  <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Destination pre-filling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="group bg-slate-800/60 hover:bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-violet-500/30 transition-all">
              <div className="text-3xl mb-3">🗓️</div>
              <h4 className="font-bold text-white mb-2">Custom Itineraries</h4>
              <p className="text-xs text-slate-400">Day-by-day travel plans generated by AI based on your preferences</p>
            </div>

            <div className="group bg-slate-800/60 hover:bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all">
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-bold text-white mb-2">Email Results</h4>
              <p className="text-xs text-slate-400">Send your personalized recommendations directly to your inbox</p>
            </div>

            <div className="group bg-slate-800/60 hover:bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-pink-500/30 transition-all">
              <div className="text-3xl mb-3">🗺️</div>
              <h4 className="font-bold text-white mb-2">Interactive Maps</h4>
              <p className="text-xs text-slate-400">Explore destinations with embedded Google Maps and local insights</p>
            </div>

            <div className="group bg-slate-800/60 hover:bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-green-500/30 transition-all">
              <div className="text-3xl mb-3">🕘</div>
              <h4 className="font-bold text-white mb-2">Search History</h4>
              <p className="text-xs text-slate-400">Sign in to save and revisit your previous travel searches</p>
            </div>
          </div>

          {/* Trust & Stats Section */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 md:p-12 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">AI</div>
                <p className="text-sm text-slate-400">Preference matching</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-400 mb-1">Live</div>
                <p className="text-sm text-slate-400">Travel context</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400 mb-1">3</div>
                <p className="text-sm text-slate-400">Starting recommendations</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-violet-400 mb-1">Free</div>
                <p className="text-sm text-slate-400">To begin the quiz</p>
              </div>
            </div>
          </div>

          {/* Feature Comparison for Returning Visitors */}
          <div className="bg-gradient-to-b from-slate-800/30 to-slate-900/30 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Enhanced for Returning Visitors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <span className="text-2xl">🔄</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Quick Retakes</h4>
                  <p className="text-sm text-slate-400">Retake the quiz anytime to explore different travel scenarios</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Saved Preferences</h4>
                  <p className="text-sm text-slate-400">Your preferences are saved for faster recommendations next time</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">⭐</span>
                <div>
                  <h4 className="font-bold text-white mb-1">Personalized Updates</h4>
                  <p className="text-sm text-slate-400">Get notified about new destinations matching your style</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 DESTINATION SLIDESHOW */}
      <DestinationSlideshow />

      {/* ❓ FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="border-y border-slate-800 bg-slate-950/70 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Good To Know</span>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl border border-slate-800 bg-slate-900 p-5">
                <summary className="cursor-pointer list-none pr-6 font-bold text-white marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.answer}</p>
              </details>
            ))}
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

    </div>
  );
}

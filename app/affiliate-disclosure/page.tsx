import Link from 'next/link';

export const metadata = {
  title: 'Affiliate Disclosure | WanderLink Travel',
  description: 'WanderLink Travel affiliate disclosure for accommodation, flight, and activity booking links.',
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen bg-slate-900 px-6 py-16 text-slate-200">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-8 leading-relaxed shadow-xl sm:p-12">
        <Link href="/" className="text-sm font-semibold text-teal-400 hover:text-teal-300">← Back to WanderLink</Link>
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-white">Affiliate Disclosure</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: August 17, 2026</p>
        </header>
        <div className="space-y-6 [&_h2]:pt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white">
          <p>WanderLink Travel is supported in part by affiliate partnerships. When you click a tracked link to book accommodation, flights, tours, activities, or other travel services, we may receive a commission from the provider or affiliate network.</p>

          <h2>What This Means for You</h2>
          <p>Affiliate compensation does not add a fee to your booking. Provider prices, availability, payment terms, and cancellation policies are controlled by the provider. Please compare options and review the final booking details before paying.</p>

          <h2>Our Partners</h2>
          <p>Our current integrations may include Stay22 for accommodation links, Aviasales or Travelpayouts for flight links, and Viator for tours and activities. Partner availability and terms may change over time.</p>

          <h2>Editorial Independence</h2>
          <p>Affiliate relationships do not guarantee a recommendation. WanderLink recommendations are generated from the preferences you provide and the data available to the service. We aim to show useful options, but you should make your own travel and booking decisions.</p>

          <h2>Questions</h2>
          <p>For questions about our partnerships, visit our <Link href="/contact">contact page</Link>.</p>
        </div>
      </article>
    </main>
  );
}

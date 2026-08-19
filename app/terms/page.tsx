import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use | WanderLink Travel',
  description: 'Read the terms that apply when using WanderLink Travel recommendations and booking links.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-900 px-6 py-16 text-slate-200">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-8 leading-relaxed shadow-xl sm:p-12">
        <Link href="/" className="text-sm font-semibold text-teal-400 hover:text-teal-300">← Back to WanderLink</Link>
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-white">Terms of Use</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: August 17, 2026</p>
        </header>
        <div className="space-y-6 [&_h2]:pt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc">
          <p>By using WanderLink Travel, you agree to use the service lawfully and in accordance with these terms. If you do not agree, please do not use the service.</p>

          <h2>Our Service</h2>
          <p>WanderLink provides AI-assisted travel inspiration, destination recommendations, trip planning information, and links to third-party travel providers. Recommendations are not a guarantee of suitability, availability, price, safety, entry permission, or booking outcome.</p>

          <h2>Third-Party Providers</h2>
          <p>Accommodation, flight, tour, insurance, visa, and other provider links may take you to third-party websites. Those websites have their own terms, prices, privacy policies, cancellation rules, and booking contracts. You are responsible for reviewing them before completing a booking.</p>

          <h2>Affiliate Compensation</h2>
          <p>WanderLink may earn commissions from qualifying accommodation, flight, and activity bookings made through tracked links. This does not change the price you pay or guarantee that a provider is the cheapest option.</p>

          <h2>Accuracy and Availability</h2>
          <p>Travel information can change without notice. Verify visa requirements with the relevant government authority, confirm health and safety guidance, and check live prices and availability directly with the provider.</p>

          <h2>Accounts and Acceptable Use</h2>
          <p>Keep your account information secure and do not attempt to abuse rate limits, interfere with the service, scrape private data, or use WanderLink for unlawful activity. We may suspend access when necessary to protect users or the service.</p>

          <h2>Limitation of Liability</h2>
          <p>To the extent permitted by law, WanderLink is not responsible for losses arising from third-party bookings, inaccurate or outdated travel information, provider changes, interruptions, or decisions made using the service.</p>

          <h2>Contact</h2>
          <p>For questions about these terms, visit our <Link href="/contact">contact page</Link>.</p>
        </div>
      </article>
    </main>
  );
}

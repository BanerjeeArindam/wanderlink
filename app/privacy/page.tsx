import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | WanderLink Travel',
  description: 'Learn how WanderLink collects, uses, and protects information when you use our travel recommendation service.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 17, 2026">
      <p>WanderLink Travel helps you discover destinations using your travel preferences. This policy explains what information we collect and how we use it.</p>

      <h2>Information We Collect</h2>
      <p>When you use WanderLink, you may provide your departure country and city, destination preferences, travel dates or month, budget, traveler counts, and activity interests. If you create an account, we may also receive account and contact information from our authentication provider.</p>
      <p>We may collect technical information such as your IP address, browser type, device information, and basic usage events for security, rate limiting, analytics, and service improvement.</p>

      <h2>How We Use Information</h2>
      <ul>
        <li>Generate personalized destination recommendations and trip plans.</li>
        <li>Save search history for signed-in users when that feature is enabled.</li>
        <li>Send requested recommendations or itineraries by email.</li>
        <li>Protect the service from abuse and enforce usage limits.</li>
        <li>Improve reliability, performance, and the user experience.</li>
      </ul>

      <h2>Service Providers</h2>
      <p>WanderLink may use third-party providers for authentication, hosting, databases, AI recommendations, images, email delivery, analytics, flight links, accommodation links, and activity bookings. These providers process information under their own policies and only as needed to provide their services.</p>

      <h2>Affiliate Links</h2>
      <p>Some links on WanderLink lead to accommodation, flight, or activity providers. These links may contain tracking identifiers, and WanderLink may earn a commission if you make a qualifying booking. The price you pay is not increased by this commission.</p>

      <h2>Data Choices</h2>
      <p>You may stop using the service at any time. You can remove guest search data from your browser storage by clearing site data. Signed-in users can contact us to request access, correction, or deletion of personal information, subject to applicable legal requirements.</p>

      <h2>Important Travel Information</h2>
      <p>Recommendations, weather information, visa guidance, and provider prices are provided for general planning and may change. Always verify requirements, safety guidance, prices, availability, and booking terms with the relevant official or provider source.</p>

      <h2>Contact</h2>
      <p>Questions about privacy can be sent through our <Link href="/contact">contact page</Link>.</p>
    </LegalPage>
  );
}

function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-900 px-6 py-16 text-slate-200">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-8 leading-relaxed shadow-xl sm:p-12">
        <Link href="/" className="text-sm font-semibold text-teal-400 hover:text-teal-300">← Back to WanderLink</Link>
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: {updated}</p>
        </header>
        <div className="space-y-6 [&_h2]:pt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc">{children}</div>
      </article>
    </main>
  );
}

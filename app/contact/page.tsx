import Link from 'next/link';

export const metadata = {
  title: 'Contact WanderLink Travel',
  description: 'Contact WanderLink Travel about privacy, partnerships, recommendations, or technical support.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-900 px-6 py-16 text-slate-200">
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-8 leading-relaxed shadow-xl sm:p-12">
        <Link href="/" className="text-sm font-semibold text-teal-400 hover:text-teal-300">← Back to WanderLink</Link>
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-white">Contact WanderLink</h1>
          <p className="mt-2 text-slate-400">We would love to hear from you.</p>
        </header>
        <div className="space-y-6">
          <p>Contact us about account support, privacy requests, affiliate partnerships, corrections, or feedback about your travel recommendations.</p>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
            <h2 className="text-xl font-bold text-white">Email</h2>
            <p className="mt-2 text-slate-300">For general enquiries and support:</p>
            <a href="mailto:hello@wanderlinktravel.com" className="mt-2 inline-block font-semibold text-teal-400 hover:text-teal-300">hello@wanderlinktravel.com</a>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6">
            <h2 className="text-xl font-bold text-white">Before You Contact Us</h2>
            <p className="mt-2 text-slate-300">For a booking, payment, cancellation, refund, or price question, contact the provider shown on your booking confirmation. WanderLink does not process third-party bookings or payments.</p>
          </div>

          <p className="text-sm text-slate-400">For details about how we handle personal information, read our <Link href="/privacy" className="text-teal-400 hover:text-teal-300">Privacy Policy</Link>. For affiliate relationships, read our <Link href="/affiliate-disclosure" className="text-teal-400 hover:text-teal-300">Affiliate Disclosure</Link>.</p>
        </div>
      </article>
    </main>
  );
}

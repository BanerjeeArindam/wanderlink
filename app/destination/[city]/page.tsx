import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildAviasalesUrl } from '@/lib/aviasales';
import { buildStay22Url } from '@/lib/stay22';
import { destinationLandings, getDestinationLanding } from '@/lib/destinations';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wanderlinktravel.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return destinationLandings.map(({ slug }) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const destination = getDestinationLanding(slug);
  if (!destination) return {};

  return {
    title: `${destination.city} Travel Guide | WanderLink Travel`,
    description: `${destination.city} travel guide: family-friendly advice, October weather, visa guidance from Australia, a 3-day itinerary, and booking links.`,
    alternates: { canonical: `/destination/${destination.slug}` },
    openGraph: {
      title: `${destination.city} Travel Guide | WanderLink Travel`,
      description: destination.intro,
      url: `${siteUrl}/destination/${destination.slug}`,
      images: [{ url: destination.image, alt: `${destination.city}, ${destination.country}` }],
    },
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const destination = getDestinationLanding(slug);
  if (!destination) notFound();

  const accommodationUrl = buildStay22Url({ destination: `${destination.city}, ${destination.country}`, adults: 2 });
  const flightUrl = buildAviasalesUrl({
    origin: 'Sydney',
    destination: destination.city,
    destinationCode: destination.airportCode,
    adults: 2,
  });
  const toursUrl = `https://www.viator.com/search/${encodeURIComponent(`${destination.city} tours`)}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        name: `${destination.city}, ${destination.country}`,
        description: destination.intro,
        image: destination.image,
        url: `${siteUrl}/destination/${destination.slug}`,
        touristType: destination.bestFor,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WanderLink', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: destination.city, item: `${siteUrl}/destination/${destination.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="relative overflow-hidden border-b border-slate-800">
        <img src={destination.image} alt={`${destination.city}, ${destination.country}`} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/80 to-slate-900" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16">
          <Link href="/" className="text-sm font-semibold text-teal-300 hover:text-teal-200">← Explore WanderLink</Link>
          <p className="mt-16 text-sm font-bold uppercase tracking-[0.24em] text-amber-300">{destination.country} travel guide</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-7xl">{destination.city}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">{destination.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={accommodationUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300">Find Accommodation</a>
            <a href={flightUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 hover:bg-amber-300">Search Flights</a>
            <a href={toursUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-600 bg-slate-800/80 px-5 py-3 font-bold text-white hover:bg-slate-700">Find Tours</a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <article className="space-y-10">
          <section>
            <h2 className="text-3xl font-extrabold text-white">Is {destination.city} family friendly?</h2>
            <p className="mt-4 leading-relaxed text-slate-300">{destination.familyFriendly}</p>
          </section>
          <section>
            <h2 className="text-3xl font-extrabold text-white">What is {destination.city} like in October?</h2>
            <p className="mt-4 leading-relaxed text-slate-300">{destination.octoberAdvice}</p>
          </section>
          <section>
            <h2 className="text-3xl font-extrabold text-white">Do Australians need a visa for {destination.city}?</h2>
            <p className="mt-4 leading-relaxed text-slate-300">{destination.visaFromAustralia}</p>
          </section>
          <section>
            <h2 className="text-3xl font-extrabold text-white">Best 3-day itinerary for {destination.city}</h2>
            <div className="mt-5 space-y-3">
              {destination.itinerary.map((day, index) => (
                <div key={day} className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-300">Day {index + 1}</span>
                  <p className="mt-2 text-slate-200">{day}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-extrabold text-white">Top things to do in {destination.city}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {destination.highlights.map((highlight) => <li key={highlight} className="rounded-lg border border-slate-800 bg-slate-800/50 p-4 text-slate-200">📍 {highlight}</li>)}
            </ul>
          </section>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950/60 p-6 lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Matched travel style</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Great for {destination.bestFor}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">Want a recommendation based on your own budget, dates, group, and interests?</p>
          <Link href="/questionnaire" className="mt-6 block rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 px-5 py-3 text-center font-extrabold text-slate-950 hover:brightness-110">Build My Travel DNA</Link>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">Affiliate disclosure: WanderLink may earn commissions from qualifying accommodation, flight, and activity bookings.</p>
        </aside>
      </div>
    </main>
  );
}

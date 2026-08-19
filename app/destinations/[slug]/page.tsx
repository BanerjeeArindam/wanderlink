import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { editorialDestinations, getEditorialDestination } from '@/lib/editorial-destinations';
import AdSlot from '@/components/AdSlot';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wanderlinktravel.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return editorialDestinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = getEditorialDestination(slug);
  if (!destination) return {};

  return {
    title: `${destination.name} | WanderLink Travel`,
    description: destination.description,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} | WanderLink Travel`,
      description: destination.description,
      url: `${siteUrl}/destinations/${destination.slug}`,
      images: [{ url: destination.image, alt: destination.name }],
    },
  };
}

export default async function EditorialDestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getEditorialDestination(slug);
  if (!destination) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: destination.name,
        description: destination.description,
        url: `${siteUrl}/destinations/${destination.slug}`,
        image: destination.image,
      },
      {
        '@type': 'FAQPage',
        mainEntity: destination.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'WanderLink', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: destination.name, item: `${siteUrl}/destinations/${destination.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="relative overflow-hidden border-b border-slate-800">
        <img src={destination.image} alt={destination.name} className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/80 to-slate-900" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16">
          <Link href="/" className="text-sm font-semibold text-teal-300 hover:text-teal-200">← Explore WanderLink</Link>
          <p className="mt-16 text-sm font-bold uppercase tracking-[0.24em] text-amber-300">{destination.eyebrow}</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-7xl">{destination.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-200">{destination.description}</p>
          <Link href="/questionnaire" className="mt-8 inline-block rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 px-6 py-3 font-extrabold text-slate-950 hover:brightness-110">Find My Perfect Match</Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article className="space-y-12">
            <section>
              <h2 className="text-3xl font-extrabold text-white">Weather and timing</h2>
              <p className="mt-4 leading-relaxed text-slate-300">{destination.weatherContext}</p>
              <p className="mt-3 leading-relaxed text-slate-300">{destination.bestTime}</p>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-white">Top ideas to explore</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-xl border border-slate-800 bg-slate-800/60 p-4 text-slate-200">📍 {highlight}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-extrabold text-white">Frequently asked questions</h2>
              <div className="mt-5 space-y-3">
                {destination.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-xl border border-slate-800 bg-slate-800/50 p-5">
                    <summary className="cursor-pointer font-bold text-white">{faq.question}</summary>
                    <p className="mt-3 leading-relaxed text-slate-300">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-950/60 p-6 lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Make it personal</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Your best destination depends on your travel DNA.</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">Tell us your budget, dates, group, climate, and interests for recommendations tailored to your trip.</p>
            <Link href="/questionnaire" className="mt-6 block rounded-xl bg-teal-500 px-5 py-3 text-center font-extrabold text-slate-950 hover:bg-teal-400">Take the free quiz</Link>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">WanderLink may earn commissions from qualifying accommodation, flight, and activity bookings.</p>
          </aside>
        </div>

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_DESTINATION_SLOT} />

        <section className="mt-16 border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-extrabold text-white">Explore related guides</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {destination.relatedCities.map((city) => (
              <Link key={city.slug} href={`/destination/${city.slug}`} className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-teal-300 hover:border-teal-400/50">{city.name}, {city.country}</Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import type { MetadataRoute } from 'next';
import { destinationLandings } from '@/lib/destinations';
import { editorialDestinations } from '@/lib/editorial-destinations';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wanderlinktravel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    '/',
    '/questionnaire',
    '/trip-cost',
    '/privacy',
    '/terms',
    '/affiliate-disclosure',
    '/contact',
  ];

  const baseEntries: MetadataRoute.Sitemap = publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'yearly',
    priority: path === '/' ? 1 : 0.5,
  }));

  const destinationEntries = destinationLandings.map((destination) => ({
    url: `${siteUrl}/destination/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const editorialEntries = editorialDestinations.map((destination) => ({
    url: `${siteUrl}/destinations/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...baseEntries, ...destinationEntries, ...editorialEntries];
}

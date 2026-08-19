export async function getDestinationImage(query: string): Promise<string> {
  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return fallbackImage;
  }

  try {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('page', '1');
    url.searchParams.set('per_page', '1');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return fallbackImage;
    }

    const data = await res.json();
    return data.results?.[0]?.urls?.regular || fallbackImage;
  } catch (err) {
    return fallbackImage;
  }
}

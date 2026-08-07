export async function getDestinationImage(query: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const data = await res.json();
    return data.results[0]?.urls?.regular || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
  } catch (err) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
  }
}

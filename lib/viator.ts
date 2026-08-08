export interface ViatorTour {
  productCode: string;
  title: string;
  productUrl: string;
  priceFrom?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  durationMinutes?: number;
}

interface ProductSummary {
  productCode: string;
  title: string;
  productUrl: string;
  images?: Array<{
    isCover?: boolean;
    variants?: Array<{ url: string; width: number; height: number }>;
  }>;
  reviews?: {
    totalReviews?: number;
    combinedAverageRating?: number;
  };
  pricing?: {
    summary?: { fromPrice?: number };
    currency?: string;
  };
  duration?: {
    fixedDurationInMinutes?: number;
  };
}

interface FreetextSearchResponse {
  products?: {
    totalCount: number;
    results: ProductSummary[];
  };
}

const VIATOR_BASE_URL =
  process.env.VIATOR_API_BASE_URL ?? 'https://api.sandbox.viator.com/partner';

function getCoverImageUrl(product: ProductSummary): string | undefined {
  const images = product.images ?? [];
  const cover = images.find((img) => img.isCover) ?? images[0];
  const variants = cover?.variants ?? [];
  if (variants.length === 0) return undefined;

  const sorted = [...variants].sort((a, b) => b.width - a.width);
  const preferred = sorted.find((v) => v.width >= 400 && v.width <= 800) ?? sorted[0];
  return preferred?.url;
}

async function viatorFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  const apiKey = process.env.VIATOR_API_KEY;
  if (!apiKey) {
    console.warn('VIATOR_API_KEY is not set — skipping Viator tour lookup.');
    return null;
  }

  try {
    const url = new URL(path, VIATOR_BASE_URL);
    const campaign = process.env.VIATOR_CAMPAIGN_VALUE;
    if (campaign) {
      url.searchParams.set('campaign-value', campaign);
    }

    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2.0',
        'Accept-Language': 'en',
        'exp-api-key': apiKey,
        ...options?.headers,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Viator API error ${res.status}:`, await res.text());
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error('Viator API request failed:', err);
    return null;
  }
}

export async function searchTours(
  searchTerm: string,
  count = 3,
  currency = 'AUD'
): Promise<ViatorTour[]> {
  const data = await viatorFetch<FreetextSearchResponse>('/search/freetext', {
    method: 'POST',
    body: JSON.stringify({
      searchTerm,
      searchTypes: [
        {
          searchType: 'PRODUCTS',
          pagination: { start: 1, count },
        },
      ],
      currency,
      productSorting: {
        sort: 'TRAVELER_RATING',
        order: 'DESCENDING',
      },
    }),
  });

  const products = data?.products?.results ?? [];

  return products.map((product) => ({
    productCode: product.productCode,
    title: product.title,
    productUrl: product.productUrl,
    priceFrom: product.pricing?.summary?.fromPrice,
    currency: product.pricing?.currency ?? currency,
    rating: product.reviews?.combinedAverageRating,
    reviewCount: product.reviews?.totalReviews,
    imageUrl: getCoverImageUrl(product),
    durationMinutes: product.duration?.fixedDurationInMinutes,
  }));
}

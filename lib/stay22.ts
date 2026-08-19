const STAY22_BASE_URL = 'https://www.stay22.com/allez/roam';

export function getStay22AffiliateId() {
  return process.env.STAY22_AID || process.env.STAY22_API_KEY || '';
}

export function buildStay22Url({
  destination,
  adults = 1,
  children = 0,
}: {
  destination: string;
  adults?: number;
  children?: number;
}) {
  const url = new URL(STAY22_BASE_URL);
  const affiliateId = getStay22AffiliateId();

  if (affiliateId) {
    url.searchParams.set('aid', affiliateId);
  }

  url.searchParams.set('address', destination.trim());
  url.searchParams.set('adults', String(Math.max(1, Math.trunc(adults))));
  url.searchParams.set('children', String(Math.max(0, Math.trunc(children))));
  return url.toString();
}

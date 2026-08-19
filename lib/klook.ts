const KLOOK_BASE_URL = 'https://www.klook.com/en-AU/search/result/';

export function getKlookAffiliateId() {
  return process.env.KLOOK_AID || process.env.NEXT_PUBLIC_KLOOK_AID || '';
}

export function buildKlookUrl({ query }: { query: string }) {
  const url = new URL(KLOOK_BASE_URL);
  const affiliateId = getKlookAffiliateId();

  url.searchParams.set('query', query.trim());
  if (affiliateId) {
    url.searchParams.set('aid', affiliateId);
  }

  return url.toString();
}

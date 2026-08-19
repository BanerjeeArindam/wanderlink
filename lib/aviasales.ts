const AVIASALES_BASE_URL = 'https://www.aviasales.com/';

const CITY_TO_IATA: Record<string, string> = {
  adelaide: 'ADL',
  amsterdam: 'AMS',
  athens: 'ATH',
  auckland: 'AKL',
  bangkok: 'BKK',
    bali: 'DPS',
  barcelona: 'BCN',
  berlin: 'BER',
  brisbane: 'BNE',
  cairo: 'CAI',
  cancun: 'CUN',
  'cape town': 'CPT',
  chicago: 'CHI',
  dubai: 'DXB',
  dublin: 'DUB',
  frankfurt: 'FRA',
  'gold coast': 'OOL',
  'hong kong': 'HKG',
  istanbul: 'IST',
    'kathmandu': 'KTM',
    kyoto: 'KIX',
  jakarta: 'JKT',
  johannesburg: 'JNB',
  'kuala lumpur': 'KUL',
  lisbon: 'LIS',
  london: 'LON',
  'los angeles': 'LAX',
  'machu picchu': 'CUZ',
  madrid: 'MAD',
  maldives: 'MLE',
  'mount everest': 'KTM',
  melbourne: 'MEL',
  'mexico city': 'MEX',
  miami: 'MIA',
  milan: 'MIL',
  montreal: 'YMQ',
  munich: 'MUC',
  nairobi: 'NBO',
  'new york': 'NYC',
  osaka: 'OSA',
  paris: 'PAR',
  perth: 'PER',
  philadelphia: 'PHL',
  porto: 'OPO',
  prague: 'PRG',
  queenstown: 'ZQN',
  'rio de janeiro': 'RIO',
  rome: 'ROM',
  'san francisco': 'SFO',
  seoul: 'SEL',
  singapore: 'SIN',
  stockholm: 'STO',
  sydney: 'SYD',
  tokyo: 'TYO',
  toronto: 'YTO',
  vancouver: 'YVR',
  vienna: 'VIE',
  zurich: 'ZRH',
};

function resolveIata(value: string, explicitCode?: string) {
  if (explicitCode?.trim() && /^[A-Za-z]{3}$/.test(explicitCode.trim())) {
    return explicitCode.trim().toUpperCase();
  }
  const trimmedValue = value.trim();
  if (/^[A-Za-z]{3}$/.test(trimmedValue)) {
    return trimmedValue.toUpperCase();
  }
  return CITY_TO_IATA[trimmedValue.split(',')[0].trim().toLowerCase()];
}

export function buildAviasalesUrl({
  destination,
  origin,
  destinationCode,
  originCode,
  adults = 1,
  children = 0,
}: {
  destination: string;
  origin: string;
  destinationCode?: string;
  originCode?: string;
  adults?: number;
  children?: number;
}) {
  const marker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || '762044';
  const departureCode = resolveIata(origin, originCode);
  const arrivalCode = resolveIata(destination, destinationCode);
  const adultCount = Math.max(1, Math.min(9, Math.trunc(adults)));
  const childCount = Math.max(0, Math.min(9, Math.trunc(children)));

  if (!departureCode || !arrivalCode) {
    throw new Error(`IATA airport code is missing for ${origin} or ${destination}.`);
  }

  const url = new URL(AVIASALES_BASE_URL);
  url.searchParams.set('params', `${departureCode}${arrivalCode}${adultCount}${childCount || ''}`);
  url.searchParams.set('marker', marker);

  return url.toString();
}

export interface TripCostInput {
  origin: string;
  destination: string;
  attraction: string;
  travelMonth: string;
  durationDays: number;
  adults: number;
  children: number;
  seasonType: string;
}

export interface TripCostLineItem {
  label: string;
  amount: number;
  detail: string;
}

export interface TripCostResult {
  currency: 'AUD';
  total: number;
  lowTotal: number;
  highTotal: number;
  nights: number;
  lineItems: TripCostLineItem[];
  primaryCta: string;
  heatmap: Array<{
    month: string;
    weeks: Array<{ week: string; multiplier: number; estimatedFlight: number }>;
  }> | null;
}

const destinationFlightBase: Record<string, number> = {
  SYD: 0,
  MEL: 180,
  BNE: 180,
  AKL: 350,
  SIN: 650,
  DPS: 700,
  HKG: 850,
  TYO: 1100,
  KIX: 1100,
  BKK: 850,
  LAX: 1500,
  LON: 1900,
  PAR: 1900,
};

const destinationNightlyRate: Record<string, number> = {
  SYD: 220,
  MEL: 190,
  BNE: 175,
  AKL: 180,
  SIN: 240,
  DPS: 130,
  HKG: 230,
  TYO: 210,
  KIX: 190,
  BKK: 110,
  LAX: 250,
  LON: 280,
  PAR: 260,
};

function normalizeCode(value: string) {
  return value.trim().toUpperCase();
}

function seasonMultiplier(seasonType: string) {
  const normalized = seasonType.toLowerCase();
  if (normalized.includes('peak') || normalized.includes('christmas')) return 1.45;
  if (normalized.includes('shoulder')) return 0.9;
  if (normalized.includes('low')) return 0.78;
  return 1;
}

function attractionRate(attraction: string) {
  const normalized = attraction.toLowerCase();
  if (normalized.includes('disney') || normalized.includes('universal')) return 125;
  if (normalized.includes('park') || normalized.includes('museum')) return 65;
  if (normalized.includes('safari') || normalized.includes('reef')) return 150;
  return 55;
}

function sixMonthNames(startMonth: string) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const requestedIndex = monthNames.findIndex((month) => month.toLowerCase() === startMonth.toLowerCase());
  const startIndex = requestedIndex >= 0 ? requestedIndex : new Date().getMonth();
  return Array.from({ length: 6 }, (_, index) => monthNames[(startIndex + index) % monthNames.length]);
}

export function calculateTripCost(input: TripCostInput, includeHeatmap: boolean): TripCostResult {
  const origin = normalizeCode(input.origin);
  const destination = normalizeCode(input.destination);
  const adults = Math.min(9, Math.max(1, Math.trunc(input.adults)));
  const children = Math.min(9, Math.max(0, Math.trunc(input.children)));
  const durationDays = Math.min(30, Math.max(1, Math.trunc(input.durationDays)));
  const nights = Math.max(1, durationDays - 1);
  const multiplier = seasonMultiplier(input.seasonType);
  const baseFlight = destinationFlightBase[destination] || 950;
  const distanceAdjustment = origin === destination ? 0.35 : 1;
  const flightPerTraveler = Math.round(baseFlight * distanceAdjustment * multiplier);
  const flight = flightPerTraveler * adults + Math.round(flightPerTraveler * 0.7) * children;
  const nightly = Math.round((destinationNightlyRate[destination] || 180) * multiplier);
  const accommodation = nightly * nights;
  const attractionUnit = attractionRate(input.attraction);
  const attractions = attractionUnit * adults + Math.round(attractionUnit * 0.6) * children;
  const dailySpend = 85 * (adults + children * 0.6) * durationDays;
  const total = Math.round(flight + accommodation + attractions + dailySpend);
  const lowTotal = Math.round(total * 0.82);
  const highTotal = Math.round(total * 1.24);
  const heatmap = includeHeatmap
    ? sixMonthNames(input.travelMonth).map((month, monthIndex) => {
        const monthSeasonFactor = month === 'December' ? 1.32 : month === 'January' || month === 'July' ? 1.12 : 0.96 + ((monthIndex % 3) * 0.03);
        const weeklyMultipliers = [0.9, 0.97, 1.08, 1.16];
        return {
          month,
          weeks: weeklyMultipliers.map((weekMultiplier, weekIndex) => ({
            week: `week-${weekIndex + 1}`,
            multiplier: Number((monthSeasonFactor * weekMultiplier).toFixed(2)),
            estimatedFlight: Math.round(flight * monthSeasonFactor * weekMultiplier),
          })),
        };
      })
    : null;

  return {
    currency: 'AUD',
    total,
    lowTotal,
    highTotal,
    nights,
    lineItems: [
      { label: 'Flights', amount: flight, detail: `${adults} adult${adults === 1 ? '' : 's'} and ${children} child${children === 1 ? '' : 'ren'}` },
      { label: 'Accommodation', amount: accommodation, detail: `${nights} night${nights === 1 ? '' : 's'} at an estimated A$${nightly}/night` },
      { label: 'Attraction', amount: attractions, detail: input.attraction || 'Estimated activities' },
      { label: 'Food and local transport', amount: Math.round(dailySpend), detail: `${durationDays} days using a planning allowance` },
    ],
    primaryCta: destination === 'HKG' && input.attraction.toLowerCase().includes('disney')
      ? 'Reserve Disney Package on Klook'
      : 'Lock in this flight rate on Aviasales',
    heatmap,
  };
}

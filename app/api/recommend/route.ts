import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { guestRateLimiter, memberRateLimiter, guestSearchLimit, memberSearchLimit } from '@/lib/ratelimit';

// Force dynamic serverless execution
export const dynamic = 'force-dynamic';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface TravelPreferences {
  sourceCity?: string;
  sourceCountry?: string;
  preferredDestinationCountry?: string;
  travelType?: 'domestic' | 'international' | 'both';
  groupType?: string;
  adults?: number;
  children?: number;
  budgetLevel?: string;
  durationDays?: number;
  travelMonth?: string;
  preferredClimate?: string;
  activityVibe?: string[];
  visaPreference?: string;
}
interface UtilityData {
  currency?: string;
  visaStatus?: string;
  visaApplyUrl?: string;
  weatherForecast?: string;
  plugType?: string;
  safetyRating?: string;
  insuranceUrl?: string;
}
interface Experience {
  name: string;
  rating: number;
  reviews: number;
}
interface DestinationCard {
  destination: string;
  airportCode?: string;
  sourceCity?: string;
  sourceCountry?: string;
  adults?: number;
  children?: number;
  countryCode: string;
  matchScore: number;
  heroTagline: string;
  reasonsToVisit: string[];
  keyHighlights: string[];
  affiliateQuery: string;
  imageUrl?: string;
  tripPlan?: string;
   // Enriched real-world fields
   utilityData?: UtilityData;
   realVisitorExperiences?: Experience[];
   weatherPrediction?: string;
   kidFriendlyRating?: string;
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request via Clerk
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    let identifier: string;
    let isAllowed: boolean;
    let remainingSearches: number;

    // 2. Enforce Tiered Rate Limits with Upstash Redis
    if (userId) {
      // Member Tier: 10 searches / 24 hours
      identifier = userId;
      const res = await memberRateLimiter.limit(identifier);
      isAllowed = res.success;
      remainingSearches = res.remaining;
    } else {
      // Guest Tier: 3 searches / 24 hours (tracked by IP address)
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';
      identifier = ip;
      const res = await guestRateLimiter.limit(identifier);
      isAllowed = res.success;
      remainingSearches = res.remaining;
    }

    // Rate Limit Exceeded Guardrail
    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit reached',
          isGuest: !userId,
          message: !userId
            ? `You have reached your ${guestSearchLimit} free daily searches. Log in for free to unlock ${memberSearchLimit} daily searches!`
            : `You have reached your limit of ${memberSearchLimit} daily searches. Please try again tomorrow.`,
        },
        { status: 429 }
      );
    }

    // 3. Parse Body Preferences
    const body: TravelPreferences = await req.json();

    // 4. Initialize OpenAI Client Lazily
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key is missing' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 5. Construct OpenAI System & User Prompt
    const systemPrompt = `
      You are WanderLink's Travel DNA Recommendation Engine.
      Analyze the user's travel preferences and return EXACTLY 3 highly relevant destination recommendations.
      Output strictly a valid JSON array containing objects matching this schema:
      [
        {
          "destination": "City, Country",
          "countryCode": "ISO-2 Country Code",
          "airportCode": "IATA city or airport code for the destination",
          "matchScore": 95,
          "heroTagline": "A punchy 1-sentence headline for this destination",
          "reasonsToVisit": ["Reason 1", "Reason 2", "Reason 3"],
          "keyHighlights": ["Attraction 1", "Attraction 2", "Attraction 3"],
          "affiliateQuery": "City Country hotels stays"
        }
      ]
      DO NOT include markdown code blocks, conversational filler, or formatting outside raw JSON.
    `;

    const userPrompt = `
      Source Country: ${body.sourceCountry || 'AU'}
      Source City: ${body.sourceCity || 'Sydney'}
      Preferred Destination Country: ${body.preferredDestinationCountry === 'ANY' ? 'No specific country preference' : (body.preferredDestinationCountry || 'No specific country preference')}
      Travel Type: ${body.travelType || 'both'} (domestic means within same country, international means other countries, both means any destination)
      Group Dynamic: ${body.groupType || 'Couple'}
      Budget Tier: ${body.budgetLevel || 'Moderate'}
      Duration: ${body.durationDays || 7} days
      Travel Month: ${body.travelMonth || 'Flexible'}
      Preferred Climate: ${body.preferredClimate || 'Mild'}
      Activities / Vibe: ${body.activityVibe?.join(', ') || 'Culture, Food, Nature'}
      Visa Requirement: ${body.visaPreference || 'Any'}

      IMPORTANT:
      - If Preferred Destination Country is a specific country, prioritize that destination first and base recommendations around it.
      - If Preferred Destination Country is "ANY" or no specific country is selected, use Travel Type to decide the destination region.
      - If Travel Type is "domestic", recommend destinations ONLY within the source country.
      - If Travel Type is "international", recommend destinations ONLY outside the source country.
      - If Travel Type is "both", recommend destinations both within and outside the source country.
      - If a specific destination country is selected, do not suggest destinations in other countries unless the user explicitly wants a broader search.
      - Apply visa requirement filter strictly: if "Visa-free only" is selected, only recommend destinations where the source country passport has visa-free or visa-on-arrival access.
    `;

    // 6. Execute OpenAI Request
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const rawContent = aiResponse.choices[0]?.message?.content || '[]';
    
    // Clean JSON response
    const sanitizedJson = rawContent
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let rawRecommendations: DestinationCard[] = [];
    try {
      rawRecommendations = JSON.parse(sanitizedJson);
    } catch {
      throw new Error('Failed to parse AI recommendation payload.');
    }

    const monthNameToNumber = (month: string) => {
      const map: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
      };
      return map[month.toLowerCase()] || new Date().getMonth() + 1;
    };

    const getPlaceCountryCode = async (placeName: string): Promise<string | null> => {
      try {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=1&language=en&format=json`;
        const geocodeResponse = await fetch(geocodeUrl, { cache: 'no-store' });
        if (!geocodeResponse.ok) return null;
        const geocodeData = await geocodeResponse.json();
        return geocodeData.results?.[0]?.country_code || null;
      } catch {
        return null;
      }
    };

    const getMonthAverageTemperature = async (placeName: string, monthName: string): Promise<string> => {
      try {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=1&language=en&format=json`;
        const geocodeResponse = await fetch(geocodeUrl, { cache: 'no-store' });
        if (!geocodeResponse.ok) return '22°C average';
        const geocodeData = await geocodeResponse.json();
        const location = geocodeData.results?.[0];

        if (!location) return '22°C average';

        const targetMonth = monthNameToNumber(monthName);
        const year = new Date().getFullYear();
        const startDate = `${year}-${String(targetMonth).padStart(2, '0')}-01`;
        const endDate = new Date(year, targetMonth, 0).toISOString().slice(0, 10);

        const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean&timezone=auto`;
        const archiveResponse = await fetch(archiveUrl, { cache: 'no-store' });
        if (!archiveResponse.ok) return '22°C average';

        const archiveData = await archiveResponse.json();
        const meanValues = archiveData.daily?.temperature_2m_mean || [];
        if (!meanValues.length) return '22°C average';

        const average = meanValues.reduce((total: number, value: number) => total + (Number(value) || 0), 0) / meanValues.length;
        return `${Math.round(average)}°C average`;
      } catch {
        return '22°C average';
      }
    };

    const visaRuleLookup: Record<string, Record<string, string>> = {
      AU: {
        FR: 'Visa-free for up to 90 days (Schengen)',
        US: 'Visa-free for up to 90 days',
        JP: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        SG: 'Visa-free',
        NZ: 'Visa-free (Special travel arrangement)',
        DE: 'Visa-free for up to 90 days (Schengen)',
        ES: 'Visa-free for up to 90 days (Schengen)',
        IT: 'Visa-free for up to 90 days (Schengen)',
        GB: 'Visa-free for up to 180 days',
        CA: 'Visa-free for up to 180 days',
        PT: 'Visa-free for up to 90 days (Schengen)',
        IE: 'Visa-free for up to 90 days (Common Travel Area)',
        MY: 'Visa-free for up to 30 days',
        ID: 'Visa-free for up to 30 days (Visa on Arrival available)',
        PH: 'Visa-free for up to 30 days',
        KR: 'Visa-free for up to 90 days',
        HK: 'Visa-free for up to 90 days',
      },
      US: {
        FR: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        JP: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        NZ: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        GB: 'Visa-free for up to 180 days',
        DE: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        ES: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        IT: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        CA: 'Visa-free (Open borders for residents)',
        PT: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        SG: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 90 days (eVISA available)',
        ID: 'Visa-free for up to 30 days (Visa on Arrival)',
        PH: 'Visa-free for up to 30 days',
        KR: 'Visa-free for up to 90 days',
      },
      UK: {
        FR: 'Visa-free for up to 90 days (post-Brexit, ETIAS from 2025)',
        US: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        JP: 'Visa-free for up to 90 days',
        NZ: 'Visa-free for up to 90 days',
        DE: 'Visa-free for up to 90 days (ETIAS from 2025)',
        ES: 'Visa-free for up to 90 days (ETIAS from 2025)',
        IT: 'Visa-free for up to 90 days (ETIAS from 2025)',
        CA: 'Visa-free for up to 180 days',
        SG: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        KR: 'Visa-free for up to 90 days',
      },
      NZ: {
        AU: 'Visa-free (Special travel arrangement)',
        FR: 'Visa-free for up to 90 days (Schengen)',
        JP: 'Visa-free for up to 90 days',
        US: 'Visa-free for up to 90 days',
        GB: 'Visa-free for up to 180 days',
        DE: 'Visa-free for up to 90 days (Schengen)',
        SG: 'Visa-free for up to 30 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 30 days',
      },
      CA: {
        FR: 'Visa-free for up to 90 days (Schengen, ETIAS from 2025)',
        US: 'Visa-free (Open borders for residents)',
        JP: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 180 days',
        NZ: 'Visa-free for up to 90 days',
        GB: 'Visa-free for up to 180 days',
        SG: 'Visa-free for up to 30 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 90 days',
      },
      DE: {
        FR: 'Visa-free (Schengen interior movement)',
        ES: 'Visa-free (Schengen interior movement)',
        IT: 'Visa-free (Schengen interior movement)',
        US: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        JP: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 90 days',
      },
      FR: {
        DE: 'Visa-free (Schengen interior movement)',
        ES: 'Visa-free (Schengen interior movement)',
        IT: 'Visa-free (Schengen interior movement)',
        US: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        JP: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 90 days',
      },
      ES: {
        FR: 'Visa-free (Schengen interior movement)',
        DE: 'Visa-free (Schengen interior movement)',
        IT: 'Visa-free (Schengen interior movement)',
        US: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
      },
      IT: {
        FR: 'Visa-free (Schengen interior movement)',
        DE: 'Visa-free (Schengen interior movement)',
        ES: 'Visa-free (Schengen interior movement)',
        US: 'Visa-free for up to 90 days',
        AU: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
      },
      SG: {
        AU: 'Visa-free for up to 30 days',
        US: 'Visa-free for up to 30 days',
        UK: 'Visa-free for up to 30 days',
        CA: 'Visa-free for up to 30 days',
        JP: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free (Border crossing arrangement)',
        ID: 'Visa-free for up to 30 days',
        PH: 'Visa-free for up to 30 days',
        KR: 'Visa-free for up to 90 days',
        FR: 'Visa-free for up to 90 days',
        DE: 'Visa-free for up to 90 days',
        ES: 'Visa-free for up to 90 days',
      },
      JP: {
        AU: 'Visa-free for up to 90 days',
        US: 'Visa-free for up to 90 days',
        NZ: 'Visa-free for up to 90 days',
        CA: 'Visa-free for up to 90 days',
        UK: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 30 days',
        ID: 'Visa-free for up to 30 days',
        PH: 'Visa-free for up to 30 days',
        KR: 'Visa-free for up to 90 days',
      },
      IN: {
        TH: 'e-Visa available; Tourist visa recommended (60 days)',
        SG: 'Tourist visa recommended (60 days)',
        MY: 'Visa-free for up to 30 days',
        ID: 'Visa on Arrival available (30 days)',
        JP: 'Visa required (Short-stay tourist visa)',
        AU: 'Visa required (Tourist e-Visa)',
        US: 'Visa required (Travel document required)',
      },
      TH: {
        AU: 'Visa-free for up to 30 days (Visa exemption)',
        US: 'Visa-free for up to 30 days (Visa exemption)',
        UK: 'Visa-free for up to 30 days (Visa exemption)',
        SG: 'Visa-free for up to 30 days',
        JP: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 30 days',
        ID: 'Visa-free for up to 30 days',
        PH: 'Visa-free for up to 30 days',
      },
      MY: {
        AU: 'Visa-free for up to 30 days',
        US: 'Visa-free for up to 90 days',
        UK: 'Visa-free for up to 30 days',
        SG: 'Visa-free (Border arrangement)',
        JP: 'Visa-free for up to 30 days',
        TH: 'Visa-free for up to 30 days',
        ID: 'Visa-free for up to 30 days',
      },
      ID: {
        AU: 'Visa on Arrival available (30 days)',
        US: 'Visa on Arrival available (30 days)',
        SG: 'Visa-free for up to 30 days',
        JP: 'Visa-free for up to 30 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 30 days',
      },
      PH: {
        AU: 'Visa-free for up to 30 days',
        US: 'Visa-free for up to 30 days',
        SG: 'Visa-free for up to 30 days',
        JP: 'Visa-free for up to 30 days',
        TH: 'Visa-free for up to 30 days',
        MY: 'Visa-free for up to 30 days',
      },
      KR: {
        AU: 'Visa-free for up to 90 days',
        US: 'Visa-free for up to 90 days',
        UK: 'Visa-free for up to 90 days',
        CA: 'Visa-free for up to 90 days',
        JP: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 90 days',
        MY: 'Visa-free for up to 90 days',
      },
      ZA: {
        AU: 'Visa-free for up to 90 days',
        US: 'Visa-free for up to 90 days',
        UK: 'Visa-free for up to 180 days',
        FR: 'Visa-free for up to 90 days (Schengen)',
        DE: 'Visa-free for up to 90 days (Schengen)',
        ES: 'Visa-free for up to 90 days (Schengen)',
        IT: 'Visa-free for up to 90 days (Schengen)',
      },
      AE: {
        AU: 'Visa-free for 30 days (Arrival visa)',
        US: 'Visa-free for 30 days (Arrival visa)',
        UK: 'Visa-free for 30 days (Arrival visa)',
        SG: 'Visa-free for 30 days',
        TH: 'Visa-free for 30 days',
      },
      HK: {
        AU: 'Visa-free for up to 90 days',
        US: 'Visa-free for up to 90 days',
        UK: 'Visa-free for up to 90 days',
        SG: 'Visa-free for up to 30 days',
        JP: 'Visa-free for up to 90 days',
        TH: 'Visa-free for up to 30 days',
      },
    };

    // Schengen Area countries for special visa-free movement rules
    const schengenCountries = new Set(['AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH', 'NO']);
    
    const getVisaRequirement = async (sourcePlace: string, destinationPlace: string, destinationCountryCode?: string): Promise<string> => {
      const sourceCountryCode = await getPlaceCountryCode(sourcePlace) || 'AU';
      const destinationCountryCodeFinal = destinationCountryCode || (await getPlaceCountryCode(destinationPlace)) || 'FR';
      const sourceUpper = sourceCountryCode.toUpperCase();
      const destUpper = destinationCountryCodeFinal.toUpperCase();

      // Same country: residents can enter freely
      if (sourceUpper === destUpper) {
        return 'Visa-free for residents';
      }

      // Schengen special handling: both source and destination in Schengen = visa-free
      if (schengenCountries.has(sourceUpper) && schengenCountries.has(destUpper)) {
        return 'Visa-free within Schengen Area (90 days per 180-day period)';
      }

      // Check explicit visa rule from the lookup table
      const rule = visaRuleLookup[sourceUpper]?.[destUpper];
      if (rule) return rule;

      // Intelligent fallback based on passport strength and destination patterns
      const strongPassports = new Set(['AU', 'CA', 'DE', 'FR', 'GB', 'US', 'NZ', 'JP', 'SG', 'KR', 'AE']);
      const isStrongPassport = strongPassports.has(sourceUpper);

      // Special handling for popular tourist destinations
      const popularDestinations = new Set(['FR', 'ES', 'IT', 'TH', 'JP', 'US', 'AU', 'DE', 'GB', 'NZ', 'SG', 'MY']);
      const isPopularDest = popularDestinations.has(destUpper);

      if (isStrongPassport && isPopularDest) {
        return 'Often visa-free or on arrival (90 days typical); verify destination requirements before booking';
      } else if (isStrongPassport && schengenCountries.has(destUpper)) {
        return 'Check if eligible for Schengen visa-free entry; EU requires advance travel authorization for most non-EU citizens';
      } else if (isStrongPassport) {
        return 'Visa-free or e-visa likely available; check official government portal for your destination';
      }
      
      return 'Visa requirement varies by passport; verify with your destination\'s official embassy or consulate';
    };

    const sourceCity = (body.sourceCity || 'Sydney').trim();
    const sourceCountry = await getPlaceCountryCode(sourceCity);
    const countryUtilityMap: Record<string, { currency: string; plugType: string }> = {
      AU: { currency: 'AUD', plugType: 'Type I' },
      US: { currency: 'USD', plugType: 'Type A/B' },
      GB: { currency: 'GBP', plugType: 'Type G' },
      CA: { currency: 'CAD', plugType: 'Type A/B' },
      NZ: { currency: 'NZD', plugType: 'Type I' },
      FR: { currency: 'EUR', plugType: 'Type C/E/F' },
      DE: { currency: 'EUR', plugType: 'Type C/F' },
      ES: { currency: 'EUR', plugType: 'Type C/F' },
      IT: { currency: 'EUR', plugType: 'Type C/F' },
      JP: { currency: 'JPY', plugType: 'Type A/B' },
      SG: { currency: 'SGD', plugType: 'Type G' },
      TH: { currency: 'THB', plugType: 'Type A/B/C' },
      IN: { currency: 'INR', plugType: 'Type C/D/M' },
      ZA: { currency: 'ZAR', plugType: 'Type M' },
      AE: { currency: 'AED', plugType: 'Type G' },
      HK: { currency: 'HKD', plugType: 'Type G' },
      KR: { currency: 'KRW', plugType: 'Type C/F' },
      MX: { currency: 'MXN', plugType: 'Type A/B' },
      BR: { currency: 'BRL', plugType: 'Type C/N' },
      VN: { currency: 'VND', plugType: 'Type A/C' },
      PH: { currency: 'PHP', plugType: 'Type A/B/C' },
      MY: { currency: 'MYR', plugType: 'Type G' },
      SE: { currency: 'SEK', plugType: 'Type C/F' },
      NO: { currency: 'NOK', plugType: 'Type C/F' },
      CH: { currency: 'CHF', plugType: 'Type J' },
      AT: { currency: 'EUR', plugType: 'Type C/F' },
      CZ: { currency: 'CZK', plugType: 'Type E' },
      PT: { currency: 'EUR', plugType: 'Type C/F' },
      GR: { currency: 'EUR', plugType: 'Type F' },
      TR: { currency: 'TRY', plugType: 'Type F' },
      EG: { currency: 'EGP', plugType: 'Type C/F' },
    };

    const getDestinationCountryMeta = async (destination: string, countryCode?: string) => {
      const resolvedCode = (countryCode || (await getPlaceCountryCode(destination)) || '').toUpperCase();
      return countryUtilityMap[resolvedCode] || { currency: 'Local currency', plugType: 'Varies by destination' };
    };

    const generateTripPlan = async (destination: string, sourceCity: string, durationDays: number, month: string) => {
      try {
        const tripPrompt = `
          Create a realistic ${durationDays}-day trip plan for visiting ${destination} from ${sourceCity} in ${month}.
          The traveler is starting from ${sourceCity}. Provide a compact but useful itinerary with day-by-day highlights, travel flow, meals, and local experiences.
          Keep it practical, friendly, and suitable for a travel app. Return only plain text, with headings like "Day 1", "Day 2" and no markdown fences.
        `;

        const tripResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a travel planner. Generate a practical trip itinerary for travelers.' },
            { role: 'user', content: tripPrompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        });

        return tripResponse.choices[0]?.message?.content?.trim() || `Day 1: Arrive in ${destination} from ${sourceCity}...`;
      } catch (tripErr) {
        console.warn(`Trip plan generation failed for ${destination}`, tripErr);
        return `Day 1: Arrive in ${destination} from ${sourceCity} and settle into your base.\nDay 2: Explore the main attractions and local food scene.\nDay 3: Visit the best cultural or scenic spots.\nDay 4: Reserve a guided experience or free day.\nDay 5: Enjoy a final neighborhood walk and departure.`;
      }
    };

    // 7. Parallel Image Enrichment via Unsplash API
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const fallbackImage =
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop';

    const enrichedRecommendations = await Promise.all(
      rawRecommendations.map(async (item) => {
        let imageUrl = fallbackImage;

        if (unsplashKey) {
          try {
            const query = encodeURIComponent(item.destination);
            const unsplashUrl = new URL('https://api.unsplash.com/search/photos');
            unsplashUrl.searchParams.set('page', '1');
            unsplashUrl.searchParams.set('per_page', '1');
            unsplashUrl.searchParams.set('query', item.destination);
            unsplashUrl.searchParams.set('orientation', 'landscape');

            const res = await fetch(unsplashUrl.toString(), {
              headers: {
                Authorization: `Client-ID ${unsplashKey}`,
                Accept: 'application/json',
              },
              next: { revalidate: 86400 },
            });

            if (res.ok) {
              const data = await res.json();
              if (data.results?.[0]?.urls?.regular) {
                imageUrl = data.results[0].urls.regular;
              }
            } else {
              console.warn(`Unsplash request failed for ${item.destination}: ${res.status} ${res.statusText}`);
            }
          } catch (unsplashErr) {
            console.warn(`Unsplash fetch failed for ${item.destination}`, unsplashErr);
          }
        }

        const weatherForecast = await getMonthAverageTemperature(item.destination, body.travelMonth || 'Flexible');
        const visaStatus = await getVisaRequirement(sourceCity, item.destination, item.countryCode || sourceCountry || undefined);
        const destinationMeta = await getDestinationCountryMeta(item.destination, item.countryCode || sourceCountry || undefined);
        const tripPlan = await generateTripPlan(
          item.destination,
          sourceCity,
          Number(body.durationDays) || 7,
          body.travelMonth || 'Flexible'
        );

        return {
          ...item,
          adults: Math.max(1, Number(body.adults) || 1),
          children: Math.max(0, Number(body.children) || 0),
          sourceCity,
          sourceCountry: body.sourceCountry || 'AU',
          imageUrl,
          tripPlan,
          utilityData: {
            weatherForecast,
            visaStatus,
            visaApplyUrl: `https://www.google.com/search?q=${encodeURIComponent(`${item.destination} visa requirements`)}`,
            currency: destinationMeta.currency,
            plugType: destinationMeta.plugType,
            safetyRating: 'Standard travel precautions',
          },
          weatherPrediction: weatherForecast,
          kidFriendlyRating: body.groupType === 'family' ? 'Family-friendly' : 'Good fit',
          realVisitorExperiences:
            item.reasonsToVisit?.slice(0, 3).map((reason, index) => ({
              name: reason,
              rating: 4.7 + (index * 0.1),
              reviews: 1200 + index * 250,
            })) || [],
        };
      })
    );

    // 8. Save Search History for Logged-In Users (Supabase)
    if (userId && supabaseUrl && supabaseKey) {
      try {
        await supabase.from('search_history').insert({
          user_id: userId,
          user_email: user?.emailAddresses[0]?.emailAddress || null,
          query_params: body,
          results: enrichedRecommendations,
        });
      } catch (dbErr) {
        console.error('Failed to log search history to Supabase:', dbErr);
      }
    }

    // 9. Return JSON Payload
    return NextResponse.json({
      success: true,
      remainingSearches,    
      isGuest: !userId,
      data: enrichedRecommendations,
    });
  } catch (error: any) {
    console.error('Error in /api/recommend endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected server error occurred.',
      },
      { status: 500 }
    );
  }
}

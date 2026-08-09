import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { guestRateLimiter, memberRateLimiter } from '@/lib/ratelimit';

// Force dynamic serverless execution
export const dynamic = 'force-dynamic';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface TravelPreferences {
  groupType?: string;
  budgetLevel?: string;
  durationDays?: number;
  travelMonth?: string;
  preferredClimate?: string;
  activityVibe?: string[];
  visaPreference?: string;
}

interface DestinationCard {
  destination: string;
  countryCode: string;
  matchScore: number;
  heroTagline: string;
  reasonsToVisit: string[];
  keyHighlights: string[];
  affiliateQuery: string;
  imageUrl?: string;
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
            ? 'You have reached your 3 free daily searches. Log in for free to unlock 10 daily searches!'
            : 'You have reached your limit of 10 daily searches. Please try again tomorrow.',
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
      Group Dynamic: ${body.groupType || 'Couple'}
      Budget Tier: ${body.budgetLevel || 'Moderate'}
      Duration: ${body.durationDays || 7} days
      Travel Month: ${body.travelMonth || 'Flexible'}
      Preferred Climate: ${body.preferredClimate || 'Mild'}
      Activities / Vibe: ${body.activityVibe?.join(', ') || 'Culture, Food, Nature'}
      Visa Requirement: ${body.visaPreference || 'Any'}
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
            const res = await fetch(
              `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${query}&orientation=landscape`,
              {
                headers: { Authorization: `Client-ID ${unsplashKey}` },
                next: { revalidate: 86400 }, // Cache photos for 24 hours
              }
            );

            if (res.ok) {
              const data = await res.json();
              if (data.results?.[0]?.urls?.regular) {
                imageUrl = data.results[0].urls.regular;
              }
            }
          } catch (unsplashErr) {
            console.warn(`Unsplash fetch failed for ${item.destination}`, unsplashErr);
          }
        }

        return { ...item, imageUrl };
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

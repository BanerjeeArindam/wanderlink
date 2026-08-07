import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDestinationImage } from '@/lib/unsplash';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const systemPrompt = `
      You are WanderLink's expert travel recommendation engine.
      Analyze the user's travel preferences and select the top 3 best destination cities/countries.

      For each recommendation, return a JSON object with:
      - destination: "City, Country"
      - countryCode: "2-letter ISO code"
      - matchScore: integer between 85 and 99
      - heroTagline: "Short 1-sentence headline"
      - reasonsToVisit: array of 3 personalized bullet strings explaining why it matches their inputs
      - keyHighlights: array of 3 top attraction/activity names
      - affiliateQuery: "Search query string for hotel/tour lookup"

      Return ONLY a valid JSON array containing exactly 3 items.
    `;

    const userPrompt = `User Travel DNA Preferences: ${JSON.stringify(body)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content || '[]';
    const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
    const parsedRecommendations = JSON.parse(cleanedContent);

    // Attach a live Unsplash image URL to each destination card
    const enrichedDestinations = await Promise.all(
      parsedRecommendations.map(async (item: any) => {
        const imageUrl = await getDestinationImage(item.destination);
        return {
          ...item,
          imageUrl, // Adds live photo URL property
        };
      })
    );

    return NextResponse.json({ success: true, destinations: enrichedDestinations });
  } catch (error: any) {
    console.error('AI Recommendation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

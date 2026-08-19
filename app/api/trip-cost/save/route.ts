import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import type { TripCostResult } from '@/lib/trip-cost';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true });
    }

    const body = (await req.json()) as {
      origin?: string;
      destination?: string;
      attraction?: string;
      travelMonth?: string;
      durationDays?: number;
      adults?: number;
      children?: number;
      seasonType?: string;
      result?: TripCostResult;
    };

    if (!body.destination || !body.result) {
      return NextResponse.json({ error: 'Missing destination or cost estimate.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('search_history').insert({
      user_id: userId,
      user_email: user.emailAddresses[0]?.emailAddress || null,
      query_params: {
        type: 'trip_cost',
        origin: body.origin,
        destination: body.destination,
        attraction: body.attraction,
        travelMonth: body.travelMonth,
        durationDays: body.durationDays,
        adults: body.adults,
        children: body.children,
        seasonType: body.seasonType,
      },
      results: [
        {
          destination: `${body.origin || ''} → ${body.destination}`,
          heroTagline: `Estimated trip cost: A$${body.result.total.toLocaleString()} (A$${body.result.lowTotal.toLocaleString()}–A$${body.result.highTotal.toLocaleString()})`,
          reasonsToVisit: body.result.lineItems.map((item) => `${item.label}: A$${item.amount.toLocaleString()} — ${item.detail}`),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to save trip cost history:', error);
    return NextResponse.json({ error: error.message || 'Unable to save this estimate.' }, { status: 500 });
  }
}

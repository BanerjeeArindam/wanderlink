import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { calculateTripCost, type TripCostInput } from '@/lib/trip-cost';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TripCostInput>;
    const input: TripCostInput = {
      origin: String(body.origin || '').slice(0, 3),
      destination: String(body.destination || '').slice(0, 3),
      attraction: String(body.attraction || 'Local attractions').slice(0, 120),
      travelMonth: String(body.travelMonth || 'Flexible').slice(0, 20),
      durationDays: Number(body.durationDays) || 5,
      adults: Number(body.adults) || 1,
      children: Number(body.children) || 0,
      seasonType: String(body.seasonType || 'Shoulder season').slice(0, 40),
    };

    if (!/^[A-Za-z]{3}$/.test(input.origin) || !/^[A-Za-z]{3}$/.test(input.destination)) {
      return NextResponse.json({ error: 'Origin and destination must be 3-letter IATA codes.' }, { status: 400 });
    }
    if (input.durationDays < 1 || input.durationDays > 30 || input.adults < 1 || input.adults > 9 || input.children < 0 || input.children > 9) {
      return NextResponse.json({ error: 'Trip length and traveler counts are outside the supported range.' }, { status: 400 });
    }

    const { userId } = await auth();
    const result = calculateTripCost(input, Boolean(userId));
    return NextResponse.json({ success: true, result, isRegistered: Boolean(userId) });
  } catch (error) {
    console.error('trip cost calculation error:', error);
    return NextResponse.json({ error: 'Unable to calculate this trip right now.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { buildAviasalesUrl } from '@/lib/aviasales';

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const destination = requestUrl.searchParams.get('destination')?.trim();
  const origin = requestUrl.searchParams.get('origin')?.trim();
  const destinationCode = requestUrl.searchParams.get('destinationCode')?.trim() || undefined;
  const adults = Number(requestUrl.searchParams.get('adults') || 1);
  const children = Number(requestUrl.searchParams.get('children') || 0);

  if (!destination || !origin) {
    return NextResponse.json(
      { error: 'Both origin and destination are required.' },
      { status: 400 }
    );
  }

  return NextResponse.redirect(buildAviasalesUrl({
    origin,
    destination,
    destinationCode,
    adults,
    children,
  }));
}
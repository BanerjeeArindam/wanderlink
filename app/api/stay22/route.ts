import { NextResponse } from 'next/server';
import { buildStay22Url, getStay22AffiliateId } from '@/lib/stay22';

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const destination = requestUrl.searchParams.get('destination')?.trim();
  const adults = Number(requestUrl.searchParams.get('adults') || 1);
  const children = Number(requestUrl.searchParams.get('children') || 0);

  if (!destination) {
    return NextResponse.json({ error: 'A destination is required.' }, { status: 400 });
  }

  if (!getStay22AffiliateId()) {
    return NextResponse.json(
      { error: 'Stay22 affiliate ID is not configured.' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(buildStay22Url({ destination, adults, children }));
}
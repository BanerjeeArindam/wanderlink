import { NextResponse } from 'next/server';
import { buildKlookUrl } from '@/lib/klook';

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query')?.trim();

  if (!query) {
    return NextResponse.json({ error: 'A search query is required.' }, { status: 400 });
  }

  return NextResponse.redirect(buildKlookUrl({ query }));
}

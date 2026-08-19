import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  guestRateLimiter,
  guestSearchLimit,
  memberRateLimiter,
  memberSearchLimit,
} from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const isGuest = !userId;
    const identifier = userId ||
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const limiter = isGuest ? guestRateLimiter : memberRateLimiter;
    const limit = isGuest ? guestSearchLimit : memberSearchLimit;
    const result = await limiter.getRemaining(identifier);

    return NextResponse.json({
      success: true,
      isGuest,
      limit,
      remainingSearches: Math.max(0, result.remaining),
      reset: result.reset,
    });
  } catch (error) {
    console.error('quota status error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to load search quota.' },
      { status: 500 }
    );
  }
}

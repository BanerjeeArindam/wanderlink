import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Guest rate limiter: 3 requests per 24 hours (86400 seconds)
export const guestRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, '86400 s'),
  prefix: '@upstash/ratelimit/guest',
});

// Member rate limiter: 10 requests per 24 hours
export const memberRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '86400 s'),
  prefix: '@upstash/ratelimit/member',
});


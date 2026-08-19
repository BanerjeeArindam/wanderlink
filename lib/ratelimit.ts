import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const parseEnvInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const guestSearchLimit = parseEnvInt(process.env.FREE_USER_SEARCH_LIMIT ?? process.env.GUEST_SEARCH_LIMIT, 3);
export const memberSearchLimit = parseEnvInt(process.env.LOGGED_IN_USER_SEARCH_LIMIT ?? process.env.MEMBER_SEARCH_LIMIT, 10);
export const rateLimitWindowSeconds = parseEnvInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 86400);

export const guestRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(guestSearchLimit, `${rateLimitWindowSeconds} s`),
  prefix: '@upstash/ratelimit/guest',
});

export const memberRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(memberSearchLimit, `${rateLimitWindowSeconds} s`),
  prefix: '@upstash/ratelimit/member',
});


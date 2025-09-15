import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Initialize Redis connection using Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for different operations
export const createBuyerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute
  analytics: true,
});

export const updateBuyerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
  analytics: true,
});

export const importBuyerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '300 s'), // 3 requests per 5 minutes
  analytics: true,
});

// Helper function to get identifier from request
export function getIdentifier(request: NextRequest, userId?: string): string {
  // Prefer user ID if authenticated, fallback to IP
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from various headers (for when behind proxy/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0]?.trim() || 
            realIp || 
            cfConnectingIp || 
            'unknown';
  
  return `ip:${ip}`;
}
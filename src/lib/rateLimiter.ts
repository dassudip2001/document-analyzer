import { LRUCache } from "lru-cache";
import { NextRequest } from "next/server";

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export const reteLimit = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limit = 5; // Requests per minute
  const currentCount = (rateLimitCache.get(ip) || 0) as number;

  if (currentCount >= limit) {
    throw new Response("Too many requests", { status: 429 });
  }

  rateLimitCache.set(ip, currentCount + 1);
};

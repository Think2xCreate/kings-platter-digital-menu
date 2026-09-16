interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * Sliding window rate limiter for protecting sensitive routes.
 * @param key Unique identifier (e.g. `login:127.0.0.1` or `upload:uid`)
 * @param maxRequests Maximum requests allowed in window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60 * 1000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(key);

  // Clean up stale entries when map grows large
  if (memoryStore.size > 5000) {
    memoryStore.forEach((val, k) => {
      if (val.resetTime < now) memoryStore.delete(k);
    });
  }

  if (!record || record.resetTime < now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(key, newRecord);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: record.resetTime,
  };
}

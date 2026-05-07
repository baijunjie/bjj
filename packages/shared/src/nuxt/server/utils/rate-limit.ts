/**
 * Rate limiting utility.
 *
 * Provides fine-grained rate limiting using Nitro's `useStorage` API.
 * Each limiter is bound to a `rateLimit:<namespace>` storage mount point;
 * configure the underlying driver in `nitro.storage` on the consumer side.
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed */
  maxRequests: number
  /** Time window in seconds */
  windowSeconds: number
}

interface RateLimitRecord {
  count: number
  windowStart: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInSeconds: number
}

/**
 * Create a rate limiter for a specific namespace.
 *
 * @param namespace - Unique namespace for this rate limiter (e.g., 'otp-email', 'otp-ip')
 * @param config - Rate limit configuration
 */
export function createRateLimiter (namespace: string, config: RateLimitConfig) {
  const { maxRequests, windowSeconds } = config
  const storage = useStorage<RateLimitRecord>(`rateLimit:${namespace}`)

  /**
   * Check rate limit for a given key without recording a hit.
   *
   * @param key - Unique identifier (e.g., email address, IP address)
   */
  async function check (key: string): Promise<RateLimitResult> {
    const now = Math.floor(Date.now() / 1000)
    const record = await storage.getItem(key)

    if (!record) {
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetInSeconds: windowSeconds,
      }
    }

    const windowEnd = record.windowStart + windowSeconds
    if (now >= windowEnd) {
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetInSeconds: windowSeconds,
      }
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds: windowEnd - now,
      }
    }

    return {
      allowed: true,
      remaining: maxRequests - record.count - 1,
      resetInSeconds: windowEnd - now,
    }
  }

  /**
   * Record a hit for the given key, starting a new window if needed.
   *
   * @param key - Unique identifier (e.g., email address, IP address)
   */
  async function record (key: string): Promise<void> {
    const now = Math.floor(Date.now() / 1000)
    const existing = await storage.getItem(key)

    if (!existing || now >= existing.windowStart + windowSeconds) {
      await storage.setItem(key, {
        count: 1,
        windowStart: now,
      })
    } else {
      await storage.setItem(key, {
        count: existing.count + 1,
        windowStart: existing.windowStart,
      })
    }
  }

  return {
    check,
    record,
  }
}

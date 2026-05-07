import type { FetchError } from 'ofetch'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

// ============================================================================
// Types
// ============================================================================

type RequestBody = BodyInit | Record<string, unknown> | null | undefined
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type FetchOptions = NitroFetchOptions<NitroFetchRequest>

export interface RequestCacheOptions {
  /** Time-to-live in milliseconds */
  ttl: number
  /** Custom cache key (defaults to URL + sorted query params) */
  key?: string
}

export interface RequestOptions extends Omit<FetchOptions, 'method' | 'body'> {
  method?: HttpMethod
  body?: RequestBody
  /**
   * Memory cache for GET requests.
   * - Default: applies factory's `defaultCacheTtl` (10s)
   * - Custom TTL: `{ ttl: 3_600_000 }`
   * - Disable: `false`
   */
  memoryCache?: RequestCacheOptions | false
}

export interface RequestFn<TOptions extends RequestOptions = RequestOptions> {
  <T>(url: string, options?: TOptions): Promise<T>
  get: <T>(url: string, options?: Omit<TOptions, 'body'>) => Promise<T>
  post: <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) => Promise<T>
  put: <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) => Promise<T>
  patch: <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) => Promise<T>
  delete: <T>(url: string, options?: TOptions) => Promise<T>
  /** Invalidate cached responses. Pass a URL prefix to clear matching entries, or omit to clear all. */
  invalidateCache: (urlPrefix?: string) => void
}

export interface CreateRequestOptions<TOptions extends RequestOptions = RequestOptions> {
  /** Default TTL (ms) for GET memory cache when caller doesn't override. */
  defaultCacheTtl?: number
  retry?: number
  retryDelay?: number
  retryStatusCodes?: number[]
  /** Forwarded to `$fetch`'s `onRequest` hook. */
  onRequest?: FetchOptions['onRequest']
  /** Forwarded to `$fetch`'s `onResponseError` hook. */
  onResponseError?: FetchOptions['onResponseError']
  /**
   * Called when a request rejects (network error or HTTP error).
   * The error is always re-thrown to the caller after this hook runs.
   */
  onError?: (error: FetchError, options: TOptions) => void | Promise<void>
}

// ============================================================================
// Cache helpers
// ============================================================================

interface CacheEntry {
  data: unknown
  expiresAt: number
}

const DEFAULT_CACHE_TTL = 10 * 1000

function generateCacheKey (url: string, query?: Record<string, unknown>): string {
  if (!query || Object.keys(query).length === 0) return url

  const sorted = Object.entries(query)
    .filter(([ , v ]) => v !== undefined && v !== null)
    .sort(([ a ], [ b ]) => a.localeCompare(b))
    .map(([ k, v ]) => `${k}=${String(v)}`)
    .join('&')

  return sorted ? `${url}?${sorted}` : url
}

function matchCacheKey (key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}?`) || key.startsWith(`${prefix}/`)
}

function clearMapByPrefix (map: Map<string, unknown>, prefix?: string): void {
  if (!prefix) {
    map.clear()
    return
  }
  for (const key of map.keys()) {
    if (matchCacheKey(key, prefix)) {
      map.delete(key)
    }
  }
}

// ============================================================================
// Factory
// ============================================================================

/**
 * Build a configured `$fetch` wrapper with memory cache + lifecycle hooks.
 *
 * Pure utility: no UI, no i18n, no error message resolution. Hosts pass
 * business handlers via `onRequest` / `onResponseError` / `onError`.
 */
export function createRequest<TOptions extends RequestOptions = RequestOptions> (
  config: CreateRequestOptions<TOptions> = {},
): RequestFn<TOptions> {
  const cacheStore = new Map<string, CacheEntry>()
  const pendingRequests = new Map<string, Promise<unknown>>()
  const defaultCacheTtl = config.defaultCacheTtl ?? DEFAULT_CACHE_TTL

  function invalidateCache (urlPrefix?: string): void {
    clearMapByPrefix(cacheStore as Map<string, unknown>, urlPrefix)
    clearMapByPrefix(pendingRequests as Map<string, unknown>, urlPrefix)
  }

  async function doFetch<T> (url: string, options: TOptions): Promise<T> {
    try {
      const result = await $fetch(url, {
        ...options,

        retry: config.retry ?? 1,
        retryDelay: config.retryDelay ?? 3000,
        retryStatusCodes: config.retryStatusCodes ?? [
          408, // Request Timeout
          429, // Too Many Requests
        ],

        onRequest: config.onRequest,
        onResponseError: config.onResponseError,
      } as FetchOptions)

      return result as T
    } catch (err) {
      const error = err as FetchError
      await config.onError?.(error, options)
      throw error
    }
  }

  async function request<T> (url: string, options?: TOptions): Promise<T> {
    const opts = (options ?? {}) as TOptions
    const { memoryCache, ...rest } = opts as RequestOptions
    const fetchOptions = rest as TOptions
    const method = opts.method ?? 'GET'

    // GET requests share an in-memory cache by default; non-GET and explicit
    // `memoryCache: false` skip the cache layer entirely.
    const cacheOptions = method === 'GET' && memoryCache !== false
      ? (memoryCache ?? { ttl: defaultCacheTtl })
      : null

    if (import.meta.client && cacheOptions) {
      const cacheKey = cacheOptions.key
        ?? generateCacheKey(url, fetchOptions.query as Record<string, unknown> | undefined)

      const cached = cacheStore.get(cacheKey)
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as T
      }

      const pending = pendingRequests.get(cacheKey)
      if (pending) {
        return pending as Promise<T>
      }

      const promise = doFetch<T>(url, fetchOptions)
        .then(result => {
          cacheStore.set(cacheKey, {
            data: result,
            expiresAt: Date.now() + cacheOptions.ttl,
          })
          return result
        })
        .finally(() => {
          pendingRequests.delete(cacheKey)
        })

      pendingRequests.set(cacheKey, promise)
      return promise
    }

    return doFetch<T>(url, fetchOptions)
  }

  request.get = <T>(url: string, options?: Omit<TOptions, 'body'>) =>
    request<T>(url, { ...options, method: 'GET' } as TOptions)

  request.post = <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) =>
    request<T>(url, { ...options, method: 'POST', body } as TOptions)

  request.put = <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) =>
    request<T>(url, { ...options, method: 'PUT', body } as TOptions)

  request.patch = <T>(url: string, body?: RequestBody, options?: Omit<TOptions, 'body'>) =>
    request<T>(url, { ...options, method: 'PATCH', body } as TOptions)

  request.delete = <T>(url: string, options?: TOptions) =>
    request<T>(url, { ...options, method: 'DELETE' } as TOptions)

  request.invalidateCache = invalidateCache

  return request as RequestFn<TOptions>
}

/**
 * Persistence cache (localStorage by default)
 */

interface CacheEntry<T = unknown> {
  value: T
  expiresAt: number | null
}

export interface CacheOptions {
  /** Prefix prepended to every key. Defaults to empty string (no isolation). */
  prefix?: string
  /** Storage backend. Defaults to `localStorage`. */
  storage?: Storage
}

export class Cache {
  private readonly prefix: string
  private readonly storage: Storage

  constructor (options: CacheOptions = {}) {
    this.prefix = options.prefix ?? ''
    this.storage = options.storage ?? localStorage
  }

  clear (): void {
    const keys = this.keys()
    for (const key of keys) {
      this.storage.removeItem(this.prefix + key)
    }
  }

  get<T = unknown> (key: string, defaultValue?: T): T | undefined {
    if (!key) {
      console.error('The parameter key cannot be empty.')
      return defaultValue
    }

    let entry: CacheEntry<T> | null
    try {
      entry = JSON.parse(this.storage.getItem(this.prefix + key) ?? 'null')
    } catch {
      return defaultValue
    }

    entry = pickFresh(entry)

    if (entry) {
      return entry.value
    } else {
      this.remove(key)
      return defaultValue
    }
  }

  has (key: string): boolean {
    if (!key) return false
    try {
      const entry: CacheEntry | null = JSON.parse(this.storage.getItem(this.prefix + key) ?? 'null')
      return pickFresh(entry) !== null
    } catch {
      return false
    }
  }

  keys (): string[] {
    const prefixLength = this.prefix.length
    const result: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key && key.startsWith(this.prefix)) {
        result.push(key.slice(prefixLength))
      }
    }
    return result
  }

  remove (key: string): void {
    this.storage.removeItem(this.prefix + key)
  }

  set<T = unknown> (key: string, value: T, ttl?: number | null): void {
    if (!key) {
      console.error('The parameter key cannot be empty.')
      return
    }

    if (value === undefined) {
      console.error(`When setting the cache, the key<${key}> must have an explicit value.`)
      return
    }

    const data = JSON.stringify({
      value,
      expiresAt: ttl ? Date.now() + ttl : null,
    })

    try {
      this.storage.setItem(this.prefix + key, data)
    } catch {
      this.remove(key)
      this.storage.setItem(this.prefix + key, data)
    }
  }
}

function pickFresh<T> (entry: CacheEntry<T> | null): CacheEntry<T> | null {
  if (entry && (!entry.expiresAt || entry.expiresAt > Date.now())) {
    return entry
  }
  return null
}

/**
 * Persistence cache (localStorage by default)
 */

interface CacheData<T = unknown> {
  value: T
  expire: number | null
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
    const keysToRemove = this.keys()
    for (const key of keysToRemove) {
      this.storage.removeItem(this.prefix + key)
    }
  }

  del (key: string): void {
    this.storage.removeItem(this.prefix + key)
  }

  get<T = unknown> (key: string, defaultValue?: T): T | undefined {
    if (!key) {
      console.error('The parameter key cannot be empty.')
      return defaultValue
    }

    let data: CacheData<T> | null
    try {
      data = JSON.parse(this.storage.getItem(this.prefix + key) ?? 'null')
    } catch {
      return defaultValue
    }

    data = overdueValidate(data)

    if (data) {
      return data.value
    } else {
      this.del(key)
      return defaultValue
    }
  }

  has (key: string): boolean {
    if (!key) return false
    try {
      const data: CacheData | null = JSON.parse(this.storage.getItem(this.prefix + key) ?? 'null')
      return overdueValidate(data) !== null
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

  set<T = unknown> (key: string, value: T, validTime?: number | null): void {
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
      expire: validTime ? Date.now() + validTime : null,
    })

    try {
      this.storage.setItem(this.prefix + key, data)
    } catch {
      this.del(key)
      this.storage.setItem(this.prefix + key, data)
    }
  }
}

function overdueValidate<T> (data: CacheData<T> | null): CacheData<T> | null {
  if (data && (!data.expire || data.expire > Date.now())) {
    return data
  }
  return null
}

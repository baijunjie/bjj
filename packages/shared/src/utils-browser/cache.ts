/**
 * Persistence cache (localStorage)
 */

interface CacheData<T = unknown> {
  value: T
  expire: number | null
}

interface Cache {
  get: <T = unknown>(key: string, defaultValue?: T) => T | undefined
  set: <T = unknown>(key: string, value: T, validTime?: number | null) => void
  del: (key: string) => void
  has: (key: string) => boolean
  keys: () => string[]
  clear: () => void
}

const IS_PRO = process.env.NODE_ENV === 'production'
const PREFIX = IS_PRO ? 'PRO_' : 'DEV_'

function overdueValidate<T>(data: CacheData<T> | null): CacheData<T> | null {
  if (data && (!data.expire || data.expire > Date.now())) {
    return data
  }
  return null
}

function get<T = unknown>(key: string, defaultValue?: T): T | undefined {
  if (!key) {
    console.error('The parameter key cannot be empty.')
    return defaultValue
  }

  let data: CacheData<T> | null
  try {
    data = JSON.parse(localStorage.getItem(PREFIX + key) ?? 'null')
  } catch {
    return defaultValue
  }

  data = overdueValidate(data)

  if (data) {
    return data.value
  } else {
    del(key)
    return defaultValue
  }
}

function set<T = unknown>(key: string, value: T, validTime?: number | null): void {
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
    localStorage.setItem(PREFIX + key, data)
  } catch {
    del(key)
    localStorage.setItem(PREFIX + key, data)
  }
}

function del(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

function has(key: string): boolean {
  if (!key) return false
  try {
    const data: CacheData | null = JSON.parse(localStorage.getItem(PREFIX + key) ?? 'null')
    return overdueValidate(data) !== null
  } catch {
    return false
  }
}

function keys(): string[] {
  const reg = new RegExp(`^${PREFIX}`)
  return Object.keys(localStorage)
    .filter(key => reg.test(key))
    .map(key => key.replace(reg, ''))
}

function clear(): void {
  const reg = new RegExp(`^${PREFIX}`)
  const keysToRemove = Object.keys(localStorage).filter(key => reg.test(key))
  for (const key of keysToRemove) {
    localStorage.removeItem(key)
  }
}

export const cache: Cache = { get, set, del, has, keys, clear }
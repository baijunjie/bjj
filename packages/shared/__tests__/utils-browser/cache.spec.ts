import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Cache } from '../../src/utils-browser/cache'

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    localStorage.clear()
    cache = new Cache({ prefix: 'TEST_' })
  })

  it('should return defaultValue when key does not exist', () => {
    expect(cache.get('test', 456)).toBe(456)
  })

  it('should set and get values', () => {
    cache.set('test', 123)
    expect(cache.get('test')).toBe(123)
    expect(cache.get('test')).not.toBe('123')
  })

  it('should preserve value types', () => {
    cache.set('test2', '123')
    expect(cache.get('test2')).toBe('123')
    expect(cache.get('test2')).not.toBe(123)
  })

  it('should list keys', () => {
    cache.set('test', 123)
    cache.set('test2', '123')
    expect(cache.keys()).toEqual([ 'test', 'test2' ])
  })

  it('should delete keys', () => {
    cache.set('test', 123)
    cache.set('test2', '123')
    cache.remove('test2')
    expect(cache.get('test2')).toBe(undefined)
  })

  it('should check key existence', () => {
    cache.set('test', 123)
    expect(cache.has('test')).toBe(true)
    expect(cache.has('test2')).toBe(false)
  })

  it('should return false for has() with empty key', () => {
    expect(cache.has('')).toBe(false)
  })

  it('should respect expiration on get', () => {
    cache.set('expiring', 'value', 100)
    expect(cache.get('expiring')).toBe('value')

    vi.useFakeTimers()
    vi.advanceTimersByTime(200)
    expect(cache.get('expiring')).toBe(undefined)
    expect(cache.get('expiring', 'default')).toBe('default')
    vi.useRealTimers()
  })

  it('should respect expiration on has()', () => {
    cache.set('expiring', 'value', 100)
    expect(cache.has('expiring')).toBe(true)

    vi.useFakeTimers()
    vi.advanceTimersByTime(200)
    expect(cache.has('expiring')).toBe(false)
    vi.useRealTimers()
  })

  it('should not expire when ttl is not set', () => {
    cache.set('permanent', 'value')

    vi.useFakeTimers()
    vi.advanceTimersByTime(999999999)
    expect(cache.get('permanent')).toBe('value')
    expect(cache.has('permanent')).toBe(true)
    vi.useRealTimers()
  })

  it('should clear all entries with the instance prefix', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    cache.set('c', 3)
    expect(cache.keys().length).toBe(3)

    cache.clear()
    expect(cache.keys().length).toBe(0)
    expect(cache.get('a')).toBe(undefined)
    expect(cache.get('b')).toBe(undefined)
  })

  it('should only clear prefixed entries on clear()', () => {
    cache.set('managed', 'value')
    localStorage.setItem('external_key', 'external_value')

    cache.clear()
    expect(cache.get('managed')).toBe(undefined)
    expect(localStorage.getItem('external_key')).toBe('external_value')
  })

  it('should store and retrieve complex objects', () => {
    const obj = { nested: { arr: [ 1, 2, 3 ], flag: true }}
    cache.set('complex', obj)
    expect(cache.get('complex')).toEqual(obj)
  })

  it('should return defaultValue for corrupted data', () => {
    localStorage.setItem('TEST_bad', 'not-json{{{')
    expect(cache.get('bad', 'fallback')).toBe('fallback')
  })

  it('should return false for has() with corrupted data', () => {
    localStorage.setItem('TEST_bad', 'not-json{{{')
    expect(cache.has('bad')).toBe(false)
  })
})

describe('Cache with default options', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should default to empty prefix and localStorage', () => {
    const cache = new Cache()
    cache.set('foo', 1)
    expect(localStorage.getItem('foo')).toBeTruthy()
    expect(cache.get('foo')).toBe(1)
  })

  it('should not collide across different prefixes', () => {
    const a = new Cache({ prefix: 'a_' })
    const b = new Cache({ prefix: 'b_' })
    a.set('key', 1)
    b.set('key', 2)
    expect(a.get('key')).toBe(1)
    expect(b.get('key')).toBe(2)
    expect(a.keys()).toEqual([ 'key' ])
    expect(b.keys()).toEqual([ 'key' ])
  })
})

describe('Cache with custom storage', () => {
  it('should use the provided storage backend', () => {
    const store = new Map<string, string>()
    const customStorage: Storage = {
      get length () {
        return store.size
      },
      key: index => [ ...store.keys() ][index] ?? null,
      getItem: key => store.get(key) ?? null,
      setItem: (key, value) => {
        store.set(key, value)
      },
      removeItem: key => {
        store.delete(key)
      },
      clear: () => {
        store.clear()
      },
    }

    const cache = new Cache({ prefix: 'x_', storage: customStorage })
    cache.set('k', { hello: 'world' })

    expect(store.has('x_k')).toBe(true)
    expect(cache.get('k')).toEqual({ hello: 'world' })
    expect(cache.keys()).toEqual([ 'k' ])

    cache.clear()
    expect(store.size).toBe(0)
  })

  it('should not touch real localStorage when custom storage is provided', () => {
    localStorage.clear()
    const store = new Map<string, string>()
    const customStorage = {
      get length () {
        return store.size
      },
      key: (i: number) => [ ...store.keys() ][i] ?? null,
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
      clear: () => {
        store.clear()
      },
    } satisfies Storage

    const cache = new Cache({ storage: customStorage })
    cache.set('foo', 'bar')

    expect(localStorage.getItem('foo')).toBeNull()
    expect(store.get('foo')).toBeTruthy()
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache } from '../../src/utils-browser/cache'

describe('cache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should exist', () => {
    expect(cache).not.toBe(undefined)
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
    expect(cache.keys()).toEqual(['test', 'test2'])
  })

  it('should delete keys', () => {
    cache.set('test', 123)
    cache.set('test2', '123')
    cache.del('test2')
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

    // 模拟过期
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

  it('should not expire when validTime is not set', () => {
    cache.set('permanent', 'value')

    vi.useFakeTimers()
    vi.advanceTimersByTime(999999999)
    expect(cache.get('permanent')).toBe('value')
    expect(cache.has('permanent')).toBe(true)
    vi.useRealTimers()
  })

  it('should clear all cache entries', () => {
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

    localStorage.removeItem('external_key')
  })

  it('should store and retrieve complex objects', () => {
    const obj = { nested: { arr: [1, 2, 3], flag: true } }
    cache.set('complex', obj)
    expect(cache.get('complex')).toEqual(obj)
  })

  it('should return defaultValue for corrupted data', () => {
    localStorage.setItem('DEV_bad', 'not-json{{{')
    expect(cache.get('bad', 'fallback')).toBe('fallback')
  })

  it('should return false for has() with corrupted data', () => {
    localStorage.setItem('DEV_bad', 'not-json{{{')
    expect(cache.has('bad')).toBe(false)
  })
})
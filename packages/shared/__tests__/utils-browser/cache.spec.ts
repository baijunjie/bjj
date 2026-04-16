import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Cache } from '../../src/utils-browser/cache'

describe('Cache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should exist', () => {
    expect(Cache).not.toBe(undefined)
  })

  it('should return defaultValue when key does not exist', () => {
    expect(Cache.get('test', 456)).toBe(456)
  })

  it('should set and get values', () => {
    Cache.set('test', 123)
    expect(Cache.get('test')).toBe(123)
    expect(Cache.get('test')).not.toBe('123')
  })

  it('should preserve value types', () => {
    Cache.set('test2', '123')
    expect(Cache.get('test2')).toBe('123')
    expect(Cache.get('test2')).not.toBe(123)
  })

  it('should list keys', () => {
    Cache.set('test', 123)
    Cache.set('test2', '123')
    expect(Cache.keys()).toEqual(['test', 'test2'])
  })

  it('should delete keys', () => {
    Cache.set('test', 123)
    Cache.set('test2', '123')
    Cache.del('test2')
    expect(Cache.get('test2')).toBe(undefined)
  })

  it('should check key existence', () => {
    Cache.set('test', 123)
    expect(Cache.has('test')).toBe(true)
    expect(Cache.has('test2')).toBe(false)
  })

  it('should return false for has() with empty key', () => {
    expect(Cache.has('')).toBe(false)
  })

  it('should respect expiration on get', () => {
    Cache.set('expiring', 'value', 100)
    expect(Cache.get('expiring')).toBe('value')

    // 模拟过期
    vi.useFakeTimers()
    vi.advanceTimersByTime(200)
    expect(Cache.get('expiring')).toBe(undefined)
    expect(Cache.get('expiring', 'default')).toBe('default')
    vi.useRealTimers()
  })

  it('should respect expiration on has()', () => {
    Cache.set('expiring', 'value', 100)
    expect(Cache.has('expiring')).toBe(true)

    vi.useFakeTimers()
    vi.advanceTimersByTime(200)
    expect(Cache.has('expiring')).toBe(false)
    vi.useRealTimers()
  })

  it('should not expire when validTime is not set', () => {
    Cache.set('permanent', 'value')

    vi.useFakeTimers()
    vi.advanceTimersByTime(999999999)
    expect(Cache.get('permanent')).toBe('value')
    expect(Cache.has('permanent')).toBe(true)
    vi.useRealTimers()
  })

  it('should clear all Cache entries', () => {
    Cache.set('a', 1)
    Cache.set('b', 2)
    Cache.set('c', 3)
    expect(Cache.keys().length).toBe(3)

    Cache.clear()
    expect(Cache.keys().length).toBe(0)
    expect(Cache.get('a')).toBe(undefined)
    expect(Cache.get('b')).toBe(undefined)
  })

  it('should only clear prefixed entries on clear()', () => {
    Cache.set('managed', 'value')
    localStorage.setItem('external_key', 'external_value')

    Cache.clear()
    expect(Cache.get('managed')).toBe(undefined)
    expect(localStorage.getItem('external_key')).toBe('external_value')

    localStorage.removeItem('external_key')
  })

  it('should store and retrieve complex objects', () => {
    const obj = { nested: { arr: [1, 2, 3], flag: true } }
    Cache.set('complex', obj)
    expect(Cache.get('complex')).toEqual(obj)
  })

  it('should return defaultValue for corrupted data', () => {
    localStorage.setItem('DEV_bad', 'not-json{{{')
    expect(Cache.get('bad', 'fallback')).toBe('fallback')
  })

  it('should return false for has() with corrupted data', () => {
    localStorage.setItem('DEV_bad', 'not-json{{{')
    expect(Cache.has('bad')).toBe(false)
  })
})
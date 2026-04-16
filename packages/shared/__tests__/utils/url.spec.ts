import { describe, it, expect } from 'vitest'
import { composeUrl } from '../../src/utils/url'

describe('composeUrl', () => {
  it('should append params to url', () => {
    expect(composeUrl('/api', { b: 2, a: 1 })).toBe('/api?a=1&b=2')
  })

  it('should append params to url with existing query', () => {
    expect(composeUrl('/api?x=0', { b: 2, a: 1 })).toBe('/api?a=1&b=2&x=0')
  })

  it('should handle url ending with ?', () => {
    expect(composeUrl('/api?', { a: 1 })).toBe('/api?a=1')
  })

  it('should handle url ending with &', () => {
    expect(composeUrl('/api?x=0&', { a: 1 })).toBe('/api?a=1&x=0')
  })

  it('should encode params', () => {
    expect(composeUrl('/api', { q: 'hello world' })).toBe('/api?q=hello+world')
  })

  it('should stringify object values', () => {
    expect(composeUrl('/api', { data: { a: 1 } })).toBe('/api?data=%7B%22a%22%3A1%7D')
  })

  it('should return url when params is not an object', () => {
    expect(composeUrl('/api', null as any)).toBe('/api')
  })

  it('should skip null and undefined values', () => {
    expect(composeUrl('/api', { a: 1, b: null, c: undefined, d: 2 })).toBe('/api?a=1&d=2')
  })

  it('should return original url when all values are null/undefined', () => {
    expect(composeUrl('/api', { a: null, b: undefined })).toBe('/api')
  })

  it('should preserve hash fragment after params', () => {
    expect(composeUrl('/page#section', { a: 1 })).toBe('/page?a=1#section')
  })

  it('should preserve hash fragment with existing query', () => {
    expect(composeUrl('/page?x=0#section', { a: 1 })).toBe('/page?a=1&x=0#section')
  })

  it('should handle empty params object', () => {
    expect(composeUrl('/api', {})).toBe('/api')
  })

  it('should keep boolean and number zero values', () => {
    expect(composeUrl('/api', { a: 0, b: false, c: '' })).toBe('/api?a=0&b=false&c=')
  })

  it('should work with absolute urls', () => {
    expect(composeUrl('https://example.com/api', { a: 1 })).toBe('https://example.com/api?a=1')
  })

  it('should sort all params together', () => {
    expect(composeUrl('/api?z=0&m=1', { a: 2 })).toBe('/api?a=2&m=1&z=0')
  })
})
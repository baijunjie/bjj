import { describe, it, expect } from 'vitest'
import { parseQuery } from '../../src/utils-browser/url'

describe('parseQuery', () => {
  it('should parse query string', () => {
    expect(parseQuery('/?a=1&c=3&b=2')).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('should return empty object when no query', () => {
    expect(parseQuery('/path')).toEqual({})
  })

  it('should decode encoded values', () => {
    expect(parseQuery('/?q=hello%20world')).toEqual({ q: 'hello world' })
  })

  it('should handle value containing = sign', () => {
    expect(parseQuery('/?token=abc=def=ghi')).toEqual({ token: 'abc=def=ghi' })
  })

  it('should handle key without value', () => {
    expect(parseQuery('/?debug&a=1')).toEqual({ debug: '', a: '1' })
  })

  it('should handle + as space', () => {
    expect(parseQuery('/?q=hello+world')).toEqual({ q: 'hello world' })
  })

  it('should use last value for duplicate keys', () => {
    expect(parseQuery('/?a=1&a=2')).toEqual({ a: '2' })
  })

  it('should ignore hash fragment', () => {
    expect(parseQuery('/?a=1&b=2#section')).toEqual({ a: '1', b: '2' })
  })

  it('should handle empty query string', () => {
    expect(parseQuery('/?')).toEqual({})
  })

  it('should handle full url', () => {
    expect(parseQuery('https://example.com/path?a=1&b=2')).toEqual({ a: '1', b: '2' })
  })
})
import { describe, it, expect } from 'vitest'
import { sortKey } from '../../src/utils/object'

describe('sortKey', () => {
  it('should sort keys alphabetically', () => {
    expect(JSON.stringify(sortKey({ b: 2, a: 1, c: 3 }))).toBe(JSON.stringify({ a: 1, b: 2, c: 3 }))
  })

  it('should sort keys by custom order', () => {
    const result = sortKey({ a: 1, b: 2, c: 3 }, [ 'c', 'a', 'b' ])
    expect(Object.keys(result)).toEqual([ 'c', 'a', 'b' ])
  })

  it('should put unordered keys after ordered keys', () => {
    const result = sortKey({ d: 4, a: 1, b: 2, c: 3 }, [ 'c', 'a' ])
    expect(Object.keys(result)).toEqual([ 'c', 'a', 'b', 'd' ])
  })

  it('should handle empty order array', () => {
    expect(JSON.stringify(sortKey({ b: 2, a: 1 }, []))).toBe(JSON.stringify({ a: 1, b: 2 }))
  })

  it('should handle null order', () => {
    expect(JSON.stringify(sortKey({ b: 2, a: 1 }, null))).toBe(JSON.stringify({ a: 1, b: 2 }))
  })
})

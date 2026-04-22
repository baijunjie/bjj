import { describe, it, expect, vi } from 'vitest'
import { safeJsonParse } from '../../src/utils/json'

describe('safeJsonParse', () => {
  it('should parse valid JSON objects', () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 })
  })

  it('should parse valid JSON arrays', () => {
    expect(safeJsonParse<number[]>('[1,2,3]')).toEqual([ 1, 2, 3 ])
  })

  it('should return default value for invalid JSON', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(safeJsonParse('not-json', { fallback: true })).toEqual({ fallback: true })
    spy.mockRestore()
  })

  it('should return {} when no default is provided for invalid JSON', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(safeJsonParse('not-json')).toEqual({})
    spy.mockRestore()
  })

  it('should return default when input is undefined', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(safeJsonParse(undefined, [])).toEqual([])
    spy.mockRestore()
  })
})

import { describe, it, expect } from 'vitest'
import { cn } from '../../../src/vue/utils/css'

describe('cn', () => {
  it('should concatenate class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes via object', () => {
    expect(cn('foo', { bar: true, baz: false })).toBe('foo bar')
  })

  it('should merge conflicting tailwind classes (last wins)', () => {
    expect(cn('px-2 px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('should drop falsy inputs', () => {
    expect(cn('foo', null, undefined, false, '', 'bar')).toBe('foo bar')
  })

  it('should return empty string with no inputs', () => {
    expect(cn()).toBe('')
  })
})

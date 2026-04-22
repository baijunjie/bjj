import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDecimal,
  formatPercent,
  formatWalletAddress,
  replaceMiddleWithDots,
  toSnakeCase,
} from '../../src/utils/format'

describe('formatCurrency', () => {
  it('should format USD without trailing zeros', () => {
    expect(formatCurrency(1, 'USD')).toBe('$1')
    expect(formatCurrency(1.5, 'USD')).toBe('$1.5')
    expect(formatCurrency(1.23, 'USD')).toBe('$1.23')
  })

  it('should accept string input', () => {
    expect(formatCurrency('2.50', 'USD')).toBe('$2.5')
  })

  it('should preserve non-trailing zeros', () => {
    expect(formatCurrency(1.05, 'USD')).toBe('$1.05')
  })

  it('should format JPY with no decimals', () => {
    expect(formatCurrency(1000, 'JPY')).toBe('¥1,000')
  })

  it('should return $0 for NaN input', () => {
    expect(formatCurrency('abc', 'USD')).toBe('$0')
  })
})

describe('formatDecimal', () => {
  it('should round to given decimals and strip trailing zeros', () => {
    expect(formatDecimal(1.501, 2)).toBe('1.5')
    expect(formatDecimal(2.051, 2)).toBe('2.05')
    expect(formatDecimal('3.10', 1)).toBe('3.1')
  })

  it('should return integer string when no fraction remains', () => {
    expect(formatDecimal(2, 2)).toBe('2')
    expect(formatDecimal(2.0, 2)).toBe('2')
  })
})

describe('formatPercent', () => {
  it('should format decimal as percent with two decimals', () => {
    expect(formatPercent(0.1234)).toBe('12.34%')
    expect(formatPercent(1)).toBe('100.00%')
    expect(formatPercent(0)).toBe('0.00%')
  })
})

describe('replaceMiddleWithDots', () => {
  it('should replace middle when string is longer than left+right', () => {
    expect(replaceMiddleWithDots('1234567890abc', { left: 3, right: 3 })).toBe('123...abc')
  })

  it('should return original when shorter than left+right', () => {
    expect(replaceMiddleWithDots('short', { left: 3, right: 3 })).toBe('short')
  })

  it('should use default left=5 right=5', () => {
    expect(replaceMiddleWithDots('0123456789abcdef')).toBe('01234...bcdef')
  })
})

describe('formatWalletAddress', () => {
  it('should keep first 8 and last 6 chars', () => {
    expect(formatWalletAddress('0x1234567890abcdef1234567890abcdef12345678'))
      .toBe('0x123456...345678')
  })

  it('should return original when address is short', () => {
    expect(formatWalletAddress('0x123')).toBe('0x123')
  })
})

describe('toSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(toSnakeCase('ExampleApp')).toBe('example_app')
    expect(toSnakeCase('exampleApp')).toBe('example_app')
  })

  it('should convert spaces to underscores', () => {
    expect(toSnakeCase('My App')).toBe('my_app')
    expect(toSnakeCase('My   App')).toBe('my_app')
  })

  it('should convert hyphens to underscores', () => {
    expect(toSnakeCase('my-app')).toBe('my_app')
    expect(toSnakeCase('my--app')).toBe('my_app')
  })

  it('should handle digits between letters', () => {
    expect(toSnakeCase('App2Version')).toBe('app2_version')
  })
})

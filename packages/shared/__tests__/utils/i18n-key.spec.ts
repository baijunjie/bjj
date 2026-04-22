import { describe, it, expect, vi } from 'vitest'
import {
  decodeI18nKey,
  encodeI18nKey,
  isI18nKey,
  translateI18nKey,
} from '../../src/utils/i18n-key'

describe('encodeI18nKey', () => {
  it('should encode without params', () => {
    expect(encodeI18nKey('shared.validation.email.invalid'))
      .toBe('i18n:shared.validation.email.invalid')
  })

  it('should encode with params', () => {
    expect(encodeI18nKey('shared.validation.walletName.tooLong', { maximum: 100 }))
      .toBe('i18n:shared.validation.walletName.tooLong:{"maximum":100}')
  })

  it('should ignore empty params object', () => {
    expect(encodeI18nKey('foo.bar', {})).toBe('i18n:foo.bar')
  })
})

describe('isI18nKey', () => {
  it('should return true for encoded keys', () => {
    expect(isI18nKey('i18n:foo.bar')).toBe(true)
    expect(isI18nKey('i18n:foo.bar:{"a":1}')).toBe(true)
  })

  it('should return false for plain strings', () => {
    expect(isI18nKey('foo.bar')).toBe(false)
    expect(isI18nKey('')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isI18nKey(null)).toBe(false)
    expect(isI18nKey(undefined)).toBe(false)
    expect(isI18nKey(42)).toBe(false)
    expect(isI18nKey({ key: 'i18n:foo' })).toBe(false)
  })
})

describe('decodeI18nKey', () => {
  it('should decode key without params', () => {
    expect(decodeI18nKey('i18n:foo.bar')).toEqual({ key: 'foo.bar' })
  })

  it('should decode key with params', () => {
    expect(decodeI18nKey('i18n:foo.bar:{"maximum":100}'))
      .toEqual({ key: 'foo.bar', params: { maximum: 100 }})
  })

  it('should return original for non-encoded strings', () => {
    expect(decodeI18nKey('foo.bar')).toEqual({ key: 'foo.bar' })
  })

  it('should fall back to full content when JSON parse fails', () => {
    expect(decodeI18nKey('i18n:foo.bar:not-json'))
      .toEqual({ key: 'foo.bar:not-json' })
  })
})

describe('translateI18nKey', () => {
  it('should return original value when not an i18n key', () => {
    const t = vi.fn((k: string) => `translated:${k}`)
    expect(translateI18nKey('plain text', t)).toBe('plain text')
    expect(t).not.toHaveBeenCalled()
  })

  it('should translate encoded key without params', () => {
    const t = vi.fn((k: string) => `T(${k})`)
    expect(translateI18nKey('i18n:hello.world', t)).toBe('T(hello.world)')
    expect(t).toHaveBeenCalledWith('hello.world')
  })

  it('should translate encoded key with params', () => {
    const t = vi.fn((k: string, params?: Record<string, unknown>) => `T(${k},${JSON.stringify(params)})`)
    expect(translateI18nKey('i18n:hello.world:{"name":"Alice"}', t))
      .toBe('T(hello.world,{"name":"Alice"})')
    expect(t).toHaveBeenCalledWith('hello.world', { name: 'Alice' })
  })

  it('should round-trip encode then decode then translate', () => {
    const encoded = encodeI18nKey('form.max', { n: 3 })
    const t = vi.fn((k: string, params?: Record<string, unknown>) => `${k}/${params?.n}`)
    expect(translateI18nKey(encoded, t)).toBe('form.max/3')
  })
})

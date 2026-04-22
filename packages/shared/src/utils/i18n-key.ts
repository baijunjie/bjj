/**
 * I18n Key Encoding/Decoding
 *
 * Provides utilities for encoding i18n keys with optional parameters into a string format,
 * and decoding them back for translation. This allows validation schemas to be decoupled
 * from i18n translation functions.
 *
 * Format:
 * - Without params: "i18n:shared.validation.email.invalid"
 * - With params: "i18n:shared.validation.walletName.tooLong:{"maximum":100}"
 */

/**
 * Decoded i18n key structure
 */
export interface DecodedI18nKey {
  key: string
  params?: Record<string, unknown>
}

/**
 * Plain translator function signature.
 *
 * Structurally compatible with vue-i18n's `t` (and similar libraries), but
 * defined without any framework-specific type dependency so this module stays
 * framework-agnostic.
 */
export type I18nTranslatorFn = (key: string, params?: Record<string, unknown>) => string

const I18N_PREFIX = 'i18n:'

/**
 * Decode an encoded i18n key string
 *
 * @param encoded - Encoded i18n key string
 * @returns Decoded key and optional parameters
 */
export function decodeI18nKey (encoded: string): DecodedI18nKey {
  if (!isI18nKey(encoded)) {
    return { key: encoded }
  }

  const content = encoded.slice(I18N_PREFIX.length)
  const colonIndex = content.indexOf(':')

  if (colonIndex === -1) {
    return { key: content }
  }

  const key = content.slice(0, colonIndex)
  const paramsStr = content.slice(colonIndex + 1)

  try {
    return { key, params: JSON.parse(paramsStr) }
  } catch {
    // If JSON parsing fails, treat the whole content as the key
    return { key: content }
  }
}

/**
 * Encode an i18n key with optional parameters into a string
 *
 * @param key - The i18n translation key
 * @param params - Optional parameters for interpolation
 * @returns Encoded string in format "i18n:key" or "i18n:key:{params}"
 */
export function encodeI18nKey (key: string, params?: Record<string, unknown>): string {
  if (params && Object.keys(params).length > 0) {
    return `${I18N_PREFIX}${key}:${JSON.stringify(params)}`
  }
  return `${I18N_PREFIX}${key}`
}

/**
 * Check if a string is an encoded i18n key
 *
 * @param value - String to check
 * @returns true if the string starts with "i18n:" prefix
 */
export function isI18nKey (value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(I18N_PREFIX)
}

/**
 * Translate an i18n key if it's encoded, otherwise return as-is
 *
 * @param value - String that may be an encoded i18n key
 * @param t - Translation function
 * @returns Translated string or original value
 */
export function translateI18nKey (value: string, t: I18nTranslatorFn): string {
  if (!isI18nKey(value)) {
    return value
  }

  const { key, params } = decodeI18nKey(value)
  return params ? t(key, params) : t(key)
}

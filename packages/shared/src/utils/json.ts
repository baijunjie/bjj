/**
 * Safely parse a JSON string.
 * @param str - The string to parse
 * @param defaultValue - Fallback value when parsing fails
 */
export function safeJsonParse<T extends object | unknown[]> (str?: string, defaultValue?: T): T {
  try {
    return JSON.parse(str!)
  } catch (e) {
    console.error(e)
    return defaultValue ?? ({} as T)
  }
}

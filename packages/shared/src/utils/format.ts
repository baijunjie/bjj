/**
 * Format a number or string as currency
 * Trailing zeros after decimal point are removed (e.g., $1.00 -> $1, $1.50 -> $1.5)
 * @param value - The value to format (number or string)
 * @param currency - ISO 4217 currency code (e.g., 'USD', 'JPY', 'EUR')
 */
export function formatCurrency (value: number | string, currency: string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return '$0'
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num)
  // Remove trailing zeros after decimal point (e.g., $1.00 -> $1, $1.50 -> $1.5)
  return formatted.replace(/\.00$/, '').replace(/(\.\d*?)0+$/, '$1')
}

/**
 * Format a number to fixed decimal places, removing trailing zeros.
 * formatDecimal(1.501, 2)   => '1.5'
 * formatDecimal(2.051, 2)   => '2.05'
 * formatDecimal('3.10', 1)  => '3.1'
 */
export function formatDecimal (value: number | string, decimals: number): string {
  return parseFloat(Number(value).toFixed(decimals)).toString()
}

/**
 * Format a decimal value as percentage
 * @param value - The decimal value (e.g., 0.1234 for 12.34%)
 * @returns Formatted percentage string (e.g., "12.34%")
 */
export function formatPercent (value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Format Ethereum wallet address for display
 * Keeps first 8 and last 6 characters, replacing middle with dots
 * @param address - The wallet address to format
 * @returns Formatted address (e.g., "0x123456...abcdef")
 */
export function formatWalletAddress (address: string): string {
  return replaceMiddleWithDots(address, { left: 8, right: 6 })
}

/**
 * Replaces the middle part of a string with dots, keeping the specified number of characters
 * @param value - The original string
 * @param options - Options to specify how many characters to keep on the left and right
 */
export function replaceMiddleWithDots (
  value: string,
  options?: { left?: number, right?: number },
): string {
  const { left = 5, right = 5 } = options || {}
  if (value.length <= left + right) return value
  return value.replace(
    new RegExp(`^(.{${left}}).*(.{${right}})$`),
    '$1...$2',
  )
}

/**
 * Convert a camelCase / space-separated / hyphen-separated string into
 * lower snake_case.
 * e.g.
 *   "ExampleApp" → "example_app"
 *   "My App" → "my_app"
 *   "my-app" → "my_app"
 */
export function toSnakeCase (value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

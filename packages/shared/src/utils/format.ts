export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  /** Strip trailing zeros after decimal point (e.g. 1.00 -> 1). Default: true */
  stripTrailingZeros?: boolean
}

/**
 * Format a number or string with `Intl.NumberFormat` ('en-US' locale).
 * By default produces grouped output (e.g. `1,000`) with trailing zeros stripped.
 * All `Intl.NumberFormatOptions` are passed through.
 * @param value - The value to format (number or string)
 * @param options - See {@link FormatNumberOptions}
 */
export function formatNumber (
  value: number | string,
  options: FormatNumberOptions = {},
): string {
  const { stripTrailingZeros = true, ...intlOptions } = options
  const num = typeof value === 'string' ? parseFloat(value) : value
  const safeNum = Number.isNaN(num) ? 0 : num
  const formatted = new Intl.NumberFormat('en-US', intlOptions).format(safeNum)
  if (!stripTrailingZeros) return formatted
  // Strip trailing zeros within the numeric portion so it works for any
  // unit/currency variant (e.g. "1.00 US dollars" -> "1 US dollars").
  return formatted
    .replace(/(\d+)\.0+(?=\D|$)/g, '$1')
    .replace(/(\d+\.\d*?)0+(?=\D|$)/g, '$1')
}

export interface FormatCurrencyOptions {
  /** How to display the currency. Default: 'symbol' */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
  /** Strip trailing zeros after decimal point (e.g. $1.00 -> $1). Default: true */
  stripTrailingZeros?: boolean
}

/**
 * Format a number or string as currency
 * @param value - The value to format (number or string)
 * @param currency - ISO 4217 currency code (e.g., 'USD', 'JPY', 'EUR').
 *   When omitted, the value is formatted as a plain number without a currency symbol.
 * @param options - See {@link FormatCurrencyOptions}
 */
export function formatCurrency (
  value: number | string,
  currency?: string,
  options: FormatCurrencyOptions = {},
): string {
  const { currencyDisplay = 'symbol', stripTrailingZeros = true } = options
  return formatNumber(value, {
    ...(currency ? { style: 'currency', currency, currencyDisplay } : {}),
    stripTrailingZeros,
  })
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

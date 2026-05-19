/**
 * Split a string into lowercase word tokens. Accepts camelCase /
 * PascalCase / kebab-case / snake_case / space-separated input.
 * Acronym runs split before the trailing capitalized word
 * (e.g. "APIKey" → ["api", "key"]).
 */
function splitWords (value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[\s_-]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
}

function capitalize (word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Convert any case into lower snake_case.
 * Accepts camelCase / PascalCase / kebab-case / snake_case / space-separated.
 * e.g.
 *   "ExampleApp"   → "example_app"
 *   "exampleApp"   → "example_app"
 *   "example-app"  → "example_app"
 *   "Example App"  → "example_app"
 *   "APIKey"       → "api_key"
 */
export function toSnakeCase (value: string): string {
  return splitWords(value).join('_')
}

/**
 * Convert any case into lower kebab-case.
 * Accepts camelCase / PascalCase / kebab-case / snake_case / space-separated.
 * e.g.
 *   "ExampleApp"   → "example-app"
 *   "exampleApp"   → "example-app"
 *   "example_app"  → "example-app"
 *   "Example App"  → "example-app"
 *   "APIKey"       → "api-key"
 */
export function toKebabCase (value: string): string {
  return splitWords(value).join('-')
}

/**
 * Convert any case into lower camelCase.
 * Accepts camelCase / PascalCase / kebab-case / snake_case / space-separated.
 * e.g.
 *   "ExampleApp"   → "exampleApp"
 *   "example_app"  → "exampleApp"
 *   "example-app"  → "exampleApp"
 *   "Example App"  → "exampleApp"
 *   "APIKey"       → "apiKey"
 */
export function toCamelCase (value: string): string {
  const words = splitWords(value)
  if (words.length === 0) return ''
  return words[0] + words.slice(1).map(capitalize).join('')
}

/**
 * Convert any case into PascalCase.
 * Accepts camelCase / PascalCase / kebab-case / snake_case / space-separated.
 * e.g.
 *   "exampleApp"   → "ExampleApp"
 *   "example_app"  → "ExampleApp"
 *   "example-app"  → "ExampleApp"
 *   "Example App"  → "ExampleApp"
 *   "APIKey"       → "ApiKey"
 */
export function toPascalCase (value: string): string {
  return splitWords(value).map(capitalize).join('')
}

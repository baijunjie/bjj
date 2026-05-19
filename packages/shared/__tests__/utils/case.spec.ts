import { describe, it, expect } from 'vitest'
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '../../src/utils/case'

describe('toSnakeCase', () => {
  it('should convert camelCase / PascalCase to snake_case', () => {
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

  it('should be idempotent on snake_case input', () => {
    expect(toSnakeCase('my_app')).toBe('my_app')
    expect(toSnakeCase('my__app')).toBe('my_app')
  })

  it('should handle digits between letters', () => {
    expect(toSnakeCase('App2Version')).toBe('app2_version')
  })

  it('should split acronym runs before the trailing word', () => {
    expect(toSnakeCase('APIKey')).toBe('api_key')
    expect(toSnakeCase('parseURLPath')).toBe('parse_url_path')
  })

  it('should return empty string for empty input', () => {
    expect(toSnakeCase('')).toBe('')
  })
})

describe('toKebabCase', () => {
  it('should convert any case to kebab-case', () => {
    expect(toKebabCase('ExampleApp')).toBe('example-app')
    expect(toKebabCase('exampleApp')).toBe('example-app')
    expect(toKebabCase('example_app')).toBe('example-app')
    expect(toKebabCase('Example App')).toBe('example-app')
  })

  it('should split acronym runs before the trailing word', () => {
    expect(toKebabCase('APIKey')).toBe('api-key')
  })
})

describe('toCamelCase', () => {
  it('should convert any case to camelCase', () => {
    expect(toCamelCase('ExampleApp')).toBe('exampleApp')
    expect(toCamelCase('example_app')).toBe('exampleApp')
    expect(toCamelCase('example-app')).toBe('exampleApp')
    expect(toCamelCase('Example App')).toBe('exampleApp')
  })

  it('should be idempotent on camelCase input', () => {
    expect(toCamelCase('exampleApp')).toBe('exampleApp')
  })

  it('should split acronym runs before the trailing word', () => {
    expect(toCamelCase('APIKey')).toBe('apiKey')
  })

  it('should return empty string for empty input', () => {
    expect(toCamelCase('')).toBe('')
  })
})

describe('toPascalCase', () => {
  it('should convert any case to PascalCase', () => {
    expect(toPascalCase('exampleApp')).toBe('ExampleApp')
    expect(toPascalCase('example_app')).toBe('ExampleApp')
    expect(toPascalCase('example-app')).toBe('ExampleApp')
    expect(toPascalCase('Example App')).toBe('ExampleApp')
  })

  it('should split acronym runs before the trailing word', () => {
    expect(toPascalCase('APIKey')).toBe('ApiKey')
  })
})

import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { findI18nUsageByTextScan, pathToNamespace } from '../../../src/plugins/i18n/utils'

const FIXTURES_DIR = path.join(import.meta.dirname, 'fixtures/text-scan')

const scan = (patterns: string[]) => findI18nUsageByTextScan(FIXTURES_DIR, patterns)

describe('findI18nUsageByTextScan', () => {
  it('should capture kebab-case key segments whole', async () => {
    const usage = await scan([ '**/layout.json' ])

    expect(usage.has('pages.easyqr.location-qr.columns.label')).toBe(true)
    expect(usage.has('pages.easyqr.location-qr.columns.created-at')).toBe(true)
    expect(usage.has('pages.dev-settings.title')).toBe(true)
  })

  it('should not emit fragments split at hyphens', async () => {
    const usage = await scan([ '**/layout.json' ])

    expect(usage.has('pages.easyqr.location')).toBe(false)
    expect(usage.has('qr.columns.label')).toBe(false)
    expect(usage.has('pages.dev')).toBe(false)
    expect(usage.has('settings.title')).toBe(false)
  })

  it('should capture keys without hyphens', async () => {
    const usage = await scan([ '**/layout.json' ])

    expect(usage.has('pages.charges.amount')).toBe(true)
  })

  it('should capture a longer chain whole without leaking its suffix', async () => {
    const usage = await scan([ '**/layout.json' ])

    expect(usage.has('obj.pages.charges.amount')).toBe(true)
    // `pages.charges.amount` is present on its own line in another fixture,
    // so assert the chain contributed no extra usage entry of its own.
    const entries = usage.get('pages.charges.amount')!
    expect(entries).toHaveLength(1)
    expect(entries[0]!.file).toContain('location-qr')
  })

  it('should only read files matching the given patterns', async () => {
    const usage = await scan([ '**/layout.json' ])

    expect(usage.has('pages.not-scanned.title')).toBe(false)
  })

  it('should return an empty map when no patterns are given', async () => {
    const usage = await scan([])

    expect(usage.size).toBe(0)
  })

  it('should record location and text-scan sentinel metadata', async () => {
    const usage = await scan([ '**/layout.json' ])
    const entries = usage.get('pages.dev-settings.title')!

    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      key: 'pages.dev-settings.title',
      fullKey: 'pages.dev-settings.title',
      namespace: '',
      functionName: '<text>',
      quoteType: '',
      isDynamic: false,
      line: 2,
      column: 13,
    })
    expect(entries[0]!.file).toContain('dev-settings/layout.json')
  })
})

describe('pathToNamespace', () => {
  it('should preserve hyphens in directory names', () => {
    expect(pathToNamespace('/p/app/pages/easyqr/location-qr/en.json', '/p/app'))
      .toBe('pages.easyqr.location-qr')
  })
})
